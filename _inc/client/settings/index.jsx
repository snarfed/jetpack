/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Engagement from 'engagement/index.jsx';
import Security from 'security/index.jsx';
import Appearance from 'appearance/index.jsx';
import GeneralSettings from 'general-settings/index.jsx';
import Writing from 'writing/index.jsx';

export const SearchableSettings = React.createClass( {
	displayName: 'SearchableSettings',

	render() {
		return (
			<div>
				<GeneralSettings
					route={ this.props.route }
					active={ ( '/general' === this.props.route.path ) }
				/>
				<Engagement
					route={ this.props.route }
					active={ ( '/engagement' === this.props.route.path ) }
				/>
				<Security
					route={ this.props.route }
					siteAdminUrl={ this.props.siteAdminUrl }
					active={ ( '/security' === this.props.route.path ) }
				/>
				<Appearance
					route={ this.props.route }
					active={ ( '/appearance' === this.props.route.path ) }
				/>
				<Writing
					route={ this.props.route }
					siteAdminUrl={ this.props.siteAdminUrl }
					active={ ( '/writing' === this.props.route.path ) }
				/>
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {}
	},
	( dispatch ) => {
		return {};
	}
)( SearchableSettings );
