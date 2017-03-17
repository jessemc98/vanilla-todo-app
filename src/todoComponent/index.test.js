import createTodo from './'
import { isElementInstance, isElementTag, hasClass } from '../view/testUtils'

const mockTodo = {
  id: 1,
  title: "Morning run",
  time: "7:00",
  checked: true
}
describe("createTodo", function () {
  const mockToggleCheckedTodo = () => {}
  beforeEach(function () {
    // mock dependencies
    createTodo.__Rewire__('todoStore', {emit(){}})
    createTodo.__Rewire__('toggleCheckedTodo', mockToggleCheckedTodo)
  });
  afterEach(function () {
    createTodo.__ResetDependency__('todoStore')
    createTodo.__ResetDependency__('toggleCheckedTodo')
    createTodo.__ResetDependency__('numFormattedForView')
  });
  it("returns a MyElement instance", function () {
    const todo = createTodo(mockTodo)

    expect(isElementInstance(todo)).toBeTruthy()
  });
  it("returns a li element", function () {
    const todo = createTodo(mockTodo)

    expect(isElementTag(todo, 'li')).toBeTruthy()
  });
  it("has a class of todo", function () {
    const todo = createTodo(mockTodo)

    expect(hasClass(todo, 'todo')).toBeTruthy()
  });
  it("calls toggleCheckedTodo with the id of the todo when clicked", function () {
    const toggleCheckedTodo = expect.createSpy()
    createTodo.__Rewire__('toggleCheckedTodo', toggleCheckedTodo)

    const id = 13
    const todo = createTodo(
      Object.assign({}, mockTodo, { id }))

    const mockEvent = {stopPropagation(){}, preventDefault(){}}
    todo.props.onclick(mockEvent)

    expect(toggleCheckedTodo).toHaveBeenCalledWith(id)
  });
  it("calls store.emit with the return value of toggleCheckedTodo when clicked", function () {
    const toggleCheckedTodoReturnValue = 'todos have been toggled dude!'
    const toggleCheckedTodo = () => toggleCheckedTodoReturnValue
    createTodo.__Rewire__('toggleCheckedTodo', toggleCheckedTodo)

    const emit = expect.createSpy()
    const mockStore = { emit }
    createTodo.__Rewire__('todoStore', mockStore)

    const id = 13
    const todo = createTodo(
      Object.assign({}, mockTodo, { id }))

    const mockEvent = {stopPropagation(){}, preventDefault(){}}
    todo.props.onclick(mockEvent)

    expect(emit).toHaveBeenCalledWith(toggleCheckedTodoReturnValue)
  });
  describe("children", function () {
    describe("first child", function () {
      it("is a input element", function () {
        const todo = createTodo(mockTodo)
        const [ firstChild ] = todo.children

        expect(isElementTag(firstChild, 'input')).toBeTruthy()
      });
      it("has class of 'todo_checkbox'", function () {
        const todo = createTodo(mockTodo)
        const [ firstChild ] = todo.children

        expect(hasClass(firstChild, 'todo_checkbox')).toBeTruthy()
      });
      it("has type of checkbox", function () {
        const todo = createTodo(mockTodo)
        const [ firstChild ] = todo.children

        expect(firstChild.props.type).toBe('checkbox')
      });
      it("has tabIndex of -1", function () {
        const todo = createTodo(mockTodo)
        const [ firstChild ] = todo.children

        expect(firstChild.props.tabIndex).toBe('-1')
      });
      it("has id of given todo.id", function () {
        const mock = Object.assign({}, mockTodo, {id: 5})
        const todo = createTodo(mock)
        const [ firstChild ] = todo.children

        expect(firstChild.props.id).toBe(5)
      });
      it("has props.checked set to empty string if todo.checked is true", function () {
        const mock = Object.assign({}, mockTodo, {checked: true})
        const todo = createTodo(mock)
        const [ firstChild ] = todo.children

        expect(firstChild.props.checked).toBe("")
      });
      it("has props.checked of undefined if todo.checked is false", function () {
        const mock = Object.assign({}, mockTodo, {checked: false})
        const todo = createTodo(mock)
        const [ firstChild ] = todo.children

        expect(firstChild.props.checked).toBe(undefined)
      });
      it("description", function () {

      });
    });
    describe("second child", function () {
      it("is a label element", function () {
        const todo = createTodo(mockTodo)
        const secondChild = todo.children[1]

        expect(isElementTag(secondChild, 'label')).toBeTruthy()
      });
      it("has tabIndex of 0", function () {
        const todo = createTodo(mockTodo)
        const secondChild = todo.children[1]

        expect(secondChild.props.tabIndex).toBe('0')
      });
      it("has class of 'todo_title'", function () {
        const todo = createTodo(mockTodo)
        const secondChild = todo.children[1]

        expect(hasClass(secondChild, 'todo_title')).toBeTruthy()
      });
      it("has props.for of given todo.id", function () {
        const mock = Object.assign({}, mockTodo, {id: 5})
        const todo = createTodo(mock)
        const secondChild = todo.children[1]

        expect(secondChild.props.for).toBe(5)
      });
      it("has one child equal to todo.title", function () {
        const title = 'i am a title'
        const mock = Object.assign({}, mockTodo, { title })
        const todo = createTodo(mock)
        const secondChild = todo.children[1]

        expect(secondChild.children).toEqual([ title ])
      });
    });
    describe("third child", function () {
      it("is a span", function () {
        const todo = createTodo(mockTodo)
        const thirdChild = todo.children[2]

        expect(isElementTag(thirdChild, 'span')).toBeTruthy()
      });
      it("has a class of todo_time", function () {
        const todo = createTodo(mockTodo)
        const thirdChild = todo.children[2]

        expect(hasClass(thirdChild, 'todo_time')).toBeTruthy()
      });
      it("calls numFormattedForTodo with todo.time", function () {
        const spy = expect.createSpy().andReturn("")
        createTodo.__Rewire__('numFormattedForView', spy)

        const time = "5:00"
        const mock = Object.assign({}, mockTodo, { time })
        const todo = createTodo(mock)

        expect(spy).toHaveBeenCalledWith(time)
      });
      it("sets first child to the return value of calling numFormattedForTodo", function () {
        const expected = '5:00 AM'
        const spy = expect.createSpy().andReturn(expected)
        createTodo.__Rewire__('numFormattedForView', spy)

        const time = "5:00"
        const mock = Object.assign({}, mockTodo, { time })
        const todo = createTodo(mock)
        const thirdChild = todo.children[2]

        expect(thirdChild.children).toEqual([ expected ])
      });
    });
  });
});
