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
import { SEO } from './seo';
import { SiteStats } from './site-stats';
import { RelatedPosts } from './related-posts';
import { VerificationServices } from './verification-services';
import { getLastPostUrl } from 'state/initial-state';

export const Traffic = React.createClass( {
	displayName: 'TrafficSettings',

	render() {
		if ( ! this.props.searchTerm && ! this.props.active ) {
			return <span />;
		}

		// Getting text data about modules and seeing if it's being searched for
		let list = [
			this.props.module( 'seo' ),
			this.props.module( 'stats' ),
			this.props.module( 'related-posts' ),
			this.props.module( 'verification-tools' )
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
				m.feature ? m.feature.toString() : ''
			].toString();

			return text.toLowerCase().indexOf( this.props.searchTerm ) > -1;
		}, this);

		let seoSettings = (
			<SEO
				settings={ this.props.settings }
				getModule={ this.props.module }
				configureUrl={ 'https://wordpress.com/settings/seo/' + this.props.siteRawUrl }
			/>
		);
		let statsSettings = (
			<SiteStats
				settings={ this.props.settings }
				getModule={ this.props.module }
			/>
		);
		let relatedPostsSettings = (
			<RelatedPosts
				settings={ this.props.settings }
				getModule={ this.props.module }
				configureUrl={
					this.props.siteAdminUrl +
						'customize.php?autofocus[section]=jetpack_relatedposts' +
						'&return=' + encodeURIComponent( this.props.siteAdminUrl + 'admin.php?page=jetpack#/traffic' ) +
						'&url=' + encodeURIComponent( this.props.lastPostUrl )
				}
			/>
		);
		let verificationSettings = (
			<VerificationServices
				settings={ this.props.settings }
				getModule={ this.props.module }
			/>
		);

		return (
			<div>
				<QuerySite />
				{ list[0] ? seoSettings : '' }
				{ list[1] ? statsSettings : '' }
				{ list[2] ? relatedPostsSettings : '' }
				{ list[3] ? verificationSettings : '' }
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			module: ( module_name ) => getModule( state, module_name ),
			settings: getSettings( state ),
			lastPostUrl: getLastPostUrl( state )
		}
	}
)( Traffic );
