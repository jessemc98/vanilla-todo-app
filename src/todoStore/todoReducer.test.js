import expect from 'expect'
import * as types from './eventTypes'
import todoReducer from './todoReducer'

describe("todoReducer", function () {
  it("returns state with added todo when a ADD_TODO event is emmitted", function () {
    const currentState = []
    const event = {
      type: types.ADD_TODO,
      payload: {id: 1, title: 'testing'}
    }

    const expected = [{id: 1, title: 'testing'}]
    expect(todoReducer(currentState, event)).toEqual(expected)
  });
  it("throws 'error adding todo: todo with that id already exists' error if adding a todo with id which already exists", function () {
    const currentState = [{id: 1, title: 'oh noes!'}]
    const event = {
      type: types.ADD_TODO,
      payload: {id: 1, title: 'testing'}
    }

    expect(() => todoReducer(currentState, event)).toThrow('error adding todo: todo with that id already exists')
  });
  it("removes todo from state using todo.id when REMOVE_TODO event is emmited", function () {
    const currentState = [{id:1, title: 'test'}, {id:3, title: 'test'}, {id:2, title: 'test'}]
    const event = {
      type: types.REMOVE_TODO,
      payload: {id: 3}
    }

    const expected = [{id:1, title: 'test'}, {id:2, title: 'test'}]
    expect(todoReducer(currentState, event)).toEqual(expected)
  });
  it("edits todo which matches the id of payload when EDIT_TODO event is emmitted", function () {
    const currentState = [{id:1, title: 'test'}, {id:3, title: 'test'}, {id:2, title: 'test'}]
    const event = {
      type: types.EDIT_TODO,
      payload: {id: 3, title: 'omg i have changed'}
    }

    const expected = [{id:1, title: 'test'}, {id:3, title: 'omg i have changed'}, {id:2, title: 'test'}]
    expect(todoReducer(currentState, event)).toEqual(expected)
  });
});
