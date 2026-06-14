'use strict';

(function ($) {
    $(function () {
        // import / export
        $('.wpclever_export').show();

        // load plugins
        if ($('.wpclever_plugins_wrapper').length) {
            $.ajax({
                url: ajaxurl, method: 'POST', data: {
                    action: 'wpc_get_plugins', security: wpc_dashboard_vars.nonce,
                }, dataType: 'html', beforeSend: function () {
                    $('.wpclever_plugins_wrapper').addClass('wpclever_plugins_loading');
                }, complete: function () {
                    $('.wpclever_plugins_wrapper').removeClass('wpclever_plugins_loading');
                }, success: function (response) {
                    $('.wpclever_plugins_wrapper').html(response);
                },
            });
        }

        // load suggestion
        if ($('.wpclever_settings_page_suggestion').length) {
            $.ajax({
                url: ajaxurl, method: 'POST', data: {
                    action: 'wpc_get_suggestion', security: wpc_dashboard_vars.nonce,
                }, success: function (response) {
                    if (response !== '' && response !== '0') {
                        $('.wpclever_settings_page_suggestion_content').html(response);
                        $('.wpclever_settings_page_suggestion_content > div').hide();
                        wpc_rotate_suggestion($('.wpclever_settings_page_suggestion_content > div'));
                    }
                },
            });
        }
    });

    $(document).on('click', '.wpclever_plugins_order_a', function (e) {
        e.preventDefault();
        var o = $(this).data('o');

        if ($(this).hasClass('wpclever_plugins_order_down')) {
            $('.wpclever_plugins_wrapper').find('.item').sort(function (a, b) {
                return $(b).data(o) - $(a).data(o);
            }).appendTo('.wpclever_plugins_wrapper');
        } else {
            $('.wpclever_plugins_wrapper').find('.item').sort(function (a, b) {
                return $(a).data(o) - $(b).data(o);
            }).appendTo('.wpclever_plugins_wrapper');
        }

        $(this).toggleClass('wpclever_plugins_order_down');
    });

    $(document).on('click', '.wpclever_export', function (e) {
        e.preventDefault();

        var $btn = $(this);
        var key = $btn.data('key');
        var name = $btn.data('name') ?? 'settings';

        if (!$('#wpclever_export').length) {
            $('body').append('<div id=\'wpclever_export\'></div>');
        }

        $('#wpclever_export').html('Loading...');

        $('#wpclever_export').dialog({
            minWidth: 460, title: 'Import / Export', modal: true, dialogClass: 'wpc-dialog', open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $('#wpclever_export').dialog('close');
                });
            },
        });

        var data = {
            action: 'wpc_export', key: key, name: name, security: wpc_dashboard_vars.nonce,
        };

        $.post(ajaxurl, data, function (response) {
            $('#wpclever_export').html(response);
        });
    });

    $(document).on('click', '.wpclever_import', function (e) {
        if (confirm('Are you sure?')) {
            var $btn = $(this);
            var key = $btn.data('key');
            var settings = $('.wpclever_export_data[data-key="' + key + '"]').val();

            if (!wpc_valid_json(settings)) {
                alert('The data is not in the correct format. Please check again!');
                $('.wpclever_export_data[data-key="' + key + '"]').focus();
            } else {
                $btn.addClass('disabled');

                var data = {
                    action: 'wpc_import', key: key, settings: settings, security: wpc_dashboard_vars.nonce,
                };

                $.post(ajaxurl, data, function (response) {
                    window.location.reload();
                });
            }
        }
    });

    function wpc_valid_json(jsonString) {
        try {
            JSON.parse(jsonString);
            return true; // The string is valid JSON
        } catch (e) {
            // An error occurred during parsing, meaning the string is not valid JSON
            // You can optionally log the error 'e' for debugging purposes
            // console.error("JSON parsing error:", e);
            return false;
        }
    }

    function wpc_rotate_suggestion(elems, i = -1) {
        i = i === elems.length - 1 ? 0 : i + 1;
        elems.eq(i).fadeIn().delay(7000).fadeOut(0, function () {
            wpc_rotate_suggestion(elems, i);
        });
    }
})(jQuery);