Package.describe({
  summary: 'Simple and intuative accounts view layer with react',
  version: '1.0.0',
  name: 'roygi:useraccounts-react',
  git: 'https://github.com/royGil/useraccounts-react.git'
})

Package.onUse(api => {
  api.versionsFrom('1.6.1')

  api.use([
    'ecmascript',
    'accounts-base',
    'accounts-password',
    'mdg:validated-method'
  ], ['client', 'server'])

  api.use('http', 'server')

  api.mainModule('index.js', ['client', 'server'])
})
