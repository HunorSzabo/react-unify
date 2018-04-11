import * as React from 'react';
import { create } from 'react-test-renderer';
import { prop, Render, state } from '../';

@Render(counter => (
  <div>
    <p>Count: {counter.count}</p>
    <button onClick={() => counter.increment()}>
      Increment by {counter.amount}
    </button>
  </div>
))
class Counter extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    const count = nextProps.deriveCount;
    return count == null ? null : { count };
  }

  @prop newCount;
  @prop amount = 1;
  @state count = 0;

  increment() {
    this.count += this.amount;
  }

  incrementSetState() {
    this.setState({ count: this.state.count + this.amount });
  }

  incrementForceUpdate() {
    this.state.count += this.amount;
    this.forceUpdate();
  }
}

describe('@Render', () => {
  it('updates from @state', () => {
    const renderer = create(<Counter />);
    renderer.root.findByType(Counter).instance.increment();
    expect(renderer).toMatchSnapshot();
  });

  it('updates from setState()', () => {
    const renderer = create(<Counter />);
    renderer.root.findByType(Counter).instance.incrementSetState();
    expect(renderer).toMatchSnapshot();
  });

  it('updates from forceUpdate()', () => {
    const renderer = create(<Counter />);
    renderer.root.findByType(Counter).instance.incrementForceUpdate();
    expect(renderer).toMatchSnapshot();
  });

  it('updates from getDerivedStateFromProps()', () => {
    const renderer = create(<Counter />);
    renderer.update(<Counter deriveCount={1} />);
    expect(renderer).toMatchSnapshot();
  });

  it('parameter render must be a function', () => {
    class MyComponent extends React.Component {}

    expect(() => Render(null)(MyComponent)).toThrow(
      'parameter render must be a function'
    );
  });

  it('can not set Component.render() when using @Render', () => {
    class MyComponent extends React.Component {
      render() {
        return null;
      }
    }

    expect(() => Render(() => null)(MyComponent)).toThrow(
      'can not set Component.render() when using @Render'
    );
  });

  it('sets Counter.Render', () => {
    expect(Counter.Render({ count: 0, amount: 1 })).toMatchSnapshot();
  });
});