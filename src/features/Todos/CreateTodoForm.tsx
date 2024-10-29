import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import styles from './todos.module.css';
import { useAuthContext } from "@/common/contexts/auth";
import { classnames } from "@/common/utils/classnames";

import { useCreateTodoMutation} from './api'


const TodoSchema = z.object({
  completed: z.boolean(),
  title: z
    .string()
    .min(5)
    .max(120)
});

type TodoSchemaType = z.infer<typeof TodoSchema>;


const CreateTodoForm = () => {
  const {currentUser} = useAuthContext()
  const createTodoMutation = useCreateTodoMutation()

  const { register, handleSubmit, reset, formState: { errors } } = 
    useForm<TodoSchemaType>({ resolver: zodResolver(TodoSchema) });
  
  const onSubmit = (data: TodoSchemaType) => {
    createTodoMutation.mutate({
      userId: currentUser!.id,
      completed: data.completed,
      title: data.title
    }, {
      onSuccess: () => reset()
    })

  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classnames([styles['todo'], styles['create-form']])}
    >

      <div className={styles['create-inputs']}>
        <input
          className={classnames([styles['checkbox'], styles['create-checkbox']])}
          type='checkbox'
          defaultChecked={false}
          {...register("completed")}
        />

        <div>
          <input
            className={styles['text-input']}
            placeholder="buy fish"
            {...register("title")}
          />
          {errors.title && <div>{errors.title.message}</div>}
        </div>
      </div>

      <button
        className={styles['update-button']}
        disabled={createTodoMutation.isPending}
        type='submit'
      >
        {createTodoMutation.isPending ? 'wait...' : 'add todo'} 
      </button>
    </form>
  )
}

export default CreateTodoForm;