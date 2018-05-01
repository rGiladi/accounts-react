import React              from 'react'
import { shallow, mount } from 'enzyme'
import { expect }         from 'chai'
import sinon              from 'sinon'
import BaseForm           from '../../../lib/AccountsReactComponent/baseForm'
import AccountsReact      from '../../../lib/AccountsReact'

const { config } = AccountsReact

describe('<BaseForm />', () => {

  // Mock props passed by each state component
  let props = {
    context: {},
    currentState: 'signIn',
    values: {},
    defaults: {
      ...config
    },
    onSubmit,
    errors: []
  }

  // Defined here so can be used with sinon.spy
  function onSubmit () {}

  // Reusable shallowed/mounted components.
  // Don't use those if a test need to to mounted with specific props
  const wrapperShallow = shallow(<BaseForm {...props} />)
  const wrapperMount   = mount(<BaseForm {...props} />)

  it('should render as a form element', () => {

    expect(wrapperShallow.type()).to.equal('form')
  })

  it('should render the title of the current state if defined', () => {

    expect(wrapperMount.find('h1').at(0)).to.have.length(1)
  })

  it('should not render the title of the current state if not defined', () => {
    props.defaults.texts.title[props.currentState] = '' // remove text for the title
    const wrapper = mount(<BaseForm {...props} />)

    expect(wrapper.find('h1').at(0)).to.have.length(0)
  })

  it('should render the fields of the current state', () => {
    const currentFieldsLength = config.fields[props.currentState].length

    expect(wrapperMount.find('.ar-fields').at(0).children()).to.have.length(currentFieldsLength)
  })

  it('should not render a reCaptcha div container if reCaptcha is disabled', () => {
    // showReCaptcha is disabled by default so we check that first.

    expect(wrapperMount.find('#recaptcha-container').at(0)).to.have.length(0)
  })

  it('should render a reCaptcha div container if reCaptcha is enabled', () => {
    props.defaults.showReCaptcha = true
    const wrapper = mount(<BaseForm {...props} />)

    expect(wrapper.find('#recaptcha-container').at(0)).to.have.length(1)
  })

  it('should render a submit a button', () => {

    expect(wrapperMount.find('button').at(0)).to.have.length(1)
  })

  it('should call the onSubmit function when the button is clicked', () => {
    const spy = sinon.spy()

    const wrapper = mount(<BaseForm {...props} onSubmit={spy} />)
    const button = wrapper.find('button')

    button.simulate('click')

    expect(spy.calledOnce).to.equal(true)
  })

  it('should render an empty div if there are no errors', () => {
    expect(wrapperMount.find('.ar-errors').children()).to.have.length(0)
  })

  it('should render a div with errors if there are any', () => {
    const error = { _id: '__globals', errStr: 'Global error message' }
    const wrapper = mount(<BaseForm {...props} errors={[error]} />)

    expect(wrapper.find('.ar-errors').children()).to.have.length(1)
  })
})
