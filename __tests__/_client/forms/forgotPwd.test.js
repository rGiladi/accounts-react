import React              from 'react'
import { shallow, mount } from 'enzyme'
import { expect }         from 'chai'
import sinon              from 'sinon'
import ForgotPwd          from '../../../lib/AccountsReactComponent/forgotPwd'
import AccountsReact      from '../../../lib/AccountsReact'

const { config } = AccountsReact

describe('ForgotPwd Form', () => {

  const getProps = (overrideDefaults = {}) => {
    return {
      currentState: 'forgotPwd',
      defaults: {
        ...config,
        ...overrideDefaults
      },
      changeState: () => {}
    }
  }

  const shallowWrapper = shallow(<ForgotPwd {...getProps()} />)
  const mountWrapper   = mount(<ForgotPwd {...getProps()} />)


  it('should render a form', () => {

    expect(mountWrapper.find('form').exists()).to.equal(true)
  })

  it('should display an emailSent message if email was sent successfully', () => {
    const instance = mountWrapper.instance()

    expect(mountWrapper.find('.email-sent').exists()).to.equal(false)
    instance.setState({ emailSent: true })
    mountWrapper.update()
    expect(mountWrapper.find('.email-sent').exists()).to.equal(true)
  })

  describe('onSubmit', () => {

    it('should catch validation errors if any', () => {
      const instance = mountWrapper.instance()

      expect(instance.state.errors.length).to.equal(0)
      instance.onSubmit()
      expect(instance.state.errors.length).to.not.equal(0)
    })

    it('should call sentPasswordResetLink if there are no validation errors', () => {
      const instance = mountWrapper.instance()
      const spy = sinon.spy(instance, 'sentPasswordResetLink')

      instance.setState({ email: 'valid@email.com' })
      instance.onSubmit()

      expect(spy.calledOnce).to.equal(true)
      spy.restore()
    })

    it('sentPasswordResetLink should call the onSubmit hook', (done) => {
      const wrapper = mount(<ForgotPwd {...getProps()} />)
      const instance = wrapper.instance()
      const spy = sinon.spy(instance.props.defaults, 'onSubmitHook')

      instance.setState({ email: 'valid@email.com' })
      instance.onSubmit()

      // onSubmitHook is called after server reponse
      setTimeout(() => {
        expect(spy.calledOnce).to.equal(true)
        done()
      }, 50)
    })
  })

  describe('links', () => {

    it('should render a signIn link if configured', () => {

      expect(mountWrapper.find('.signIn-link').exists()).to.equal(true)
    })

    it('should not render a signIn link if not configured', () => {
      const _props = getProps({ hideSignInLink: true })
      const wrapper = shallow(<ForgotPwd {..._props} />)

      expect(wrapper.find('.signIn-link').exists()).to.equal(false)
    })

    it('should call the redirect function when clicking on a link', () => {
      const instance = mountWrapper.instance()
      const spy = sinon.spy(instance, 'redirect')

      mountWrapper.find('.signIn-link').simulate('mouseDown')

      expect(spy.calledOnce).to.equal(true)
      spy.restore()
    })
  })
})
