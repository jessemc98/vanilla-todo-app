import linkedList from './linkedList'

describe("linkedList", function () {
  const mockList = {updateTodos(){}, }
  const mockStore = {
    getState() {return {}},
    subscribe() {}
  }
  beforeEach(function () {
    // mock dependencies
    linkedList.__Rewire__('createList', () => {return mockList})
  });
  afterEach(function () {
    linkedList.__ResetDependency__('createList')
  });
  it("calls createList dependency with given props", function () {
    const createList = expect.createSpy().andReturn(mockList)
    linkedList.__Rewire__('createList', createList)
    const props = {id: 'list'}
    linkedList(mockStore, "key", props)

    expect(createList).toHaveBeenCalledWith(props)
  });
  it("returns the object returned by calling createList dependency", function () {
    const list = Object.assign({id: 'i am a list'}, mockList)
    const createList = () => list
    linkedList.__Rewire__('createList', createList)

    expect(linkedList(mockStore, "key")).toEqual(list)
  });
  it("calls updateTodos method with the initial state before object is returned", function () {
    // mock createList dependency and spy on updateTodos
    const updateTodos = expect.createSpy()
    const createList = () => ({ updateTodos })
    linkedList.__Rewire__("createList", createList)
    // mock store.getState
    const todos = [{}, {}]
    const initialState = { todos }
    const getState = () => initialState
    const store = Object.assign({}, mockStore, { getState })

    linkedList(store, "todos")

    expect(updateTodos).toHaveBeenCalledWith(todos)
  });
  it("calls store.subscribe with 'key' and a bound list.updateTodos function", function () {
    const key = 'todos'
    // spy on store.subscribe
    const subscribe = expect.createSpy()
    const store = Object.assign({}, mockStore, { subscribe })

    linkedList(store, key)

    expect(subscribe).toHaveBeenCalledWith(key, mockList.updateTodos.bind(mockList))
  });
});
