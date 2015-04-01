var $ = require('jquery');
require('./jquery.blockUI.js');
var jsontemplate = require('jsontemplate');
var lfod = require('./lfod-api.js');


var templates = {};
var api;

var init_templates = function() {
    $('.template').each(function(idx, template) {
        var templ = $(template);
        var template_id = templ.attr('data-template-id');
        var code = templ.parent().html();
        templates[template_id] = new jsontemplate.Template(code,
            {default_formatter: 'html',
             undefined_str: '' });
        templ.remove();
    });
}

var load_data = function(area, data) {
    $('#'+area).html('');
    $(data).each(function(idx, item) {
        var code = $(templates[area].expand(item));
        if ((area == 'lfodder') && (item.id == 'guests')) {
            return
        }
        $('#'+area).append(code);
    });
    $('img').each(function(idx, item) {
        var img = $(item);
        var src = img.attr('data-src');
        if (src) {
            img.attr('src', src+'?d=monsterid');
        }
    });
    do_show_only_three(1);
}

var show_only_three = function(ev) {
    ev.preventDefault();
    do_show_only_three(0);
    return false;
}

var do_show_only_three = function(hide) {
    $('.rank').each(function(idx, item) {
        if (idx>2) {
            if (hide == 1)
                $(item).hide();
            else
                $(item).slideUp();
        }
    });
    $('#more a.more').show();
    $('#more a.less').hide();
}

var show_all = function (ev) {
    ev.preventDefault();
    $('.rank').slideDown();
    $('#more a.more').hide();
    $('#more a.less').show();
    return false;
}

var select = function(ev) {
    ev.preventDefault();
    var link = $(ev.target);
    if (link.hasClass('lfodder_fetch')) {
        //only one can fetch, disable all other
        $('#button button').addClass('activated');
        $('.lfodder_fetch.selected').toggleClass('selected');
    }
    link.toggleClass('selected');
    return false;
}

var fetch = function(ev) {
    ev.preventDefault();
    var fetcher = $('.favface.selected').attr('data-id');
    if (!fetcher) {
        return false;
    }
    $('.favface.selected').removeClass('selected');
    $('#app').block({message:'<img src="ajax-loader.gif" />', css: {border:0, 'background-color':'transparent'}});
    var selected_eaters = $('.js-switch');
    var eaters = [];
    selected_eaters.each(function(idx, eater) {
      if (eater.checked) {
        eaters.push(eater.value);
        $(eater).click();
      }
    });
    var guests = $('input[name=guests]').val();
    api.fetch(fetcher, eaters, guests, update_ranking);
    $('input[name=guests]').val('0');
    $('button.primary').removeClass('activated');
    update_log();
    $('.lfodder').fadeOut();
    $('#app').unblock();
    return false;
}

var update_ranking = function() {
    api.get_ranking(function(data) { load_data('ranking', data); });
}

var update_lfodder = function() {
    api.get_fetchers(function(data) { load_data('lfodder', data); });
}

var update_log = function() {
    var fetches = api.get_last_fetches(
        function(data) { load_data('log', data); });
}

var increase_guests = function(ev) {
    ev.preventDefault();
    $('input').val(parseInt($('input').val())+1);
    $('#guests').effect('highlight', {color: '#ffff00'}, 700);
    return false;
}

var show_all_logs = function(ev) {
    ev.preventDefault();
    $('div.log').toggle();
    $('div.log:first-child').show();
}

var load_settings = function () {
    var url = localStorage.getItem('lfod_url');
    var dbname = localStorage.getItem('lfod_dbname');
    $('#settings_backend_url').val(url);
    $('#settings_dbname').val(dbname);
    api = new lfod.Lfod(url, dbname);
}

var save_settings = function (ev) {
    localStorage.setItem('lfod_url', $('#settings_backend_url').val());
    localStorage.setItem('lfod_dbname', $('#settings_dbname').val());
    window.location.reload();
}

$().ready(function() {
    $('.icon').click(function (ev) {
        ev.preventDefault();
        if ($('.modal').hasClass('visible')) {
            $('.modal').removeClass('visible');
        } else {
            $('.modal').addClass('visible');
        }
    });
    $('.btn-save-settings').click(save_settings);
    load_settings();
    init_templates();
    update_ranking();
    update_lfodder();
    update_log();
    $('.toggle').not('#lfodder_eat_guests').click(select);
    $('#lfodder_eat_guests').click(increase_guests);
    $('#button button').click(fetch);
    $('.favface').click(function (ev) {
        ev.preventDefault();
        var selected = $(ev.currentTarget);
        if (selected.hasClass('selected')) {
            selected.removeClass('selected');
            $('.lfodder').fadeOut();
        } else {
            $('.favface').removeClass('selected');
            selected.addClass('selected');
            $('.lfodder').fadeIn();
        }
    });
    
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

    elems.forEach(function(html) {
      var switchery = new Switchery(html, { size: 'small' });
    });
});
