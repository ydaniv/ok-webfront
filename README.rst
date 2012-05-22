Open Knesset Templates
======================

This repository holds the code for `Open Knesset`_ wed based frontend.
You are invited to fork the code, improve the design and send a pull request

.. _Open Knesset: http://oknesset.org

Quick Start
-----------


Fork the repo: ``ok-templates.git`` by using the *Fork* button on github.
The only external dependecy is node.js so first get it for your platform
from the `download page`_ and then::

    $ git clone git@github.com:yourusername/ok-templates.git
    $ cd ok-webfront
    $ npm install -d
    $ node app.js

and point your browser at http://localhost:3000.


.. _download page: http://nodejs.org/#download

Contributing
------------

Design
~~~~~~

the templates themselves are located at the ``views`` folder and written in 
Mustache_ logicless templating language.  The templates have a ``.html``
file suffix.

.. _Mustache: http://mustache.github.com

Once stasified with your changes, commit your changes to your fork with a
meaningful commit message and send a pull request to `hasadna's fork`_

.. _Mustache: http://mustache.github.com
.. _gettext: http://www.gnu.org/software/gettext/
.. _hasadna's fork: https://github.com/hasadna/ok-templates
.. _poedit: http://www.poedit.net/

Improving Open Knesset Integration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you can run a local `Open Knesset`_ development server, you can run the
webfront so it will access the local server just type::

  $ NODE_ENV=local node app.js

Running in `local` configuration, the webfront server will access port 8000
on the locahost instead of our deve server at http://api.dev.oknesset.org.
