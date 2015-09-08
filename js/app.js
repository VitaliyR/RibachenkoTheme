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
        window.scrollTo(0, 0);
    }

    onResize();
  };

  /**
   * Listener for onResize event.
   * If there is a cover container - and it is smaller than innerHeight - make
   * it's height to match 100%
   */
  var onResize = function () {
    if (coverContainer && coverContainer.style.backgroundImage) { // if we are on cover
      // check cover container height to be either 100% of body (if not too much content or auto
      document.body.style.height = 'auto';
      var containerIsSmall = parseInt(coverContainer.getBoundingClientRect().height, 10) <= window.innerHeight;
      document.body.style.height = containerIsSmall ? '100%' : 'auto';

      // check for main.content with articles - if its content fits the design column
      var articlesColumnStyles = getComputedStyle(document.querySelector('.blog-stories'));
      var articles = document.querySelector('main');
      var firstArticle = articles.children[0];

      if (firstArticle && articlesColumnStyles.display !== 'block') {
        articles.style.display = 'none';

        var articlesContainerHeight = parseInt(
          window.getComputedStyle(
            document.querySelector('.blog-stories-wrapper')
          ).height,
          10);
        var articlesHeader = document.querySelector('.blog-stories-header').getBoundingClientRect().height;

        var articlesHeight = articlesContainerHeight - articlesHeader;
        articles.style.maxHeight = articlesHeight + 'px';

        articles.style.display = 'block';
      } else {
        articles.style.maxHeight = 'initial';
      }
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
