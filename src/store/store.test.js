import expect from 'expect'

import { createStore } from './store'
describe("store", function () {
  it("returns current state when store.getState is called", function () {
    const state = {test: 'works'}
    const store = createStore({}, state)

    expect(store.getState()).toEqual(state)
  });
  it("sets initialState to be an empty object when no arguments are passed", function () {
    const store = createStore({})

    expect(store.getState()).toEqual({})
  });
  it("creates a key with the value returned from passing the initial state to each reducer", function () {
    const reducer = (state, event) => state/2
    const store = createStore({ reducer }, {reducer: 10})

    expect(store.getState()).toEqual({reducer: 5})
  });
  it("calls all reducers with event of type 'STORE_INIT' ", function () {
    const reducer = expect.createSpy()
    const store = createStore({ reducer })

    expect(reducer).toHaveBeenCalledWith(undefined, {type: 'STORE_INIT'})
  });
  it("calls all reducers with args: currState and event when an event is emitted and sets state to the return value", function () {
    const reducers = {
      first: (state, event) => {
        if (event.type === 'increment-first' ||
            event.type === 'increment-both') return state += 1
        return state
      },
      second: (state, event) => {
        if (event.type === 'add-second') return  state += event.value
        if (event.type == 'increment-both') return state += 1
        return state
      }
    }
    const initialState = {
      first: 10, second: 0
    }
    const store = createStore(reducers, initialState)

    store.emit({type: 'increment-first'})

    expect(store.getState()).toEqual({first: 11, second: 0})

    store.emit({
      type: 'add-second',
      value: 50
    })

    expect(store.getState()).toEqual({first: 11, second: 50})

    store.emit({type: 'increment-both'})

    expect(store.getState()).toEqual({first: 12, second: 51})
  });
  it("calls reducers correctly if reducer is an array of functions", function () {
    const reducers = {
      first: [
        (state, event) => {
          if (event.type === 'increment-once') return state += 1
          return state
        },
        (state, event) => {
          if (event.type === 'increment-twice') return state += 2
          return state
        }
      ]
    }
    const initialState = {first: 10}
    const store = createStore(reducers, initialState)

    store.emit({type: 'increment-once'})
    store.emit({type: 'increment-twice'})

    expect(store.getState()).toEqual({first: 13})
  });
  describe("subscribing to store", function () {
    let reducers, store, spy;
    beforeEach(function () {
      reducers = {
        test: (state, e) => e.type === 'hello'?'testing':state
      }
      store = createStore(reducers, {test: 'not testing'})
      spy = expect.createSpy()

      store.subscribe('test', spy)
    });

    it("calls subscribers with new state if state changes", function () {
      store.emit({type: 'hello'})

      expect(spy).toHaveBeenCalledWith('testing')
    });
    it("doesnt call subscribers with new state if event is emitted but state doesnt change", function () {
      store.emit({type: 'goodbye'})

      expect(spy).toNotHaveBeenCalled()
    });
    it("unsubscribes when called with the function", function () {
      store.unsubscribe('test', spy)

      store.emit({type: 'hello'})

      expect(spy).toNotHaveBeenCalled()
    });
    it("doesnt unsubscribe to all subscribers", function () {
      const secondSubscriber = expect.createSpy()
      store.subscribe('test', secondSubscriber)

      store.unsubscribe('test', spy)
      store.emit({type: 'hello'})

      expect(secondSubscriber).toHaveBeenCalledWith('testing')
    });
  });
});
