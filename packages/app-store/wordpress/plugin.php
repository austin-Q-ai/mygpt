<?php
/**
 * Plugin Name:       MyGPT.fi 
 * Plugin URI:        https://mygpt.fi/apps/wordpress
 * Description:       Embed your MyGPT.fi in Wordpress
 * Version:           0.1
 * Author:            MyGPT.fi, Inc.
 * Author URI:        https://mygpt.fi
 * License:           AGPLv3
 * License URI:       https://www.gnu.org/licenses/agpl-3.0.en.html
 * Text Domain:       calcom-embed
 */

function cal_shortcode( $atts, $content = null) {
global $post;extract(shortcode_atts(array(
'for' => $post->post_title,
), $atts));
if(empty($content)) $content='Embed MyGPT.fi';

return '<script>(function (C, A, L){let p=function (a, ar){a.q.push(ar);}; let d=C.document; C.Cal=C.Cal || function (){let cal=C.Cal; let ar=arguments; if (!cal.loaded){cal.ns={}; cal.q=cal.q || []; d.head.appendChild(d.createElement("script")).src=A; cal.loaded=true;}if (ar[0]===L){const api=function (){p(api, arguments);}; const namespace=ar[1]; api.q=api.q || []; typeof namespace==="string" ? (cal.ns[namespace]=api) && p(api, ar) : p(cal, ar); return;}p(cal, ar);};})(window, "https://mygpt.fi/embed.js", "init"); Cal("init") </script> <script>Cal("inline",{calLink: '.$content.'});</script>'
}
add_shortcode('cal', 'cal_shortcode');