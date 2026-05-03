'use strict';

const { release: { version } } = require('./package.json');

module.exports.RELEASE = version;
module.exports.PORT = process.env.PORT || '51821';
module.exports.WEBUI_HOST = process.env.WEBUI_HOST || '0.0.0.0';
/** This is only kept for migration purpose. DO NOT USE! */
module.exports.PASSWORD = process.env.PASSWORD;
module.exports.PASSWORD_HASH = process.env.PASSWORD_HASH;
module.exports.WG_PATH = process.env.WG_PATH || '/etc/wireguard/';
module.exports.WG_DEVICE = process.env.WG_DEVICE || 'eth0';
module.exports.WG_HOST = process.env.WG_HOST;
module.exports.WG_PORT = process.env.WG_PORT || '51820';
module.exports.WG_CONFIG_PORT = process.env.WG_CONFIG_PORT || process.env.WG_PORT || '51820';
module.exports.WG_MTU = process.env.WG_MTU || null;
module.exports.WG_PERSISTENT_KEEPALIVE = process.env.WG_PERSISTENT_KEEPALIVE || '0';
module.exports.WG_DEFAULT_ADDRESS = process.env.WG_DEFAULT_ADDRESS || '10.8.0.x';
module.exports.WG_DEFAULT_ADDRESS_V6 = process.env.WG_DEFAULT_ADDRESS_V6 || 'fd42:42:42::x';
module.exports.WG_DEFAULT_DNS = typeof process.env.WG_DEFAULT_DNS === 'string'
  ? process.env.WG_DEFAULT_DNS
  : '1.1.1.1';
module.exports.WG_ALLOWED_IPS = process.env.WG_ALLOWED_IPS || '0.0.0.0/0, ::/0';

module.exports.WG_PRE_UP = process.env.WG_PRE_UP || '';
module.exports.WG_POST_UP = process.env.WG_POST_UP || `
nft add table ip wg-easy;
nft add chain ip wg-easy postrouting { type nat hook postrouting priority srcnat\\; };
nft add rule ip wg-easy postrouting ip saddr ${module.exports.WG_DEFAULT_ADDRESS.replace('x', '0')}/24 oifname ${module.exports.WG_DEVICE} masquerade;
nft add chain ip wg-easy forward { type filter hook forward priority filter\\; };
nft add rule ip wg-easy forward iifname wg0 accept;
nft add rule ip wg-easy forward oifname wg0 accept;
nft add table ip6 wg-easy;
nft add chain ip6 wg-easy postrouting { type nat hook postrouting priority srcnat\\; };
nft add rule ip6 wg-easy postrouting ip6 saddr ${module.exports.WG_DEFAULT_ADDRESS_V6.replace('x', '0')}/64 oifname ${module.exports.WG_DEVICE} masquerade;
nft add chain ip6 wg-easy forward { type filter hook forward priority filter\\; };
nft add rule ip6 wg-easy forward iifname wg0 accept;
nft add rule ip6 wg-easy forward oifname wg0 accept;
`.split('\n').join(' ').trim();

module.exports.WG_PRE_DOWN = process.env.WG_PRE_DOWN || '';
module.exports.WG_POST_DOWN = process.env.WG_POST_DOWN || `
nft delete table ip wg-easy;
nft delete table ip6 wg-easy;
`.split('\n').join(' ').trim();
module.exports.LANG = process.env.LANG || 'en';
module.exports.UI_TRAFFIC_STATS = process.env.UI_TRAFFIC_STATS || 'false';
module.exports.UI_CHART_TYPE = process.env.UI_CHART_TYPE || 0;
