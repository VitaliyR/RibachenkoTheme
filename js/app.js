(function () {
  'use strict';

  /**
   * Listener for onReady event. Creates ImageFullscreenController
   */
  var onReady = function () {
    new ImageFullscreen({
      selector: '.post-content img'
    });

    onResize();
  };

  /**
   * Listener for onResize event.
   */
  var onResize = function () {
    var coverContainer = document.querySelector('.cover-container');
    
    if (coverContainer && coverContainer.style.backgroundImage) {
      var containerIsSmall = coverContainer.getBoundingClientRect().height <= window.innerHeight;
      document.body.style.height = containerIsSmall ? '100%' : 'auto';
    }
  };



  /**
   * Attach events
   */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  window.addEventListener('resize', onResize);

})();
