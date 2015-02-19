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


Configure local Drupal Installations
------------------------------------

Unfortunately, the configration and content of a Drupal 7 website seems to be spread throughout the entire Drupal software install. The situation is better with Drupal 8, where content and configuration have been separated. However, Drupal 8 has not yet reached release candidate status (Feb 2015).

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
    
    ln -s ../sites-available/drupal_exercise.com drupal_exercise.com
    
|

A minimal virtual sites file content for "drupal_exercise.conf" is:

::

    <VirtualHost *:80>
        ServerName drupal_exercise.com
        ServerAlias www.drupal_exercise.com
        DocumentRoot /var/www/html/drual_exercise.com
    </VirtualHost>  


|
|

Using this "drupal_exercise.conf" file the Drual install will be in DocumentRoot (/var/www/html/drual_exercise.com). Note that default apache2 document roots are defined in /etc/apache2/apache2.conf.

|

Using the above setup precedure we can setup as many Drupal installs as required, where required.

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

Is hosted by Godaddy (IP 192.186.252.37 - unknown if this is a static IP address?). The hosting expires on 15/2/17. 
Currently has PharmRox.com (or PharmCow.com - not yet determined) pointing to the IP address.

Final setup not really completed - this section is provisional.


Remote Users and Passwords:
+++++++++++++++++++++++++++

Host unix account and Cpanel
----------------------------

The user account is: kellerberrin. 
password: <usual non bank password except the first letter is a capital letter
and the final number is 54>

The best way to reach the site is by cPanel through the GoDaddy website **ssh kellerberrin@pharmrox.com** (or, depending on setup, **ssh kellerberrin@pharmcow.com**).


Remote Drupal User1 (SuperUser)
-------------------------------

User: admin
|
Password: <usual password> d***1



