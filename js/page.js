class Page {
  constructor(container) {
    this.container = container;
    this.elements = {};

    for (let selectorName in this.selectors) {
      let elements = this.container.querySelectorAll(this.selectors[selectorName]);
      this.elements[selectorName] = elements.length === 1 ? elements[0] : elements;
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
          if (typeof eventObj === 'object' && !eventObj.length) {
            eventObj = [eventObj];
          }
          eventObj.forEach((obj) => obj.addEventListener(eventName, eventHandler.bind(this)));
        }
      }
    }
  }
}

export default Page;
