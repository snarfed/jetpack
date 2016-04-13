<?php

require_once dirname(__FILE__) . '/class.jetpack-sync-deflate-codec.php';

/**
 * Simple version of a Jetpack Sync Server - just receives arrays of events and
 * issues them locally with the 'jetpack_sync_remote_action' action.
 */
class Jetpack_Sync_Server {
	private $codec;

	// this is necessary because you can't use "new" when you declare instance properties >:(
	function __construct() {
		$this->codec = new Jetpack_Sync_Deflate_Codec();
	}

	function set_codec( iJetpack_Sync_Codec $codec ) {
		$this->codec = $codec;
	}

	function receive( $data ) {
		$events = $this->codec->decode( $data );
		foreach ( $events as $event ) {
			list( $action_name, $args ) = $event;
			/**
			 * Fires when an action is received from a remote Jetpack site
			 *
			 * @since 4.1
			 *
			 * @param string $action_name The name of the action executed on the remote site
			 * @param array $args The arguments passed to the action
			 */
			do_action( "jetpack_sync_remote_action", $action_name, $args );	
		}
	}
}