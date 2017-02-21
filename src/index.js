import './index.scss'
import store from './todoStore/store'
import createList from './listComponent/linkedList'

// create a list linked to the store
const list = createList(store, 'todos', {id: 'list'})

// append list node to document
document.getElementById('main').appendChild(list.node)
