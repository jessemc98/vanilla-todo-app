import initialState from './initialState'
import * as types from './eventTypes'

export default function (state=initialState.todos, event) {
  const { type } = event
  if (type === types.ADD_TODO) {
    // check if todo with that id exists and throw error if so
    state.forEach(todo => {
      if (todo.id === event.payload.id) {
        throw new Error('error adding todo: todo with that id already exists')
      }
    })
    // return copy of state with new added todo
    const copy = [...state]
    copy.push(event.payload)
    return copy
  }
  if (type === types.REMOVE_TODO) {
    return state.filter(todo => todo.id !== event.payload.id)
  }
  if (type === types.EDIT_TODO) {
    return state.map(todo => {
      return todo.id === event.payload.id ? event.payload : todo
    })
  }
  if (type == types.TOGGLE_CHECKED_TODO) {
    const toggledId = event.payload.id
    return state.map(todo => {
      if (todo.id === toggledId) {
        return Object.assign({}, todo, {checked: !todo.checked})
      }
      return todo
    })
  }
  return state
}
