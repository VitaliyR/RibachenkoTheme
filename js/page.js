class Page {
  constructor(container) {
    this.container = container;
    this.elements = {};

    for (let selectorName in this.selectors) {
      this.elements[selectorName] = this.container.querySelectorAll(this.selectors[selectorName]);
    }

    for (let eventDesc in this.events) {
      const event = eventDesc.split(' ');
      const eventName = event[0];
      const eventHandler = this.events[eventDesc];
      let eventObj = event[1];

      if (eventName === 'init') {
        eventHandler();
      } else {
        eventObj = window[eventObj] || this.elements[eventObj];

        if (eventObj) {
          eventObj.addEventListener(eventName, eventHandler.bind(this));
        }
      }
    }
  }
}

export default Page;
