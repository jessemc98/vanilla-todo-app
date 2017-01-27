import expect from 'expect'
import * as events from './eventsCreators'
import * as eventTypes from './eventTypes'

describe("eventCreators", function () {
  describe("addTodo", function () {
    let todo, action;
    beforeEach(function () {
      todo = {title: 'test', id: 123}
      action = events.addTodo(todo)
    });
    it("returns an action of type 'ADD_TODO'", function () {
      expect(action.type).toEqual(eventTypes.ADD_TODO)
    });
    it("returns an action with the todo as a payload", function () {
      expect(action.payload).toEqual(todo)
    });
  });
  describe("removeTodo", function () {
    let id, action;
    beforeEach(function () {
      id = 123
      action = events.removeTodo(id)
    });
    it("returns action of type 'REMOVE_TODO'", function () {
      expect(action.type).toEqual(eventTypes.REMOVE_TODO)
    });
    it("returns a action with payload.id equal to passed id", function () {
      expect(action.payload.id).toEqual(id)
    });
  });
  describe("editTodo", function () {
    let newTodo, action;
    beforeEach(function () {
      newTodo = {title: 'test', id: 123}
      action = events.editTodo(newTodo)
    });
    it("returns action of type 'EDIT_TODO'", function () {
      expect(action.type).toEqual(eventTypes.EDIT_TODO)
    });
    it("returns action with payload equal to new todo", function () {
      expect(action.payload).toEqual(newTodo)
    });
  });
});
