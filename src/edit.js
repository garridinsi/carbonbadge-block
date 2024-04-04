/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __, _n } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';

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
	 *
	 * @type {Object}
	 */
	const { useDarkMode } = attributes;

	const measuringText = __( 'Measuring CO₂', 'carbonbadge-block' );
	const [ measureDiv, setMeasureDiv ] = useState( measuringText );
	const [ belowText, setBelowText ] = useState( '&nbsp;' );
	const [ darkMode, setDarkMode ] = useState( useDarkMode );

	/**
	 * Indicates whether the current environment is the WordPress admin area.
	 * @type {boolean}
	 */
	const isAdminEnv = window.location.href.indexOf( 'wp-admin' ) > -1;

	/**
	 * Gets the current page URL and encodes it. If the current environment is the WordPress admin area, it gets the URL of the front end.
	 *
	 * @type {string}
	 */
	const currentPage = encodeURIComponent(
		isAdminEnv
			? window.location.href.split( 'wp-admin' )[ 0 ]
			: window.location.href
	);

	// Just for testing, should be commented out in production
	// const currentPage = encodeURIComponent( 'https://enekogarrido.com' );

	/**
	 * The URL to check. If the current page URL does not end with a slash, it appends one.
	 * @type {string}
	 */
	const urlToCheck = currentPage.endsWith( '/' )
		? currentPage
		: `${ currentPage }/`;

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
		const belowText = __(
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
		setBelowText( belowText );
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
						<a
							className="wcb_a"
							target="_blank"
							rel="noopener noreferrer"
							href="https://websitecarbon.com"
						>
							{ /* translators: Don't translate, Website Carbon is
							the name of a service: https://websitecarbon.com */ }
							{ __( 'Website Carbon', 'carbonbadge-block' ) }
						</a>
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
