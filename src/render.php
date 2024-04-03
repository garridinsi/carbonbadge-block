<?php
if (!defined('ABSPATH'))
  exit; // Exit if accessed directly
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
  'carbonbadge-block',
  array(
    'isDarkMode' => $use_dark_mode,
  )
);
?>

<div <?php echo get_block_wrapper_attributes(); ?> data-wp-interactive='{ "namespace": "carbonbadge-block" }'
  data-wp-context='{ "isOpen": false, "showTheResult": false, "showLoading": false, "showNoResult": false, "measureDiv": "", "belowText": "", "darkMode": false }'
  data-wp-run="callbacks.doRequest">
  <div class="wcb carbonbadge" data-wp-class--wcb-d="context.darkMode">
    <div class="wcb_p">

      <span data-wp-bind--hidden="!context.showLoading" data-wp-class--wcb_g="context.showLoading">
        <?php esc_html_e('Measuring CO₂', 'carbonbadge-block'); ?> <span>&hellip;</span>
      </span>
      <span data-wp-bind--hidden="!context.showNoResult" data-wp-class--wcb_g="context.showNoResult">
        <?php esc_html_e('No data available', 'carbonbadge-block'); ?>
      </span>
      <span data-wp-bind--hidden="!context.showTheResult" data-wp-class--wcb_g="context.showTheResult">
        <span data-wp-text="context.measureDiv"></span>
        <?php esc_html_e('g of CO₂/view', 'carbonbadge-block'); ?>
      </span>
      <a class="wcb_a" target="_blank" rel="noopener noreferrer" href="https://websitecarbon.com">
        /* translators: Don't translate, Website Carbon is the name of a service: https://websitecarbon.com */
        <?php esc_html_e('Website Carbon', 'carbonbadge-block'); ?>
      </a>
    </div>
    <div data-wp-bind--hidden="!context.showTheResult">
      <span class="wcb_2">
        <?php esc_html_e('Cleaner than', 'carbonbadge-block');
        ?>
        <span>&nbsp;</span>
        <span data-wp-text="context.belowText"></span>
        <?php esc_html_e('% of pages tested', 'carbonbadge-block'); ?>
      </span>
    </div>
  </div>
</div>