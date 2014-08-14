import os
from google.appengine.ext import ndb
from google.appengine.ext import db
from google.appengine.tools import bulkloader


class NDCLookup(db.Model):
    ndc = db.StringProperty()
    format = db.StringProperty()
    producttypename = db.StringProperty()
    proprietaryname = db.StringProperty()
    nonproprietaryname = db.StringProperty()
    dosageformname = db.StringProperty()
    routename = db.StringProperty()
    applicationnumber = db.StringProperty()
    labellername = db.StringProperty()
    substancename = db.StringProperty()
    activenumeratorstrength = db.StringProperty()
    activeingredientunit = db.StringProperty()
    pharmclasses = db.StringProperty()
    packagedescription = db.StringProperty()


class NDCLoader(bulkloader.Loader):
    def __init__(self):
        bulkloader.Loader.__init__(self, 'NDCLookup',
                                   [('ndc', str),
                                    ('format', str),
                                    ('producttypename', str),
                                    ('proprietaryname', lambda x: x.upper()),
                                    ('nonproprietaryname', str),
                                    ('dosageformname', str),
                                    ('routename', str),
                                    ('applicationnumber', str),
                                    ('labellername', str),
                                    ('substancename', lambda x: x.replace(';','').split(' ')),
                                    ('activenumeratorstrength', str),
                                    ('activeingredientunit', str),
                                    ('pharmclasses', str),
                                    ('packagedescription', str)
                                  ])

loaders = [NDCLoader]
