Open Knesset Templates
======================

This repository holds the code for `Open Knesset`_ templates, sample data and 
code to run as development server.  You are invited to fork the code, improve
the design and send a pull request

.. _Open Knesset: http://oknesset.org

Quick Start
-----------


Fork the repo: ``ok-templates.git`` by using the *Fork* button on github.
The only external dependecy is node.js so first get it for your platform
from the `download page`_ and then::

    $ git clone git@github.com:yourusername/ok-templates.git
    $ npm install -d
    $ cd ok-webfront
    $ node app.js

and point your broser at http://localhost:3000/bill/3133 to see the template
from ``views/bill/show.html`` rendered using context from
``fixtures/bill/3133.json``.


.. _download page: http://nodejs.org/#download

Contributing
------------

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
