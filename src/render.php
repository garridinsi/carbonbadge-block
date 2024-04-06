<?php

/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
if (!defined('ABSPATH'))
  exit; // Exit if accessed directly


/**
 * If the `useDarkMode` attribute is set, we use that value.
 * Otherwise, we default to `false`.
 * This attribute is used to determine if the block should be displayed in dark mode.
 * If the attribute is set to `true`, the block will be displayed in dark mode.
 * If the attribute is set to `false`, the block will be displayed in light mode.
 * The `useDarkMode` attribute is a boolean attribute.
 * We will add this attribute later to the default state of the block.
 */
if (!empty($attributes['useDarkMode'])) {
  $use_dark_mode = $attributes['useDarkMode'];
} else {
  $use_dark_mode = false;
}

/**
 * Similar to the `useDarkMode` attribute, we check if the `useCustomUrl` attribute is set.
 * If the `useCustomUrl` attribute is set, we use that value. Also, we check if the `customUrlToCheck` attribute is set.
 * If the `customUrlToCheck` attribute is set, we use that value.
 * Otherwise, we default `customUrlToCheck` to an empty string.
 * Otherwise, we default `useCustomUrl` to `false`.
 * This attribute is used to determine if the block should use a custom URL to check the carbon footprint.
 * If the attribute is set to `true`, the block will use a custom URL to check the carbon footprint.
 * If the attribute is set to `false`, the block will use the current page URL to check the carbon footprint.
 * The `useCustomUrl` attribute is a boolean attribute.
 * We will add this attribute later to the default state of the block.
 */
if (!empty($attributes['useCustomUrl'])) {
  $use_custom_url = $attributes['useCustomUrl'];
  if (!empty($attributes['customUrlToCheck'])) {
    $custom_url = $attributes['customUrlToCheck'];
  } else {
    $custom_url = '';
  }
} else {
  $use_custom_url = false;
  $custom_url = '';
}

/**
 * Similar to the `useDarkMode` attribute, we check if the `showLinkToWebCarbon` attribute is set.
 * If the `showLinkToWebCarbon` attribute is set, we use that value.
 * Otherwise, we default `showLinkToWebCarbon` to `false`.
 * This attribute is used to determine if the block should show a link to the Website Carbon website.
 * If the attribute is set to `true`, the block will show a link to the Website Carbon website.
 * If the attribute is set to `false`, the block will not show a link to the Website Carbon website.
 * The `showLinkToWebCarbon` attribute is a boolean attribute.
 * We will add this attribute later to the default state of the block.
 */
if (!empty($attributes['showLinkToWebCarbon'])) {
  $show_link_to_wc = $attributes['showLinkToWebCarbon'];
} else {
  $show_link_to_wc = false;
}

/**
 * We load the default state of the block here.
 * This is the state that the block will have when it is first loaded.
 * This is useful for setting up the initial state of the block.
 * The state is an array of key-value pairs.
 * In this case, we are setting the `isDarkMode` key to the value of the `$use_dark_mode` variable.
 * We are setting the `useCustomUrl` key to the value of the `$use_custom_url` variable.
 * We are setting the `customUrlToCheck` key to the value of the `$custom_url` variable.
 * We are setting the `showLinkToWebCarbon` key to the value of the `$show_link_to_wc` variable.
 * We are setting the `i18n` key to an array of key-value pairs. This is used for internationalization as we cannot use the `__()` function in JS files.
 */
