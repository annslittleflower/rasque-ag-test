import type { User } from "@/common/types/User"
import { Button } from "@/common/components/ui"

const UserCard = ({user}: {user: User}) => {
  console.log('single user', user)
  return (
    <div>
      <div>{user.email}</div>
      <Button>click me</Button>
    </div>
  )
}

export default UserCard