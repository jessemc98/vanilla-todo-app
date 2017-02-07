import { assignPropsToElem, removeAllChildren } from './'

export default function MyElement({ element, props, children } = {}) {
  // create element and assign props to it
  this.node = document.createElement(element)
  this.element = element
  this.props = props
  this.children = children
}
MyElement.prototype.updateProps = function (newProps) {
  assignPropsToElem(this.node, newProps)
  this.props = newProps
}
MyElement.prototype.updateChildren = function (newChildren) {
  const node = this.node
  // remove children
  removeAllChildren(node)
  // append new children
  newChildren.forEach(child => {
    // if child is string append textNode
    if (typeof child === 'string') {
      const textNode = document.createTextNode(child)
      return node.appendChild(textNode)
    }
    // if not a string must be a MyElement instance
    this.node.appendChild(child.node)
  })

  this.children = newChildren
}
