angularjs-blog
==============

AngularJS Blog

Principle
---------

  * Server-side / Client-side Seperation;

      * Browser does not ask redirection to the server with posting data;
          * create, update, delete requests are only posted using AJAX call.
          * when received response, browser decide what to do; forward or error it.
      * Server does not set client side properties; i.e. cookies, headers
          * client make request to server using API
          * when received response, browser decide to set it or not

  * Search-Engine Friendliness
      * Server-side AngularJS templating
      * Server-side Layout support

Server-side
-----------

  * MongoDB
  * Express
  * AngularJS Template Rendering, i.e. {{::variable}}
  * NodeJS
  * JWT, JSON Web Token, for auth. check
  * Ruby-On-Rails like application dispatch using controller and action
  * MVC pattern
  * Server-side AngularJS templating; `ng-if`, `ng-include`, and `ng-repeat`
  * Layout support

Client-side
-----------

  * Search engine friendly without using single page app
  * Multi-page applicatoin
  * It does not use ngRoute nor uiRoute
  * Role-based client-side auth. 
  * JWT token encrypted into sessionStorage
  * Custom directives, [`ngd`](https://github.com/allenhwkim/angularjs-directives)

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
