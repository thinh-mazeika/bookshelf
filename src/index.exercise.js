import {AppProviders} from 'context/index'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {App} from './app'
import './bootstrap'
import {loadDevTools} from './dev-tools/load'

loadDevTools(() => {
  ReactDOM.render(
    <AppProviders>
      <App />
    </AppProviders>,
    document.getElementById('root'),
  )
})
