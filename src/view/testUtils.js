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

export function hasGivenProps(element, props) {
  let hasProps = true
  // for every key in props
  Object.keys(props).forEach(key => {
    // check element.props[key] === props[key]
    if (element.props[key] !== props[key]) {
      return hasProps = false
    }
  })
  return hasProps
}

export function hasExactProps(element, props) {
  let hasProps = hasGivenProps(element, props)

  // check element.props doesnt contain a key/value pair not contained in props
  Object.keys(element.props).forEach(key => {
    if (props[key] !== element.props[key]) {
      hasProps = false
    }
  })

  return hasProps
}
