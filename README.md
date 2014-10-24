angularjs-blog
==============

AngularJS Blog

Server-side
-----------

  * MongoDB
  * Express
  * AngularJS Template Rendering, i.e. {{::variable}}
  * NodeJS
  * JWT, JSON Web Token, for auth. check
  * Ruby-On-Rails like application dispatch using controller and action
  * MVC pattern
  * Decorative pattern layout generation

Client-side
-----------

  * Search engine friendly without using single page app
  * Multi-page applicatoin
  * It does not use ngRoute nor uiRoute
  * Role-based client-side auth. 
  * encrypted jwt token with sessionStorage
  * custom directives, [`ngd`](https://github.com/allenhwkim/angularjs-directives)

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
