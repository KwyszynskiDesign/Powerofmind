'use strict';

(function($) {
  $(function() {
    woonp_status();
    woonp_type();
    woonp_type_single();
  });

  $(document).on('change', 'input[name="_woonp_status"]', function() {
    woonp_status();
  });

  $(document).on('change', '.woonp_type', function() {
    woonp_type();
  });

  $(document).on('change', 'select[name="_woonp_type"]', function() {
    woonp_type_single();
  });

  function woonp_status() {
    if ($('input[name="_woonp_status"]:checked').val() === 'overwrite') {
      $('div.woonp_show_if_overwrite').show();
    } else {
      $('div.woonp_show_if_overwrite').hide();
    }
  }

  function woonp_type() {
    if ($('.woonp_type').val() === 'select') {
      $('tr.woonp_show_if_type_input').css('display', 'none');
      $('tr.woonp_show_if_type_select').css('display', 'table-row');
    } else {
      $('tr.woonp_show_if_type_select').css('display', 'none');
      $('tr.woonp_show_if_type_input').css('display', 'table-row');
    }
  }

  function woonp_type_single() {
    if ($('select[name="_woonp_type"]').val() === 'select') {
      $('div.woonp_show_if_type_input').css('display', 'none');
      $('div.woonp_show_if_type_select').css('display', 'flex');
    } else {
      $('div.woonp_show_if_type_select').css('display', 'none');
      $('div.woonp_show_if_type_input').css('display', 'flex');
    }
  }
})(jQuery);
