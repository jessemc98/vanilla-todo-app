import createList from './'

export default function linkedList(store, key, props) {
  const initialState = store.getState()
  // create a list
  const list = createList(props)

  // update list with initial state
  list.updateTodos(initialState[key])

  // subscribe to store,
  // call list.updateTodos with new todos every time they change
  store.subscribe(key, list.updateTodos.bind(list))

  return list
}
