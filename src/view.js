/**
 * WordPress dependencies
 */
import { store, getContext } from "@wordpress/interactivity";

/**
 * Indicates whether the current page is on the wp-admin side.
 * @type {boolean}
 */
const isAdminEnv = window.location.href.indexOf("wp-admin") > -1;

/**
 * Encodes the current page URL.
 * If the current page is on the wp-admin side, gets the homepage.
 * @type {string}
 */
// const currentPage = encodeURIComponent(
//   isAdminEnv ? window.location.href.split("wp-admin")[0] : window.location.href
// );

// Just for testing
const currentPage = encodeURIComponent("https://enekogarrido.com/");

/**
 * Represents the URL to be checked. If the URL ends with a slash, the URL is the same as the current page URL.
 * Otherwise, the URL is the current page URL with a trailing slash because of API requirements.
 * @type {string}
 */
const urlToCheck = currentPage.endsWith("/") ? currentPage : `${currentPage}/`;

const { state } = store("carbonbadge-block", {
  callbacks: {
    doRequest: () => {
      const context = getContext();
      setProps(3, context);
      context.darkMode = state.isDarkMode;
      if ("fetch" in window) {
        const saved = localStorage.getItem(`wcb_${urlToCheck}`);
        const now = new Date().getTime();
        if (!saved || now - JSON.parse(saved).t > 864e5) {
          newRequest(context);
        } else {
          const jsonSaved = JSON.parse(saved);
          renderResult(jsonSaved);
        }
      }
    },
  },
});

/**
 * Renders the result of a measurement.
 * @param {Object} e - The measurement object.
 * @param {Object} [context=getContext()] - The context object.
 */
const renderResult = (e, context = getContext()) => {
  context.measureDiv = e.c;
  context.belowText = e.p;
  setProps(1, context);
};
/**
 * Sets the properties of the context object based on the given action.
 * showTheResult: If true, the result of the calculation is shown on view.
 * showLoading: If true, the loading message is shown on view.
 * showNoResult: If true, the "no result" message is shown on view.
 * case 1: showTheResult is true, showLoading and showNoResult are false.
 * case 2: showNoResult is true, showLoading and showTheResult are false.
 * case 3: showLoading is true, showNoResult and showTheResult are false.
 * @param {number} action - The action to perform.
 * @param {object} [context=getContext()] - The context object to modify.
 */
const setProps = (action, context = getContext()) => {
  switch (action) {
    case 1:
      context.showTheResult = true;
      context.showLoading = false;
      context.showNoResult = false;
      break;
    case 2:
      context.showTheResult = false;
      context.showLoading = false;
      context.showNoResult = true;
      break;
    case 3:
      context.showTheResult = false;
      context.showLoading = true;
      context.showNoResult = false;
  }
};
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
 * @param {Object} context - The context object.
 */
const newRequest = (context = getContext()) => {
  fetch(`https://api.websitecarbon.com/b?url=${urlToCheck}`)
    .then((response) => {
      if (!response.ok) throw Error(response);
      return response.json();
    })
    .then((json) => {
      if (json) {
        renderResult(json, context);
      }
      json.t = new Date().getTime();
      localStorage.setItem(`wcb_${urlToCheck}`, JSON.stringify(json));
    })
    .catch((err) => {
      setProps(2, context);
      localStorage.removeItem(`wcb_${urlToCheck}`);
      throw new Error(err);
    });
};
