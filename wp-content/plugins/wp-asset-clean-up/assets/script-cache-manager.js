document.addEventListener("DOMContentLoaded", function () {
    if (typeof jQuery === "undefined") {
        console.error("jQuery is not loaded. Asset CleanUp needs the jQuery library, so make sure it is loaded.");
        return;
    }

    jQuery(document).ready(function ($) {
        $.fn.wpAssetCleanUpClearCache = function () {
            const wpacuSpinnerElId = '#wpacu-main-loading-spinner';
            const wpacuSpinnerTextEl = '#wpacu-main-loading-spinner-text';

            const self = {
                init: function () {
                    // Clear cache if "clear_cache" is set in the "wpacu_object"
                    // e.g. after a WP theme is changed
                    if (typeof wpacu_object.clear_cache_via_ajax !== 'undefined' && wpacu_object.clear_cache_via_ajax) {
                        self.wpacuAjaxClearCache(true);
                    }

                    $(document).on('click', '.wpacu-clear-cache-link', function (e) {
                        e.preventDefault();

                        if ($(wpacuSpinnerElId).length > 0) {
                            $(wpacuSpinnerTextEl).html($('div[data-wpacu-clear-cache-text="1"]').html());
                            $(wpacuSpinnerElId).removeClass('wpacu_hide');
                        }

                        self.wpacuAjaxClearCache(true);
                    });

                    // Do not trigger other plugins' cache again if already cleared (save resources)
                    let triggeredClearCacheIncludingOtherPluginsClearing = false;

                    // The assets of a page just had rules applied (e.g. assets were unloaded)
                    if (wpacu_object.clear_cache_via_ajax !== '') {
                        self.wpacuAjaxClearCache();
                        triggeredClearCacheIncludingOtherPluginsClearing = true;
                    }

                    if (wpacu_object.clear_other_caches !== '' && !triggeredClearCacheIncludingOtherPluginsClearing) {
                        setTimeout(function () {
                            self.wpacuClearAutoptimizeCache();
                            self.wpacuClearCacheEnablerCache();
                        }, 150);
                    }
                },

                afterSubmit: function () {
                    try {
                        let httpRefererFieldTargetName = 'input[type="hidden"][name="_wp_http_referer"]',
                            wpacuHttpRefererFieldVal;

                        if ($(httpRefererFieldTargetName).length > 0) {
                            wpacuHttpRefererFieldVal = $(httpRefererFieldTargetName).val();

                            // Edit Taxonomy page (after submit)
                            if (wpacuHttpRefererFieldVal.includes('term.php?taxonomy=') && wpacuHttpRefererFieldVal.includes('message=')) {
                                self.wpacuAjaxClearCache();
                            }

                            // Edit (Post/Page/Custom Post type) page (after submit)
                            if (wpacuHttpRefererFieldVal.includes('post.php?post=') && wpacuHttpRefererFieldVal.includes('message=')) {
                                self.wpacuAjaxClearCache();
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                },

                wpacuAjaxClearCache: function (forceCacheClear = false) {
                    // Do these verifications if the default value is used which is for triggering the cache in certain situations
                    // If it's set to "true" then it's the obvious intention of the user to clear the cache such as clicking the link from the top admin bar
                    if (forceCacheClear === false) {
                        /**
                         * Called after a post/page is saved (WordPress AJAX call)
                         */
                        if (typeof wpacu_object.wpacu_ajax_preload_url_nonce === 'undefined') {
                            return;
                        }

                        // Is the post status a "draft" one? Do not do any cache clearing and preloading as it's useless
                        let $wpacuHiddenPostStatusEl = '#hidden_post_status';
                        if ($($wpacuHiddenPostStatusEl).length > 0 && $($wpacuHiddenPostStatusEl).val() === 'draft') {
                            return;
                        }
                    }

                    $.get(wpacu_object.ajax_url, {
                        'action': wpacu_object.plugin_prefix + '_clear_cache',
                        'time_r': new Date().getTime(),
                        'wpacu_nonce': wpacu_object.wpacu_ajax_clear_cache_nonce
                    }, function (response) {
                        setTimeout(function () {
                            self.wpacuClearAutoptimizeCache(); // Autoptimize (if active)

                            // "Cache Enabler" (if active) cache was already cleared in classes/Update::ajaxClearCache() during the AJAX call
                            if (typeof wpacu_object.is_frontend_view !== 'undefined' && wpacu_object.is_frontend_view) {
                                // Preload (for the guest)
                                // The preload for the admin is not needed as the user is managing the CSS/JS in the front-end view and the page has been already visited
                                self.wpacuPreloadForGuest();
                            } else {
                                // Preload (for the admin)
                                $.get(wpacu_object.page_url, {
                                    'wpacu_preload': 1,
                                    'wpacu_no_frontend_show': 1,
                                    'time_r': new Date().getTime()
                                }, function () {
                                    // Then, preload (for the guest)
                                    self.wpacuPreloadForGuest();
                                });
                            }
                        }, 150);
                    }).always(function () {
                        if ($('#wpacu-assets-reloading-in-edit-post-area').length > 0) {
                            $('#wpacu-assets-reloading-in-edit-post-area').remove();
                        }
                    });
                },

                wpacuPreloadForGuest: function () {
                    $.post(wpacu_object.ajax_url, {
                        'action': wpacu_object.plugin_prefix + '_preload',
                        'page_url': wpacu_object.page_url,
                        'wpacu_nonce': wpacu_object.wpacu_ajax_preload_url_nonce,
                        'time_r': new Date().getTime()
                    }, function () {
                        if ($(wpacuSpinnerElId).length > 0) {
                            // As the caching has been cleared, hide the notice from the screen
                            $(wpacuSpinnerElId).addClass('wpacu_hide');
                        }
                    });
                },

                wpacuClearAutoptimizeCache: function () {
                    if (typeof wpacu_object.autoptimize_not_active !== 'undefined') {
                        return; // Autoptimize is not activated, thus do not continue
                    }

                    if (wpacu_object.clear_autoptimize_cache == 'false') {
                        console.log(wpacu_object.plugin_title + ': Autoptimize cache clearing is deactivated via "WPACU_DO_NOT_ALSO_CLEAR_AUTOPTIMIZE_CACHE" constant.');
                        return;
                    }

                    let wpacuAutoptimizeClickEl = '#wp-admin-bar-autoptimize-default li';

                    // Autoptimize elements & variables: make sure they are all initialized
                    if ($(wpacuAutoptimizeClickEl).length > 0
                        && typeof autoptimize_ajax_object.ajaxurl !== 'undefined'
                        && typeof autoptimize_ajax_object.nonce !== 'undefined') {
                        $.ajax({
                            type: 'GET',
                            url: autoptimize_ajax_object.ajaxurl,
                            data: {'action': 'autoptimize_delete_cache', 'nonce': autoptimize_ajax_object.nonce},
                            dataType: 'json',
                            cache: false,
                            timeout: 9000,
                            success: function (cleared) {
                            },
                            error: function (jqXHR, textStatus) {
                            }
                        });
                    }
                },

                wpacuClearCacheEnablerCache: function () {
                    if (typeof wpacu_object.cache_enabler_not_active !== 'undefined') {
                        return; // Autoptimize is not activated, thus do not continue
                    }

                    if (wpacu_object.clear_cache_enabler_cache == 'false') {
                        console.log(wpacu_object.plugin_title + ': "Cache Enabler" cache clearing is deactivated via "WPACU_DO_NOT_ALSO_CLEAR_CACHE_ENABLER_CACHE" constant.');
                        return;
                    }

                    let sendParams = {
                        'action': wpacu_object.plugin_prefix + '_cache_enabler_clear_cache',
                        'time_r': new Date().getTime(), // avoid any caching
                        'wpacu_nonce': wpacu_object.wpacu_ajax_clear_cache_enabler_cache_nonce
                    };

                    $.get(wpacu_object.ajax_url, sendParams, function (response) {
                    });
                }
            }

            return self;
        };

        window.wpacuCacheManager = $.fn.wpAssetCleanUpClearCache();
        wpacuCacheManager.init();
    });
});
