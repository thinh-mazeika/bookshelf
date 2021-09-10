/** @jsx jsx */
import {jsx} from '@emotion/core'
import Tooltip from '@reach/tooltip'
import React from 'react'
import {FaSearch, FaTimes} from 'react-icons/fa'
import './bootstrap'
import {BookRow} from './components/book-row'
import {BookListUL, Input, Spinner} from './components/lib'
import * as colors from './styles/colors'
import {client} from './utils/api-client'

function DiscoverBooksScreen() {
  const [status, setStatus] = React.useState('idle')

  const [data, setData] = React.useState(null)
  const [queried, setQueried] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [error, setError] = React.useState()

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError = status === 'error'

  React.useEffect(() => {
    if (!queried) {
      return
    }
    setStatus('loading')
    client(`books?query=${encodeURIComponent(query)}`).then(
      response => {
        setData(response)
        setStatus('success')
        setQueried(true)
      },
      errorResponse => {
        setError(errorResponse)
        setStatus('error')
      },
    )
  }, [queried, query])

  function handleSearchSubmit(event) {
    event.preventDefault()

    setQueried(true)
    setQuery(event.target['search'].value)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>
      {isError ? (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
