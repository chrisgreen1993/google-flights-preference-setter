export class BaseComponent<State extends Record<string, any>> {
  state: State;

  constructor(initalState: State) {
    this.state = new Proxy(initalState, {
      set: (target, prop: string, value) => {
        target[prop as keyof State] = value;
        this.render();
        return true;
      },
    });
  }

  render() {
    throw new Error("render() method not implemented");
  }
}
