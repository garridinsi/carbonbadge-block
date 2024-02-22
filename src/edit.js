/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  const { useDarkMode } = attributes;

  const measuringText = __(
    "Measuring CO<sub>2</sub>&hellip;",
    "wp-carbonbadge"
  );
  const [measureDiv, setMeasureDiv] = useState(measuringText);
  const [belowText, setBelowText] = useState("&nbsp;");
  const [darkMode, setDarkMode] = useState(useDarkMode);

  const isAdminEnv = window.location.href.indexOf("wp-admin") > -1;
  const currentPage = encodeURIComponent(
    isAdminEnv ? "https://enekogarrido.com/" : window.location.href
  );
  const urlToCheck = currentPage.endsWith("/")
    ? currentPage
    : `${currentPage}/`;
  const newRequest = (e = false) => {
    fetch(`https://api.websitecarbon.com/b?url=${urlToCheck}`)
      .then((response) => {
        if (!response.ok) throw Error(response);
        return response.json();
      })
      .then((json) => {
        if (e) {
          renderResult(json);
        }
        json.t = new Date().getTime();
        localStorage.setItem(`wcb_${urlToCheck}`, JSON.stringify(json));
      })
      .catch((err) => {
        const noResultText = __("No Result", "wp-carbonbadge");
        setMeasureDiv(noResultText);
        localStorage.removeItem(`wcb_${urlToCheck}`);
        throw new Error(err);
      });
  };
  const renderResult = (e) => {
    const cleanerThanText = __("Cleaner than", "wp-carbonbadge");
    const percentageText = __("of pages tested", "wp-carbonbadge");
    const ofCO2Text = __("g of CO<sub>2</sub>/view", "wp-carbonbadge");
    setMeasureDiv(`${e.c}${ofCO2Text}`);
    setBelowText(`${cleanerThanText} ${e.p}% ${percentageText}`);
  };

  useEffect(() => {
    if ("fetch" in window) {
      const saved = localStorage.getItem(`wcb_${urlToCheck}`);
      const now = new Date().getTime();
      if (saved) {
        const jsonSaved = JSON.parse(saved);
        renderResult(jsonSaved);
        if (now - jsonSaved.t > 864e5) {
          newRequest(true);
        }
      } else {
        newRequest();
      }
    }
  }, [urlToCheck]);

  useEffect(() => {
    setDarkMode(useDarkMode);
  }, [useDarkMode]);

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Settings", "wp-carbonbadge")}>
          <ToggleControl
            checked={!!useDarkMode}
            label={__("Use dark mode", "wp-carbonbadge")}
            onChange={() =>
              setAttributes({
                useDarkMode: !useDarkMode,
              })
            }
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <div className={`wcb carbonbadge ${darkMode ? "wcb-d" : ""}`}>
          <div className="wcb_p">
            <span
              className="wcb_g"
              dangerouslySetInnerHTML={{
                __html: measureDiv,
              }}
            ></span>
            <a
              className="wcb_a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://websitecarbon.com"
            >
              {__("Website Carbon", "wp-carbonbadge")}
            </a>
          </div>
          <span
            className="wcb_2"
            dangerouslySetInnerHTML={{
              __html: belowText,
            }}
          ></span>
        </div>
      </div>
    </>
  );
}
