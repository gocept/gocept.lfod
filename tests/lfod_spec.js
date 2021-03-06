var lfod = require('../src/lfod-api.js');


describe('Lfod module structure', function() {
    it('has Lfod defined', function() {
        expect(lfod.Lfod).toBeDefined();
    });
});


describe('Lfod api definition', function() {
    var mylfod;

    beforeAll(function() {
        mylfod = new lfod.Lfod('http://localhost/');
    });

    it('has fetch method', function() {
        expect(mylfod.fetch).toBeDefined();
    });
    it('has get_ranking method', function() {
        expect(mylfod.get_ranking).toBeDefined();
    });
    it('has get_fetchers method', function() {
        expect(mylfod.get_fetchers).toBeDefined();
    });
    it('database url saved', function() {
        expect(mylfod.database_url).toEqual('http://localhost/lfod/');
    });
    it('log database url saved', function() {
        expect(mylfod.log_database_url).toEqual('http://localhost/lfod_log/');
    });
});


describe('Lfod can list fetchers', function() {
    var mylfod;
    var callback;

    beforeAll(function() {
        mylfod = new lfod.Lfod('some_url');
        callback = jasmine.createSpy('callback');
    });

    beforeEach(function() {
        this.list_fetchers_mock = spyOn(mylfod, 'list_fetchers').and.callFake(() => this.fake_data);
    });

    it('get_fetchers can handle empty data', function() {
        this.fake_data = [];
        mylfod.get_fetchers(callback);
        expect(callback).toHaveBeenCalledWith([]);
    });

    it('get_fetchers returns data from database', function() {
        this.fake_data = [{'name': 'Basti'}, {'name': 'Nilo'}];
        mylfod.get_fetchers(callback);
        expect(callback).toHaveBeenCalledWith([{'name': 'Basti'}, {'name': 'Nilo'}]);
    });

    it('get_fetchers calls database method with sortkey name', function() {
        mylfod.get_fetchers(function() {});
        expect(this.list_fetchers_mock).toHaveBeenCalledWith('name');
    });

    it('get_ranking returns data from database', function() {
        this.fake_data = [{'name': 'Basti'}, {'name': 'Nilo'}];
        mylfod.get_ranking(callback);
        expect(callback).toHaveBeenCalledWith([{'name': 'Basti'}, {'name': 'Nilo'}]);
    });

    it('get_ranking calls database method with sortkey score', function() {
        mylfod.get_ranking(function() {});
        expect(this.list_fetchers_mock).toHaveBeenCalledWith('score');
    });
});


describe('Lfod calculates scores for eaters and fetcher', function() {
    var set_score_mock;

    beforeAll( function() {
        var mylfod = new lfod.Lfod('some_url');
        var callback = function() {};
        set_score_mock = spyOn(mylfod, 'db_set_score');
        spyOn(mylfod, 'db_log_fetch');
        var current_score = {'nilo': -3, 'basti': 1, 'zagy': 2};
        spyOn(mylfod, 'db_get_score').and.callFake(function(fetcher_id) {return current_score[fetcher_id]});
        mylfod.fetch('nilo', ['basti', 'zagy'], 0, callback);
    });

    it('nilos score is increased by number of eater', function() {
        expect(set_score_mock).toHaveBeenCalledWith('nilo', -1);
    });

    it('bastis score is reduced by one', function() {
        expect(set_score_mock).toHaveBeenCalledWith('basti', 0);
    });

    it('zagys score is reduced by one', function() {
        expect(set_score_mock).toHaveBeenCalledWith('zagy', 1);
    });
});


describe('Lfod can handle guests', function() {
    var mylfod;
    var callback;

    beforeAll(function() {
        mylfod = new lfod.Lfod('some_url');
        callback = function() {};
    });

    beforeEach(function() {
        this.set_score_mock = spyOn(mylfod, 'db_set_score');
        var current_score = {'nilo': -3, 'basti': 1, 'zagy': 2, 'guests': 0};
        spyOn(mylfod, 'db_log_fetch');
        spyOn(mylfod, 'db_get_score').and.callFake(
            function(fetcher_id) {return current_score[fetcher_id]});
        mylfod.fetch('nilo', ['basti', 'zagy'], 5, callback);
    });

    it('nilos score is increased by number of eater and guests', function() {
        expect(this.set_score_mock).toHaveBeenCalledWith('nilo', 4);
    });

    it('bastis score is reduced by one', function() {
        expect(this.set_score_mock).toHaveBeenCalledWith('basti', 0);
    });

    it('zagys score is reduced by one', function() {
        expect(this.set_score_mock).toHaveBeenCalledWith('zagy', 1);
    });

    it('guests score is reduced by number of guests', function() {
        expect(this.set_score_mock).toHaveBeenCalledWith('guests', -5);
    });

    it('number of guests can be given as string', function() {
        mylfod.fetch('nilo', ['basti'], '3', callback);
        expect(this.set_score_mock).toHaveBeenCalledWith('nilo', 4);
    });
});


describe('Handling of database JSON results', function() {
    var mylfod;

    beforeAll(function() {
        mylfod = new lfod.Lfod('some_url');
    });

    beforeEach(function() {
        var db_list_fetchers_mock = spyOn(
            mylfod, 'db_list_fetchers').and.returnValue(
            {"total_rows": 2,
             "rows": [{"id": "basti",
                       "key": "Basti",
                       "value": {"name":"Basti", "score":0}},
                      {"id": "nilo",
                       "key": "Nilo",
                       "value": {"name":"Nilo", "score":4}}]});
    });

    it('list_fetchers returns name, score and id of fetchers', function() {
        expect(mylfod.list_fetchers('name')).toEqual(
          [{name: 'Basti', score: 0, id: 'basti'},
           {name: 'Nilo', score: 4, id: 'nilo'}]);
    });
});


describe('Calculation of the logs', function() {
    var callback;
    var thedaybeforeyesterday;
    var mylfod;

    beforeAll(function() {
        mylfod = new lfod.Lfod('some_url');
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(today.getDate()-1);
        thedaybeforeyesterday = new Date();
        thedaybeforeyesterday.setDate(yesterday.getDate()-1);
        spyOn(mylfod, 'db_get_last_fetches').and.returnValue(
            [{'fetcher': 'andrea', time: today.getTime()},
                {'fetcher': 'nilo', time: yesterday.getTime()},
                {'fetcher': 'basti', time: thedaybeforeyesterday.getTime()}])
        fetcher_names = {'andrea': {'name': 'Andrea'},
                            'basti': {'name': 'Basti'},
                            'nilo': {'name': 'Nilo'}};
        spyOn(mylfod, 'db_get_fetcher').and.callFake(
            function(fetcher_id) {return fetcher_names[fetcher_id]});
        spyOn(mylfod, 'db_log_fetch');
        callback = jasmine.createSpy('callback');
        mylfod.get_last_fetches(callback);
    });

    it('callback is called with fetcher and date logs', function() {
        expect(callback).toHaveBeenCalledWith(
          [{date: 'today', fetcher: 'Andrea'},
           {date: 'yesterday', fetcher: 'Nilo'},
           {date: thedaybeforeyesterday.toDateString(), fetcher: 'Basti'}]);
    });
});
