app.factory('Image', ['$http', function($http) {

  var uploadImages = function(imageFiles) {
    var formData = new FormData();
    var formDataEmpty = true;
    for (var i=0; i<imageFiles.length; i++) {
      var file = imageFiles[i];
      if (file && file.type.match("image")) {
        formData.append('image', file);
        formDataEmpty = false;
      } else {
        console.log('ignored non-image blob or file', file);
      }
    }
    if (!formDataEmpty) {
      return $http.post('/images', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }); 
    }
  };

  return {
    width: '300',
    uploadImages: uploadImages
  };

}]);
