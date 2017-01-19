/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getModule } from 'state/modules';
import { getSettings } from 'state/settings';
import QuerySite from 'components/data/query-site';
import Composing from './composing';
import Media from './media';
import CustomContentTypes from './custom-content-types';
import ThemeEnhancements from './theme-enhancements';
import PostByEmail from './post-by-email';

export const Writing = React.createClass( {
	displayName: 'WritingSettings',

	render() {
		if ( ! this.props.searchTerm && ! this.props.active ) {
			return <span />;
		}

		let commonProps = {
			settings: this.props.settings,
			getModule: this.props.module
		};

		return (
			<div>
				<QuerySite />
				<Composing { ...commonProps } />
				<Media { ...commonProps } />
				<CustomContentTypes { ...commonProps } />
				<ThemeEnhancements { ...commonProps } />
				<PostByEmail { ...commonProps } />
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
	},
	( dispatch ) => {
		return {};
	}
)( Writing );
