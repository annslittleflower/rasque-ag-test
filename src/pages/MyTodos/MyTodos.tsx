import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@/common/contexts/auth";
import { TodosList } from "@/features";


const MyTodos =  () => {
  const navigate = useNavigate();
  const {currentUser} = useAuthContext()

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
    }
  }, [currentUser])

  return (
    <div>
      <h2>MyTodos</h2>
      <TodosList />
    </div>
  );
}

export default MyTodos
