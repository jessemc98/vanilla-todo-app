import MyElement from './MyElement'

export function assignPropsToElem(elem, props) {
  const propKeys = Object.keys(props)
  const isType = Object.prototype.toString

  propKeys.forEach(key => {
    /* if props[key] is an object deep assign props
       by doing recursive call to self */
    if (isType.call(props[key])  === '[object Object]') {

      // if elem[key] is not already an object set it to an empty one
      if (elem[key] !== null &&
        isType.call(elem[key])  !== '[object Object]') {
        elem[key] = {}
      }
      return assignPropsToElem(elem[key], props[key])
    }
    // if obj is an element and not an event listener eg 'onclick' setAttribute
    if (isType.call(elem.setAttribute) === '[object Function]' && key.slice(0, 2) !== 'on') {
      return elem.setAttribute(key, props[key])
    }

    elem[key] = props[key]
  })
}

// removes all children from a given DOM element
export function removeAllChildren(el) {
  while (el.firstChild) { el.removeChild(el.firstChild) }
}

export function createElement(element="div", props={}, children=[]) {
  const elem = new MyElement({ element, props, children })
  elem.updateChildren(children)
  elem.updateProps(props)

  return elem;
}
