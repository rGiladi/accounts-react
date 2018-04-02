# **Meteor Accounts UI for React**

`meteor add meteoreact:accounts`

* [Goals](#Goals)
* [Setup](#Setup)
  * [Styled versions](#Styled)
  * [Routing](#Routing)
  * [Configuration](#Configuration)


<a name='Goals' />

## Goals

This package has multiple goals:

1. Be an almost identical fork of the great [useraccounts](https://github.com/meteor-useraccounts/core) package with the difference of being dependent only on react (no blaze/jquery/templating).

2. Allow an easy migration path for applications which already use the useraccounts package.

3. Make sense. The code should be understandable, no huge files with lots of conditions and unrelated contexts.

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
This package currently supports react-router (should also work with flow-router but it has not been checked yet.)

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

    if (Meteor.userId() && path !== '/change-password') {
      return (<Redirect to='/' />)
    }

    return (
      <AccountsReactComponent
        history={history}
        route={path}
        token={params.token}
      />
    )
  }
}

export default Authentication
```

##### React Router

<a name='Configuration' />
## Configuration

* Configuration should be the same on both ends. A good place to put the file is `imports/both/startup`.

* Although it is valid to use different configurations for the client and the server you'd better avoid it in order to prevent possible unknown side-effects.
However, it's perfectly fine to set client configurations (like texts) only on the client and vice versa.

* Configuration must also run before Meteor's startup, so dont put it inside Meteor.startup function
