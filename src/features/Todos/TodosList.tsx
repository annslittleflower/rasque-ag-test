import { useAuthContext } from "@/common/contexts/auth";

import {useQueryTodos} from './api'
import TodoItem from './TodoItem';
import CreateTodoForm from './CreateTodoForm';
import styles from './todos.module.css';


const TodosList = () => {
  const {currentUser} = useAuthContext()
  const {todos, isLoading} = useQueryTodos(currentUser?.id)

  if (isLoading) {
    return (
      <div>loading, please wait...</div>
    )
  }

  return (
    <div className={styles['todos-wrapper']}>
      <CreateTodoForm />
      {todos?.map(t => (
        <TodoItem todo={t} key={t.id} />
      ))}
    </div>
  )
}

export default TodosList;