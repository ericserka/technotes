import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../hooks/useAuth'

const GoHomeButton = ({ navigate, pathname }) => {
  return pathname !== '/dash' ? (
    <button
      className="dash-footer__button icon-button"
      title="Home"
      onClick={() => navigate('/dash')}
    >
      <FontAwesomeIcon icon={faHouse} />
    </button>
  ) : null
}

export const DashFooter = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { username, status } = useAuth()

  return (
    <footer className="dash-footer">
      <GoHomeButton navigate={navigate} pathname={pathname} />
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  )
}
