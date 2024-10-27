import styles from './todos.module.css';
import { useAuthContext } from "@/common/contexts/auth";

import {useQueryTodos, useUpdateTodoMutation} from './api'

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
    <div 
    // className={styles['todos-wrapper']}
    >
      {todos?.map(t => (
        <div key={t.id}>
          {t.id} &nbsp;
          {t.completed.toString()} &nbsp;
          {t.title} &nbsp;
          {t.userId}
        </div>
      ))}

      <button
        onClick={() => {
          updateTodoMutation.mutate({ userId: currentUser!.id, todoId: todos![0].id })
        }}
      >
        Update First Todo
      </button>
    </div>
  )
}

export default TodosList;