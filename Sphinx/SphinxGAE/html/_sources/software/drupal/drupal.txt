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


Users and Passwords:
++++++++++++++++++++

User 1
------

User: kellerberrin
|
Password: <usual password> d***1

Phpadmin
--------

User: root
|
Password: <usual password> d***1


Drupal Control Scripts:
+++++++++++++++++++++++


1.    **localDrupal** - Start the Bitnami Drupal stack. Apache listens on port:8080 and MySql is active on port:3306. 

      |action| (UVIS) $localDrupal

|

2.    **stopDrupal** - Stop and unload the Drupal stack (Apache and MySql).

      |action| (UVIS) $stopDrupal



