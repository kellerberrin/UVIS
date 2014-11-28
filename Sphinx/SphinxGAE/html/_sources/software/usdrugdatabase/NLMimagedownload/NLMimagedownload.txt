.. _nlmimagedownloaddoc:


.. |action| image:: emphasize.png
    :width: 20pt
    :height: 20pt
    
THE NLM Drug Image and RxCui API
================================

This program should run after the **processrawNDCfiles** program
has created a new "NDCDatabase.csv" file.

If the "ImageCheckpoint.csv" file is present with previously harvested data then only new NDCs will need to be
updated.

Downloading RxImage and RxCui data from the National Library of Medicine
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

The application reads all the NDCs defined in the US drug database and
downloads any required visual information on the drugs.

The NLM has a drug image API available here:

 http://rximage.nlm.nih.gov/docs/doku.php

Documentation for the RxNorm API is here:

 http://rxnav.nlm.nih.gov/RxNormAPIs.html

 A python application "getrximages.py" has been created to harvest this data.

This is wrapped in a linux bash command "harvestRxImages".


**Executing the RxImage harvest program.**

*   **harvestRxImages** Harvests the RxImage API from the National Library of Medicine.
    If the intermediate download file "ImageCheckpoint.csv" is present. The harvest program
    only gets NDCs that are in "NDCDatabase.csv" but not in "ImageCheckpoint.csv".
    If no "ImageCheckpoint.csv" is present than the download starts at the first record (NDC code)
    in "NDCDatabase.csv".

     |action| (UVIS) $harvestRxImages


The following ENVIRONMENT variables are set in "workenv UVIS" and used by "getrximages.py" (actual paths will vary
on different development computers).

1.  UVISUSDRUGIMAGEDIR=/media/kellerberrin/WorkDisk/Kellerberrin/Software/Active/UVIS
                       /GAEServer/NDCDatafilesUpload

    This environment variable identifies the data directory for "getrximages.py"

2.  UVISUSDRUGIMAGELOGFILE=$UVISUSDRUGIMAGEDIR/harvestrximages.log

    This environment variable identifies the log file of  "harvestrximages.py"

3.  UVISUSDRUGDATAFILE=$UVISUSDRUGIMAGEDIR/csvupload/NDCDatabase.csv

    This environment variable identifies the raw CSV file created using **processrawNDCfiles**.
    This file is read and the NDC codes in the file are compared to NDC codes in UVISUSDRUGIMAGECHECKPOINT.
    Only NDC codes that are present in this file but not present UVISUSDRUGIMAGECHECKPOINT are then queried
    on the RxImage API. Only NDCs in this file are eventually written to UVISUSDRUGIMAGEDATAFILE.

3.  UVISUSDRUGIMAGEDATAFILE=$UVISUSDRUGIMAGEDIR/csvupload/NDCImageDatabase.csv

    This environment variable creates a new file with the same format as the NDCDatabase.csv file
    but with the image fields populated. **Note that the file is
    recreated each time the image download is run.** This file will eventually be uploaded to the GAE Datastore.

    If the checkpoint file below exists then this file is pre-populated to the point that RxImage requests begin.

4.  UVISUSDRUGIMAGECHECKPOINT=$UVISUSDRUGIMAGEDIR/csvupload/ImageCheckpoint.csv

    If this file exists then it assumed that an image download has already occurred. The file is then read
    and closed. The NDCs in the file are then compared to the NDCs in the UVISUSDRUGDATAFILE (NDCDatabase.csv).
    Only NDCs present in UVISUSDRUGDATAFILE but not present in UVISUSDRUGIMAGECHECKPOINT are scheduled to
    be harvested from RxImage. Once the list of NDCs to be harvested has been generated the file is closed
    and reopened with "append" and the new image data is appended to end of the file.

    Note - to force the **harvestrximages** program harvest all NDC codes then simply delete this file.

5.  UVISUSDRUGIMAGEMAXRATE=3

    A throttle that sets the maximum number of queries per second so the RxImage API hosted by NLM is not over-loaded.

6.  UVISUSDRUGIMAGEURL=http://rximage.nlm.nih.gov/api/rximage/1/rxbase

    The URL of the RxImage API hosted by the NLM.

7.  UVISUSDRUGRXCUIURL=http://rxnav.nlm.nih.gov/REST/rxcui.json

    The URL of the RxCui NDC lookup function of the RxNorm API
