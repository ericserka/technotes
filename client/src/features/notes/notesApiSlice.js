import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const notesAdapter = createEntityAdapter({
  // not completed first
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
})

const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: '/notes',
        validateStatus: (response, result) => {
          // isError is added in the errorHandler middleware
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: (responseData) =>
        notesAdapter.setAll(
          initialState,
          responseData.map((r) => ({ ...r, id: r._id }))
        ),
      keepUnusedDataFor: 5,
      providesTags: (result, _error, _arg) => {
        return result?.ids
          ? [
              { type: 'Note', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'Note', id })),
            ]
          : [{ type: 'Note', id: 'LIST' }]
      },
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: '/notes',
        method: 'POST',
        body: initialNote,
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: '/notes',
        method: 'PATCH',
        body: initialNote,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Note', id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: '/notes',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Note', id: arg.id }],
    }),
  }),
})

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors((state) => selectNotesData(state) ?? initialState)
