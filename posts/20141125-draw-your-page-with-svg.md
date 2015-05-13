---
title: Draw Your Page with SVG
---

Inspired by [svg drawing animation](http://tympanus.net/Development/SVGDrawingAnimation/), I thought we can draw any outline of any webpage by following the paths of box models, and this is [the result](https://github.com/allenhwkim/drawpage). <!--more-->

For TL;DR;

 * [demo for github](https://rawgit.com/allenhwkim/drawpage/master/demo/github.com-explore.html)
 * [demo for Facebook](https://rawgit.com/allenhwkim/drawpage/master/demo/facebook.html)
 * [demo for demo](https://rawgit.com/allenhwkim/drawpage/master/demo/demo1.html)

How to use
----------

  * To draw your page every time when page loads, append the following code at the end of your page

        <script src=\"https://rawgit.com/allenhwkim/drawpage/master/draw-page.js\"></script>
        <script>drawPage()</script>

  * Or, only to test how it looks like

    1. Go to any web page, and open a console
    2. copy paste the following code if [\"Content-Security-Policy\"](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Introducing_Content_Security_Policy) is allowed

             (function() {
                var dp = document.createElement('script'); dp.type = 'text/javascript'; dp.async = true;
                dp.src = 'https://rawgit.com/allenhwkim/drawpage/master/draw-page.js';
                document.documentElement.appendChild(dp);
              })();

    3. run `drawPage()` command


I used flatten.js by Timo, https://github.com/timo22345. I thank him for his amazing script.

Let me know if you have questions.
