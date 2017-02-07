import { createElement } from '../view'
import createTodo from '../todoComponent'

function createList(props){
  return Object.assign(
    createElement("ul", Object.assign({class: 'todolist'}, props)),
    {
      state: {
        todos: []
      },
      // Methods
      appendTodos(todos=[]) {
        const newChildren = [...this.children]
        todos.forEach(todo => {
          const elem = createTodo(todo)
          newChildren.push(elem)
          this.state.todos.push(todo)
        })
        this.updateChildren(newChildren)
      },
      clearAllTodos() {
        this.updateChildren([])
        this.state.todos = []
      },
      clearGivenTodos(todos = []) {
        const newChildren = [...this.children]
        todos.forEach(todo => {
          // get index of todo to clear
          const todoIndex = this.state.todos.findIndex(curr => curr.id === todo.id)
          // splice children and todos at those indexes index is not -1
          todoIndex > -1
            && this.state.todos.splice(todoIndex, 1)
            && newChildren.splice(todoIndex, 1)
        })

        this.updateChildren(newChildren)
      },
      updateTodos(newTodos) {
        const removed = this.state.todos
          .filter(oldTodo => newTodos.indexOf(oldTodo) === -1)
        const newItems = newTodos
          .filter(newTodo => this.state.todos.indexOf(newTodo) === -1)

        if (newItems.length > 0){
          this.appendTodos(newItems)
        }
        if (removed.length > 0){
          this.clearGivenTodos(removed)
        }
      }
    }
  )
}

export default createList
