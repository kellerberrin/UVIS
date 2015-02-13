.. _linuxdoc:

.. |action| image:: emphasize.png
    :width: 20pt
    :height: 20pt
   

.. image:: linux.jpg
    :width: 64px
    :align: left
    :height: 64px

The UVIS Linux (Bash) Environment
=================================


.. image:: apple.jpg
    :width: 64px
    :align: left
    :height: 64px

This is a command line environment that can used by any OS using the Bash command shell.
In particular, this documentation applies to the Apple command line development environment.    


The UVIS Bash Scripts
=====================

Setup Scripts (Once Only)
+++++++++++++++++++++++++

The scripts simply need to be copied into a suitable directory such as
'$HOME/bin'. Ensure that the directory is in the '$PATH' of the Bash shell environment.  

**Important** - Two environment variables defined in the script 'UVIS_LOCAL_ENV' need to 
changed for each different development environment. 
See the comments in the 'UVIS_LOCAL_ENV' script.

|
|
|


Terminal Session Setup (Every Terminal Session)
+++++++++++++++++++++++++++++++++++++++++++++++

At the command prompt execute the following:

|

|action| $workenv UVIS

|

This has the following actions:


1.    Creates a child shell with the environment variables for UVIS. These are defined in the 'UVIS' script. 
      **Important** - some of these environment variables may need to changed for each different
      development environment. See the comments in the script.

2.    Changes the working directory to the UVIS root directory.

3.    Changes the shell prompt to indicate that the user is in the UVIS development environment.
      The prompt is: '(UVIS) $' to indicate a child shell with the UVIS environment.


Once you have finished developing in the UVIS environment; simply execute '(UVIS) $exit' to return to the
original (parent) shell. 

|action| (UVIS) $exit

|
|

The Scripts
+++++++++++

1.    **localDrupal** - Start the Bitnami Drupal stack. Apache listens on port:8080 and MySql is active on port:3306. 

      |action| (UVIS) $localDrupal

|

2.    **stopDrupal** - Stop and unload the Drupal stack (Apache and MySql).

      |action| (UVIS) $stopDrupal

|

3.    **localbulkloader** - This script uploads the drug database data in spreadsheet '.csv' format to the **local** GAE
      datastore.

      |action| (UVIS) $localbulkloader

|

4.    **remotebulkloader** - This script uploads the drug database data in spreadsheet '.csv' format to the **remote** GAE
      datastore.

      |action| (UVIS) $remotebulkloader

|

5.   **localSphinxGAE** - Run a local copy of the Sphinx documentation on the local GAE server. This
     documentation can be viewed in a web browser at 'http://localhost:8070' (see script 'UVIS')

     |action| (UVIS) $localsphinxGAE 

|

6.   **localUSdrugGAE** - Run a local copy of the US drug database on the local GAE server. This
     can be viewed in a web browser at 'http://localhost:9080' (see script 'UVIS') 

     |action| (UVIS) $localUSdrugGAE

|

7.   **localPharmCatGAE** - Run a local copy of the PharmCat web application on the local GAE server. This
     can be viewed in a web browser at 'http://localhost:9090' (see script 'UVIS')

     |action| (UVIS) $localPharmCatGAE

|

8.   **localAuthenticateGAE** - Run a local copy of the Authentication server on the local GAE server. This
     can be viewed in a web browser at 'http://localhost:9070' (see script 'UVIS')

     |action| (UVIS) $localAuthenticateGAE

|

9.   **processrawNDCfiles** - Process the raw tab delimted NDC files (package.txt and product.txt) downloaded
     from the NDC website. These are processed into a .csv file that can be uploaded into the GAE Datastore using
     the bulkloader tool (see **bulkloader**).

     |action| (UVIS) $processrawNDCfiles

|

10.  **harvestRxImages** Harvests the RxImage API from the National Library of Medicine.
     If the intermediate download file "ImageCheckpoint.csv" is present. The harvest program
     only gets NDCs that are in "NDCDatabase.csv" but not in "ImageCheckpoint.csv".
     If no "ImageCheckpoint.csv" is present than the download starts at the first record (NDC code)
     in "NDCDatabase.csv".

     |action| (UVIS) $harvestRxImages

|

11.  **reldir** - Not executed directly. Not important - changes the UVIS environment shell prompt.
     Should be replaced with a prompt script based on sed.

|

12.  **sphinxmake** - Generate a new version of the Sphinx html documentation from the '.rst' source files.

     |action| (UVIS) $sphinxmake html     

|

13.  **uploadSphinxGAE** - Upload the current local version of the Sphinx documentation to the remote GAE server.
     This documentation can be viewed on a web browser at 'http://kellerberrin-doc.appspot.com'.

     |action| (UVIS) $uploadsphinxGAE

