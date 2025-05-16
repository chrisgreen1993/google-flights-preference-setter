

export class BaseComponent {
  constructor(initalState = {}) {
    this.state = new Proxy(initalState, {
      set: (target, prop, value) => {
        target[prop] = value;
        this.render();
        return true;
      }
    });
  }

  render() {
    throw new Error('render() method not implemented');
  }
}

