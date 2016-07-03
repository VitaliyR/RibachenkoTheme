import config from '../config';

import Page from '../page';
import Paginator from '../paginator';
import utils from '../utils';

class CoverController extends Page {

  get selectors() {
    return {
      scrollContent: '.content, .description',
      sections: '.section-container > section'
    };
  }
  
  get events() {
    return {
      'init': this.handleResize,
      'resize window': this.handleResize
    };
  }

  constructor(...args) {
    super(...args);

    scrollTo(0, 0);

    this.paginator = new Paginator(this.container);

    if (!utils.isMobile() && !utils.isMac()) {
      this.enableScrolls();
    }
  }

  /**
   * Resize handler, called on window resize
   */
  handleResize() {
    if (navigator.appVersion.match(/MSIE/)) {
      this.matchSectionsHeight();
    }
  }

  matchSectionsHeight() {
    if (innerWidth < config.mobile_width || innerHeight < config.mobile_height) {
      return this.clearSectionsHeight();
    }

    var maxHeight = Array.prototype.reduce.apply(this.elements.sections, [
      function(max, section) {
        var height = section.getBoundingClientRect().height;
        return height > max ? height : max;
      },
      0
    ]);

    for (var i = 0; i < this.elements.sections.length; i++) {
      var section = this.elements.sections[i];
      section.style.height = maxHeight + 'px';
    }
  }

  clearSectionsHeight() {
    for (var i = 0; i < this.elements.sections.length; i++) {
      var section = this.elements.sections[i];
      section.style.height = '';
    }
  }

  /**
   * @uses jQuery
   */
  enableScrolls() {
    var barsSelector = '.jspHorizontalBar, .jspVerticalBar';
    var $scrollContent = $(this.elements.scrollContent);

    this._timeouts = {};

    $scrollContent
      .css('overflow', 'initial')
      .bind('jsp-initialised', function () {
        $(this).find(barsSelector).hide();
      })
      .jScrollPane({
        contentWidth: '0px'
      })
      .scroll(
        function () {
          var $self = $(this);
          $self.find(barsSelector).stop().show().css('opacity', 0.9);

          clearTimeout(this._timeouts[this]);
          // fixme this unclear
          this._timeouts[this] = setTimeout(function () {
            $self.find(barsSelector).stop().fadeTo('fast', 0);
          }, 1000);
        }
      );

    $('body').on('articlesUpdated', function () {
      $scrollContent.each(function () {
        $(this).data('jsp').reinitialise();
      });
    });

    $scrollContent.each(function () {
      var jsp = $(this).data('jsp');
      jsp && jsp.reinitialise();
    });
  }
}

export default CoverController;
