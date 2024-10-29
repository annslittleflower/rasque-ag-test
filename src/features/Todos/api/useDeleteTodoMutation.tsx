import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Todo, User } from '@/common/types';


type MutationArgument = {
  userId: User['id'];
  todoId: Todo['id'];
}

const apiFunction = async ({ todoId }: MutationArgument) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('something is wrong, try again later');
  }

  return await response.json();

}

const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiFunction,
    // @ts-ignore
    onSuccess: (data, variables, context) => {
      const userTodos = queryClient.getQueryData<Todo[]>(['todos', variables.userId])

      const filteredTodos = userTodos!.filter(todo => (todo.id !== variables.todoId));

      queryClient.setQueryData(['todos', variables.userId], filteredTodos)
    },
    retry: 3,
  });
};

export default useDeleteTodoMutation;