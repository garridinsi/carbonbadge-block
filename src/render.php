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
 * We load the default state of the block here.
 * This is the state that the block will have when it is first loaded.
 * This is useful for setting up the initial state of the block.
 * The state is an array of key-value pairs.
 * In this case, we are setting the `isDarkMode` key to the value of the `$use_dark_mode` variable.
 */
wp_interactivity_state(
  'carbonbadge-block',
  array(
    'isDarkMode' => $use_dark_mode,
  )
);
?>

<!--
  - data-wp-interactive: Sets the block namespace
  - data-wp-context: Sets the initial state of the block.
  - data-wp-run: Sets the callback function to run when the block is rendered.
      In this case, it is `callbacks.doRequest`. This function is defined in the `index.js` file.
  - data-wp-class-(className): Adds the class to the element if the condition is met.
  - data-wp-bind-(attribute): Binds the attribute to the value of the parameter.
  - data-wp-text: Sets the text content of the element to the value of the parameter.
 -->
<div <?php echo get_block_wrapper_attributes(); ?> data-wp-interactive='{ "namespace": "carbonbadge-block" }'
  data-wp-context='{ "isOpen": false, "showTheResult": false, "showLoading": false, "showNoResult": false, "measureDiv": "", "belowText": "", "darkMode": false }'
  data-wp-run="callbacks.doRequest">
  <div class="wcb carbonbadge" data-wp-class--wcb-d="context.darkMode">
    <div class="wcb_p">
      <span data-wp-bind--hidden="!context.showLoading" data-wp-class--wcb_g="context.showLoading">
        <?php esc_html_e('Measuring CO₂', 'carbonbadge-block'); ?>
        <span>&hellip;</span>
      </span>
      <span data-wp-bind--hidden="!context.showNoResult" data-wp-class--wcb_g="context.showNoResult">
        <?php esc_html_e('No data available', 'carbonbadge-block'); ?>
      </span>
      <span data-wp-bind--hidden="!context.showTheResult" data-wp-class--wcb_g="context.showTheResult">
        <?php printf(__('%sg of CO₂/view', 'carbonbadge-block'), '<span data-wp-text="context.measureDiv"></span>'); ?>
      </span>
      <a class="wcb_a" target="_blank" rel="noopener noreferrer" href="https://websitecarbon.com">
        Website Carbon
      </a>
    </div>
    <div data-wp-bind--hidden="!context.showTheResult">
      <span class="wcb_2">
        <?php printf(__('Cleaner than&nbsp;%s&#37; of pages tested', 'carbonbadge-block'), '<span data-wp-text="context.belowText"></span>'); ?>
      </span>
    </div>
  </div>
</div>