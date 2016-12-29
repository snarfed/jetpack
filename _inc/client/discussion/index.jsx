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
import { Comments } from './comments';
import { Subscriptions } from './subscriptions';

export const Discussion = React.createClass( {
	displayName: 'DiscussionSettings',

	render() {
		if ( ! this.props.searchTerm && ! this.props.active ) {
			return <span />;
		}

		// Getting text data about modules and seeing if it's being searched for
		let list = [
			this.props.module( 'comments' ),
			this.props.module( 'subscriptions' )
		].map( function( m ) {
			if ( ! this.props.searchTerm ) {
				return true;
			}

			let text = [
				m.module,
				m.name,
				m.description,
				m.learn_more_button,
				m.long_description,
				m.search_terms,
				m.additional_search_queries,
				m.short_description,
				m.feature.toString()
			].toString();

			return text.toLowerCase().indexOf( this.props.searchTerm ) > -1;
p		}, this);

		let commentsSettings = (
			<Comments
				settings={ this.props.settings }
				getModule={ this.props.module }
			/>
		);
		let subscriptionsSettings = (
			<Subscriptions
				settings={ this.props.settings }
				getModule={ this.props.module }
				siteRawUrl={ this.props.siteRawUrl }
			/>
		);

		return (
			<div>
				<QuerySite />
				{ list[0] ? commentsSettings : '' }
				{ list[1] ? subscriptionsSettings : '' }
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
)( Discussion );
