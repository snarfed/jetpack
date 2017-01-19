/**
 * External dependencies
 */
import analytics from 'lib/analytics';
import React from 'react';
import { connect } from 'react-redux';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { FormFieldset } from 'components/forms';
import { ModuleToggle } from 'components/module-toggle';
import { getModule } from 'state/modules';
import { isModuleFound as _isModuleFound } from 'state/search';
import { ModuleSettingsForm as moduleSettingsForm } from 'components/module-settings/module-settings-form';
import { ModuleSettingCheckbox } from 'components/module-settings/form-components';
import SettingsCard from 'components/settings-card';

const ThemeEnhancements = moduleSettingsForm(
	React.createClass( {

		render() {
			if (
				! this.props.isModuleFound( 'infinite-scroll' )
				&& ! this.props.isModuleFound( 'minileven' )
			) {
				return <span />;
			}

			return (
				<SettingsCard
					{ ...this.props }
					header={ __( 'Theme enhancements' ) }>
					{
						[
							{
								...this.props.module( 'infinite-scroll' ),
								checkboxes: [
									{
										key: 'infinite_scroll',
										label: __( 'Scroll infinitely (Shows 7 posts on each load)' )
									},
									{
										key: 'infinite_scroll_google_analytics',
										label: __( 'Track each infinite Scroll post load as a page view in Google Analytics' )
									}
								],
								separator: true
							},
							{
								...this.props.module( 'minileven' ),
								checkboxes: [
									{
										key: 'wp_mobile_excerpt',
										label: __( 'Use excerpts instead of full posts on front page and archive pages' )
									},
									{
										key: 'wp_mobile_featured_images',
										label: __( 'Show featured images' )
									},
									{
										key: 'wp_mobile_app_promos',
										label: __( 'Show an ad for the WordPress mobile apps in the footer of the mobile theme' )
									}
								]
							}
						].map( item => {
							if ( ! this.props.isModuleFound( item.module ) ) {
								return <span />;
							}

							return (
								<div key={ `theme_enhancement_${ item.module }` }>
									<FormFieldset support={ item.learn_more_button }>
										<ModuleToggle slug={ item.module }
													  compact
													  activated={ this.props.getOptionValue( item.module ) }
													  toggling={ this.props.isSavingAnyOption( item.module ) }
													  toggleModule={ this.props.toggleModuleNow }>
										<span className="jp-form-toggle-explanation">
										{
											item.description
										}
										</span>
										</ModuleToggle>
										{
											this.props.getOptionValue( item.module )
												? item.checkboxes.map( chkbx => {
													return <ModuleSettingCheckbox
														name={ chkbx.key }
														{ ...this.props }
														label={ chkbx.label }
														key={ `${ item.module }_${ chkbx.key }`}
													/>
												  } )
												: ''
										}
									</FormFieldset>
									{
										item.separator
											? <hr />
											: ''
									}
								</div>
							);
						} )
					}
				</SettingsCard>
			);
		}
	} )
);

export default connect(
	( state ) => {
		return {
			module: ( module_name ) => getModule( state, module_name ),
			isModuleFound: ( module_name ) => _isModuleFound( state, module_name )
		}
	}
)( ThemeEnhancements );
