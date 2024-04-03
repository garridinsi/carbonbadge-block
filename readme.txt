=== Carbonbadge Block ===
Contributors: garridinsi
Tags: block
Donate link: https://buymeacoffee.com/garridinsi
Requires at least: 6.5
Tested up to: 6.5
Stable tag: 1.0.0
License: GPL-3.0-or-later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

The Website Carbon widget Gutenberg block, made with the Interactivity API.

== Description ==
## Yes, websites have a carbon footprint

[Website Carbon](https://www.websitecarbon.com) is a service made by [Wholegrain digital](https://wholegraindigital.com/) to help inspire and educate people to create a zero carbon internet. Provides an easy way to check the carbon footprint of your website.

They provide a official badge to put on your website, and with this plugin, you can have that badge as a reactive Gutenberg block, thanks to the new [Interactivity API](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/)

## How it works
This plugin adds a new block to the Gutenberg editor, called "Carbonbadge". You can add it to any post or page, and it will show the carbon footprint of the current page.
The block will render a badge with the carbon footprint of the current page, and a link to the Website Carbon website.
The data is fetched from the Website Carbon API, with a client side call, and it's updated every time the page is loaded. The result for a concrete page is cached for 24 hours, client side.
More information on the Website Carbon badge can be found [here](https://www.websitecarbon.com/badge/) and on the website FAQ page [here](https://www.websitecarbon.com/faq/)
The privacy policy of the Website Carbon service can be found [here](https://www.websitecarbon.com/privacy-policy/)
The Website Carbon service is provided by [Wholegrain digital](https://www.wholegraindigital.com)

## The code on GitHub
You can find the code of this plugin on [GitHub](https://github.com/garridinsi/carbonbadge-block)

== Installation ==
1. Upload the plugin files to the `/wp-content/plugins/carbonbadge-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the \'Plugins\' screen in WordPress.
3. Place the block on any Gutenberg post or page.

== Changelog ==
= 1.0.0 =
* First stable release
* Add block icon on the editor
* Better code documentation

= 0.1.4 =
* Fix error when generating the plugin, currentPage var was taking the testing page instead of the current page

= 0.1.2 =
* Fix localization issues
* Improve in code documentation

= 0.1.1 =
* Change plugin name and slug to `carbonbadge-block`

= 0.1.0 =
* First release
