app.directive('contentsWidthHeight', [function() {
  return {
    link: function(scope, element, attrs) {
      var len = parseInt(attrs.contentsWidthHeight);
      var width = Math.floor(len/50);
      width = width > 50 ? 50 :
              width < 20 ? 20 : 
              width;

      var rand = Math.floor(Math.random()*2)+1;
      var height = ((len % 3) + 1) * 50;
      var css = {width: width+"%", minHeight: height+"px"};
      element.css(css);
    }
  };
}]);
