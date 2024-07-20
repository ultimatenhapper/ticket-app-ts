import { Todo } from "@prisma/client";
import TodoCard from "./TodoCard";

interface Props {
  todos: Todo[];
}
const TodoGrid = ({ todos }: Props) => {
  return (
    <div className="flex flex-wrap gap-10 items-center justify-center">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoGrid;
