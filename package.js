Package.describe({
  summary: 'Simple and intuative accounts view layer with react',
  version: '1.0.0',
  name: 'meteoreact:accounts',
  git: 'https://github.com/royGil/accounts-react'
})

Package.onUse(api => {
  api.versionsFrom('1.6.1')

  api.use([
    'ecmascript',
    'accounts-base',
    'accounts-password',
    'mdg:validated-method'
  ], ['client', 'server'])

  api.use('react-meteor-data')
  api.use('service-configuration', { weak: true })
  api.use('http', 'server')

  api.mainModule('index.js', ['client', 'server'])
})
