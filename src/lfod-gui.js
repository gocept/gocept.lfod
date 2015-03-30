var $ = require('jquery');
require('./jquery.blockUI.js');
var jsontemplate = require('jsontemplate');
var lfod = require('./lfod-api.js');


templates = {};
api = new lfod.Lfod('http://lfod:dofl@lunch.gocept.com/db/');

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
        $('#button a').addClass('activated');
        $('.lfodder_fetch.selected').toggleClass('selected');
    }
    link.toggleClass('selected');
    return false;
}

var fetch = function(ev) {
    ev.preventDefault();
    var fetcher = $('.lfodder_fetch.selected').attr('data-id');
    if (!fetcher) {
        return false;
    }
    $('#app').block({message:'<img src="ajax-loader.gif" />', css: {border:0, 'background-color':'transparent'}});
    var selected_eaters = $('.lfodder_eat.selected');
    var eaters = [];
    selected_eaters.each(function(idx, eater) {
        eaters.push($(eater).attr('data-id'));
    });
    var guests = $('input').val();
    api.fetch(fetcher, eaters, guests, update_ranking);
    $('.toggle.selected').toggleClass('selected');
    $('input').val('0');
    $('#button a').removeClass('activated');
    update_log();
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
    $('div.log').hide();
    $('div.log:first-child').show();
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

$().ready(function() {
    init_templates();
    update_ranking();
    update_lfodder();
    update_log();
    $('.toggle').not('#lfodder_eat_guests').click(select);
    $('#lfodder_eat_guests').click(increase_guests);
    $('#button a').click(fetch);
    $('#more a.more').click(show_all);
    $('#more a.less').click(show_only_three);
    $('#more a.less').hide();
    $('#show_all_logs').click(show_all_logs);
});
