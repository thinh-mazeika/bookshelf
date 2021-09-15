import React from 'react'

const AuthContext = React.createContext()

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`userAuth must be used within a AuthContext provider`)
  }
  return context
}

export {AuthContext, useAuth}
