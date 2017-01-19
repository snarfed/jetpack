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
import { isModuleFound as _isModuleFound } from 'state/search';
import QuerySite from 'components/data/query-site';
import { SEO } from './seo';
import { SiteStats } from './site-stats';
import { RelatedPosts } from './related-posts';
import { VerificationServices } from './verification-services';
import { getLastPostUrl } from 'state/initial-state';

export const Traffic = React.createClass( {
	displayName: 'TrafficSettings',

	render() {
		let found = {
			seo: this.props.isModuleFound( 'seo-tools' ),
			stats: this.props.isModuleFound( 'stats' ),
			related: this.props.isModuleFound( 'related-posts' ),
			verification: this.props.isModuleFound( 'verification-tools' ),
			sitemaps: this.props.isModuleFound( 'sitemaps' )
		};

		if (
			! this.props.searchTerm
			&& ! this.props.active
			&& ! found.seo
			&& ! found.stats
			&& ! found.related
			&& ! found.verification
			&& ! found.sitemaps
		) {
			return <span />;
		}

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
				{ found.seo && seoSettings }
				{ found.stats && statsSettings }
				{ found.related && relatedPostsSettings }
				{ ( found.verification || found.sitemaps ) && verificationSettings }
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			module: ( module_name ) => getModule( state, module_name ),
			settings: getSettings( state ),
			isModuleFound: ( module_name ) => _isModuleFound( state, module_name ),
			lastPostUrl: getLastPostUrl( state )
		}
	}
)( Traffic );
