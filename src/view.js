/**
 * WordPress dependencies
 */
import { store, getContext } from "@wordpress/interactivity";

const isAdminEnv = window.location.href.indexOf("wp-admin") > -1;
const currentPage = encodeURIComponent(
  !isAdminEnv ? "https://enekogarrido.com/" : window.location.href
);
const urlToCheck = currentPage.endsWith("/") ? currentPage : `${currentPage}/`;

const { state } = store("wp-carbonbadge", {
  callbacks: {
    doRequest: () => {
      const context = getContext();
      setProps(3, context);
      context.darkMode = state.isDarkMode;
      if ("fetch" in window) {
        const saved = localStorage.getItem(`wcb_${urlToCheck}`);
        const now = new Date().getTime();
        if (saved) {
          const jsonSaved = JSON.parse(saved);
          renderResult(jsonSaved);
          if (now - jsonSaved.t > 864e5) {
            newRequest(context);
          }
        } else {
          newRequest(context);
        }
      }
    },
  },
});

const renderResult = (e, context = getContext()) => {
  context.measureDiv = e.c;
  context.belowText = `Cleaner than ${e.p}% of pages tested`;
  setProps(1, context);
};
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
