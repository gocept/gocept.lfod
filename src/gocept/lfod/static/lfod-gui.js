(function($) {

templates = {};
api = new lfod.Lfod();

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
}

var select = function(ev) {
    var link = $(ev.target);
    if (link.hasClass('lfodder_fetch')) {
        //only one can fetch, disable all other
        $('.lfodder_fetch.selected').toggleClass('selected');
    }
    link.toggleClass('selected');
}

var fetch = function(ev) {
    var selected_eaters = $('.lfodder_eat.selected');
    var eaters = [];
    selected_eaters.each(function(idx, eater) {
        eaters.push($(eater).attr('data-id'));
    });
    var fetcher = $('.lfodder_fetch.selected').attr('data-id');
    var guests = $('input').val();
    api.fetch(fetcher, eaters, guests, update_ranking);
}

var update_ranking = function() {
    api.get_ranking(function(data) { load_data('ranking', data); });
}

var update_lfodder = function() {
    api.get_fetchers(function(data) { load_data('lfodder', data); });
}


$().ready(function() {
    init_templates();
    update_ranking();
    update_lfodder();
    $('.toggle').click(select);
    $('#button a').click(fetch);
});

})(jQuery);
