import { createStore } from '../store/store'

import initialState from './initialState'
import todos from './todoReducer'

const todoStore = createStore({ todos }, initialState)

export const emit = todoStore.emit
export default todoStore
