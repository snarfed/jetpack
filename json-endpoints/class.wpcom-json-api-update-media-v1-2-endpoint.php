<?php
class WPCOM_JSON_API_Update_Media_v1_2_Endpoint extends WPCOM_JSON_API_Update_Media_v1_1_Endpoint {
	private function update_by_attrs_parameter( $media_id, $attrs ) {
		$insert = array();

		// Attributes: Title, Caption, Description
		if ( isset( $attrs['title'] ) ) {
			$insert['post_title'] = $attrs['title'];
		}

		if ( isset( $attrs['caption'] ) ) {
			$insert['post_excerpt'] = $attrs['caption'];
		}

		if ( isset( $attrs['description'] ) ) {
			$insert['post_content'] = $attrs['description'];
		}

		if ( ! empty( $insert ) ) {
			$insert['ID'] = $media_id;
			wp_update_post( (object) $insert );
		}

		// Attributes: Alt
		if ( isset( $attrs['alt'] ) ) {
			$alt = wp_strip_all_tags( $attrs['alt'], true );
			update_post_meta( $media_id, '_wp_attachment_image_alt', $alt );
		}

		// Attributes: Artist, Album
		$id3_meta = array();

		foreach ( array( 'artist', 'album' ) as $key ) {
			if ( isset( $attrs[ $key ] ) ) {
				$id3_meta[ $key ] = wp_strip_all_tags( $attrs[ $key ], true );
			}
		}

		if ( ! empty( $id3_meta ) ) {
			// Before updating metadata, ensure that the item is audio
			$item = $this->get_media_item_v1_1( $media_id );
			if ( 0 === strpos( $item->mime_type, 'audio/' ) ) {
				wp_update_attachment_metadata( $media_id, $id3_meta );
			}
		}
	}

	/**
	 * Generate a filename in function of the original name of the file when it was first loaded.
	 * The returned filename has this structure `{basename}-e{random-number}.{ext}`
	 * 
	 * @param  {Number} $media_id - media post ID
	 * @return {String} A random filename.
	 */
	private function generate_new_filename( $media_id ) {
		$path = get_attached_file( $media_id );
		$path_parts = pathinfo( $path );
		$filename = $path_parts['filename'];
		$suffix = time() . rand( 100, 999 );

		do {
			$filename = preg_replace( '/-e([0-9]+)$/', '', $filename );
			$filename .= "-e{$suffix}";
			$new_filename = "{$filename}.{$path_parts['extension']}";
			$new_path = "{$path_parts['dirname']}/$new_filename";
			$suffix++;
		} while( file_exists( $new_path ) );

		return $new_filename;
	}

	/**
	 * Store a new `snapshot` into the `revision_history` post metadata.
	 *
	 * @param {Number} $media_id - media post ID
	 * @return {Boolean} `true` if the update action was successful.
	 */
	private function store_snapshot( $media_id, $filename ) {
		$snapshot_array = get_post_meta( $media_id, '_wp_revision_history', true );

		if ( ! $snapshot_array ) {
			$snapshot_array = array();
		}

		$media_item = $this->get_media_item_v1_1( $media_id );

		$snapshot = array(
			'URL'              => (string) $media_item->URL,
			'date'             => (string) $media_item->date,
			'mime_type'        => (string) $media_item->mime_type,
			'name'             => (string) $filename,
			'extension'        => (string) $media_item->extension,
			'thumbnails'       => (array) $media_item->thumbnails,
			'height'           => (int) $media_item->height,
			'width'            => (int) $media_item->width,
		);

		array_unshift( $snapshot_array, $snapshot );
		return update_post_meta( $media_id, '_wp_revision_history', $snapshot_array );
	}

