import { useQueryClient } from '@tanstack/react-query';
import type { User, Todo } from '@/common/types/';


const useQuerySummary = () => {
  const queryClient = useQueryClient()

  const cachedUsers = queryClient.getQueryData<User[]>(['usersList'])

  const usersWithTodos = cachedUsers?.map((u) => {
    const todos = queryClient.getQueryData<Todo[]>(['todos', u.id])
    if (todos) {
      // const completedTodos = todos.filter(t => t.completed)
      // const uncompletedTodos = todos.filter(t => !t.completed)

      // return {
      //   name: u.name,
      //   completedTodos,
      //   uncompletedTodos
      // }
      return todos.map(i => ({...i, username: u.name}))
    }
  })

  console.log('usersWithTodos', usersWithTodos)

  return usersWithTodos?.filter(item => !!item).flat()
};

export default useQuerySummary;