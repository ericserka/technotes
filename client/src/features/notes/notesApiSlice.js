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
      query: () => '/notes',
      validateStatus: (_response, result) => !result.isError,
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((r) => ({ ...r, id: r._id }))
        return notesAdapter.setAll(initialState, loadedNotes)
      },
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
  }),
})

export const { useGetNotesQuery } = notesApiSlice

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
