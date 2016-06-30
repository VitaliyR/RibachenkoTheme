import config from './config';
import Page from './page';

import Cover from './pages/cover';

class App extends Page {

  get selectors() {
    return {
      sections: '.section-container > section'
    };
  }
  
  get events() {
    return {
      'init': this.handleResize,
      'resize window': this.handleResize
    };
  }

  /**
   * @constructor
   * @override
   */
  constructor(...args) {
    super(...args);

    // todo refactor
    if (document.body.classList.contains('home-template')) {
      new Cover(this.container);
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
}

/**
 * Exports
 */
document.addEventListener('DOMContentLoaded', function () {
  new App(document.body);
});
