// 🐨 you'll need to import React and ReactDOM up here

// 🐨 you'll also need to import the Logo component from './components/logo'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { Logo } from 'components/logo'
import React from 'react'
import ReactDOM from 'react-dom'

export const App = () => {
  const [openModal, setOpenModal] = React.useState('none')
  return (
    <div>
      <Logo width="80" height="80" />
      <title>Bookshelf</title>
      <div>
        <button onClick={() => setOpenModal('login') }>Login</button>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>
      <Dialog aria-label="Login Form" isOpen={openModal === 'login'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Login</h3>
      </Dialog>
      <Dialog aria-label="Register Form" isOpen={openModal === 'register'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Register</h3>
      </Dialog>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
)