Package.describe({
  summary: 'Simple and intuative useraccounts for react',
  version: '1.0.0',
  name: 'roygi:useraccounts-react',
  git: 'https://github.com/something/something.git'
})

Package.onUse(api => {
  api.versionsFrom('1.6.1')

  api.use('ecmascript')
  api.use('accounts-base')
  api.use('accounts-password')
  api.use('mdg:validated-method')

  api.mainModule('index.js', ['client', 'server'])
})
