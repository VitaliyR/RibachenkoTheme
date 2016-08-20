var config = require('../config');

var Page = require('../core/page');
var Paginator = require('./paginator');
var utils = require('../lib/utils');

module.exports = Page.extend({

  selectors: {
    container: '.cover-container',
    footer: 'footer.site-footer',
    scrollContent: '.content, .description',
    sections: '.section-container > section'
  },

  classNames: {
    animation: 'animation'
  },

  events: {
    'init': 'handleResize',
    'resize window': 'handleResize',
    'animationend window': 'handleAnimationEnd'
  },

  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.checkAnimation();

    setTimeout(function() {
      scrollTo(0, 0);
    }, 150);

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
      setTimeout(this.matchSectionsHeight.bind(this), 100);
    }
  },

  checkAnimation: function() {
    var animation = this.store.get('cover_animation');
    var now = Date.now();
    var shouldPlay = this.animated = !animation || ((now - animation) > config.cover_animation_freq);

    if (shouldPlay) {
      utils.toggleClass(document.body, this.classNames.animation, true);
      this.store.set('cover_animation', now);
    }
  },

  /**
   * AnimationEnd handler
   * @param {Event} e
   */
  handleAnimationEnd: function(e) {
    if (this.animated && e.target === this.elements.footer) {
      utils.toggleClass(document.body, this.classNames.animation, false);
    }
  },

  /**
   * IE support
   * @returns {*}
   */
  matchSectionsHeight: function() {
    this.clearSectionsHeight();

    if (innerWidth < config.mobile_width || innerHeight < config.mobile_height) {
      return;
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
   * Scrolls for not OS X systems
   */
  enableScrolls: function() {
    this.elements.scrollContent.forEach(function(element) {
      SimpleScrollbar.initEl(element);
    });
  }
});
