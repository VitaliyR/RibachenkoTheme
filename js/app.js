(function () {
  'use strict';

  /**
   * Listener for onReady event. Creates ImageFullscreenController
   */
  var onReady = function () {
    new ImageFullscreen({
      selector: '.post-content img'
    });
  };


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

})();
