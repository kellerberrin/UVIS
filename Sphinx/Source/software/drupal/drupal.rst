.. _drupaldoc:

.. |action| image:: emphasize.png
    :width: 20pt
    :height: 20pt

.. image:: drupal.jpg
    :width: 136px
    :align: left
    :height: 143px

|
|
|
|
|
|
|

Local Installation:
+++++++++++++++++++

Install a **LAMP** stack (Apache2 and Mysql) using the appropriate software downloads.

Note that "ServerName localhost" was added to /etc/apache2/apach2.conf to suppress a warning and ensure that the apache web listens to **localhost:80**.

|

Install **phpmyAdmin** this will use the same password as the mySQL root password defined blow.

|

(optional) Install drush - a Drupal download and configuration utility.  

|

**Important** Configure the apache server correcty by enabling the rewrite module.

    
::
    
    sudo a2enmod rewrite

And enabling **AllowOverride All** on any virtualhost records in **/etc/apache2/sites-available**

::

	<VirtualHost *:80>
    	. . .
    	ServerName  example.com
    	ServerAdmin webmaster@example.com
    	DocumentRoot /var/www/html
    	. . .
    	<Directory /var/www/html>
	    	. . .
        	AllowOverride All
    	</Directory>
    	. . .
	</VirtualHost>

|
|

Configure local Drupal Installations
------------------------------------

Unfortunately, the configuration and content of a Drupal 7 website seems to be spread throughout the entire Drupal software install. The situation is better with Drupal 8, where content and configuration have been separated. However, Drupal 8 has not yet reached release candidate status (Feb 2015).

|
  
This means that moving a Drupal site to production means zipping up the entire install (plus the Drupal MySQL database) and moving this install to production.

|

A by-product of this is that development Drupal installs should be kept in individual separate directories within the git software development tree.

|

1.  This is accomplished by aliasing localhost with a virtual web address in /etc/hosts.
    For example, the following line was added to /etc/hosts   "127.0.0.1  drupal_exercise.com". Thus we now have an 
    alias for localhost called "drupal_exercise.com".

|
    
2.  The next step is to add "drupal_exercise.conf" to the available virtual sites directory "/etc/apache2/sites-available". 
    Then a logical link is added to "/etc/apache/sites-enabled" that links to "drupal_exercise.conf".
    The command is:
    
::
    
    ln -s ../sites-available/drupal_exercise.conf drupal_exercise.conf
    
|

A minimal virtual sites file content for "drupal_exercise.conf" is:

::

    <VirtualHost *:80>
        ServerName drupal_exercise.com
        ServerAlias www.drupal_exercise.com
        ServerAdmin james.duncan.mcculloch@gmail.com
        DocumentRoot /var/www/html/
        DocumentRoot /var/www/html/drupal_exercise/
        <Directory /var/www/html/drupal_exercise/>
            Options -Indexes +FollowSymLinks
            AllowOverride All
	        Order allow,deny
            allow from all
        </Directory>
    </VirtualHost>


|
|

Using this "drupal_exercise.conf" file the Drual install will be in DocumentRoot (/var/www/html/drual_exercise.com). Note that default apache2 document roots are defined in /etc/apache2/apache2.conf.

|

Using the above setup precedure we can setup as many Drupal installs as required, where required.

|

Transferring a Drupal Site:
+++++++++++++++++++++++++++

1.  Step one. In order to transfer a Drupal site we need to archive (tar) all the html virtual directory files and then transfer these to the virtual host directory of the target machine. For example:

|

**Source machine**

:: 

    cd /var/www/html
    sudo tar -cvf drupal_exercise.tar drupal_exercise/

    (gzipped) sudo tar -zcvf drupal_exercise.tar drupal_exercise/


|

Where **drupal_exercise** is exchanged for the virtual host directory of interest. Then this file is transfered to the target machine and the archive file is untarred in the **parent** directory of the relevent virtual host directory. The resultant directory name created by untarring the archive file must match the virtual file name defined in the relevant **.conf** record in the **apache** "sites-available" (and linked to "site-enabled") directory. If not, then change the directory name so that they match.

**Target machine** (creates a directory "drupal_exercise" which must match the virtual host directory)

:: 

    cd /var/www/html
    sudo tar -xvf drupal_exercise.tar

    (gzipped) sudo tar -zxvf drupal_exercise.tar

|
   
2.  Step two. Transfer the source Mysql Drupal database to the Mysql Drupal database on the target machine. This is most conveniently done by using **phpmyadmin** to select the source Drupal database (for example, **drupal_exercise**) and dump to selected database to an sql dump file. Transfer this database dump file to the target machine. Use **phpmyadmin** on the target machine to drop/delete the Drupal database if it already exists, then recreate/create the database and import the sql dump file to recreate the Drupal database.

|

If the Drupal database name and user are the same on the source and target machines then we are finished and the Drupal site should fire up on the target machine. However, if database name and user name have changed then the **sites/default/settings.php** files should be changed. Here is the relevant PHP record (about line 215 in settings.php):

