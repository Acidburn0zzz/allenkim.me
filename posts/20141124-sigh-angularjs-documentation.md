---
title: Sigh, AngularJS Documentation
---

I was having hard time to document my [angularJS directive](https://github.com/allenhwkim/angularjs-google-maps). The following is 
the list of documentation tools I have tried and built<!--more-->
 

1. [docular](https://github.com/gitsome/docular)
----------------------------------------------------------
**Pretty but not simple**

We can follow [this guide](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation), then run this docular to generate documentation

<img src=http://i.imgur.com/MdiWXd2.png border=2 width=\"50%\" />

Pros:

* It generates the exactly the same style of AngularJS documentation 
  from your code
* It follows the same tagging that AngularJS Code
*  Clone of AngularJS Documentation Engine

Cons: 

* Need to start a server to see the documentation
* Dependent on grunt and grunt-docular
* Requires grunt-docular configuration
* So many custom tags to learn
* and more configuration, tl;dr

2. [JSDoc](http://usejsdoc.org/)
-------------------------------------
Simple but not pretty

<img src=http://i.imgur.com/pBWCd2P.png border=2 width=\"50%\" />

Pros:  

* No server is required to see the documentation
* Command line available

Cons:  

* group by classes, modules, etc, but not group by controllers, 
  directives, filters, etc
* No fancy output. i.e. http://gitgrimbo.github.io/jsdoc3-examples/jsdoc/

3. [dgeni](https://github.com/angular/dgeni)
-----------------------------------------------------
Dgeni is a documentation generator developed by the Angular team.

<img src=http://i.imgur.com/KSiJrHy.png border=2 width=\"50%\" />

pros:  

* angularjs family use this; angularjs, protractor, and ionic

cons :   

* complex; no guide, no tutorial, nor documentation
* so many steps; 14 steps of document generation(pros?)

4. [Allen's Conclusion](https://github.com/allenhwkim/angular-jsdoc)
---------------------------------------------------------------------
Why can't we just have simple documentation generator like javaDoc?
JSDoc works like a javaDoc,but it's not customized for AngularJS.
Then, if I customize JSDoc for AngularJS using plugin and template....?

Ok, let me make that template and plugin for AngularJS, 

.... A week later, 

Tada ~~
<a href=\"https://github.com/allenhwkim/angular-jsdoc\">
<img src=http://i.imgur.com/FPo9x25.gif width=\"50%\" />
</a>

Pros:  

* It's just JSDoc template designed for AngularJS
* Taking advantage of all JSDoc Simplicity
* group by @ngdoc tag values; controller, directive, service, or any

Cons:  

* Still not pretty design
* Maybe more that I don't think of at the moment

I wish this helps someone who wants to do document AngularJS code.

Allen
