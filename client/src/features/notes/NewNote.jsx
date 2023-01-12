import PulseLoader from 'react-spinners/PulseLoader'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { NewNoteForm } from './NewNoteForm'

export const NewNote = () => {
  const users = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  if (!users.length) return <PulseLoader color="#FFF" />

  return <NewNoteForm users={users} />
}
