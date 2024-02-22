<?php
/**
 * Plugin Name:       Carbonbadge Block
 * Description:       The Website Carbon widget Gutenberg block, made with the Interactivity API.
 * Version:           0.1.0
 * Requires at least: 6.5
 * Requires PHP:      7.0
 * Author:            garridinsi
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       wp-carbonbadge
 *
 * @package           wp-carbonbadge
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wp_carbonbadge_wp_carbonbadge_block_init()
{
	register_block_type_from_metadata(__DIR__ . '/build');
}
add_action('init', 'wp_carbonbadge_wp_carbonbadge_block_init');
