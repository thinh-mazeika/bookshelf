import VisuallyHidden from '@reach/visually-hidden'
import React from 'react'
import {CircleButton, Dialog} from './lib'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn && fn(...args))

const ModalContext = React.createContext()

const Modal = props => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <ModalContext.Provider
      value={[isOpen, setIsOpen]}
      {...props}
    ></ModalContext.Provider>
  )
}

const ModalDismissButton = ({children: child}) => {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

const ModalOpenButton = ({children: child}) => {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

const ModalContentsBase = props => {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      {...props}
    ></Dialog>
  )
}

const ModalContents = ({title, children, ...props}) => {
  return (
    <ModalContentsBase {...props}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}
export {Modal, ModalDismissButton, ModalContents, ModalOpenButton}
