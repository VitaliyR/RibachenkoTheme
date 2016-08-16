var config = require('../config');

var Page = require('../core/page');
var Paginator = require('./paginator');
var utils = require('../lib/utils');

module.exports = Page.extend({

  selectors: {
    container: '.cover-container',
    scrollContent: '.content, .description',
    sections: '.section-container > section'
  },

  events: {
    'init': 'handleResize',
    'resize window': 'handleResize',
    'articles:update window': 'articlesUpdate'
  },

  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);

    scrollTo(0, 0);

    this.paginator = new Paginator(this.container);

    if (!utils.isMobile() && !utils.isMac()) {
      this.enableScrolls();
    }
  },

  /**
   * Resize handler, called on window resize
   */
  handleResize: function() {
    if (navigator.appVersion.match(/MSIE/)) {
      this.matchSectionsHeight();
    }

    var container = this.elements.container;
    var containerHeight = container.getBoundingClientRect().height;

    // todo
    // container.style.height = window.innerHeight > containerHeight ? (window.innerHeight + 'px') : 'auto';
  },

  matchSectionsHeight: function() {
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
  },

  clearSectionsHeight: function() {
    for (var i = 0; i < this.elements.sections.length; i++) {
      var section = this.elements.sections[i];
      section.style.height = '';
    }
  },

  /**
   * @uses jQuery
   */
  enableScrolls: function() {
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
        function() {
          var $self = $(this);
          $self.find(barsSelector).stop().show().css('opacity', 0.9);

          clearTimeout(this._timeouts[this]);
          // fixme this unclear
          this._timeouts[this] = setTimeout(function () {
            $self.find(barsSelector).stop().fadeTo('fast', 0);
          }, 1000);
        }
      );

    $scrollContent.each(function() {
      var jsp = $(this).data('jsp');
      jsp && jsp.reinitialise();
    });
  },

  articlesUpdate: function() {
    // $scrollContent.each(function() {
    //     $(this).data('jsp').reinitialise();
    //   });
  }
});
