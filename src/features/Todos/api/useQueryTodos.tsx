import { useQuery } from '@tanstack/react-query';
import type { Todo, User } from '@/common/types';


const useQueryTodos = (userId?: User['id'] ) => {
  const result = useQuery<Todo[]>({
    enabled: !!userId,
    queryKey: ['todos', userId],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);

      if (!response.ok) {
        throw new Error('something is wrong, try again later');
      }

      const todos = await response.json();

      return todos;
    },
  });

  return {...result, todos: result.data};
};

export default useQueryTodos;