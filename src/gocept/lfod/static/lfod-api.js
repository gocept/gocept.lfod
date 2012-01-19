
lfod = {}

lfod.Lfod = function() {
    this.construct.apply(this, arguments);
}

lfod.Lfod.prototype = {
    construct: function(database_url) {
        this.database_url = database_url;
        this.fetcher_ids = ['guests', 'nilo', 'basti']
        this.fetchers =  {
            'guests':{'id': 'guests', 'name': 'Guests', 'score': -4, 'avatar_url': 'http://www.gravatar.com/avatar/a51cd122bc7693338bd5605ab9e1bea3'},
            'nilo':{'id': 'nilo', 'name': 'Nilo', 'score': 5, 'avatar_url': 'http://www.gravatar.com/avatar/175820105d688458ad46d4e42733f171'},
            'basti':{'id': 'basti', 'name': 'Basti', 'score': 3, 'avatar_url': 'http://www.gravatar.com/avatar/a51cd122bc7693338bd5605ab9e1bea5'}};
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
        return this.fetchers[fetcher_id].score;
    },
    db_set_score: function(fetcher_id, score) {
        //update fetcher score in database
        this.fetchers[fetcher_id].score = score;
    },
    db_list_fetchers: function(sort) {
        //return all fetchers stored in database
        //sorted by given key
        var data = [];
        for (x=0; x<this.fetcher_ids.length; x++) {
            var fetcher_id = this.fetcher_ids[x];
            data.push(this.fetchers[fetcher_id]);
        }
        return data;
    }
}



//api.data = [{'id': 'nilo', 'name': 'Nilo', 'score': '5', 'avatar_url': ''},
//            {'id': 'basti', 'name': 'Basti', 'score': '3', 'avatar_url': ''}];

