Package.describe({
  name: 'meteoreact:accounts',
  summary: 'Simple and intuative accounts view layer with react',
  version: '1.1.0',
  documentation: 'README.md',
  git: 'https://github.com/royGil/accounts-react'
})

Package.onUse(api => {
  api.versionsFrom('1.6.1')

  api.use([
    'ecmascript',
    'accounts-base',
    'accounts-password',
    'mdg:validated-method@1.1.0'
  ], ['client', 'server'])

  api.use('react-meteor-data@0.2.16', 'client')

  api.use('service-configuration', { weak: true })
  api.use('http', 'server')

  api.mainModule('index.js', ['client', 'server'])
})
