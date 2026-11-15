import React, { Component } from "react";

// Same wiring substate-connect provided, without its bundled copy of React 16.
export function connect(store, chunk) {
  return function wrap(Comp) {
    function Connected(props) {
      const mapped = {};
      for (const key in chunk) {
        mapped[key] = store.getProp(chunk[key]);
      }
      return React.createElement(Comp, { ...mapped, ...props });
    }

    const name = Comp.displayName || Comp.name || "Component";
    Connected.displayName = `Connect(${name})`;
    return Connected;
  };
}

export function Provide(store, triggers, onMount) {
  return function wrap(Comp) {
    class Provided extends Component {
      componentDidMount() {
        this.subscriptions = triggers.map((actionName) => {
          const handler = (nextState) => {
            this.setState(nextState);
          };
          store.on(actionName, handler);
          return { actionName, handler };
        });
        if (onMount) onMount.call(this, store, triggers);
      }

      componentWillUnmount() {
        if (!this.subscriptions) return;
        this.subscriptions.forEach(({ actionName, handler }) => {
          store.off(actionName, handler);
        });
      }

      render() {
        return React.createElement(Comp, {
          ...this.state,
          ...this.props,
        });
      }
    }

    const name = Comp.displayName || Comp.name || "Component";
    Provided.displayName = `Provide(${name})`;
    return Provided;
  };
}
