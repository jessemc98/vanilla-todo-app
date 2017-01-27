import initialState from './initialState'
import * as types from './eventTypes'

export default function (state=initialState.todos, event) {
  if (event.type === types.ADD_TODO) {
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
  if (event.type === types.REMOVE_TODO) {
    return state.filter(todo => todo.id !== event.payload.id)
  }
  if (event.type === types.EDIT_TODO) {
    return state.map(todo => {
      return todo.id === event.payload.id ? event.payload : todo
    })
  }
  return state
}
