/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import {
	determineUrl,
	getCurrentPage,
	getFromStorage,
	removeFromStorage,
	setToStorage,
} from './controller';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function thxat updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	/**
	 * The properties for the block.
	 *
	 * @type {import('@wordpress/block-editor').BlockProps}
	 */
	const blockProps = useBlockProps();

	/**
	 * The attributes object. It contains the block's settings.
	 * The useDarkMode attribute is a boolean that indicates whether the block should use dark mode or not.
	 * The showLinkToWebCarbon attribute is a boolean that indicates whether the block should show a link to the Website Carbon website or not.
	 *
	 * @type {Object}
	 */
	const { useDarkMode, showLinkToWebCarbon, customUrlToCheck, useCustomUrl } =
		attributes;

	const measuringText = __( 'Measuring CO₂', 'carbonbadge-block' );
	const [ measureDiv, setMeasureDiv ] = useState( measuringText );
	const [ belowText, setBelowText ] = useState( '&nbsp;' );
	const [ darkMode, setDarkMode ] = useState( useDarkMode );
	const [ linkToWebCarbon, setLinkToWebCarbon ] =
		useState( showLinkToWebCarbon );
	const [ useCustomUrlState, setUseCustomUrlState ] =
		useState( useCustomUrl );
	const [ decodedCustomUrlToCheck, setDecodedCustomUrlToCheck ] = useState(
		decodeURIComponent( customUrlToCheck )
	);
	const [ urlToCheck, setUrlToCheck ] = useState(
		getCurrentPage(
			determineUrl( useCustomUrlState, decodedCustomUrlToCheck )
		)
	);

	/**
	 * Makes a new request to the website carbon API and stores the result in local storage.
	 */
	const newRequest = () => {
		fetch( `https://api.websitecarbon.com/b?url=${ urlToCheck }` )
			.then( ( response ) => {
				if ( ! response.ok ) {
					throw Error( response );
				}
				return response.json();
			} )
			.then( ( json ) => {
				renderResult( json );
				setToStorage( urlToCheck, json );
			} )
			.catch( ( err ) => {
				const noResultText = __( 'No Result', 'carbonbadge-block' );
				setMeasureDiv( noResultText );
				removeFromStorage( urlToCheck );
				throw new Error( err );
			} );
	};
	/**
	 * Renders the result based on the provided data. The data object contains the measurement and percentage values.
	 * Sets the measurement and percentage values in the state.
	 *
	 * @param {Object} data - The data object containing the measurement and percentage values.
	 * @return {void}
	 */
	const renderResult = ( data ) => {
		// translators: %s is a placeholder for the percentage of pages tested. The second % is the percentage symbol.
		const belowTextToSet = __(
			'Cleaner than %s% of pages tested',
			'carbonbadge-block'
		).replace( '%s', data.p );

		// translators: %s is a placeholder for the amount of CO2 in grams.
		const ofCO2Text = __( '%sg of CO₂/view', 'carbonbadge-block' ).replace(
			'%s',
			data.c
		);

		setMeasureDiv( ofCO2Text );
		setBelowText( belowTextToSet );
	};

	useEffect( () => {
		if ( 'fetch' in window ) {
			setBelowText( '&nbsp;' );
			setMeasureDiv( measuringText );
			const saved = getFromStorage( urlToCheck );
			if ( ! saved ) {
				newRequest();
			} else {
				renderResult( saved );
			}
		}
	}, [ urlToCheck ] );

	useEffect( () => {
		setDarkMode( useDarkMode );
	}, [ useDarkMode ] );

	useEffect( () => {
		setLinkToWebCarbon( showLinkToWebCarbon );
	}, [ showLinkToWebCarbon ] );

	useEffect( () => {
		setUseCustomUrlState( useCustomUrl );
	}, [ useCustomUrl ] );

	useEffect( () => {
		setAttributes( {
			customUrlToCheck: encodeURIComponent( decodedCustomUrlToCheck ),
		} );
	}, [ decodedCustomUrlToCheck ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'carbonbadge-block' ) }>
					<ToggleControl
						checked={ !! useDarkMode }
						label={ __( 'Use dark mode', 'carbonbadge-block' ) }
						onChange={ () =>
							setAttributes( {
								useDarkMode: ! useDarkMode,
							} )
						}
					/>
					<ToggleControl
						checked={ !! showLinkToWebCarbon }
						label={ __(
							'Add link to Website Carbon results',
							'carbonbadge-block'
						) }
						help={ __(
							'If checked, a link to the Website Carbon site will be shown on the badge. If not enabled, only the Website Carbon text will be shown, without any link.',
							'carbonbadge-block'
						) }
						onChange={ () =>
							setAttributes( {
								showLinkToWebCarbon: ! showLinkToWebCarbon,
							} )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Custom URL settings', 'carbonbadge-block' ) }
					initialOpen={ false }
				>
					<ToggleControl
						checked={ !! useCustomUrl }
						label={ __( 'Use custom URL', 'carbonbadge-block' ) }
						help={ __(
							'If checked, the block will measure the carbon footprint of the URL provided below. If not enabled, the block will measure the carbon footprint of the current page.',
							'carbonbadge-block'
						) }
						onChange={ () => {
							setAttributes( {
								useCustomUrl: ! useCustomUrl,
							} );
							setUrlToCheck(
								getCurrentPage(
									! useCustomUrl
										? decodedCustomUrlToCheck
										: window.location.href
								)
							);
						} }
					/>
					{ useCustomUrl && (
						<TextControl
							label={ __( 'URL to check', 'carbonbadge-block' ) }
							value={ decodedCustomUrlToCheck }
							onChange={ ( value ) => {
								setDecodedCustomUrlToCheck( value );
							} }
							onBlur={ () => {
								setUrlToCheck(
									getCurrentPage( decodedCustomUrlToCheck )
								);
							} }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div
					className={ `wcb carbonbadge ${ darkMode ? 'wcb-d' : '' }` }
				>
					<div className="wcb_p">
						<span
							className="wcb_g"
							dangerouslySetInnerHTML={ {
								__html: measureDiv,
							} }
						></span>
						{ linkToWebCarbon ? (
							<a
								className="wcb_a"
								target="_blank"
								rel="noopener noreferrer"
								href={ `https://websitecarbon.com/website/${ urlToCheck }` }
							>
								Website Carbon
							</a>
						) : (
							<span className="wcb_a">Website Carbon</span>
						) }
					</div>
					<span
						className="wcb_2"
						dangerouslySetInnerHTML={ {
							__html: belowText,
						} }
					></span>
				</div>
			</div>
		</>
	);
}
