import { Link } from 'react-router-dom'

export const Welcome = () => {
  return (
    <section className="welcome">
      <p>
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeStyle: 'long',
        }).format(new Date())}
      </p>

      <h1>Welcome!</h1>

      <p>
        <Link to="/dash/notes">View techNotes</Link>
      </p>

      <p>
        <Link to="/dash/users">View User Settings</Link>
      </p>
    </section>
  )
}
