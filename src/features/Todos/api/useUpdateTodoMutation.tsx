import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Todo, User } from '@/common/types';

type MutationArgument = {
  userId: User['id'];
  todoId: Todo['id'];
  completed: Todo['completed']
  title: Todo['title']
}

const apiFunction = async ({userId, todoId, completed, title}: MutationArgument) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        userId,
        title,
        completed
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  );

  if (!response.ok) {
    throw new Error('something is wrong, try again later');
  }

  return await response.json();

}

const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiFunction,
    // @ts-ignore
    onSuccess: (data, variables, context) => {
      const userTodos = queryClient.getQueryData<Todo[]>(['todos', variables.userId])

      const updatedTodos = userTodos!.map(todo => {
        if (todo.id === variables.todoId) {
          return { ...todo, title: variables.title, completed: variables.completed };
        } 
        return todo;
       });

       queryClient.setQueryData(['todos', variables.userId], updatedTodos)
    },
    retry: 3,
  });
};

export default useUpdateTodoMutation;