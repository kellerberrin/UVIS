.. _nlmimagedownloaddoc:


.. |action| image:: emphasize.png
    :width: 20pt
    :height: 20pt
    
THE NLM Drug Image API
======================



Downloading CSV Data from the National Library of Medicine
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

The application reads all the NDCs defined in the US drug database and
downloads any visual information on the drugs.

The NLM has a drug image API available here:

 http://rximage.nlm.nih.gov/docs/doku.php

 A web application has been created to harvest this data.

 At the moment this is designed to be run from a web browser connected to the
 local US drug database instance with the following address:

 http://localhost:9080/runimageupdate?checkpoint=9100

 Where:

 1.     **localhost:9080** is the the current URL address of the US drug database application.

 2.     **runimageupdate** is the handler defined in the 'app.py' source file.

 3.     **checkpoint=9100** restarts the downloader from a particular sequential NDC record which has
        been previously checkpointed.

Important note - this is a temporary function that updates the GAE datastore directly. It will be replaced
with a Python function that reads the NLM API and then updates the CSV file that is then uploaded to the
production database. This replacement Python function will run on the command line independently of the local GAE.
