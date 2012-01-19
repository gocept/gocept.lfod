
lfod = {}

lfod.Lfod = function() {
    this.construct.apply(this, arguments);
}

lfod.Lfod.prototype = {
    construct: function(database_url) {
        this.database_url = database_url;
    },
    fetch: function(fetcher, eaters, guests, callback) {
        callback();
    },
    get_ranking: function(callback) {
        //get lfodders sorted by score and pass to callback
        var data = this.db_list_fetchers('score');
        callback(data);
    },
    get_fetchers: function(callback) {
        //get lfodders sorted by name and pass to callback
        var data = this.db_list_fetchers('name');
        callback(data);
    },
    db_get_score: function(fetcher_id) {
        //get current fetcher score from database and return it
    },
    db_set_score: function(fetcher_id, score) {
        //update fetcher score in database
    },
    db_list_fetchers: function(sort) {
        //return all fetchers stored in database
        //sorted by given key
    }
}



//api.data = [{'id': 'nilo', 'name': 'Nilo', 'score': '5', 'avatar_url': ''},
//            {'id': 'basti', 'name': 'Basti', 'score': '3', 'avatar_url': ''}];

