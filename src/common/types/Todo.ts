
import type { User } from "./User";

export type Todo = {
  userId: User['id'];
  id: number;
  title: string;
  completed: boolean;
}