|

14.  **rollbackSphinxGAE** - rollback any failed upgrade of the Sphinx documentation to the remote GAE server.
     Typically this must be done if there is a network failure during an upgrade.
     This documentation can be viewed on a web browser at 'http://kellerberrin-doc.appspot.com'.

     |action| (UVIS) $rollbacksphinxGAE

|

15.  **uploadUSdrugGAE** - Upload the current local version of the US drug database to the remote GAE server.
     This application can be viewed on a web browser at 'http://kellerberrin-drugdatabase.appspot.com'.

     |action| (UVIS) $uploadUSdrugGAE

|

16.  **rollbackUSdrugGAE** - rollback any failed upgrade of the US drug Database documentation to the remote GAE server.
     Typically this must be done if there is a network failure during an upgrade.
     This documentation can be viewed on a web browser at 'http://kellerberrin-database.appspot.com'.

     |action| (UVIS) $rollbackUSdrugGAE

|

17.  **uploadPharmCatGAE** - Upload the current local version of the PharmCat web application to the remote GAE server.
     This application can be viewed on a web browser at 'http://kellerberrin-pharmcat.appspot.com' and is aliased to
     'PharmCat.com'.

     |action| (UVIS) $uploadPharmCatGAE

|

18.  **rollbackPharmCatGAE** - rollback any failed upgrade of the PharmCat Web Application to the remote GAE server.
     Typically this must be done if there is a network failure during an upgrade.
     This documentation can be viewed on a web browser at 'http://kellerberrin-pharmcat.appspot.com'.

     |action| (UVIS) $rollbackPharmCatGAE

|

19.  **uploadAuthenticateGAE** - Upload the current local version of the UVIS Authentication server to the remote GAE server.
     This application can be viewed on a web browser at 'http://kellerberrin-authenticate.appspot.com'.

     |action| (UVIS) $uploadAuthenticateGAE

|

20.  **rollbackAuthenticateGAE** - rollback any failed upgrade of the Authenticate Server to the remote GAE server.
     Typically this must be done if there is a network failure during an upgrade.
     This documentation can be viewed on a web browser at 'http://kellerberrin-authenticate.appspot.com'.

     |action| (UVIS) $rollbackAuthenticateGAE

|

21.  **UVIS** - Not executed directly. Defines all the environment variables needed by the UVIS development environment.
     The following 3 sub-scripts are executed in order. Do not modify this script for different development environments 
     (nodify UVIS_LOCAL_ENV below).

     1. Executes the **UVIS_LOCAL_ENV** script to set the local directory structure.

     2. Executes the **UVIS_US_DRUG** script to set the US drug application environment variables.

     3. Executes the **UVIS_SPHINX** script to set the Sphinx environment variables.
     
     4. Executes the **UVIS_PHARMCAT** script to set the PharmCat environment variables.

|

22.  **UVIS_SPHINX** - Not executed directly. Defines all the environment variables needed by the Sphinx development environment.
     This script is run from the **UVIS** script above. Modify this script to modify the Sphinx environment.


|

23.  **UVIS_USDRUG** - Not executed directly. Defines all the environment variables needed by the US drug database environment.
     This script is run from the **UVIS** script above. Modify this script to modify the US drug database environment.

|

24.  **UVIS_PHARMCAT** - Not executed directly. Defines all the environment variables needed by the PharmCat web application.
     This script is run from the **UVIS** script above. Modify this script to modify the PharmCat web application.

|

25.  **UVIS_AUTHENTICATE** - Not executed directly. Defines all the environment variables needed by the Authenticate server APIs.
     This script is run from the **UVIS** script above. Modify this script to modify the Authenticate server application.

|

26.  **UVIS_LOCAL_ENV** - Not executed directly. Defines all the **local** computer environment (directories) needed by the UVIS
     development environment. This script is run from the **UVIS** script above.
     **Important** - this file must be changed for different development computers (two lines only). See the comments in the script.

|

27.  **UVIS_TURING_ENV**, **UVIS_JACOD_ENV**, etc - Not executed directly. One of these scripts is run from **UVIS_LOCAL_ENV** above.
     Defines the environment variables (directories) needed by the UVIS development environment for a particular computer. 
     For example; UVIS_TURING_ENV defines the UVIS environment for the Turing (desktop) environment (approx 4-6 directories). 
     The UVIS_LOCAL_ENV script selects which of these environments is in current use. See the comments in the script. 

|

28.  **workenv** - Setup the UVIS development environment. Must be run in each terminal session '$workenv UVIS'.
     Creates a child shell, defines the UVIS environment variables and changes the prompt. Exit by executing '$exit' and
     returning to the original (parent) shell. 

     |action| $workenv UVIS

