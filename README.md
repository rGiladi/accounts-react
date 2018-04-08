# **Meteor Accounts UI for React**

`meteor add meteoreact:accounts`

* [Goals](#Goals)
* [Setup](#Setup)
  * [Styled versions](#Styled)
  * [Routing](#Routing)
  * [States](#States)
  * [Configuration](#Configuration)
    * [Hooks](#Hooks)
    * [ReCaptcha](#ReCaptcha)
    * [OAuth](#OAuth)
    * [Redirects](#Redirects)
    * [Custom Routes]('#Custom-Routes')
  * [Fields](#Fields)


<a name='Goals' />

## Goals

This package has multiple goals:

1. Be an almost identical fork of the great [useraccounts](https://github.com/meteor-useraccounts/core) package with the difference of being dependent only on react (no blaze/jquery/templating).

2. Allow an easy migration path for applications which already use the useraccounts package.

3. Make sense. The codebase should be understandable and easy to modify.

4. Be Actively maintained.


<a name='Setup' />

## Setup

<a name='Styled' />

#### Styled versions
Pick the package that suit your app. (Create it if it doesn't exist!)
* [meteoreact:unstyled](https://github.com/royGil/accounts-unstyled)
* [meteoreact:semantic-ui](https://github.com/royGil/accounts-semantic)

<a name='Routing' />

#### Routing
This package currently supports react-router.

<a name='React-Router-Example' />

##### React Router

If you want to use different paths for your routes see [custom routes](#Custom-Routes)

```javascript
import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { AccountsReactComponent } from 'meteor/meteoreact:accounts'

class Authentication extends Component {

  render () {
    const arState = this.arState

    return (
      <Switch>
        <Route exact path='/sign-in'          component={arState} />
        <Route exact path='/sign-up'          component={arState} />
        <Route exact path='/forgot-password'  component={arState} />
        <Route exact path='/change-password'  component={arState} />
        <Route exact path='/reset-password/:token' component={arState} />
      </Switch>
    )
  }

  arState = ({ match, history }) => {
    const { path, params } = match

    // Cant change password if not logged in.
    if (Meteor.userId() && path !== '/change-password') {
      return (<Redirect to='/' />)
    }

    return (
      <AccountsReactComponent
        history={history}
        route={path}
        token={params.token} // for the reset-password route
      />
    )
  }
}

export default Authentication
```

<a name='States' />

## States

When you render AccountsReactComponent there are 3 ways to make it render the form you want

* Pass a "state" prop
```javascript
  <AccountsReactComponent
    state='signUp'
  />
```

* Pass a "route" prop
```javascript
  <AccountsReactComponent
    route='/sign-up'
  />
```
You must pass a route that resolves to one of the possible states ([example](#Custom-Routes))

* Configure the "defaultState" key
```javascript
  AccountsReact.configure({
    defaultState: 'signUp'
  })
```

Currently available states are:

| State     | Details
| --------- | -------
| changePwd | Set a new password (Must be logged in)
| forgotPwd | Send a password reset email to an address
| resetPwd  | Set a new password (After reset, a "token" prop must be passed to AccountsReactComponent)
| signIn    | Login form
| signUp    | Registration form

<a name='Configuration' />

## Configuration

* Configuration should be the same on both ends. A good place to put the configuration file is `imports/both/startup` (and import it on both ends)

* Although it is valid to use different configurations for the client and the server you'd better avoid it in order to prevent possible unknown side-effects.
However, it's perfectly fine to set client configurations (like texts) only on the client and vice versa.

* Configuration must also run before Meteor's startup.

The following is a list with details about each configurable option.

| Option                      | Type     | Default   | Description |
| --------------------------- | -------- | --------- | ----------- |
|  **Behaviour**              |          |           |             |
|confirmPassword	            | Boolean	 | true	     | Ask the password twice for confirmation (only on sign up)
| defaultState                | String   | 'signIn'  | The state to use if no route has been declared (via route or prop)
| disableForgotPassword       | Boolean  | false     | Disable the option the call Accounts.forgotPassword
| enablePasswordChange        | Boolean  | true      | Make the changePwd state available, you can either set it to false or just don't set a route for it.
| focusFirstInput             | Boolean  | !Meteor.isCordova | Whether to focus the first input when a form is rendered.
| forbidClientAccountCreation | Boolean  | false     | Dont allow user creation on the client. If set to true - no sign up link/form will be available.
| lowercaseUsername           | Boolean  | false     | Transform username field to lowercase upon registration
| loginAfterSignup            | Boolean  | true      | Login automatically after sign up
| overrideLoginErrors         | Boolean  | true      | Show general error on failed login (without specifying which field was wrong)
| sendVerificationEmail       | Boolean  | false     | Send email verification after successful registration
| setDenyRules                | Boolean  | true      | Apply default deny rules on Meteor.users collection
| **Appearance**              |          |           |
| hideSignInLink	            | Boolean  | false	   | When set to true, asks to never show the link to the sign in page
| hideSignUpLink	            | Boolean	 | false	   | When set to true, asks to never show the link to the sign up page
| showForgotPasswordLink	    | Boolean	 | false	   | Specifies whether to display a link to the forgot password page/form
| showLabels                  |	Boolean	 | true	     | Specifies whether to display text labels above input elements
| showPlaceholders	          | Boolean	 | true	     | Specifies whether to display place-holder text inside input elements
| **Client side validation**  |          |           |
| continuousValidation	      | Boolean	 | false     | Validate input as the user type (on every "onChange" event)
| negativeValidation          | Boolean  | true      | Validate input on every "onBlur" event (only after first data insertion)
| [**Hooks**](#Hooks)         |          |           |  
| onLogoutHook                | Function |           | Triggered by calling AccountsReact.logout()
| onSubmitHook                | Function |           | A function to be called after a form submission. It takes 2 arguments (error, state).
| preSignupHook               | Function |           | A function to be called before calling the "createUser" method. It takes 2 arguments (password, info). Password is the raw password (before hashing), info is the object with all the data about the new user (you can modify it directly)
| showReCaptcha               | Boolean  | false     | Add reCaptcha mechanism to the sign up form ([details](#Recaptcha))
| [**OAuth**](#OAuth)         |          |
| [**Redirects**](#Redirects) |          |           |
| [**mapStateToRoute**](#Custom-Routes)  |           |           |

<a name='Hooks' />

### Hooks

```javascript
const onLogoutHook = () => {
  // A good use case will be to redirect the user somewhere
}

const onSubmitHook = (err, state) => {
  if (!err) {
    if (state === 'signIn') {
      //
    }
    if (state === 'signUp') {
      //
    }  
  }
}

const preSignupHook = (password, info) => {
  /*
    info structure might look like this
    {
      username,
      email,
      password (hashed),
      profile
    }
  */
}

AccountsReact.configure({
  onLogoutHook,
  onSubmitHook,
  preSignupHook
})
```

<a name='ReCaptcha' />

### ReCaptcha

First, obtain the necessary API keys from [here](https://www.google.com/recaptcha/admin#list)

Choose one of the following ways to configure reCaptcha settings (**Make sure your secretKey never reach the client!**)

* [**Meteor settings file**](https://docs.meteor.com/api/core.html#Meteor-settings)
```javascript
  "public": {
    "reCaptcha": {
      "siteKey": SITE KEY,
      // params
    }
  }
  "reCaptcha": {
    "secretKey": SECRET KEY
  }
```
```javascript
  AccountsReact.configure({
    showReCaptcha: true
  })
```

* **Configuration Object**
```javascript
  AccountsReact.configure({
    reCaptcha: {
      // params (except secretKey!)
    },
    showReCaptcha: true
  })
```
And on a server only file
```javascript
  AccountsReact.configure({
    reCaptcha: {
      secretKey: SECRET KEY
    }
  })
```

[List of available params (except callback)](https://developers.google.com/recaptcha/docs/display#render_param)

<a name='OAuth' />

### OAuth

You can specify whether to allow users to login with 3rd party service.
The only requirements are that you add the `service-configuration` package (`meteor add service-configuration`) and the relevant packages for the services you want (e.g `accounts-google`. `accounts-facebook`, etc...)

And configure the services you want to support (server side)

```javascript
  // google example
  ServiceConfiguration.configurations.update(
    { service: "google" },
    {
      $set: {
        "loginStyle": "popup",
        "clientId": "-",
        "secret": "-"
      }
    }
  )
```
You can also specify additional options for each service like so
```javascript
  AccountsReact.configure({
    oauth: {
      'google': {
        // options
      },
      'facebook': {
        // ...
      }
    }
  })
```
You can find the available options [here](https://docs.meteor.com/api/accounts.html#Meteor-loginWith%3CExternalService%3E)

<a name='Redirects' />

### Redirects

You can specify directly what happens when a user clicks on a link that normally will redirect him to a different form (e.g "Forgot your password?" link).

```javascript
  AccountsReact.configure({
    redirects: {
      toSignUp: () => {},
      toSignIn: () => {},
      toForgotPwd: () => {}
    }
  })
```

Note that if you set any of the above, its your responsibility to take the user to a different route.
If routing support (no internal state) is what you seek, you should probably just pass a "history" prop ([see example above](#React-Router-Example)) to AccountsReactComponent

<a name='Custom-Routes' />

### Custom Routes

Behind the scenes, AccountsReactComponent will use an object called `mapStateToRoute` to map different routes to the desired states.

The default object used is the following

```javascript
  mapStateToRoute: {
   signIn: '/sign-in',
   signUp: '/sign-up',
   forgotPwd: '/forgot-password',
   changePwd: '/change-password',
   resetPwd: '/reset-password'
  }
```

You can easily override it with

```javascript
  AccountsReact.configure({
    mapStateToRoute: {
      signIn: '/login',
      signUp: '/register'
      // ...
    }
  })
```

<a name='Fields' />

## Fields
