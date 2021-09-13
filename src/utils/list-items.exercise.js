import {queryCache, useMutation, useQuery} from 'react-query'
import {client} from './api-client'
import {setQueryDataForBook} from './books.exercise'

// 💯 Make hooks
function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
    config: {
      // 💯 Add books to the query cache
      onSuccess(listItems) {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })
  return listItems ?? []
}

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem(user, options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      // 💯 Add optimistic updates and recovery
      onMutate(newItem) {
        const previousItem = queryCache.getQueryData('list-items')
        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })
        return () => queryCache.setQueryData('list-items', previousItem)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useRemoveListItem(user, options) {
  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {...defaultMutationOptions, ...options},
  )
}

function useCreateListItem(user, options) {
  return useMutation(
    ({bookId}) =>
      client(`list-items`, {method: 'POST', token: user.token, data: {bookId}}),
    {...defaultMutationOptions, ...options},
  )
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
