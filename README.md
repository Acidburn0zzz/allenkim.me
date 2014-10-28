angularjs-blog
==============

AngularJS Blog

Server-side
-----------

  * NodeJS and Express for web server
  * Configurable MongoDB and Mongoose for database
  * JWT, JSON Web Token, for security check
  * Server-side templataing of `ng-if`, `ng-include`, and `ng-repeat`

Client-side
-----------

  * Not a single page app, but a muti-page web site
    * it does not use ngRoute
  * Role-based client-side auth. (https://github.com/allenhwkim/angularjs-auth)
  * encrypted jwt token in localstorage

Server Setup
------------

  * NodeJS and npm packages
    * i.e. `$ sudo yum install nodejs npm`
    * `$ npm install`

  * MongoDB
    * Only to use local database
    * Not required when you use MongoDB service, i.e. mongolab
    $ To start it locally, `$ mongod --dbpath mongodb/data/db --fork --logpath mongodb/mongodb.log`

  * Configure the application
    * `$ cp config/config.js.example config/config.js`
    * `$ vim config/config.js`

  * Run server
    * `$ scripts/server`
