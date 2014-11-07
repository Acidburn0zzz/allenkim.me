/* global GeoPattern */
app.directive('geoPattern', [function() {
  return {
    link: function(scope, element, attrs) {
      var pattern = GeoPattern.generate(element.html());
      element.css('background-image', pattern.toDataUrl());
    }
  };
}]);
