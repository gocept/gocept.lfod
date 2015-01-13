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


Initialize new database
=======================

Create databases for ldof and log::

  $ curl -X PUT http://localhost:5984/lfod
  $ curl -X PUT http://localhost:5984/lfod_log

Add user::

  $ curl -X PUT http://localhost:5984/lfod/basti -d '{"_id":"basti","name":"Basti","score":0,"avatar_url":"http://www.gravatar.com/avatar/a51cd122bc7693338bd5605ab9e1bea5"}'
  $ …

Create views::

  $ curl -X PUT http://localhost:5984/lfod/_design/lists -d '{"_id": "_design/lists", "language": "javascript", "views": {"get_avatars": {"map": "function(doc) {\n  emit(doc.avatar_url, doc);\n}"}, "list_by_name": {"map": "function(doc) {\n  emit(doc.name, doc);\n}"}, "list_by_score": {"map": "function(doc) {\n  emit(doc.score, doc);\n}"}}}'
  $ curl -X PUT http://localhost:5984/lfod_log/_design/lists -d '{"_id": "_design/lists", "language": "javascript", "views": {"list_by_time": {"map": "function(doc) {\n  emit(doc.time, doc);\n}"}}}'
