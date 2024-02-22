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

// Generate unique id for aria-controls.
$unique_id = wp_unique_id('p-');
if (!empty($attributes['useDarkMode'])) {
  $use_dark_mode = $attributes['useDarkMode'];
} else {
  $use_dark_mode = false;
}
wp_interactivity_state(
  'wp-carbonbadge',
  array(
    'isDarkMode' => $use_dark_mode,
  )
);
?>

<div <?php echo get_block_wrapper_attributes(); ?> data-wp-interactive='{ "namespace": "wp-carbonbadge" }'
  data-wp-context='{ "isOpen": false, "showTheResult": false, "showLoading": false, "showNoResult": false, "measureDiv": "", "belowText": "", "darkMode": false}'
  data-wp-run="callbacks.doRequest">
  <div class="wcb carbonbadge" data-wp-class--wcb-d="context.darkMode">
    <div class="wcb_p">

      <span data-wp-bind--hidden="!context.showLoading" data-wp-class--wcb_g="context.showLoading">
        Measuring CO<sub>2</sub>&hellip;
      </span>
      <span data-wp-bind--hidden="!context.showNoResult" data-wp-class--wcb_g="context.showNoResult">
        No data available
      </span>
      <span data-wp-bind--hidden="!context.showTheResult" data-wp-class--wcb_g="context.showTheResult">
        <span data-wp-text="context.measureDiv"></span>
        g of CO<sub>2</sub>/view
      </span>
      <a class="wcb_a" target="_blank" rel="noopener noreferrer" href="https://websitecarbon.com">
        Website Carbon
      </a>
    </div>
    <span class="wcb_2" data-wp-text="context.belowText"></span>
  </div>
</div>