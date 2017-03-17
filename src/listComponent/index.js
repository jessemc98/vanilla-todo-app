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
        const findById = id => todo => todo.id === id
        const copy = [...this.state.todos]
        const removed = getRemoved(copy, newTodos)
        const added = getNew(copy, newTodos)
        const updated = getUpdated(copy, newTodos)

        function getRemoved(initial, target) {
          return initial.filter(todo =>
            // not in target
            target.indexOf(todo) === -1 &&
            // todo with same id not in target
            target.findIndex(findById(todo.id)) === -1)
        }
        function getUpdated(initial, target) {
          return (initial
            .filter(todo => target.indexOf(todo) === -1)
            .reduce((updated, current) => {
              const indexOfTodoInNew = target.findIndex(findById(current.id))
              let changed

              if (indexOfTodoInNew  > -1) {
                changed = {
                  old: current,
                  new: target[indexOfTodoInNew]
                }
              }

              changed && updated.push(changed)
              return updated
            }, [])
          )
        }
        function getNew(initial, target) {
          return target.filter(
            todo =>
              initial.indexOf(todo) === -1 &&
              initial.findIndex(findById(todo.id)) === -1
          )
        }

        if (added.length > 0){
          this.appendTodos(added)
        }
        if (removed.length > 0){
          this.clearGivenTodos(removed)
        }
        if (updated.length > 0){
          this.updateGivenTodos(updated)
        }
      },
      updateGivenTodos(todos) {
        const newChildren = [...this.children]
        todos.forEach(todo => {
          const index = this.state.todos.indexOf(todo.old)
          const elem = createTodo(todo.new)

          this.state.todos[index] = todo.new
          newChildren[index] = elem
        })
        this.updateChildren(newChildren)
      }
    }
  )
}

export default createList
