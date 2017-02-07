import expect from 'expect'
import MyElement from './MyElement'

export function createElementMock(element, props, children) {
  return {
    element,
    props,
    children,
    updateProps: expect.createSpy().andCall(
      function (newProps) {this.props = newProps}
    ),
    updateChildren: expect.createSpy().andCall(
      function (newChildren) {this.children = newChildren}
    )
  }
}

export function isElementInstance(element) {
  return element instanceof MyElement
}

export function isElementTag(element, tag) {
  return element.element === tag
}
