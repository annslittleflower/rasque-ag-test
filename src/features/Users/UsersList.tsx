import styles from './users.module.css';
import useQueryUsers from './useQueryUsers'
import UserCard from './UserCard'

const UsersList = () => {
  const {users, isLoading} = useQueryUsers()
  console.log('users', users)

  if (isLoading) {
    return (
      <div>loading, please wait...</div>
    )
  }

  return (
    <div className={styles['users-wrapper']}>
      {users?.map(u => (
        <UserCard user={u} key={u.id} />
      ))}
    </div>
  )
}

export default UsersList;