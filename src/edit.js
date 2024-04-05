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
import { getCurrentPage } from './controller';

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

	const measuringText = __( 'Measuring CO₂...', 'carbonbadge-block' );
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

	const whatUrl = useCustomUrlState
		? decodedCustomUrlToCheck
		: window.location.href;

	const [ urlToCheck, setUrlToCheck ] = useState( getCurrentPage( whatUrl ) );

	useEffect( () => {
		newRequest( true );
	}, [ urlToCheck ] );

	/**
	 * Makes a new request to the website carbon API and stores the result in local storage.
	 * @param {boolean} render - Optional parameter indicating whether to render the result or not.
	 */
	const newRequest = ( render = false ) => {
		fetch( `https://api.websitecarbon.com/b?url=${ urlToCheck }` )
			.then( ( response ) => {
				if ( ! response.ok ) throw Error( response );
				return response.json();
			} )
			.then( ( json ) => {
				if ( render ) {
					renderResult( json );
				}
				json.t = new Date().getTime();
				localStorage.setItem(
					`wcb_${ urlToCheck }`,
					JSON.stringify( json )
				);
			} )
			.catch( ( err ) => {
				const noResultText = __( 'No Result', 'carbonbadge-block' );
				setMeasureDiv( noResultText );
				localStorage.removeItem( `wcb_${ urlToCheck }` );
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
		/*
		 * translators: %s is a placeholder for the percentage of pages tested. Please note that &#37; means % and should be part of the text.
		 */
		const belowTextToSet = __(
			'Cleaner than&nbsp;%s&#37; of pages tested',
			'carbonbadge-block'
		).replace( '%s', data.p );

		/*
		 * translators: %s is a placeholder for the amount of CO2 in grams.
		 */
		const ofCO2Text = __( '%sg of CO₂/view', 'carbonbadge-block' ).replace(
			'%s',
			data.c
		);

		setMeasureDiv( ofCO2Text );
		setBelowText( belowTextToSet );
	};

	useEffect( () => {
		if ( 'fetch' in window ) {
			const saved = localStorage.getItem( `wcb_${ urlToCheck }` );
			const now = new Date().getTime();
			if ( saved ) {
				const jsonSaved = JSON.parse( saved );
				renderResult( jsonSaved );
				if ( now - jsonSaved.t > 864e5 ) {
					newRequest( true );
				}
			} else {
				newRequest();
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
							'Enable Website Carbon link',
							'carbonbadge-block'
						) }
						help={ __(
							'If checked, a link to the Website Carbon homepage will be shown on the badge. If not enabled, only the Website Carbon text will be shown, without any link.',
							'carbonbadge-block'
						) }
						onChange={ () =>
							setAttributes( {
								showLinkToWebCarbon: ! showLinkToWebCarbon,
							} )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Advanced', 'carbonbadge-block' ) }>
					<ToggleControl
						checked={ !! useCustomUrl }
						label={ __( 'Use custom URL', 'carbonbadge-block' ) }
						help={ __(
							'If checked, the block will measure the carbon footprint of the URL provided below. If not enabled, the block will measure the carbon footprint of the current page.',
							'carbonbadge-block'
						) }
						onChange={ () =>
							setAttributes( {
								useCustomUrl: ! useCustomUrl,
							} )
						}
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
								href="https://websitecarbon.com"
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
