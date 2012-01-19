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
    mylfod = new lfod.Lfod('some_url');
    var callback = jasmine.createSpy('spy on callback');
    it('get_ranking method calls callback', function() {
        mylfod.get_ranking(callback);
        expect(callback).toHaveBeenCalled();
    });
    it('get_fetchers method calls callback', function() {
        mylfod.get_fetchers(callback);
        expect(callback).toHaveBeenCalled();
    });
    it('fetch method calls callback', function() {
        mylfod.fetch('', '', '', callback);
        expect(callback).toHaveBeenCalled();
    });
});

