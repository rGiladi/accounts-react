import React              from 'react'
import { shallow, mount } from 'enzyme'
import { expect }         from 'chai'
import sinon              from 'sinon'
import SignUp             from '../../../lib/AccountsReactComponent/signUp'
import AccountsReact      from '../../../lib/AccountsReact'

const { config } = AccountsReact

describe('SignUp Form', () => {

  const getProps = (overrideDefaults = {}) => {
    return {
      currentState: 'signUp',
      defaults: {
        ...config,
        ...overrideDefaults
      },
      changeState: () => {}
    }
  }

  const shallowWrapper = shallow(<SignUp {...getProps()} />)
  const mountWrapper   = mount(<SignUp {...getProps()} />)


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
      const _props = getProps({ hideSignInLink: true })
      const wrapper = mount(<SignUp {..._props} />)

      expect(wrapper.find('.signIn-link').exists()).to.equal(false)
    })

    it('should call the redirect function when clicking on a link', () => {
      const instance = mountWrapper.instance()
      const spy = sinon.spy(instance, 'redirect')

      mountWrapper.find('.signIn-link').simulate('mouseDown')

      expect(spy.calledOnce).to.equal(true)
    })
  })
})
