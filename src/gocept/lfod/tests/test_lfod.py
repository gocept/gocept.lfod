# Copyright (c) 2012 gocept gmbh & co. kg
# See also LICENSE.txt

import os
import gocept.exttest
import pkg_resources


def test_suite():
    return gocept.exttest.makeSuite(
        os.environ.get('jasmine-bin'),
        '--json',
        pkg_resources.resource_filename('gocept.lfod', '/static/tests'))
