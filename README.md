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
