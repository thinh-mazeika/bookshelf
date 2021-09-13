// 💯 Make hooks
import bookPlaceholderSvg from 'assets/book-placeholder.svg'
import {useQuery} from 'react-query'
import {queryCache} from 'react-query/dist/react-query.development'
import {client} from './api-client'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchConfig = (query, user) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  config: {
    onSuccess(books) {
      for (const book of books) {
        setQueryDataForBook(book)
      }
    },
  },
})

function useBook(bookId, user) {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })
  return data ?? loadingBook
}

function useBookSearch(query, user) {
  const result = useQuery(getBookSearchConfig(query, user))
  return {...result, books: result.data ?? loadingBooks}
}

// 💯 Prefetch the book search query
async function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch')
  await queryCache.prefetchQuery(getBookSearchConfig('', user))
}

// 💯 Add books to the query cache
// export * from './books.extra-6'

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}, book])
}

export {useBookSearch, useBook, refetchBookSearchQuery, setQueryDataForBook}
