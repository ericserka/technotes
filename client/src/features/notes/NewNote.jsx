import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import { NewNoteForm } from './NewNoteForm'

export const NewNote = () => {
  const users = useSelector(selectAllUsers)

  if (!users.length) return <p>Not Currently Available</p>

  return <NewNoteForm users={users} />
}
