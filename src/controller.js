/**
 * Checks if the given URL belongs to the admin environment.
 *
 * @param {string} url - The URL to check.
 * @return {boolean} - Returns true if the URL belongs to the admin environment, otherwise returns false.
 */
function isAdminEnv( url ) {
	return url.indexOf( 'wp-admin' ) > -1;
}

/**
 * Returns the current page URL after encoding it.
 *
 * @param {string} url - The URL of the current page.
 * @return {string} The encoded URL of the current page.
 */
export function getCurrentPage( url ) {
	const splittedUrl = isAdminEnv( url ) ? url.split( 'wp-admin' )[ 0 ] : url;
	return encodeURIComponent(
		splittedUrl.endsWith( '/' ) ? splittedUrl : `${ splittedUrl }/`
	);
}

/**
 * Determines the URL to use based on the provided parameters.
 * If the custom URL is provided and the "use custom URL" option is enabled, the custom URL is used.
 * Otherwise, the current URL is used.
 * Also, if the custom URL is empty, the current URL is used.
 *
 * @param {boolean} useCustomUrl     - Whether to use a custom URL.
 * @param {string}  customUrlToCheck - The custom URL to check.
 * @return {string} The determined URL.
 */
export function determineUrl( useCustomUrl, customUrlToCheck ) {
	return useCustomUrl && customUrlToCheck !== ''
		? decodeURIComponent( customUrlToCheck )
		: window.location.href;
}

/**
 * Retrieves data from local storage based on the provided URL.
 * If the data is not found or expired, null is returned.
 * The data is considered expired if it is older than 24 hours.
 * If the data is expired, it is removed from local storage.
 *
 * @param {string} url - The URL used as the key to retrieve data from local storage.
 * @return {object|null} - The parsed data retrieved from local storage, or null if the data is not found or expired.
 */
export function getFromStorage( url ) {
	const storedData = window.localStorage.getItem( `wcb_${ url }` );
	if ( ! storedData ) {
		return null;
	}
	const parsedData = JSON.parse( storedData );
	const currentTime = new Date().getTime();
	if ( currentTime - parsedData.t > 86400000 ) {
		removeFromStorage( url );
		return null;
	}
	return parsedData;
}

/**
 * Sets data to local storage with a timestamp.
 *
 * @param {string} url  - The URL to set the data for.
 * @param {Object} data - The data to be stored.
 */
export function setToStorage( url, data ) {
	data.t = new Date().getTime();
	window.localStorage.setItem( `wcb_${ url }`, JSON.stringify( data ) );
}

/**
 * Removes an item from the local storage.
 *
 * @param {string} url - The URL of the item to be removed.
 */
export function removeFromStorage( url ) {
	window.localStorage.removeItem( `wcb_${ url }` );
}
