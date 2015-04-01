var $ = require('jquery');


lfod = {};

lfod.Lfod = function() {
    this.construct.apply(this, arguments);
}

lfod.Lfod.prototype = {
    construct: function(couchdb_url) {
        this.couchdb_url = couchdb_url;
        this.database_url = couchdb_url + 'lfod/';
        this.log_database_url = couchdb_url + 'lfod_log/';
    },
    fetch: function(fetcher_id, eater_ids, guests, callback) {
        debugger;
        return;
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
        this.db_log_fetch(fetcher_id, eater_ids, guests);
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
    get_last_fetches: function(callback) {
        var fetches = this.db_get_last_fetches();
        if (!fetches)
            return ['never fetched'];
        var result = [];
        for (x=0; x<fetches.length; x++) {
            var date = new Date();
            date.setTime(fetches[x]['time']);
            var today = new Date();
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate()-1);
            if (date.toDateString() == today.toDateString())
                date = 'today';
            else if (date.toDateString() == yesterday.toDateString())
                date = 'yesterday';
            else
                date = date.toDateString();
            var fetcher = this.db_get_fetcher(fetches[x]['fetcher'])['name'];
            result.push({'date': date, 'fetcher': fetcher});
        }
        callback(result);
    },
    db_get_score: function(fetcher_id) {
        //get current fetcher score from database and return it
        var response = $.ajax({
            url:this.database_url+fetcher_id,
            async:false});
        return $.parseJSON(response.responseText)['score'];
    },
    db_get_fetcher: function(fetcher_id) {
        var response = $.ajax({
            url:this.database_url+fetcher_id,
            async:false});
        return $.parseJSON(response.responseText);
    },
    db_set_score: function(fetcher_id, score) {
        //update fetcher score in database
        var fetcher = this.db_get_fetcher(fetcher_id);
        fetcher['score'] = score;
        var response = $.ajax({
            url:this.database_url+fetcher_id,
            data: JSON.stringify(fetcher),
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            async:false});
    },
    db_log_fetch: function(fetcher_id, eater_ids, guests) {
        //Save a log to the database for the fetch
        var response = $.ajax({
            url:this.log_database_url,
            data: JSON.stringify(
                {'fetcher': fetcher_id,
                 'eaters': eater_ids,
                 'guests': guests,
                 'time': new Date().getTime()}),
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            async:false});

    },
    db_get_last_fetches: function() {
        var response = $.ajax({
            url:this.log_database_url+'_design/lists/_view/list_by_time',
            async:false});
        var logs = $.parseJSON(response.responseText);
        if (logs.total_rows == 0)
            return []
        var result = [];
        for (x=1;x<=5;x++) {
            if (logs.total_rows-x >= 0)
                result.push(logs['rows'][logs.total_rows-x]['value']);
        }
        return result;
    },
    db_list_fetchers: function(sort) {
        var response = $.ajax({
            url:this.database_url+'_design/lists/_view/list_by_'+sort,
            async:false});
        return $.parseJSON(response.responseText);
    }
}

module.exports = lfod;
