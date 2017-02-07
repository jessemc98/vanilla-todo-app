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

describe("hasGivenProps", function () {
  const elem = {props: {
    one: '1',
    two: '2',
    three: '3'
  }}
  it("returns true if element.props contains object with same shape as given props", function () {
    const props = {
      one: '1',
      two: '2',
      three: '3'
    }
    expect(utilities.hasGivenProps(elem, props)).toBeTruthy()
  });
  it("returns true if element.props contains all properties in given props object", function () {
    const props = {
      one: '1',
      two: '2'
    }
    expect(utilities.hasGivenProps(elem, props)).toBeTruthy()
  });
  it("returns false if element.props does not contain all properties in given props object", function () {
    const props = {
      one: '1',
      two: '2',
      four: '4'
    }
    expect(utilities.hasGivenProps(elem, props)).toBeFalsy()
  });
  it("returns false if element.props.key does not equal given props.key", function () {
    const props = {
      one: '2'
    }
    expect(utilities.hasGivenProps(elem, props)).toBeFalsy()
  });
});

describe("hasExactProps", function () {
  const elem = {props: {
    one: '1',
    two: '2',
    three: '3'
  }}
  it("returns false if element.props contains a key/value pair not contained in given props object", function () {
    const props = {
      one: '1',
      two: '2'
    }
    expect(utilities.hasExactProps(elem, props)).toBeFalsy()
  });
  it("returns false if given props object contains a key/value pair not contained in element.props", function () {
    const props = {
      one: '1',
      two: '2',
      three: '3',
      four: '4'
    }
    expect(utilities.hasExactProps(elem, props)).toBeFalsy()
  });
  it("returns false if given props object contains a propety value not contained in element.props", function () {
    const props = {
      one: '1',
      two: '2',
      three: '4'
    }
    expect(utilities.hasExactProps(elem, props)).toBeFalsy()
  });
  it("returns true if element.props is an object with the same shape as given props", function () {
    const props = {
      one: '1',
      two: '2',
      three: '3'
    }
    expect(utilities.hasExactProps(elem, props)).toBeTruthy()
  });
});
