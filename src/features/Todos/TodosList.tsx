import styles from './todos.module.css';
import { useAuthContext } from "@/common/contexts/auth";

import {useQueryTodos, useUpdateTodoMutation} from './api'
import TodoItem from './TodoItem';

const TodosList = () => {
  const {currentUser} = useAuthContext()
  const {todos, isLoading} = useQueryTodos(currentUser?.id)
  const updateTodoMutation = useUpdateTodoMutation()

  if (isLoading) {
    return (
      <div>loading, please wait...</div>
    )
  }

  return (
    <div className={styles['todos-wrapper']}>
      {todos?.map(t => (
        <TodoItem todo={t} key={t.id} />
      ))}
    </div>
  )
}

export default TodosList;