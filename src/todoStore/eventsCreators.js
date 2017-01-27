import * as type from './eventTypes'

const genericEvent = type => payload => ({ type, payload })

export const addTodo = genericEvent(type.ADD_TODO)

export function removeTodo(id) {
  return {
    type: type.REMOVE_TODO,
    payload: { id }
  }
}

export const editTodo = genericEvent(type.EDIT_TODO)
