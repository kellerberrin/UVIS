.. _gaedatabasedoc:


.. |action| image:: emphasize.png
    :width: 20pt
    :height: 20pt
    

The GAE Datastore Design
========================


The Kind = **"NDCLookup"** Entity Layout.
+++++++++++++++++++++++++++++++++++++++++

The GAE datastore is a "High Replication" database. It is not a standard SQL database but is based on the "Big Table" concept.
Database tables are referred to as a "Kind". The entry in the "Kind" is an "Entity" and can be best thought of
as a stored object (or in SQL terms a table row).

Kind = **"NDCLookup"**  

The entity layout. This is constructed from the product and package csv files from the 
FDA database.
  

