import PulseLoader from 'react-spinners/PulseLoader'
import { useAuth } from '../../hooks/useAuth'
import { MemoizedNote } from './Note'
import { useGetNotesQuery } from './notesApiSlice'

export const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth()
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery('notesList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content

  if (isLoading) content = <PulseLoader color="#FFF" />

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = notes

    const filteredIds =
      isManager || isAdmin
        ? ids
        : ids.filter((noteId) => entities[noteId].username === username)

    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <MemoizedNote key={noteId} noteId={noteId} />)

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    )
  }

  return content
}
