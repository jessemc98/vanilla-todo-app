import createList from "./"
import MyElement from '../view/MyElement'

describe("list", function () {
  describe("calls createElement", function () {
    let element, createElement;
    beforeEach(function () {
      // mock createElement
      element = {props: {}, children: []}
      createElement = expect.createSpy().andReturn(element)

      createList.__Rewire__('createElement', createElement)
    });
    afterEach(function () {
      createList.__ResetDependency__('createElement')
    });
    it("returns the element instance returned by createElement", function () {
      const list = createList()

      expect(list).toBe(element)
    });
    it("with element argument of 'ul'", function () {
      const list = createList()

      const firstArgument = createElement.calls[0].arguments[0]
      expect(firstArgument).toBe("ul")
    });
    describe("with props", function () {
      it(".class of 'todolist'", function () {
        const list = createList()

        const secondArgument = createElement.calls[0].arguments[1]
        expect(secondArgument.class).toBe("todolist")
      });
      it("passed as first argument of createList", function () {
        const props = {
          tabIndex: "-1",
          style: {
            color: 'blue'
          }
        }

        const list = createList(props)

        const secondArgument = createElement.calls[0].arguments[1]
        expect(secondArgument).toMatch(props)
      });
    });
  });
  describe("has initial state", function () {
    it("todos is an empty array", function () {
      const list = createList()

      expect(list.state.todos).toEqual([])
    });
  });
  describe("clearAllTodos", function () {
    it("calls updateChildren method with an empty array", function () {
      const list = createList()
      const updateChildren = expect.spyOn(list, 'updateChildren')

      list.clearAllTodos()

      expect(updateChildren).toHaveBeenCalledWith([])
    });
    it("sets state.todos to an empty array", function () {
      const list = createList()
      list.state.todos = [{id: 1}, {id: 2}, {id: 3}]

      list.clearAllTodos()

      expect(list.state.todos).toEqual([])
    });
  });
  describe("clearGivenTodos", function () {
    describe("removes only given todos from state.todos", function () {
      it("removes one todo given an array with one todo", function () {
        const list = createList()
        const todos = [{id: 1}, {id: 2}, {id: 3}]
        const [one, two, three] = todos
        list.state.todos = [...todos]

        list.clearGivenTodos([two])

        expect(list.state.todos).toEqual([one, three])
      });
      it("removes more than one todo given an array of todos", function () {
        const list = createList()
        const todos = [{id: 1}, {id: 2}, {id: 3}, {id: 4}]
        const [one, two, three, four] = todos
        list.state.todos = [...todos]

        list.clearGivenTodos([one, three])

        expect(list.state.todos).toEqual([two, four])
      });
      it("doesnt remove any todos given an empty array", function () {
        const list = createList()
        const todos = [{id: 1}, {id: 2}]
        const [ one, two ] = todos
        list.state.todos = todos

        list.clearGivenTodos([])

        expect(list.state.todos).toEqual([one, two])
      });
      it("doesnt remove any todos when no arguments are given", function () {
        const list = createList()
        const todos = [{id: 1}, {id: 2}]
        const [ one, two ] = todos
        list.state.todos = todos

        list.clearGivenTodos()

        expect(list.state.todos).toEqual([one, two])
      });
    });
    describe("calls updateChildren method", function () {
      describe("with an array of children with the given todos removed", function () {
        it("removes correct child given an array with one todo", function () {
          const list = createList()
          const todos = [{id: 1}, {id: 2}, {id: 3}]
          const [one, two, three] = todos
          list.state.todos = [...todos]
          /* children is usually made up of todoComponents but we
            are just using an array of todos for testing purposes */
          list.children = [...todos]
          const spy = expect.spyOn(list, 'updateChildren')

          list.clearGivenTodos([two])

          const updateChildrenCalledWith = spy.calls[0].arguments[0]
          expect(updateChildrenCalledWith).toEqual([one, three])
          spy.restore()
        });
        it("removes correct children given an array of todos", function () {
          const list = createList()
          const todos = [{id: 1}, {id: 2}, {id: 3}, {id: 4}]
          const [one, two, three, four] = todos
          list.state.todos = [...todos]
          list.children = [...todos]
          const spy = expect.spyOn(list, 'updateChildren')

          list.clearGivenTodos([one, three])

          const updateChildrenCalledWith = spy.calls[0].arguments[0]
          expect(updateChildrenCalledWith).toEqual([two, four])
          spy.restore()
        });
      });
    });
  });
  describe("appendTodos", function () {
    let spy, list, mockUpdateChildren;
    beforeEach(function () {
      // mock createTodo dependency
      spy = expect
        .createSpy()
        .andCall(todo => todo)
      createList.__Rewire__('createTodo', spy)
    });
    beforeEach(function () {
      //mock updateChildren method
      list = createList()
      mockUpdateChildren = expect.spyOn(list, 'updateChildren')
    });
    afterEach(function () {
      // remove stubbed dependencies
      createList.__ResetDependency__('createTodo')
    });
    it("doesnt throw an error when called without any arguments", function () {
      expect(list.appendTodos.bind(list)).toNotThrow()
    });
    describe("appends given todos to state.todos", function () {
      it("appends one todo", function () {
        const todos = [{id: 1}, {id: 2}]
        const [one, two] = todos
        const three = {id: 3}
        list.state.todos = [...todos]

        list.appendTodos([three])

        expect(list.state.todos).toEqual([one, two, three])
      });
      it("appends multiple todos", function () {
        const todos = [{id: 1}]
        const [one] = todos
        const two = {id: 2}
        const three = {id: 3}
        list.state.todos = [...todos]

        list.appendTodos([two, three])

        expect(list.state.todos).toEqual([one, two, three])
      });
      it("doesnt append anything when given an empty array", function () {
        const todos = [{id: 1}]
        list.state.todos = [...todos]

        list.appendTodos([])

        expect(list.state.todos).toEqual(todos)
      });
    });
    describe("calls updateChildren with this.children + appended todos", function () {
      it("when given an array with one todo", function () {
        const todos = [{id: 1}, {id: 2}]
        const [one, two] = todos
        const three = {id: 3}
        list.state.todos = [...todos]
        list.children = [...todos]

        list.appendTodos([three])

        expect(mockUpdateChildren).toHaveBeenCalledWith([one, two, three])
      });
      it("when given an array with multiple children", function () {
        const todos = [{id: 1}]
        const [ one ] = todos
        const two = {id: 2}
        const three = {id: 3}
        list.state.todos = [...todos]
        list.children = [...todos]

        list.appendTodos([two, three])

        expect(mockUpdateChildren).toHaveBeenCalledWith([one, two, three])
      });
    });
  });
  describe("updateTodos", function () {
    let list
    beforeEach(function () {
      list = createList()
      // mock updateTodos dependencies
      expect.spyOn(list, 'appendTodos')
      expect.spyOn(list, 'clearGivenTodos')
    });
    it("doesnt call appendTodos if they are all already in state", function () {
      const inState = {id: 6}
      list.state.todos = [{id: 5}, inState, {id: 7}]
      const todos = [inState]

      list.updateTodos(todos)

      expect(list.appendTodos).toNotHaveBeenCalled()
    });
    describe("calls appendTodos method", function () {
      describe("when no todos in state", function () {
        it("with given todo", function () {
          list.state.todos = []
          const todos = [{id: 6}]

          list.updateTodos(todos)

          expect(list.appendTodos).toHaveBeenCalledWith(todos)
        });
        it("with array of multiple todos", function () {
          list.state.todos = []
          const todos = [{id: 6}, {id: 7}]

          list.updateTodos(todos)

          expect(list.appendTodos).toHaveBeenCalledWith(todos)
        });
      });
      describe("when todos in state and given an array of todos", function () {
        it("not already in state", function () {
          list.state.todos = [{id: 4}, {id: 5}]
          const todos = [{id: 6}, {id: 7}]

          list.updateTodos(todos)

          expect(list.appendTodos).toHaveBeenCalledWith(todos)
        });
        it("some of which are already in state", function () {
          const inState = {id: 6}
          const newTodo = {id: 7}
          list.state.todos = [{id: 5}, inState]
          const todos = [inState, newTodo]

          list.updateTodos(todos)

          expect(list.appendTodos).toHaveBeenCalledWith([newTodo])
        });
      });
    });
    it("doesnt call clearGivenTodos when no todos in state", function () {
      list.state.todos = []
      const todos = [{id: 6}]

      list.updateTodos(todos)

      expect(list.clearGivenTodos).toNotHaveBeenCalled()
    });
    describe("calls clearGivenTodos method", function () {
      it("when state contains todos which are not in newTodo array", function () {
        const todos = [{id: 1}, {id: 2}, {id: 3}]
        const [ one, two, three ] = todos
        list.state.todos = [...todos]

        list.updateTodos([two])

        expect(list.clearGivenTodos).toHaveBeenCalledWith([one, three])
      });
      it("when state contains a single todo which is not in newTodo array", function () {
        const todos = [{id: 1}, {id: 2}, {id: 3}]
        const [ one, two, three ] = todos
        list.state.todos = [...todos]

        list.updateTodos([two])

        expect(list.clearGivenTodos).toHaveBeenCalledWith([one, three])
      });
    });
  });
});
