import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {App} from 'app'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import * as React from 'react'
import {queryCache} from 'react-query'
import {buildBook, buildUser} from 'test/generate'

afterEach(async () => {
  queryCache.clear()
  await auth.logout()
})

test('renders all the book information', async () => {
  window.localStorage.setItem(auth.localStorageKey, '__auth_provider_token__')
  const user = buildUser()
  const book = buildBook()
  const route = `book/${book.id}`
  window.history.pushState({}, 'Test Page', route)
  const originalFetch = window.fetch
  window.fetch = async (url, config) => {
    if (url.endsWith(`/bootstrap`)) {
      return {
        ok: true,
        json: async () => ({
          user: {...user, token: '__auth_provider_token__'},
          listItems: [],
        }),
      }
    } else if (url.endsWith(`/book/${book.id}`)) {
      return {
        ok: true,
        json: async () => ({
          book,
        }),
      }
    }
    return originalFetch(url, config)
  }
  render(<App />, {wrapper: AppProviders})
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('textbox', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})