	/**
	 * Save the given file locally.
	 * 
	 * @param  {Array} $file_array
	 * @param  {Number} $media_id - post media ID
	 * @return {Array|WP_Error} An array with information about the new file saved or a WP_Error is something went wrong.
	 */
	private function save_image( $file_array, $media_id ) {
		$filename = $file_array['tmp_name'];

		if ( ! file_exists( $filename ) ) {
			return new WP_Error( 'invalid_input', 'No media provided in input.' );
		}

		// check mime_type of the given file
		if (
			! $this->is_file_supported_for_sideloading( $filename ) &&
			! file_is_displayable_image( $filename )
		) {
			@unlink( $filename );
			return new WP_Error( 'invalid_input', 'Invalid file type.', 403 );
		}

		// override filename
		$file_array['name'] = $this->generate_new_filename( $media_id );

		$overrides = array( 'test_form' => false );

		// create a `YYYY/MM` date string according to the post_date of the current media post.
		$time = current_time( 'mysql' );
		if ( $media = get_post( $media_id ) ) {
			if ( substr( $media->post_date, 0, 4 ) > 0 ) {
				$time = $media->post_date;
			}
		}

		$file = wp_handle_sideload( $file_array, $overrides, $time );

		if ( isset( $file['error'] ) ) {
			return new WP_Error( 'upload_error', $file['error'] );
		}

		return $file;
	}

	/**
	 * Get the image from a remote url and then save it locally.
	 *
	 * @param  {String} $url - image URL to save locally
	 * @param  {Number} $media_id - media post ID
	 * @return {Array|WP_Error} An array with information about the new file saved or a WP_Error is something went wrong.
	 */
	private function save_media_from_url( $url, $media_id ) {
		if ( ! $url ) {
			return null;
		}

		// if we didn't get a URL, let's bail
		$parsed = @parse_url( $url );
		if ( empty( $parsed ) ) {
			return new WP_Error( 'invalid_url', 'No media provided in url.' );
		}

		// save the remote image into a tmp file
		$tmp = download_url( $url );
		if ( is_wp_error( $tmp ) ) {
			return $tmp;
		}

		$file_array = array( 'tmp_name' => $tmp );

		return $this->save_image( $file_array, $media_id );
	}

	function callback( $path = '', $blog_id = 0, $media_id = 0 ) {
		$blog_id = $this->api->switch_to_blog_and_validate_user( $this->api->get_blog_id( $blog_id ) );
		if ( is_wp_error( $blog_id ) ) {
			return $blog_id;
		}

		if ( ! current_user_can( 'upload_files', $media_id ) ) {
			return new WP_Error( 'unauthorized', 'User cannot view media', 403 );
		}

		$input = $this->input( true );

		// images
		$media_file = $input['media'] ? (array) $input['media'] : null;
		$media_url = $input['media_url'];
		$media_attrs = $input['attrs'] ? (array) $input['attrs'] : null;

		if ( isset( $media_url ) || isset( $input['media'] ) ) {
			$user_can_upload_files = current_user_can( 'upload_files' ) || $this->api->is_authorized_with_upload_token();

			if ( ! $user_can_upload_files  ) {
				return new WP_Error( 'unauthorized', 'User cannot upload media.', 403 );
			}
			
			$new_file_array = $media_file
				? $this->save_image( $media_file, $media_id )
				: $this->save_media_from_url( $media_url, $media_id );

			if ( is_wp_error( $new_file_array) ) {
				return $new_file_array;
			}

			$new_attached_filename = $new_file_array['file'];

			// Update the attached file.
			$update_success = update_attached_file( $media_id, $new_attached_filename );

			if ( $update_success ) {
				$new_metadata = wp_generate_attachment_metadata( $media_id, $new_attached_filename );
				wp_update_attachment_metadata( $media_id, $new_metadata );

				$filename = pathinfo( $new_attached_filename )['basename'];
				$this->store_snapshot( $media_id, $filename );

				unset( $input['media_url'] );
			}
		}

		// update media through of `attrs` value
		if ( $input['media'] && $media_attrs ) {
			$this->update_by_attrs_parameter( $media_id, $media_attrs );
		}

		// call parent method
		$response = parent::callback( $path, $blog_id, $media_id );

		// expose revision_history array
		$response->revision_history = (array) $this->get_revision_history( $media_id );

		return $response;
	}
}
