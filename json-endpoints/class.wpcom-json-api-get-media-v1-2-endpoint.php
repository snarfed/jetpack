<?php
class WPCOM_JSON_API_Get_Media_v1_2_Endpoint extends WPCOM_JSON_API_Get_Media_v1_1_Endpoint {
	function callback( $path = '', $blog_id = 0, $media_id = 0 ) {
		$response = parent::callback( $path, $blog_id, $media_id );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		// expose revision_history array
		$response->revision_history = (array) $this->get_revision_history( $media_id );

		return $response;
	}
}
