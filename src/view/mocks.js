import expect from 'expect'

export function createElementMock(element, props, children) {
  return expect.createSpy().andReturn({
    element,
    props,
    children,
    updateProps: expect.createSpy().andCall(
      (newProps) => this.props = newProps
    ),
    updateChildren: expect.createSpy().andCall(
      (newChildren) => this.children = children
    )
  })
}