wp_interactivity_state(
  'carbonbadge-block',
  array(
    'isDarkMode' => $use_dark_mode,
    'useCustomUrl' => $use_custom_url,
    'customUrlToCheck' => $custom_url,
    'showLinkToWebCarbon' => $show_link_to_wc,
    "i18n" => array(
      "measuringCO2" => __("Measuring CO₂", "carbonbadge-block"),
      "noResult" => __("No Result", "carbonbadge-block"),
      "gOfCO2PerView" => __("%sg of CO₂/view", "carbonbadge-block"),
      "cleanerThan" => __("Cleaner than %s% of pages tested", "carbonbadge-block")
    )
  )
);
/**
 * We set the initial context of the block here.
 * This is the context that the block will have when it is first loaded.
 * The context is an array of key-value pairs.
 * In this case, we are setting the `isOpen` key to `false`.
 * We are setting the `showTheResult` key to `false`.
 * We are setting the `showLoading` key to `false`.
 * We are setting the `showNoResult` key to `false`.
 * We are setting the `measureDiv` key to the value of the `__("Measuring CO₂", "carbonbadge-block")` function.
 * We are setting the `belowText` key to an empty string.
 * We are setting the `darkMode` key to the value of the `$use_dark_mode` variable.
 * We are setting the `websiteCarbonLink` key to `#`.
 * We are setting the `resultData` key to an empty string.
 * We are setting the `showLinkToWebCarbon` key to the value of the `$show_link_to_wc` variable.
 */
$my_context = array(
  'isOpen' => false,
  'showTheResult'  => false,
  'showLoading' => false,
  'showNoResult' => false,
  'measureDiv' => __("Measuring CO₂", "carbonbadge-block"),
  'belowText' => '',
  'darkMode' => $use_dark_mode,
  'websiteCarbonLink' => '#',
  'resultData' => '',
  'showLinkToWebCarbon' => $show_link_to_wc
);
?>

<!--
  - data-wp-interactive: Sets the block namespace
  - echo wp_interactivity_data_wp_context( $my_context ): Sets the context of the block defined on the array above.
  - data-wp-run: Sets the callback function to run when the block is rendered.
      In this case, it is `callbacks.doRequest`. This function is defined in the `index.js` file.
  - data-wp-class-(className): Adds the class to the element if the condition is met.
  - data-wp-bind-(attribute): Binds the attribute value to the value of the parameter.
  - data-wp-text: Sets the text content of the element to the value of the parameter.
 -->
<div <?php echo get_block_wrapper_attributes(); ?> data-wp-interactive='{ "namespace": "carbonbadge-block" }' <?php echo wp_interactivity_data_wp_context($my_context); ?> data-wp-run="callbacks.doRequest">

  <div class="wcb carbonbadge" data-wp-class--wcb-d="context.darkMode">
    <div class="wcb_p">
      <!-- 
        - data-wp-text: Sets the content of the span to the parameter context.measureDiv.
            This parameter is defined on the edit.js file and is used to show the message "Measuring CO₂" or the result of the calculation.
       -->
      <span class="wcb_g" data-wp-text="context.measureDiv">
      </span>
      <!-- 
        - data-wp-bind--hidden: Adds the hidden attribute if the condition is met. 
            In this case, the element is hidden if the context.showLinkToWebCarbon is false.
        - data-wp-bind--href: Sets the href attribute to the value of the parameter context.websiteCarbonLink.
            This parameter is defined on the edit.js file and is used to set the link to the Website Carbon website.
       -->
      <span data-wp-bind--hidden="!context.showLinkToWebCarbon">
        <a class="wcb_a" target="_blank" rel="noopener noreferrer" data-wp-bind--href="context.websiteCarbonLink">
          Website Carbon
        </a>
      </span>
      <!-- 
        - data-wp-bind--hidden: Adds the hidden attribute if the condition is met. 
            In this case, the element is hidden if the context.showLinkToWebCarbon is true.
       -->
      <span data-wp-bind--hidden="context.showLinkToWebCarbon">
        <span class="wcb_a">Website Carbon</span>
      </span>
    </div>
    <div>
      <!-- 
        - data-wp-text: Sets the content of the span to the parameter context.belowText.
            This parameter is defined on the edit.js file and is used to show the result of the calculation.
       -->
      <span class="wcb_2" data-wp-text="context.belowText">
      </span>
    </div>
  </div>
</div>