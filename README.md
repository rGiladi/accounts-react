# ** This package is not maintained anymore **

# **Meteor Accounts UI for React**

`meteor add meteoreact:accounts`

**A huge credit goes to the [`useraccounts`](https://github.com/meteor-useraccounts/core) package and the people behind it.**

This package has been created to be used in one of my projects which was purely React.
Although the original useraccounts package [can be used](https://www.meteor.com/tutorials/react/adding-user-accounts) in react, it depends on blaze and jquery which are both useless when developing with react.

Right now, you might find that there are several features which hasn't been included in this package. Please open an issue if you need a feature and think it will benefit the community.

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
  * [Custom routes]('#Custom-Routes')
  * [Fields](#Fields)
    * [Add fields](#Add-Fields)
    * [Remove fields](#Remove-Fields)
    * [Edit fields](#Edit-Fields)
  * [Texts](#Texts)
* [Override Styling](#Override-Styling)
* [Contributing](#Contributing)


<a name='Goals' />

## Goals

This package has multiple goals:

1. Be an almost identical fork of the great [useraccounts](https://github.com/meteor-useraccounts/core) package with the difference of being dependent only on react (no blaze/jquery/templating).

2. Allow an easy migration path for applications which already use the useraccounts package.

3. Make sense. The codebase should be understandable and easy to modify.

4. Stay actively maintained.


<a name='Setup' />

## Setup
**Important** - Please note that you must provide a set of components either by using one of the versions below or [by adding your own](#Override-Styling)

Also note that it's mandatory to call `AccountsReact.configure` on both client/server even with an empty object!

<a name='Styled' />

### Styled versions
Pick the package that suit your app. ([Create it if it doesn't exist!](https://github.com/royGil/accounts-react/issues/6))
* [meteoreact:accounts-unstyled](https://github.com/royGil/accounts-unstyled)
* [meteoreact:accounts-semantic](https://github.com/royGil/accounts-semantic)


*If you've created a package and want to include it here, please open a pull request with a link to the package on [atmoshperejs](https://atmospherejs.com/)*

<a name='Routing' />

### Routing
This package currently supports react-router.

<a name='React-Router-Example' />

#### React Router

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
        <Route exact path='/resend-verification'   component={arState} />
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

### States

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
| resendVerification | Resend email with verification link

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
| sendVerificationEmail       | Boolean  | true      | Send email verification after successful registration
| setDenyRules                | Boolean  | true      | Apply default deny rules on Meteor.users collection
| disableConfigureLoginService | Boolean | true      | Disable `configureLoginService()` insecure method
| **Appearance**              |          |           |
| hideSignInLink	            | Boolean  | false	   | When set to true, asks to never show the link to the sign in page
| hideSignUpLink	            | Boolean	 | false	   | When set to true, asks to never show the link to the sign up page
| showForgotPasswordLink	    | Boolean	 | false	   | Specifies whether to display a link to the forgot password page/form
| showResendVerificationLink  | Boolean	 | false	   | Specifies whether to display a link to the resend verification page/form
| showLabels                  |	Boolean	 | true	     | Specifies whether to display text labels above input elements
| showPlaceholders	          | Boolean	 | true	     | Specifies whether to display place-holder text inside input elements
| **Client side validation**  |          |           |
| continuousValidation	      | Boolean	 | false     | Validate input as the user type (on every "onChange" event)
| negativeValidation          | Boolean  | true      | Validate input on every "onBlur" event (only after first data insertion)
| [**Hooks**](#Hooks)         |          |           |  
| onLoginHook                 | Function | A function to be called after a successful login
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
   resetPwd: '/reset-password',
   resendVerification: '/resend-verification'
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

### Fields

Form fields are defined as objects in an array and can be easily customized to your needs.
You can edit, add or remove fields directly or via one of the built in functions (addField, removeField ...)

The supported properties are listed in the following table.
**Note that you can also specify your own properties**

| Property             | Type             | Required |                 Description
| -------------------- | -----------------| -------- | ----------------------------------------  |
| _id                  | String           |    X     | A unique field's id/name (internal use only) to be also used  as attribute name into Meteor.user().profile in case it identifies an additional sign up field. Usually all lowercase letters
| type                 | String           |    X     | Specifies the input element type. At the moment supported inputs are: password, email, text, select, radio
| displayName          | String           |          | The field's label text. The text label is shown only if showLabels options is set to true
| errStr               | String           |          | Error message to display in case of a false validation.
| exclude              | Boolean          |          | (On sign up only) If set to true the field will be excluded from the new user object
| func                 | Function         |          | Specify a custom function for validation. (example below)
| minLength            | Integer          |          | If specified, requires the content of the field to be at least `minLength` characters
| maxLength            | Integer          |          | If specified, require the content of the field to be at most maxLength characters.
| options              | [Object]         |          | In case type property is set to "select" or "radio", this field must be set to an array of options to be used
| placeholder          | String           |          | The field's (input) placeholder text. The place-holder is shown only if showPlaceholders option is set to true
| re                   | RegExp           |          | Specify a regular expression to validate against. (example below)
| required             | Boolean          |          | If set to true the corresponding field cannot be left blank
| autocomplete         | String           |          | `<input>` autocomplete tag value

**The original user accounts package supports several more properties. Pull requests are more then welcome!**

You can see each state default fields [here](https://github.com/royGil/accounts-react/blob/master/lib/AccountsReact.js#L78)

Examples of **func** and **re** properties.

[func](https://github.com/royGil/accounts-react/blob/master/lib/AccountsReact.js#L137)
```javascript
{
  _id: 'confirmPassword',
  displayName: 'Confirm password',
  type: 'password',
  placeholder: 'Re-enter your password',
  errStr: 'Password doesn\'t match',
  exclude: true,
  func: (fields, fieldObj, value, model, errorsArray) => {
    /*
      fields:      Current form fields array
      fieldObj:    This object
      value:       This field's value
      model:       Current form values object
      errorsArray: Current form errors array
    */

    if (!this.config.confirmPassword) {
      return true
    }

    // check that passwords match
    const { password } = model
    const { _id, errStr } = fieldObj

    if (typeof password === 'string') {
      if (!value || (value !== password)) {
        errorsArray.push({ _id, errStr })
        return
      }
    }

    return true
  }
}
```

[re](https://github.com/royGil/accounts-react/blob/master/lib/AccountsReact.js#L118)
```javascript
{
  _id: 'email',
  displayName: 'Email',
  placeholder: 'Enter your email',
  re: regExp.Email,
  errStr: 'Please enter a valid email'
}
```

<a name='Add-Fields' />

#### Add Fields
To add additional fields, you must specify the state you want to mutate, and an array of object(s) containing your field's data.

```javascript
import { AccountsReact } from 'meteor/meteoreact:accounts'

AccountsReact.addFields('signUp', [
  {
    _id: 'fullName',
    displayName: 'Full Name',
    placeholder: 'Enter your full name',
    minLength: 4,
    maxLength: 70,
    required: true,
    errStr: 'This field must contain at least 4 characters and no more than 70',
    autocomplete: 'name'
  }
])
```

<a name='Remove-Fields' />

#### Remove Fields
This functionality is not implemented yet, You can [help](https://github.com/royGil/accounts-react/issues/3)

<a name='Edit-Fields' />

#### Edit Fields
This functionality is not implemented yet, You can [help](https://github.com/royGil/accounts-react/issues/4)


<a name='Texts' />

### Texts

Configuring the text to be used by the forms is done via the `AccountsReact.configure` function.

The default configuration object contains a `texts` property which you can view [here](https://github.com/royGil/accounts-react/blob/master/lib/AccountsReact.js#L206)

Here is an example of how to override those

```javascript
import { AccountsReact } from 'meteor/meteoreact:accounts'
AccountsReact.configure({
  texts: {
    button: {
      changedPwd: 'Change your password!'
    },
    info: {
      emailSent: 'Check your inbox!'
    },
    loginForbiddenMessage: 'The username or password is incorrect'
  }
})
```

<a name='Override-Styling' />

## Override Styling

Lets say that you are using `semantic-ui-react` and `meteoreact:accounts-semantic` and want to add a simple description below each input field.

Instead of copying the full package into your local *packages* folder and directly change the code (which is totally legitimate and will work just fine!) you can look at the source code of that package and copy only the implementation of the input field into your project.

From there you can edit (almost*) anything you'd like. Save the file when you are done and then add it like so:

```javascript
import { AccountsReact } from 'meteor/meteoreact:accounts'
import YourInputField from '...'

AccountsReact.style({
    InputField: YourInputField
})
```

You can override any of the following fields

[`InputField`](https://github.com/royGil/accounts-semantic/blob/master/Input.js),
[`SelectField`](https://github.com/royGil/accounts-semantic/blob/master/Select.js),
[`RadioField`](https://github.com/royGil/accounts-semantic/blob/master/Radio.js),
[`SubmitField`](https://github.com/royGil/accounts-semantic/blob/master/Submit.js),
[`TitleField`](https://github.com/royGil/accounts-semantic/blob/master/Title.js),
[`ErrorsField`](https://github.com/royGil/accounts-semantic/blob/master/Errors.js)

*Dont edit or remove anything that might break the core functionality (like the onChange handlers for example)

<a name='Contributing' />

## Contributing

1. Fork this repo

2. `git clone https://github.com/royGil/accounts-react-demo && cd accounts-react-demo`

3. `git clone https://github.com/{your_account}/accounts-react packages/meteoreact:accounts`
4. `meteor npm install`

From this point you can make changes to the package folder and run the demo app to see them.

_Note that if you want to test anything related to the social buttons you'll have to include a proper **settings.json** file ([see example below](#settings.json-example))_

To commit your changes

1. `cd packages/meteoreact:accounts`

2. `npm install` (so you can run tests)

3. `npm test` and make sure there are no errors

4. Push your changes (**from within the "meteoreact:accounts" folder!**) and create a PR from your fork on github.

I'll appreciate if you write tests for your new commit but its not a requirement.

-------------

<a name='settings.json-example' />

```javascript
{
  "services": {
    "google": {
      "loginStyle": "popup",
      "clientId": "XXX",
      "secret": "XXX"
    },
    "facebook": {
      "loginStyle": "popup",
      "appId": "XXX",
      "secret": "XXX"
    },
    "github": {
      "loginStyle": "popup",
      "clientId": "XXX",
      "secret": "XXX"
    },
    "twitter": {
      "loginStyle": "popup",
      "consumerKey": "XXX",
      "secret": "XXX"
    }
  }
}

```
