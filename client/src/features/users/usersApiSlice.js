import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      validateStatus: (_response, result) => !result.isError,
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((r) => ({ ...r, id: r._id }))
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      keepUnusedDataFor: 5,
      providesTags: (result, _error, _arg) => {
        return result?.ids
          ? [
              { type: 'User', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'User', id })),
            ]
          : [{ type: 'User', id: 'LIST' }]
      },
    }),
  }),
})

export const { useGetUsersQuery } = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState)
