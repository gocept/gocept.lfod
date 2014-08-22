===========
gocept.lfod
===========

Determine the lunch fetcher of the day.

Installation
============

This package needs couchDB. Please install it first.

To install JS dependencies, run ``npm install``.


Building
========

Run tests with ``npm test``, update minified JS bundle with ``npm run build``.


Local server
============

Run ``nginx -c $PWD/nginx.conf`` to start nginx.

XXX requires correct absolute paths in ./nginx.conf


Local database
==============

Creating local databases::

  $ curl -X PUT http://localhost:5984/lfod
  $ curl -X PUT http://localhost:5984/lfod_log


Dump/load production data::

  $ virtualenv .
  $ bin/pip install couchdb
  $ bin/couchdb-dump http://lfod:dofl@lunch.gocept.com/db/lfod > lfod.dump
  $ bin/couchdb-dump http://lfod:dofl@lunch.gocept.com/db/lfod_log > lfod_log.dump
  $ bin/couchdb-load http://localhost:5984/lfod < lfod.dump
  $ bin/couchdb-load http://localhost:5984/lfod_log < lfod_log.dump