::  
 
    $databases = array (
    'default' => 
    array (
        'default' => 
        array (
        'database' => 'drupal_exercise',
        'username' => 'kellerberrin',
        'password' => 'd***1',
        'host' => 'localhost',
        'port' => '',
        'driver' => 'mysql',
        'prefix' => '',
        ),
    ),
    );
 

|

**Important! The settings PHP file contains the Mysql database password and should be locked down as tight as possible.**


Securing the Drupal Site after installation:
++++++++++++++++++++++++++++++++++++++++++++

Instructions assume that the Drupal virtual host directory is in "drupal_exercise". Change this to actual virtual host directory when following the instructions.

|

Obviously select a proper and difficult password for Mysql root user and Drupal user. Then establish which account is maintaining the site and what group and user is **apache** running as.

|

1.  Step One. First of all establish what group and user is apache running as (generally www-data) 

::

    sudo ps axo user,group,comm | grep apache

|

2.  Step Two. Make sure all the files have owner root (or whatever user is maintaining the web site - kellerberrin on the development machine) and group www-data so that **apache** can access the files.

|

::

    cd /var/www/html
    sudo chown -R root:www-data drupal_exercise

|

3.  Step Three. Lock down all the directories. 

|

::

    sudo find drupal_exercise -type d -exec chmod -R u=rwx,g=rx,o-rwx '{}' \;

    or

    sudo find drupal_exercise -type d -exec chmod 750 '{}' \;

|

4.  Step Four. Lock down all the files. 

|

::

    sudo find drupal_exercise -type f -exec chmod -R u=rw,g=r,o-rwx '{}' \;

    or

    sudo find drupal_exercise -type f -exec chmod -R 640 '{}' \;

|

5.  Step Five. Lock down all the sub-directories of **sites/default/files**. 

|

::

    sudo find drupal_exercise/sites/default/files -type d -exec chmod -R ug=rwx,o-rwx '{}' \;

    or

    sudo find drupal_exercise/sites/default/files -type d -exec chmod -R 770 '{}' \;
    
    
| 

6.  Step Six. Lock down all the files of **sites/default/files**. 

|

::

    sudo find drupal_exercise/sites/default/files -type f -exec chmod -R ug=rw,o-rwx '{}' \;

    or 
    
    sudo find drupal_exercise/sites/default/files -type f -exec chmod -R 660 '{}' \;
    
|

7.  Step Seven. Lock down the settings files in **sites/default/settings**. 

|

::

    sudo chmod ug=r,o-rwx drupal_exercise/sites/default/settings.php

    or 

    sudo chmod 440 drupal_exercise/sites/default/settings.php

|

Note that if Drupal needs to modify the settings file (change of database information) then **temporarily** change the permissions to

::

    sudo chmod ug=rw,o-rwx drupal_exercise/sites/default/settings.php

    or 

    sudo chmod 660 drupal_exercise/sites/default/settings.php
    
|
|
|


Local Users and Passwords:
++++++++++++++++++++++++++

Drupal users and mysql databases are setup according to the drupal install documentation.

|

Below are typical values for the drupal_exercise.com install described above




Drupal (Admin) User 1
---------------------

User: admin

Password: <usual password> d***1

Phpmyadmin and Mysql
--------------------

The mysql (phpmyadmin) user name and password are:

Drupal database: drupal_exercise

Drupal database user: kellerberrin (setup according to Drupal documentation)

Password: <usual password> d***1

MySql SuperUser: root

Password: <usual password> d***1


Local Drupal Control Scripts:
+++++++++++++++++++++++++++++


1.    **startLamp** - Start the LAMP stack. Apache listens on localhost:80 (or an appropriate alias such as drupal_exercise.com) and MySql is active on port:3306. 

      |action| (UVIS) $startLamp

|

2.    **stopLamp** - Stop and unload the LAMP stack (Apache and MySql).

      |action| (UVIS) $stopLamp


Remote Drupal Server
++++++++++++++++++++

Is hosted by Google (IP 130.211.167.94 - This is a static IP address).  
Currently has PharmRox.com pointing to the IP address.

Pharmrox.com is setup is a virtual server (see above)


Remote Users and Passwords:
+++++++++++++++++++++++++++

Host unix account 
----------------------------

The user account is: kellerberrin. 
password: <extended non bank password, the final two characters is "5x">

The best way to reach the site is by the **ssh** account.



Remote Drupal User1 (SuperUser)
-------------------------------

User: admin
|
Password: <usual password> d***1


Installing a Local Mail Server
-------------------------------

Sending mail from the local Drupal contact page failed. 

Googling produced the following solution to install a mail server on the local machine that Drupal can use to send emails.
A shared host will probably have a client mail already installed. 

::

    sudo apt-get install php-pear
    sudo pear install mail
    sudo pear install Net_SMTP
    sudo pear install Auth_SASL
    sudo pear install mail_mime
    sudo apt-get install postfix






