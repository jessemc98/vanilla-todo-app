import { createElement } from '../view'

import numFormattedForView from '../common/numFormattedForView'
import { toggleCheckedTodo } from '../todoStore/eventsCreators'
import todoStore from '../todoStore/store'
// returns a 'Todo' view element when given a todo object from state
export default function createTodo(todo) {
  const inputProps = {
    tabIndex: "-1",
    class: "todo_checkbox",
    type: "checkbox",
    id: todo.id
  }
  if (todo.checked) {
    inputProps.checked = ""
  }

  return createElement(
    "li",
    {
      class: `todo ${todo.highlight ? 'todo-'+todo.highlight : ''}`,
      onclick(e) {
        e.stopPropagation()
        e.preventDefault()
        todoStore.emit(
          toggleCheckedTodo(todo.id))
      }
    },
    [
      createElement("input", inputProps),
      createElement("label",
        {
          class: "todo_title",
          tabIndex: "0",
          for: todo.id
        },
        [ todo.title ]
      ),
      createElement("span",
        { class: "todo_time" },
        [ numFormattedForView(todo.time) ]
      )
    ]
  )
}
