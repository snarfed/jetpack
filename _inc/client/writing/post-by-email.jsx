/**
 * External dependencies
 */
import analytics from 'lib/analytics';
import React from 'react';
import { connect } from 'react-redux';
import { translate as __ } from 'i18n-calypso';
import Button from 'components/button';
import ClipboardButtonInput from 'components/clipboard-button-input';

/**
 * Internal dependencies
 */
import {
	FormFieldset,
	FormLegend,
	FormLabel
} from 'components/forms';
import { ModuleToggle } from 'components/module-toggle';
import { getModule } from 'state/modules';
import { isModuleFound as _isModuleFound } from 'state/search';
import { ModuleSettingsForm as moduleSettingsForm } from 'components/module-settings/module-settings-form';
import SettingsCard from 'components/settings-card';

const PostByEmail = moduleSettingsForm(
	React.createClass( {

		regeneratePostByEmailAddress( event ) {
			event.preventDefault();
			this.props.regeneratePostByEmailAddress();
		},

		address() {
			const currentValue = this.props.getOptionValue( 'post_by_email_address' );
			// If the module Post-by-email is enabled BUT it's configured as disabled
			// Its value is set to false
			if ( currentValue === false ) {
				return '';
			}
			return currentValue;
		},

		render() {
			if ( ! this.props.isModuleFound( 'post-by-email' ) ) {
				return <span />;
			}

			let isPbeActive = this.props.getOptionValue( 'post-by-email' );
			return (
				<SettingsCard
					{ ...this.props }
					module="post-by-email"
					hideButton>
					<ModuleToggle slug="post-by-email"
								  compact
								  activated={ isPbeActive }
								  toggling={ this.props.isSavingAnyOption( 'post-by-email' ) }
								  toggleModule={ this.props.toggleModuleNow }>
						<span className="jp-form-toggle-explanation">
							{
								this.props.module( 'post-by-email' ).description
							}
						</span>
					</ModuleToggle>
					{
						isPbeActive
							? <FormFieldset>
								<FormLabel>
									<FormLegend>{ __( 'Email Address' ) }</FormLegend>
									<ClipboardButtonInput
										value={ this.address() }
										copy={ __( 'Copy', { context: 'verb' } ) }
										copied={ __( 'Copied!' ) }
										prompt={ __( 'Highlight and copy the following text to your clipboard:' ) }
									/>
								</FormLabel>
								<Button
									onClick={ this.regeneratePostByEmailAddress } >
									{ __( 'Regenerate address' ) }
								</Button>
							  </FormFieldset>
							: ''
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
)( PostByEmail );
