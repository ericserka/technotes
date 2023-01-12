import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const Welcome = () => {
  const { username, isManager, isAdmin } = useAuth()
  const isManagerOrAdmin = isManager || isAdmin
  return (
    <section className="welcome">
      <p>
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeStyle: 'long',
        }).format(new Date())}
      </p>

      <h1>Welcome {username}!</h1>

      <p>
        <Link to="/dash/notes">View techNotes</Link>
      </p>

      <p>
        <Link to="/dash/notes/new">Add new techNote</Link>
      </p>

      {isManagerOrAdmin && (
        <p>
          <Link to="/dash/users">View User Settings</Link>
        </p>
      )}

      {isManagerOrAdmin && (
        <p>
          <Link to="/dash/users/new">Add new User</Link>
        </p>
      )}
    </section>
  )
}
