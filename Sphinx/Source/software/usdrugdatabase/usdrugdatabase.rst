.. _usdrugdatabasedoc:


US Drug Database Documentation
==============================    


.. toctree::
    :maxdepth: 2
    :glob:
    :hidden:
    :includehidden:

    FDAdownload/FDAdownload
    GAEdatabase/GAEdatabase
    NLMimagedownload/NLMimagedownload


|
|
|
|    


Google App Engine Datastore Design
----------------------------------


.. image:: GAEsmall.jpg
    :width: 62px
    :align: left
    :height: 55px
    :target: GAEdatabase/GAEdatabase.html

:ref:`US Drug Database GAE Datastore Documentation<gaedatabasedoc>`
The Layout and design of the US drug database GAE datastore.


|
|
|
|


Downloading and Processing the FDA Product and Package Files.
-------------------------------------------------------------


.. image:: fda.png
    :width: 100px
    :align: left
    :height: 43px
    :target: FDAdownload/FDAdownload.html


:ref:`Downloading and processing the FDA "package.txt" and "product.txt" <fdadownloaddoc>`
These files are downloaded as zip file and processed into csv file to uploaded into the GAE datastore.



|
|
|
|


Downloading and processing the National Library of Medicine (NLM) Image Files.
------------------------------------------------------------------------------


.. image:: nlm.png
    :width: 300px
    :align: left
    :height: 40px
    :target: NLMimagedownload/NLMimagedownload.html


:ref:`Downloading the image files from the NLM online API<nlmimagedownloaddoc>`
Solid drug (pill) image URLs are downloaded from the NLM online API using a python script.
The image URLS are used to decorate the csv file generated from the "package.txt" and "product.txt"
down loaded from the FDA.
