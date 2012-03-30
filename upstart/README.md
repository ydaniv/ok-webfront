# Installing OK-Webfront on Ubuntu using Upstart

To install on production server using Upstart follow these steps:

* Copy the *.conf files from this directory to /etc/init
* Edit ok-webfront-web-3000.conf and set the following:
  * **APP_DIR** - should point to absolute path to installation of ok-webfront.
  * **RUN\_AS** - should be the local user under which the server is run (eg. deploy).
  * **PORT** - should be set to the HTTP port the app is listening to.

## Adding more backend servers

Suppose we want to increase the concurrency of ok-webfront. We can do that by adding another backend server.
If our first server is listening on port 300, we can add another, that listens on port 3001 by following these steps:

* Copy ok-webfront-web-3000.conf to ok-webfront-web-3001.conf
* Edit ok-webfront-web-3001.conf and change **PORT** from 3000 to 3001
* Run _sudo restart ok-webfront_