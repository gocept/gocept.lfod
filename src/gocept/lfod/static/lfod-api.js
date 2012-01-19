
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
        callback({});
    },
    get_fetchers: function(callback) {
        //get lfodders sorted by name and pass to callback
        callback({});
    }
}



//api.data = [{'id': 'nilo', 'name': 'Nilo', 'score': '5', 'avatar_url': ''},
//            {'id': 'basti', 'name': 'Basti', 'score': '3', 'avatar_url': ''}];

