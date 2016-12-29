/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { getModule } from 'state/modules';
import { getSettings } from 'state/settings';
import QuerySite from 'components/data/query-site';
import { BackupsScan } from './backups-scan';
import { Antispam } from './antispam';
import { Protect } from './protect';
import { SSO } from './sso';

export const Security = React.createClass( {
	displayName: 'SecuritySettings',

	render() {
		if ( ! this.props.searchTerm && ! this.props.active ) {
			return <span />;
		}

		// Getting text data about modules and seeing if it's being searched for
		let list = [
			[
				'scan',
				__( 'Security Scanning' ),
				__( 'Automatically scan your site for common threats and attacks.' ),
				'https://vaultpress.com/jetpack/',
				'security scan threat attacks pro scanning', // Extra search terms @todo make translatable
				'backups',
				__( 'Site Backups' ),
				__( 'Keep your site backed up!' ),
				'https://vaultpress.com/jetpack/',
				'backup restore pro security'
			],
			[
				'akismet',
				'Akismet',
				__( 'Keep those spammers away!' ),
				'https://akismet.com/jetpack/',
				'spam security comments pro'
			],
			this.props.module( 'protect' ),
			this.props.module( 'sso' )
		].map( function( m ) {
			if ( ! this.props.searchTerm ) {
				return true;
			}

			let text;
			if ( Array.isArray( m ) ) {
				text = m.join( ' ' );
			} else {
				text = [
					m.module,
					m.name,
					m.description,
					m.learn_more_button,
					m.long_description,
					m.search_terms,
					m.additional_search_queries,
					m.short_description,
					m.feature ? m.feature.toString() : ''
				].toString();
			}

			return text.toLowerCase().indexOf( this.props.searchTerm ) > -1;
		}, this);

		let backupSettings = (
			<BackupsScan
				settings={ this.props.settings }
				getModule={ this.props.module }
			/>
		);
		let akismetSettings = (
			<Antispam
				settings={ this.props.settings }
				getModule={ this.props.module }
			/>
		);
		let protectSettings = (
			<Protect
				settings={ this.props.settings }
				getModule={ this.props.module }
			/>
		);
		let ssoSettings = (
			<SSO
				settings={ this.props.settings }
				getModule={ this.props.module }
			/>
		);
		return (
			<div>
				<QuerySite />
				{ list[0] ? backupSettings : '' }
				{ list[1] ? akismetSettings : '' }
				{ list[2] ? protectSettings : '' }
				{ list[3] ? ssoSettings : '' }
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			module: ( module_name ) => getModule( state, module_name ),
			settings: getSettings( state )
		}
	}
)( Security );
