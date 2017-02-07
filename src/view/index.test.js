import expect from 'expect';
import { assignPropsToElem, removeAllChildren, createElement, __RewireAPI__ as viewRewire } from './index'

describe("assignPropsToElem", function () {
  describe("takes two objects as arguments", function () {
    describe("for each 'key' in the secondObject", function () {
      it("if secondObject[key] is not an object sets the firstObject[key] to equal the secondObject[key]", function () {
        const first = {}
        const second = {
          one: 'one',
          two: 2,
          three: "1 2 3"
        }

        assignPropsToElem(first, second)

        expect(first).toEqual(second)
      });
      it("if secondObject[key] is an array sets the firstObject[key] to that array", function () {
        const list = [{}, {}, {}]
        const first = {}
        const second = { iAmList: list }

        assignPropsToElem(first, second)

        expect(first.iAmList).toBe(list)
      });
      describe("if secondObject[key] is an object it assigns the values from the secondObject[key] to firstObject[key]", function () {
        it("if firstObject[key] is an empty object", function () {
          const firstObject = { childObject: {}}
          const secondObject = { childObject: {value: 'none what-so-ever'} }

          assignPropsToElem(firstObject, secondObject)

          expect(firstObject.childObject)
            .toEqual(secondObject.childObject)
            .toNotBe(secondObject.childObject)
        });
        it("if firstObject[key] is an object with existing keys", function () {
          const firstObject = { childObject: {otherValue: 'a value'}}
          const secondObject = { childObject: {value: 'none what-so-ever'} }

          assignPropsToElem(firstObject, secondObject)

          expect(firstObject.childObject).toEqual({
            otherValue: 'a value',
            value: 'none what-so-ever'
          })
        });
        it("if firstObject[key] is undefined", function () {
          const firstObject = {}
          const secondObject = { childObject: {value: 'none what-so-ever'} }

          assignPropsToElem(firstObject, secondObject)

          expect(firstObject.childObject)
            .toEqual(secondObject.childObject)
            .toNotBe(secondObject.childObject)
        });
      });
      describe("if firstObject.setAttribute is a function and firstObject[key] is not an object", function () {
        it("calls firstObject.setAttribute(key, secondObject[key])", function () {
          const firstObject = { setAttribute: expect.createSpy()}
          const secondObject = { key: 'value' }

          assignPropsToElem(firstObject, secondObject)

          expect(firstObject.setAttribute)
            .toHaveBeenCalledWith('key', 'value')
        });
        it("sets firstObject[key] to secondObject[key] without calling firstObject.setAttribute if key starts with 'on'", function () {
          const firstObject = { setAttribute: expect.createSpy()}
          const secondObject = { onclick: function(){} }

          assignPropsToElem(firstObject, secondObject)

          expect(firstObject.setAttribute).toNotHaveBeenCalled()
          expect(firstObject.onclick).toBe(secondObject.onclick)
        });
        it("doesnt break if firstObject.setAttribute is defined but not a function", function () {
          const firstObject = { setAttribute: 'i am not a function'}
          const secondObject = { key: 'value' }

          assignPropsToElem(firstObject, secondObject)

          expect(firstObject.onclick).toBe(secondObject.onclick)
        });
      });
    });
  });
});
describe("removeAllChildren", function () {
  function createElementWithChildren(num) {
    const elem = document.createElement('div')
    for (var i = 0; i < num; i += 1) {
      elem.appendChild(
        document.createElement('div')
      )
    }
    return elem
  }
  it("removes all children from an element if it has multiple children", function () {
    const elem = createElementWithChildren(3)

    removeAllChildren(elem)

    expect(elem.children.length).toBe(0)
  });
  it("removes all children from an element if it one child", function () {
    const elem = createElementWithChildren(1)

    removeAllChildren(elem)

    expect(elem.children.length).toBe(0)
  });
  it("doesnt throw an error if element doesnt have any children", function () {
    const elem = createElementWithChildren(0)

    expect(() => removeAllChildren(elem)).toNotThrow()
  });
});
describe("createElement", function () {
  function mockMyElement(){
  };
  mockMyElement.prototype = {
    updateChildren: function(){},
    updateProps: function(){}
  }
  it("returns an instance of 'MyElement' ", function () {
    // mock MyElement constructor
    viewRewire.__Rewire__('MyElement', mockMyElement)

    const elem = createElement()
    expect(elem).toBeA(mockMyElement)
  });
  it("calls MyElement constructor with given args.element of 'div' by default", function () {
    // mock MyElement constructor
    const mock = { mockMyElement }
    const mySpy = expect.spyOn(mock, 'mockMyElement').andReturn(mockMyElement.prototype)
    viewRewire.__Rewire__('MyElement', mock.mockMyElement)

    const elem = createElement()

    const args = mySpy.calls[0].arguments[0]
    expect(args.element).toEqual('div')
  });
  it("calls MyElement constructor with given args.element equal to first argument to createElement", function () {
    // mock MyElement constructor
    const mySpy = expect.createSpy().andReturn(mockMyElement.prototype)
    viewRewire.__Rewire__('MyElement', mySpy)

    const elem = createElement('ul')

    const args = mySpy.calls[0].arguments[0]
    expect(args.element).toEqual('ul')
  });
  it("calls MyElement constructor with given args.props equal to second argument to createElement", function () {
    // mock MyElement constructor
    const mySpy = expect.createSpy().andReturn(mockMyElement.prototype)
    viewRewire.__Rewire__('MyElement', mySpy)

    const props = {}
    const elem = createElement(null, props)

    const args = mySpy.calls[0].arguments[0]
    expect(args.props).toEqual(props)
  });
  it("calls MyElement constructor with given args.children equal to third argument to createElement", function () {
    // mock MyElement constructor
    const mySpy = expect.createSpy().andReturn(mockMyElement.prototype)
    viewRewire.__Rewire__('MyElement', mySpy)

    const children = []
    const elem = createElement(null, null, children)

    const args = mySpy.calls[0].arguments[0]
    expect(args.children).toEqual(children)
  });
  it("calls updateChildren on instance before returning 'MyElement' instance", function () {
    // mock MyElement constructor
    const mockElement = {
      updateChildren: expect.createSpy(),
      updateProps: expect.createSpy()
    }
    const mySpy = expect.createSpy().andReturn(mockElement)
    viewRewire.__Rewire__('MyElement', mySpy)

    const children = []
    const elem = createElement(null, null, children)

    expect(mockElement.updateChildren).toHaveBeenCalledWith(children)
  });
  it("calls updateProps on instance before returning 'MyElement' instance", function () {
    // mock MyElement constructor
    const mockElement = {
      updateChildren: expect.createSpy(),
      updateProps: expect.createSpy()
    }
    const mySpy = expect.createSpy().andReturn(mockElement)
    viewRewire.__Rewire__('MyElement', mySpy)

    const props = {}
    const elem = createElement(null, props)

    expect(mockElement.updateProps).toHaveBeenCalledWith(props)
  });
});
