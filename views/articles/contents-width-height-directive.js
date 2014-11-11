app.directive('contentsWidthHeight', [function() {
  return {
    link: function(scope, element, attrs) {
      var len = parseInt(attrs.contentsWidthHeight);
      var width = (Math.min(len, 100) / 10) * 5;
      width = Math.max(width, 20);

      var height = Math.floor(Math.min(len/100, 3));
      height = (height || 1) * 50;
      var css = {minWidth: width+"%", minHeight: height+"px"};
      console.log('css', css);
      element.css(css);
    }
  };
}]);
