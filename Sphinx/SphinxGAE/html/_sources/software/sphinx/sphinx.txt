.. _sphinxdoc:


.. |action| image:: emphasize.png
    :width: 20pt
    :height: 20pt
    


.. image:: sphinx.jpg
    :width: 64px
    :align: left
    :height: 64px
    :target: http://sphinx-doc.org/
    
Documenting With Sphinx
=======================    
    

There are two logical documentation projects.


.. image:: tree_wheat.jpg
    :width: 300px
    :height: 160px
    :align: left

**UVIS Documentation**. This is public, non-technical documentation of the UVI System. 
It is accessed using the URL: `<http://kellerberrin-doc.appspot.com>`_. 
This documentation features an image of a tree in a wheat field on its web page. 

|
|
|
 
.. image:: keller_post_office.jpg
    :width: 250px
    :height: 180px
    :align: left

 
**Software Documentation**. This is the proprietary, software documentation of the UVI System. 
It is strictly access controlled and is accessed using the URL: 
`<https://kellerberrin-doc.appspot.com/html/software/software.html>`_.  
This documentation features an image of the Kellerberrin post office on its web page. 

|
|
|


The two documentation environments share the same source directories. 
The software directory is protected by the requirement to be logged in as 
'admin' (currently only james.duncan.mcculloch@gmail.com) in *app.yaml*. 
    
    
.. note:: This section refers to setup and use in a *Windows* environment only. 

However, it should be relative easy to infer setup instructions for use in other environments such as Mac and Linux. 

.. note:: Python 2.7 must be installed and defined in the Windows %Path% environment variable. 

More information on installing Python is available here: `<https://www.python.org/>`_.

Setting Up Sphinx
-----------------

Sphinx Software
***************

.. note:: The (virtual environment) Sphinx directory is *C:\\Sphinx\\SphinxVirtual*.

Sphinx uses several 3rd party Python text libraries (DocUtils). Therefore it is generally a good idea (but not necessary) 
to run Sphinx in a virtual Python environment. See `<http://www.westga.edu/~drocco/sphinx/>`_ for further details.

It is assumed that Sphinx is set up in a Python virtual environment in directory *C:\\Sphinx\\SphinxVirtual*. 
This directory contains the subdirectories *Lib* and *Scripts* containing the Python code that implements Sphinx. 

.. warning:: Do not create a Sphinx project after installing Sphinx. 

|action| Download from the Sphinx project website `<http://sphinx-doc.org/>`_.

|action| Create a permanent global (or user) environment variable %SPHINX_BIN% that points to the Sphinx install directory *C:\\Sphinx\\SphinxVirtual*. 

The Windows environment variable can be set by selecting *Advanced system settings* from the 
System page of the Control Panel. If Sphinx is installed to another directory then %SPHINX_BIN% should point 
to the directory that contains the subdirectories *Lib* and *Scripts*. 


Top Level Directories
**********************

UVIS Documentation (Public)
++++++++++++++++++++++++++++

.. note:: The UVIS Documentation top-level directory is *<UserPath>\\UVIS\\Sphinx\\UVIS*.


This directory contains the batch files used to compile the documentation.
The *make.bat* file is has the filename *<UserPath>\\Sphinx\\make.bat*.
This has been modified from the original Sphinx distribution file to use the %SPHINX_BIN% environment variable to locate 
the Sphinx Python run-times (*C:\\Sphinx\\SphinxVirtual*). 
It has also been modified to directly place compiled HTML files in the Sphinx Google Engine directory 
*<UserPath>\\UVIS\\Sphinx\\SphinxGAE\\html*.


Software Documentation (Restricted)
+++++++++++++++++++++++++++++++++++

.. note:: The Software Documentation top-level directory is *<UserPath>\\Sphinx\\Software*.

The batch files are identical to UVIS Documentation (above).



Using Sphinx
------------

.. note:: The UVIS Documentation source code directory root is *<UserPath>\\Sphinx\\UVIS\\source*.

.. note:: The Software source code directory root is *<UserPath>\\Sphinx\\Software\\source*.

Using Sphinx is identical for both projects, the example code assumes we are compiling UVIS Documentation.

If sphinx is installed in a virtual python environment then initialize this environment (skip if a non-virtual install). 

|action| Initialize the Sphinx virtual environment by executing (once only) the batch 
file *<UserPath>\\UVIS\\Sphinx\\initSphinx.bat* 

The command window line prompt should now change to::

(SphinxVirtual) <UserPath>\UVIS\Sphinx

|action| Compile the Sphinx Restructured Text (reST) sources by executing the batch file 
*<UserPath>\\UVIS\\Sphinx\\make.bat* with the argument *html*:: 

(SphinxVirtual) <UserPath>\UVIS\Sphinx\make html

This can be executed repeatedly as part of the the edit/debug cycle and places the compiles HTML code 
and image files, etc  in the Sphinx Google Engine directory *<UserPath>\\UVIS\\Sphinx\\SphinxGAE\\hmtl*.

These are then ready for viewing in a web browser using the local Google App Engine Launcher or deploying to 
the Cloud Google App Engine to be globally served as HTML pages.  


.. image:: GAEsmall.jpg
    :width: 62px
    :align: left
    :height: 55px
    :target: https://developers.google.com/appengine/downloads/
    
Linking to Google App Engine
----------------------------  

Information on installing and using the local Google App Engine Launcher is available 
here: `<https://developers.google.com/appengine/downloads>`_. Typically, it installs as part of the Google App Engine API 
download.

When the documentation source is compiled (see using Sphinx above) it is automatically placed in the relevant 
*SphinxGAE* directory tree. The documenter only needs to refresh the browser to see the latest version. 
However, first the *SphinxGAE* directory must be linked to the local Google App Engine Launcher.   
The documentation application is configured as a local Google App by specifying the *SphinxGAE* directory in the 
"Add Existing Application" item of the "File" menu of the GAE Launcher.

The Sphinx documentation can then be readily deployed to the Cloud from the GAE Launcher. 

The Google App Engine directory contains two small files that defines Sphinx HTML output as a GAE application.

*   *app.yaml*
*   *gae_sphinx.py*

See the GAE documentation for further information: `<https://developers.google.com/appengine/docs/python/config/appconfig>`_.


UVIS Documentation (Public)
***************************

.. note:: The UVIS Documentation Google App Engine directory root (*SphinxGAE*) is *<UserPath>\\UVIS\\Sphinx\\SphinxGAE*.


The file *app.yaml* has the first line::

    application: kellerberrin-doc

Which must be changed to::

    application: <new application name>

If the UVIS documentation application name is changed to <new application name>.

This name maps onto a GAE application ID of the same name when the documentation application is deployed. 

Software Documentation (Restricted)
***********************************

.. note:: The Software Documentation source directory root (*SphinxGAE*) is *<UserPath>\\UVIS\\Sphinx\\source\\software*.


The file *app.yaml* has the url handler::

  url: /html/software
  static_dir: html/software
  login: admin
  secure: always  
  auth_fail_action: unauthorized

  
This ensures that:

1.  All server response is returned using the secure *https* protocol 
    (the initial request can use the *http* protocol).
    
2. Restrict access to requesters whose Google ID has been granted **admin** (owner) privileges.
    The 'auth_fail_action' can be set to 'unauthorized' which issues an error message to users
    not logged in with an an admin account or 'redirect' which prompts the user to login to an
    an admin account.
