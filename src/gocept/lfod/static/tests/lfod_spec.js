require('../lfod-api.js');


describe('Lfod api definition', function() {
    it('api is defined', function() {
        expect(lfod.Lfod).toBeDefined();
    });
    mylfod = new lfod.Lfod('some_url');
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
        expect(mylfod.database_url).toEqual('some_url');
    });
});

describe('Lfod api methods callback', function() {
    var mylfod = new lfod.Lfod('some_url');
    var callback = jasmine.createSpy('callback');
    it('get_ranking method calls callback', function() {
        mylfod.get_ranking(callback);
        expect(callback).toHaveBeenCalled();
    });
    it('get_fetchers method calls callback', function() {
        mylfod.get_fetchers(callback);
        expect(callback).toHaveBeenCalled();
    });
});

describe('Lfod can list fetchers', function() {
    var mylfod = new lfod.Lfod('some_url');
    var fake_data = [];
    var callback = jasmine.createSpy('callback');
    var list_fetchers_mock = spyOn(mylfod, 'db_list_fetchers').andCallFake(function() {return fake_data;});
    it('get_fetchers can handle empty data', function() {
        mylfod.get_fetchers(callback);
        expect(callback).toHaveBeenCalledWith([]);
    });
    it('get_fetchers returns data from database', function() {
        fake_data = [{'name': 'Basti'}, {'name': 'Nilo'}];
        mylfod.get_fetchers(callback);
        expect(callback).toHaveBeenCalledWith([{'name': 'Basti'}, {'name': 'Nilo'}]);
    });
    it('get_fetchers calls database method with sortkey name', function() {
        mylfod.get_fetchers(function() {});
        expect(list_fetchers_mock).toHaveBeenCalledWith('name');
    });
    it('get_ranking returns data from database', function() {
        fake_data = [{'name': 'Basti'}, {'name': 'Nilo'}];
        mylfod.get_ranking(callback);
        expect(callback).toHaveBeenCalledWith([{'name': 'Basti'}, {'name': 'Nilo'}]);
    });
    it('get_ranking calls database method with sortkey score', function() {
        mylfod.get_ranking(function() {});
        expect(list_fetchers_mock).toHaveBeenCalledWith('score');
    });
});

describe('Lfod calculates scores for eaters and fetcher', function() {
    var mylfod = new lfod.Lfod('some_url');
    var callback = function() {};
    var set_score_mock = spyOn(mylfod, 'db_set_score');
    var current_score = {'nilo': -3, 'basti': 1, 'zagy': 2};
    spyOn(mylfod, 'db_get_score').andCallFake(
        function(fetcher_id) {return current_score[fetcher_id]});
    mylfod.fetch('nilo', ['basti', 'zagy'], 0, callback);
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
    var mylfod = new lfod.Lfod('some_url');
    var callback = function() {};
    var set_score_mock = spyOn(mylfod, 'db_set_score');
    var current_score = {'nilo': -3, 'basti': 1, 'zagy': 2, 'guests': 0};
    spyOn(mylfod, 'db_get_score').andCallFake(
        function(fetcher_id) {return current_score[fetcher_id]});
    mylfod.fetch('nilo', ['basti', 'zagy'], 5, callback);
    it('nilos score is increased by number of eater and guests', function() {
        expect(set_score_mock).toHaveBeenCalledWith('nilo', 4);
    });
    it('bastis score is reduced by one', function() {
        expect(set_score_mock).toHaveBeenCalledWith('basti', 0);
    });
    it('zagys score is reduced by one', function() {
        expect(set_score_mock).toHaveBeenCalledWith('zagy', 1);
    });
    it('guests score is reduced by number of guests', function() {
        expect(set_score_mock).toHaveBeenCalledWith('guests', -5);
    });
    it('number of guests can be given as string', function() {
        mylfod.fetch('nilo', ['basti'], '3', callback);
        expect(set_score_mock).toHaveBeenCalledWith('nilo', 4);
    });
});

