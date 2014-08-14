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

**Important** - some environment variables defined in the script 'UVIS' may 
need to changed for each different development environment. 
See the comments in the 'UVIS' script.

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

1.    **bulkloader** - This script uploads the drug database data in spreadsheet '.csv' format to either the local GAE
      datastore or the remote GAE datastore. Change the appropriate environment variable to change between 'local' 
      or 'remote'. See the comment in the script 'UVIS'.

      |action| (UVIS) $bulkloader

|

2.   **localsphinxGAE** - Run a local copy of the Sphinx documentation on the local GAE server. This
     documentation can be viewed in a web browser at 'http://localhost:8080' (see script 'UVIS')

     |action| (UVIS) $localsphinxGAE 

|

3.   **localUSdrugGAE** - Run a local copy of the US drug database on the local GAE server. This
     can be viewed in a web browser at 'http://localhost:9080' (see script 'UVIS') 

     |action| (UVIS) $localUSdrugGAE

|

4.   **reldir** - Not important - changes the UVIS environment shell prompt. Not executed directly.
     Should be replaced with a prompt script based on sed.

|

5.   **sphinxmake** - Generate a new version of the Sphinx html documentation from the '.rst' source files.

     |action| (UVIS) $sphinxmake html     

|

6.   **uploadsphinxGAE** - Upload the current local version of the Sphinx documentation to the remote GAE server.
     This documentation can be viewed on a web browser at 'http://kellerberrin-doc.appspot.com'.

     |action| (UVIS) $uploadsphinxGAE 

|

7.   **uploadUSdrugGAE** - Upload the current local version of the US drug database to the remote GAE server.
     This application can be viewed on a web browser at 'http://kellerberrin-drugdatabase.appspot.com'.

     |action| (UVIS) $uploadUSdrugGAE 

|

8.   **UVIS** - Defines all the environment variables needed by the UVIS development environment.
     **Important** - some of these environment variables may need to changed for each different
     development environment. See the comments in the script.

|

9.   **workenv** - Setup the UVIS development environment. Must be run in each terminal session '$workenv UVIS'.
     Creates a child shell, defines the UVIS environment variables and changes the prompt. Exit by executing '$exit' and
     returning to the original (parent) shell. 

     |action| $workenv UVIS

