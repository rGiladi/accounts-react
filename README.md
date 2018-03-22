# **Meteor Accounts UI for React**

* `meteor add roygi:useraccounts-react`

### Configuration

* Configuration should be the same on both ends. A good place to put the file is `imports/both/startup`.

* Although it is valid to use different configurations for the client and the server you'd better avoid it in order to prevent possible unknown side-effects.
However, it's perfectly fine to set client configurations (like texts) only on the client and vice versa.

* Configuration must also run before Meteor's startup, so dont put it inside Meteor.startup function

```javascript
  import { AccountsReact } from 'meteor/roygi:useraccounts-react'

  AccountsReact.configure({
    hideSignInLink: true,
    hideSignUpLink: true,
    validateOnChange: true,
    texts: {
      button: {
        signUp: 'Register'
      },
      title: {
        signUp: 'Create Your Account'
      },
      links: {
        toSignUp: 'Don\'t have an account? Register'
      }

      // ...
    }
  })
```

### Styling Components

* You can either override components manually

```javascript
  import { AccountsReact } from 'meteor/roygi:useraccounts-react'

  AccountsReact.style({
    ButtonField: <YourCustomButton />,
    InputField: <YourCustomInput />

    // ...
  })
```

* Pick a theme based on your favourite library

  * Semantic UI `meteor add roygi:useraccounts-semantic`


* Develop your own theme ([see guidelines](#theme-developing))

### Local Development

Wanna help or just play abit with the code? Here are several steps you can take for setting up a good development setup.

There are two setup options here:

1. Using [meteor-client-bundler](https://github.com/Urigo/meteor-client-bundler) so you can develop client stuff easily with webpack and [react-hot-loader](https://github.com/gaearon/react-hot-loader).

  * `git clone https://github.com/royGil/useraccounts-react`
  * `cd useraccounts-react && npm install`
  * `npm link`
  * `cd dev && npm install`
  * `npm install -g meteor-client-bundler`
  * `meteor-client bundle -s server`
  * `npm run start` (or `npm run server` and `npm run client` on different terminals)

  Here, useraccounts gets imported as an npm package from meteor's `imports` folder on both ends. The advantage here is that the client is separated from the server so updates to the local lib folder wont force the browser to refresh on each change (but instead use webpack and react-hot-loader to push changes).

2. Using meteor's `packages` folder.

  * `git clone https://github.com/royGil/useraccounts-react && mv useraccounts-react roygi:useraccoutns-react`
  * Put the cloned folder in the `packages` folder inside any meteor project
  * `meteor add roygi:useraccoutns-react`

  Just edit the files inside that package folder and meteor will just reload on every change

If you want to add a feature or anything else please follow the `contributing` section
