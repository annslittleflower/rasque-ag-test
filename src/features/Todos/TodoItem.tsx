import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import styles from './todos.module.css';
import { useAuthContext } from "@/common/contexts/auth";
import type { Todo } from '@/common/types';

import { useUpdateTodoMutation, useDeleteTodoMutation} from './api'


const TodoSchema = z.object({
  completed: z.boolean(),
  title: z
    .string()
    .min(5)
    .max(120)
});

type TodoSchemaType = z.infer<typeof TodoSchema>;


const TodoItem = ({todo}: {todo: Todo}) => {
  const {currentUser} = useAuthContext()
  const updateTodoMutation = useUpdateTodoMutation()
  const deleteTodoMutation = useDeleteTodoMutation()
  const { register, handleSubmit, formState: { errors } } = 
    useForm<TodoSchemaType>({ resolver: zodResolver(TodoSchema) });
  
  const onSubmit = (data: TodoSchemaType) => {
    updateTodoMutation.mutate({
      userId: currentUser!.id,
      todoId: todo.id,
      completed: data.completed,
      title: data.title
    })
  };

  const onDeleteTodo = () => {
    deleteTodoMutation.mutate({
      userId: currentUser!.id,
      todoId: todo.id,
    })
  }


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['todo']}
    >

      <input
        className={styles['checkbox']}
        type='checkbox'
        defaultChecked={todo.completed}
        {...register("completed")}
      />

      <div>
        <input
          className={styles['text-input']}
          defaultValue={todo.title}
          {...register("title")}
        />
        {errors.title && <div>{errors.title.message}</div>}
      </div>

      <button
        className={styles['update-button']}
        disabled={updateTodoMutation.isPending}
        type='submit'
      >
        {updateTodoMutation.isPending ? 'wait...' : 'Update'} 
      </button>

      <button
        className={styles['update-button']}
        disabled={deleteTodoMutation.isPending}
        onClick={onDeleteTodo}
        type="button"
      >
        {deleteTodoMutation.isPending ? 'wait...' : 'Delete'} 
      </button>

    </form>
  )
}

export default TodoItem;