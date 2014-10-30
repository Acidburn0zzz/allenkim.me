LEAN
====

It's not MEAN, it's LEAN

Light-Express-Angular-Node

MongoDB dependency has been removed, but that does not mean you can't use MongoDB. 

It's originally developed using MongoDB, but later changed not to be dependent on that. To use MongoDB, you simply use different file in models directory, I.e., models/articles-mongo.js instead of "models/article.js"

In default, it uses a single file named "db/articles.json" for its data storage. It's not a data base but a file which is a good fit for a single user and  especially blog data.

The main point of LEAN stack is to provide easy and light angular, express, and node development to starters.


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

  * Express
  * Node
  * JWT, JSON Web Token, for auth. check
  * Ruby-On-Rails like application dispatch with controller and action
  * MVC pattern
  * Server-side AngularJS templating; `ng-if`, `ng-include`, and `ng-repeat`
  * Layout support

Client-side
-----------

  * Search engine friendliness avoiding SPA, single page app
  * It does not use ngRoute nor uiRoute
  * Role-based client-side auth. 
  * Custom directives, [`ngd`](https://github.com/allenhwkim/angularjs-directives)

Setup
---------------

1. Run the server

  *. `$ git clone https://github.com/allenhwkim/lean.git`
  *. `$ cd lean && npm install`
  *. `$ scripts/server`

2. Access url, http://localhost:3000
