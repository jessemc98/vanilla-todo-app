import MyElement from './MyElement'

// mock imported assignPropsToElem function with a noop
MyElement.__Rewire__('assignPropsToElem', () => {})

describe("MyElement constructor", function () {
  describe("returns object with properties", function () {
    describe("'node'", function () {
      it("is a DOM element", function () {
        const elem = new MyElement();

        expect(elem.node.tagName).toBeTruthy()
      });
      it(`is set to be an element with the tagName set to args.element`, function () {
        const tagName = 'ul'
        const elem = new MyElement({ element: tagName });

        expect(elem.node.tagName).toBe('UL')
      });
    });
    describe("'element'", function () {
      it("is set to args.element", function () {
        const element = 'table'
        const elem = new MyElement({ element })

        expect(elem.element).toEqual(element)
      });
    });
    describe("'props'", function () {
      it("is set to args.props", function () {
        const props = { one: 1, two: 2 }
        const elem = new MyElement({ props })

        expect(elem.props).toEqual(props)
      });
    });
    describe("'children'", function () {
      it("is set to the third argument passed to element", function () {
        const children = []
        const elem = new MyElement({ children })

        expect(elem.children).toEqual(children)
      });
    });
  });
  describe("prototype", function () {
    describe("updateProps", function () {
      const { updateProps } = MyElement.prototype
      it("sets an objects 'props' property to the given props", function () {
        const object = {props: { width: '15px'}}
        const newProps = { height: '100px'}

        updateProps.call(object, newProps)

        expect(object.props).toBe(newProps)
      });
      it("calls 'assignPropsToElem' with objects 'node' property", function () {
        const node = {type: 'node'}
        const object = { node }
        const newProps = { height: '2em' }

        // stub imported assignPropsToElem function
        const myStub = expect.createSpy()
        MyElement.__Rewire__('assignPropsToElem', myStub)

        updateProps.call(object, newProps)

        expect(myStub).toHaveBeenCalledWith(node, newProps)
      });
    });
    describe("updateChildren", function () {
      const { updateChildren } = MyElement.prototype
      const mockChildren = [
        {node: {appendChild: function(){}}}
      ]
      it("calls 'removeAllChildren' with objects 'node' property", function () {
        const object = {node: {appendChild: () => {}}}
        const myStub = expect.createSpy()
        MyElement.__Rewire__('removeAllChildren', myStub)

        updateChildren.call(object, [])

        expect(myStub).toHaveBeenCalledWith(object.node)
      });
      it("sets object.children to the passed argument", function () {
        const object = {node: {appendChild: () => {}}}
        const children = ['one', 'two', 'three']

        updateChildren.call(object, children)

        expect(object.children).toBe(children)
      });
      describe("for each 'child' in the given array", function () {
        describe("if it is a string type", function () {
          it("document.createTextNode is called with the given string", function () {
            const object = {node: {appendChild: () => {}}}
            const children = ['one']

            // spy on document.createTextNode
            const mySpy = expect.spyOn(document, 'createTextNode')
                            .andCallThrough()

            updateChildren.call(object, children)

            expect(mySpy).toHaveBeenCalledWith('one')
            mySpy.restore()
          });
          it(`returns the value of calling 'object.node.appendChild' with the
              return value of document.createTextNode(child)`, function () {
            const appendChild = expect.createSpy()
            const object = {node: { appendChild }}
            const children = ['one']
            const expectedReturn = 'i am to be returned'
            // mock document.createTextNode and expectedReturn
            const createTextNode = expect
              .spyOn(document, 'createTextNode')
              .andReturn(expectedReturn)

            updateChildren.call(object, children)

            expect(appendChild).toHaveBeenCalledWith(expectedReturn)
            createTextNode.restore()
          });
        });
        describe("if it is a MyElement object", function () {
          it("should call 'object.node.appendChild' with 'child.node'", function () {
            const appendChild = expect.createSpy()
            const object = {node: { appendChild }}
            const children = [{node: 'i am a node'}]

            updateChildren.call(object, children)

            expect(appendChild).toHaveBeenCalledWith(children[0].node)
          });
        });
      });
    });
  });
});
