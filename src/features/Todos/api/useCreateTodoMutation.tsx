import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Todo, User } from '@/common/types';

type MutationArgument = {
  userId: User['id'];
  completed: Todo['completed']
  title: Todo['title']
}

const apiFunction = async ({userId, completed, title}: MutationArgument) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/`,
    {
      method: 'POST',
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

const useCreateTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiFunction,
    onSuccess: (data, variables, context) => {
      const userTodos = queryClient.getQueryData<Todo[]>(['todos', variables.userId])

      console.log('after post', data)

      // queryClient.setQueryData(['todos', variables.userId], updatedTodos)
    },
    retry: 3,
  });
};

export default useCreateTodoMutation;
