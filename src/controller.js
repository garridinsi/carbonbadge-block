/**
 * Checks if the given URL belongs to the admin environment.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} - Returns true if the URL belongs to the admin environment, otherwise returns false.
 */
function isAdminEnv( url ) {
	return url.indexOf( 'wp-admin' ) > -1;
}

/**
 * Returns the current page URL after encoding it.
 *
 * @param {string} url - The URL of the current page.
 * @returns {string} The encoded URL of the current page.
 */
export function getCurrentPage( url ) {
	const splittedUrl = isAdminEnv( url ) ? url.split( 'wp-admin' )[ 0 ] : url;
	return encodeURIComponent(
		splittedUrl.endsWith( '/' ) ? splittedUrl : `${ splittedUrl }/`
	);
}
