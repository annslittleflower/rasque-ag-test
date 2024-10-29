import type { User } from "@/common/types/User"
import { Button } from "@/common/components/ui"
import styles from './users.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@/common/contexts/auth";

const UserCard = ({user}: {user: User}) => {
  const navigate = useNavigate();
  const {setCurrentUser} = useAuthContext()

  const onUserSelect = () => {
    // console.log('user', user)
    setCurrentUser(user)
    navigate('/my-todos')
  }

  return (
    <div className={styles['user-row']}>
      <div>{user.email}</div>
      <Button
        className={styles['select-button']}
        onClick={onUserSelect}
      >
        login
      </Button>
    </div>
  )
}

export default UserCard