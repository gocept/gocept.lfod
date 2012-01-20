
lfod = {}

lfod.Lfod = function() {
    this.construct.apply(this, arguments);
}

lfod.Lfod.prototype = {
    construct: function(database_url) {
        this.database_url = database_url;
    },
    fetch: function(fetcher_id, eater_ids, guests, callback) {
        for (var x=0; x<eater_ids.length; x++) {
            var eater_id = eater_ids[x];
            var current = this.db_get_score(eater_id);
            this.db_set_score(eater_id, current-1);
        }
        var current_fetcher = this.db_get_score(fetcher_id);
        guests = parseInt(guests);
        current_fetcher += eater_ids.length + guests;
        if (guests > 0) {
            var guests_score = this.db_get_score('guests');
            this.db_set_score('guests', guests_score - guests);
        }
        this.db_set_score(fetcher_id, current_fetcher)
        callback();
    },
    get_ranking: function(callback) {
        //get lfodders sorted by score and pass to callback
        var data = this.list_fetchers('score');
        callback(data);
    },
    get_fetchers: function(callback) {
        //get lfodders sorted by name and pass to callback
        var data = this.list_fetchers('name');
        callback(data);
    },
    list_fetchers: function(sort) {
        //return all fetchers stored in database
        //sorted by given key
        var result = this.db_list_fetchers(sort);
        var data = [];
        for(i=0; i<result.total_rows; i++) {
            var res = result.rows[i].value;
            res.id = result.rows[i].id;
            data.push(res);
        }
        return data;
    },
    db_get_score: function(fetcher_id) {
        //get current fetcher score from database and return it
        var response = $.ajax({
            url:this.database_url+fetcher_id,
            async:false});
        return $.parseJSON(response.responseText)['score'];
    },
    db_set_score: function(fetcher_id, score) {
        //update fetcher score in database
        var response = $.ajax({
            url:this.database_url+fetcher_id,
            async:false});
        fetcher = $.parseJSON(response.responseText);
        fetcher['score'] = score;
        var response = $.ajax({
            url:this.database_url+fetcher_id,
            data: JSON.stringify(fetcher),
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            async:false});
    },
    db_list_fetchers: function(sort) {
        var response = $.ajax({
            url:this.database_url+'_design/lists/_view/list_by_'+sort,
            async:false});
        return $.parseJSON(response.responseText);
    }
}
