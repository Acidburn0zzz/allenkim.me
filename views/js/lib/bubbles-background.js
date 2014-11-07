var BubblesBackground = function(canvasEl, options) {
  if (typeof canvasEl == "string") {
    canvasEl = document.querySelector(canvasEl);
  }
  options = options || {};
  var interval = options.interval || 1000;
  var minRadius = options.minRadius || 5;
  var maxRadius = options.maxRadius || 100;
  var minVel = options.minVel || -2;
  var maxVel = options.maxVel || 2;
  var numCircles = options.numCircles || 30;
  var circleColor = options.circleColor || '#B3E1E5';
  var circles = [];

  var random = function(max, min){
    if (min !== undefined) {
      return Math.floor(Math.random()*(max-min)) + min;
    } else {
      return Math.floor(Math.random()*(max));
    }
  };

  var Circle = function() {
    var circle = {
      x: random(window.innerWidth),
      y: random(window.innerHeight),
      radius: random(maxRadius, minRadius),
      xVel: random(minVel, maxVel),
      yVel: random(minVel, maxVel)
    };
    (circle.xVel === 0 && circle.yVel === 0) && (circle.yVel = 1);
    return circle;
  };

  var drawCircles = function(){
    var ctx = canvasEl.getContext('2d');
    ctx.clearRect(0,0, canvasEl.width, canvasEl.height);
    
    for(var i=0; i<numCircles; i++){
      var maxX = window.innerWidth, maxY = window.innerHeight;

      var circle = circles[i] || new Circle();
      circle.x = circle.x + circle.xVel; // move to x
      circle.y = circle.y + circle.yVel; // move to y
      
      if ( circle.x + circle.radius < 0 ||
        circle.y + circle.radius < 0 || 
        circle.x - circle.radius > maxX ||
        circle.y - circle.radius > maxY ) {
        circle = new Circle();
      }

      ctx.beginPath();
      ctx.fillStyle = circleColor;
      ctx.globalAlpha = 0.4;
      
      ctx.arc(
        circle.x, circle.y,
        circle.radius, 0, Math.PI*2, false );
      ctx.fill();
      ctx.closePath();

      circles[i] = circle;
    }
  }

  if (!canvasEl) {
    throw "Invalid element" + canvasEl; 
  } else {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    window.addEventListener('resize', function() {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
      circles=[]; // redraw all circles
      drawCircles();
    });
  }
  
  drawCircles();
  setInterval(drawCircles, interval);
};
