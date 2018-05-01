import React              from 'react'
import { shallow, mount } from 'enzyme'
import { expect }         from 'chai'
import sinon              from 'sinon'
import SignIn             from '../../../lib/AccountsReactComponent/signIn'
import AccountsReact      from '../../../lib/AccountsReact'

const { config } = AccountsReact

describe('SignIn Form', () => {

  const getProps = (overrideDefaults = {}) => {
    return {
      currentState: 'signIn',
      defaults: {
        ...config,
        ...overrideDefaults
      },
      changeState: () => {}
    }
  }

  const shallowWrapper = shallow(<SignIn {...getProps()} />)
  const mountWrapper   = mount(<SignIn {...getProps()} />)


  it('should render a form', () => {

    expect(mountWrapper.find('form').exists()).to.equal(true)
  })

  describe('onSubmit', () => {

    it('should catch validation errors if any', () => {
      const instance = mountWrapper.instance()

      expect(instance.state.errors.length).to.equal(0)
      instance.onSubmit()
      expect(instance.state.errors.length).to.not.equal(0)
    })
  })

  describe('links', () => {

    it('should render a signIn link if configured', () => {

      expect(mountWrapper.find('.signIn-link').exists()).to.equal(true)
    })

    it('should not render a signIn link if not configured', () => {
      const _props = getProps({ hideSignUpLink: true })
      const wrapper = shallow(<SignIn {..._props} />)

      expect(wrapper.find('.signInLink').exists()).to.equal(false)
    })

    it('should render a forgotPwd link if configured', () => {
      const _props = getProps({ showForgotPasswordLink: true })
      const wrapper = shallow(<SignIn {..._props} />)

      expect(wrapper.find('.forgotPwd-link').exists()).to.equal(true)
    })

    it('should not render a forgotPwd link if not configured', () => {

      expect(mountWrapper.find('.forgotPwd-link').exists()).to.equal(false)
    })

    it('should call the redirect function when clicking on the links', () => {
      const _props = getProps({ showForgotPasswordLink: true })
      const wrapper = mount(<SignIn {..._props} />)
      const instance = wrapper.instance()
      const spy = sinon.spy(instance, 'redirect')

      wrapper.find('.signIn-link').simulate('mouseDown')
      wrapper.find('.forgotPwd-link').simulate('mouseDown')

      expect(spy.calledTwice).to.equal(true)
    })
  })
})
