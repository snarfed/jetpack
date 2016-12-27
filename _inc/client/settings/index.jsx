/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Engagement from 'engagement/index.jsx';
import Security from 'security/index.jsx';
import Appearance from 'appearance/index.jsx';
import GeneralSettings from 'general-settings/index.jsx';
import Writing from 'writing/index.jsx';

export default React.createClass( {
	displayName: 'SearchableSettings',

	render() {
		var commonProps = {
			route: this.props.route,
			searchTerm: this.props.searchTerm
		};

		return (
			<div>
				<GeneralSettings
					active={ ( '/general' === this.props.route.path ) }
					{ ...commonProps }
				/>
				<Engagement
					active={ ( '/engagement' === this.props.route.path ) }
					{ ...commonProps }
				/>
				<Security
					siteAdminUrl={ this.props.siteAdminUrl }
					active={ ( '/security' === this.props.route.path ) }
					{ ...commonProps }
/>
				<Appearance
					route={ this.props.route }
					active={ ( '/appearance' === this.props.route.path ) }
					{ ...commonProps }
				/>
				<Writing
					siteAdminUrl={ this.props.siteAdminUrl }
					active={ ( '/writing' === this.props.route.path ) }
					{ ...commonProps }
				/>
			</div>
		);
	}
} );

