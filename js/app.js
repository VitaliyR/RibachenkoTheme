import Page from './page';

import Cover from './pages/cover';

class App extends Page {

  /**
   * Returns controller for the current page of application
   * @returns {*}
   */
  get controller() {
    const documentClassList = Array.from(document.body.classList);

    let controller;

    for (let cont of this.controllers) {
      let thisController = documentClassList.some((v) => cont.classList.indexOf(v) !== -1);
      if (thisController) {
        controller = cont.controller;
        break;
      }
    }

    return controller;
  }

  /**
   * @constructor
   * @override
   */
  constructor(...args) {
    super(...args);

    this.controllers = [
      {
        controller: Cover,
        classList: [
          'home-template',
          'tag-template',
          'archive-template'
        ]
      }
    ];

    this.currentController = this.controller;
    new this.currentController(this.container);
  }
  
}

/**
 * Exports
 */
document.addEventListener('DOMContentLoaded', function () {
  new App(document.body);
});
