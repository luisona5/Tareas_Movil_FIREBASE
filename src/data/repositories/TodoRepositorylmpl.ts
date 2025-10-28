import { TodoRepository} from "@/src/domain/repositories/TodoRepository";
import { Todo, CreateTodoDTO, UpdateTodoDTO } from "@/src/domain/entities/todo";
import { SQLiteTodoDataSource} from "../datasources/SQLiteTodoDtaSource";

export class TodoRepositorylmpl implements TodoRepository {
    constructor(private dataSource: SQLiteTodoDataSource) {}

    async getAll(): Promise<Todo[]> {
        return await this.dataSource.getAllTodos();
    }

    async getById(id: string): Promise<Todo | null> {
        return await this.dataSource.getTodoById(id);
    }

    async create(data: CreateTodoDTO): Promise<Todo> {
        return await this.dataSource.createTodo(data.title);
    }

    async update(data: UpdateTodoDTO): Promise<Todo> {
        return await this.dataSource.updateTodo(
            data.id, 
            data.completed,
            data.title
        );
    }   

    async delete(id: string): Promise<void> {
        return await this.dataSource.deleteTodo(id);
    }   
}