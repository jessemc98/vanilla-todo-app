import * as utilities from './testUtils'
import MyElement from './MyElement'

describe("createElementMock", function () {
  it("returns an object", function () {
    expect(utilities.createElementMock()).toBeA(Object)
  });
  it("sets obj.element to the first argument given", function () {
    const elem = utilities.createElementMock('ul')

    expect(elem.element).toBe('ul')
  });
  it("sets obj.props to the second argument given", function () {
    const props = {iamprop: 'value'}
    const elem = utilities.createElementMock(null, props)

    expect(elem.props).toBe(props)
  });
  it("sets obj.children to the third argument given", function () {
    const children = [{iamchild: 'value'}]
    const elem = utilities.createElementMock(null, null, children)

    expect(elem.children).toBe(children)
  });
  describe("updateProps", function () {
    it("is a spy", function () {
      const elem = utilities.createElementMock()

      expect(elem.updateProps.name).toBe('spyLogic')
    });
    it("sets obj.children to equal given children", function () {
      const elem = utilities.createElementMock()
      const props = {iamchild: 'value'}

      elem.updateProps(props)

      expect(elem.props).toBe(props)
    });
  });
  describe("updateChildren", function () {
    it("is a spy", function () {
      const elem = utilities.createElementMock()

      expect(elem.updateChildren.name).toBe('spyLogic')
    });
    it("sets obj.children to equal given children", function () {
      const elem = utilities.createElementMock()
      const children = [{iamchild: 'value'}]

      elem.updateChildren(children)

      expect(elem.children).toBe(children)
    });
  });
});

describe("isElementInstance", function () {
  it("returns true if given a MyElement instance", function () {
    const elem = new MyElement()

    expect(utilities.isElementInstance(elem)).toBeTruthy()
  });
  it("returns false if given object is not a MyElement instance", function () {
    const elem = {}

    expect(utilities.isElementInstance(elem)).toBeFalsy()
  });
});

describe("isElementTag", function () {
  const elem = {element: 'div'}
  it("returns true if element was created with given tag", function () {
    expect(utilities.isElementTag(elem, 'div')).toBeTruthy()
  });
  it("returns false if element was not created with given tag", function () {
    expect(utilities.isElementTag(elem, 'ul')).toBeFalsy()
  });
});
