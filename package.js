Package.describe({
  name: 'meteoreact:accounts',
  summary: 'Simple and intuative accounts view layer with react',
  version: '1.2.4',
  documentation: 'README.md',
  git: 'https://github.com/royGil/accounts-react'
})

Package.onUse(api => {
  api.versionsFrom('1.6.1')

  api.use([
    'ecmascript',
    'accounts-base',
    'accounts-password',
    'mdg:validated-method@1.1.0',
    'check'
  ], ['client', 'server'])

  api.use('react-meteor-data@0.2.16', 'client')

  api.use('service-configuration', { weak: true })
  api.use('http', 'server')

  api.mainModule('index.js', ['client', 'server'])
})

Package.onTest(api => {
  api.use([
    'ecmascript',
    'accounts-base',
    'accounts-password',
    'meteoreact:accounts',
    'meteoreact:accounts-unstyled',
    'mdg:validated-method@1.1.0',
    'react-meteor-data@0.2.16',
    'cultofcoders:mocha'
  ])

  api.use('http', 'server')

  api.mainModule('__tests__/client.test.js', 'client')
  api.mainModule('__tests__/server.test.js', 'server')
})
