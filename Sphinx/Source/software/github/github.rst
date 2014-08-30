.. _github:

.. |action| image:: emphasize.png
    :width: 20pt
    :height: 20pt
   

.. image:: octocat.png
    :width: 64px
    :align: left
    :height: 64px

The UVIS Github Repository
==========================


The UVIS Github repository is at top level (root directory) of the UVIS
software structure.

Go to the root directory by executing the UVIS work environment:  

|

|action| $workenv UVIS

|

The prompt '(UVIS) $' should appear.

Alternatively, if you are already in thje UVIS work environment then simply change directory:

|

|action| $cd $UVISDIR

|



Linux Shell Github Commands
+++++++++++++++++++++++++++

Setup Git
---------

*     Set up a global user name.

      |action| $git config --global user.name "kellerberrin"

|

*    Set up a global email (must be the same as the email registered on Github)

     |action| $git config --global user.email "james.duncan.mcculloch@gmail.com"

|

Create a Repository and Add Files.
----------------------------------

*    Make sure we are in the UVIS root directory.

|action| $cd $UVISDIR

|

*    Create the respository.

     |action| $git init

|

*    Add all subdirectories and files to the repository. 

     |action| $git add .

|

*    Commit all the new files.

     |action| $git commit -m "The Initial UVIS Commit"

|

Create a Remote Repository on Github
------------------------------------

*    Register the Github respository.

|action| $git remote add origin https://github.com/kellerberrin/UVIS.git

|

*    Verify the remote repository.

|action| $git remote -v

|


Push the Local Repository onto Github
-------------------------------------


*   Push the local repository onto Github.

|action| $git push origin master

|

Update the Local and (Optional!) Remote Repository on Github
------------------------------------------------------------

*    Make sure we are in the UVIS root directory.

    |action| $cd $UVISDIR

|

*    Add all the updated files and directories to the local repository. 

     |action| $git add .

|

*    Commit all the updated files and directories to the local repository.

     |action| $git commit -m "Some Suitable Update Comment"

|

*   (Optional!) Push the local repository onto the remote (public!) Github.

    |action| $git push origin master

|



