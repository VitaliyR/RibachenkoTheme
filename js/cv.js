document.addEventListener('DOMContentLoaded', function() {
  var objects = document.getElementsByTagName('object');

  Array.prototype.forEach.call(objects, function(object) {
    object.addEventListener('load', function() {
      var svg = object.contentDocument.querySelector('svg');
      object.parentElement.replaceChild(svg, object);
    });
  });
});
