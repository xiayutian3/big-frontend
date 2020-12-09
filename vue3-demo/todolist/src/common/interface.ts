import { TodoItemState } from './const'

// 接口约束
export interface TodoItem{
  id: string;
  text: string;
  state: TodoItemState;
}
