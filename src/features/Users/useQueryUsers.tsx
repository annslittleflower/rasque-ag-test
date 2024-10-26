import { useQuery } from '@tanstack/react-query';
import type { User } from '@/common/types/User';


const useQueryUsers = () => {
  const result = useQuery<User[]>({
    queryKey: ['usersList'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');

      if (!response.ok) {
        throw new Error('something is wrong, try again later');
      }

      const usersData = (await response.json());

      return usersData;
    },
  });

  return {...result, users: result.data};
};

export default useQueryUsers;