/**
 * WordPress dependencies
 */
import { store, getContext, withScope } from '@wordpress/interactivity';
import {
	getCurrentPage,
	determineUrl,
	getFromStorage,
	removeFromStorage,
	setToStorage,
} from './controller';

const { state, actions } = store( 'carbonbadge-block', {
	callbacks: {
		doRequest: () => {
			const context = getContext();
			context.measureDiv = state.i18n.measuringCO2;
			context.darkMode = state.isDarkMode;
			if ( 'fetch' in window ) {
				const saved = getFromStorage( urlToCheck );
				if ( ! saved ) {
					actions.newRequest();
				} else {
					context.resultData = saved;
					actions.renderResult();
				}
			}
		},
	},
	actions: {
		/**
		 * Renders the result of a measurement.
		 * Gets the measurement and percentage values from the context.
		 */
		*renderResult() {
			const context = getContext();
			if ( ! context || ! context.resultData ) {
				context.measureDiv = state.i18n.noResult;
				return;
			}
			const data = context.resultData;
			if ( ! data || ! data.c || ! data.p ) {
				context.measureDiv = state.i18n.noResult;
				return;
			}
			// We replace the placeholder %s with the values we want to display.
			const ofCO2Text = state.i18n.gOfCO2PerView.replace( '%s', data.c );
			const belowTextToSet = state.i18n.cleanerThan.replace(
				'%s',
				data.p
			);
			context.measureDiv = ofCO2Text;
			context.belowText = belowTextToSet;
			if ( context.showLinkToWebCarbon ) {
				context.websiteCarbonLink = `https://websitecarbon.com/website/${ whatUrl }`;
			}
		},
		/**
		 * Makes a new request to the websitecarbon API and stores the result in local storage.
		 * If the request is successful, the result is rendered on the view.
		 * If the request fails, the "no result" message is shown on the view.
		 * The websitecarbon API returns the result in the following format:
		 * {
		 *  "c": 0.17, // CO2 emissions per page view
		 *  "p": 84, // Percentage cleaner than rest of pages tested
		 *  "url": "${urlToCheck}" // URL of the page tested
		 * }
		 */
		*newRequest() {
			const context = getContext();

			yield fetch( `https://api.websitecarbon.com/b?url=${ urlToCheck }` )
				.then( ( res ) => {
					if ( ! res.ok ) throw Error( res );
					return res.json();
				} )
				.then( ( json ) => {
					context.resultData = json;
					setToStorage( urlToCheck, json );
					actions.renderResult();
				} )
				.catch( ( err ) => {
					removeFromStorage( urlToCheck );
					context.measureDiv = state.i18n.noResult;
					throw new Error( err );
				} );
		},
	},
} );

// The non-encoded URL that is going to be checked.
const whatUrl = determineUrl( state.useCustomUrl, state.customUrlToCheck );

// The encoded URL that is going to be checked.
const urlToCheck = getCurrentPage( whatUrl );
