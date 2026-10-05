<?php
/**
 * Plugin Name: AVICINNA Headless Integration & ISR Revalidator
 * Description: Dedicated headless integration for AVICINNA Next.js platform. Dispatches on-demand ISR revalidation webhooks, routes Gutenberg draft previews to Next.js, and exposes Rank Math/Yoast SEO fields in REST API.
 * Version: 1.0.0
 * Author: AVICINNA Healthcare Engineering
 * License: GPL-2.0+
 */

if (!defined('ABSPATH')) {
    exit;
}

// Configurable constants or environment variables
define('AVICINNA_FRONTEND_URL', defined('AVICINNA_FRONTEND_URL_CONST') ? AVICINNA_FRONTEND_URL_CONST : 'https://avicinna.netlify.app');
define('AVICINNA_REVALIDATE_SECRET', defined('AVICINNA_REVALIDATE_SECRET_CONST') ? AVICINNA_REVALIDATE_SECRET_CONST : 'avicinna_wp_secure_token_change_me');

/**
 * 1. On-Demand ISR Revalidation on Post Publish, Update, or Trash
 */
function avicinna_trigger_nextjs_revalidation($post_id, $post, $update) {
    // Only trigger for standard 'post' post type
    if ($post->post_type !== 'post') {
        return;
    }

    // Ignore auto-drafts and revisions
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    $slug = $post->post_name;
    $webhook_url = rtrim(AVICINNA_FRONTEND_URL, '/') . '/api/revalidate-blog?secret=' . urlencode(AVICINNA_REVALIDATE_SECRET);

    $body = wp_json_encode(array(
        'post_id' => $post_id,
        'slug'    => $slug,
        'status'  => $post->post_status,
        'time'    => current_time('mysql'),
    ));

    wp_remote_post($webhook_url, array(
        'method'      => 'POST',
        'timeout'     => 5,
        'redirection' => 2,
        'httpversion' => '1.1',
        'blocking'    => false, // Non-blocking for instant editor experience
        'headers'     => array(
            'Content-Type' => 'application/json',
        ),
        'body'        => $body,
    ));
}
add_action('wp_after_insert_post', 'avicinna_trigger_nextjs_revalidation', 10, 3);
add_action('trashed_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'post') {
        avicinna_trigger_nextjs_revalidation($post_id, $post, true);
    }
});

/**
 * 2. Route Gutenberg Preview Button directly to Next.js Draft Mode
 */
function avicinna_custom_preview_link($preview_link, $post) {
    if ($post->post_type !== 'post') {
        return $preview_link;
    }

    $slug = $post->post_name ? $post->post_name : 'preview-' . $post->ID;
    return add_query_arg(
        array(
            'secret' => AVICINNA_REVALIDATE_SECRET,
            'slug'   => $slug,
            'id'     => $post->ID,
        ),
        rtrim(AVICINNA_FRONTEND_URL, '/') . '/api/draft'
    );
}
add_filter('preview_post_link', 'avicinna_custom_preview_link', 10, 2);

/**
 * 3. Expose Custom Fields in REST API for Medical Articles
 */
add_action('rest_api_init', function () {
    register_rest_field('post', 'meta_custom', array(
        'get_callback' => function ($post_arr) {
            $post_id = $post_arr['id'];
            return array(
                'reading_time'  => get_post_meta($post_id, 'reading_time', true) ?: 5,
                'author_name'   => get_post_meta($post_id, 'author_name', true) ?: 'أ. د. استشاري جراحة',
                'author_role'   => get_post_meta($post_id, 'author_role', true) ?: 'استشاري في الطب البشري',
                'hospital_name' => get_post_meta($post_id, 'hospital_name', true) ?: 'مستشفيات الشركاء بتركيا',
                'category_slug' => get_post_meta($post_id, 'category_slug', true) ?: 'oncology',
            );
        },
        'update_callback' => function ($value, $post, $field_name) {
            if (!is_array($value)) return;
            foreach ($value as $k => $v) {
                update_post_meta($post->ID, sanitize_key($k), sanitize_text_field($v));
            }
        },
        'schema' => array(
            'description' => __('Medical post custom metadata'),
            'type'        => 'object',
        ),
    ));
});

/**
 * 4. Expose Rank Math / Yoast SEO Fields Cleanly in WP REST API
 */
add_action('rest_api_init', function () {
    register_rest_field('post', 'rank_math_seo', array(
        'get_callback' => function ($post_arr) {
            $post_id = $post_arr['id'];
            return array(
                'title'          => get_post_meta($post_id, 'rank_math_title', true) ?: get_the_title($post_id),
                'description'    => get_post_meta($post_id, 'rank_math_description', true) ?: get_the_excerpt($post_id),
                'focus_keyword'  => get_post_meta($post_id, 'rank_math_focus_keyword', true) ?: '',
                'canonical'      => rtrim(AVICINNA_FRONTEND_URL, '/') . '/blog/' . get_post_field('post_name', $post_id),
            );
        },
        'schema' => array(
            'description' => __('Rank Math SEO Clean Metadata'),
            'type'        => 'object',
        ),
    ));
});

/**
 * 5. Headless Redirect: Send any public visitor accessing WP frontend to Next.js
 */
add_action('template_redirect', function () {
    if (!is_admin() && !wp_is_json_request() && !is_user_logged_in()) {
        wp_redirect(AVICINNA_FRONTEND_URL . '/blog', 301);
        exit;
    }
});
