import Page from './page';

import Cover from './pages/cover';

class App extends Page {

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
  
}

/**
 * Exports
 */
document.addEventListener('DOMContentLoaded', function () {
  new App(document.body);
});
