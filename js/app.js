(function () {
  'use strict';

  var coverContainer;

  /**
   * Listener for onReady event. Creates ImageFullscreenController
   */
  var onReady = function () {
    new ImageFullscreen({
      selector: '.post-content img'
    });

    coverContainer = document.querySelector('.cover-container');

    if (coverContainer) {
        new Paginator();
    }

    onResize();
  };

  /**
   * Listener for onResize event.
   * If there is a cover container - and it is smaller than innerHeight - make
   * it's height to match 100%
   */
  var onResize = function () {
    if (coverContainer && coverContainer.style.backgroundImage) {
      var containerIsSmall = parseInt(coverContainer.getBoundingClientRect().height, 10) <= window.innerHeight;
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
