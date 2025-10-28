import { Todo } from "../entities/todo";
import { TodoRepository } from "../repositories/TodoRepository";
// Caso de uso para obtener todos los todos

export class GetAllTodo {
    // Solo necesita el repositorio para realizar la operacion
    constructor(private repository: TodoRepository) {}

    // El metodo execute no recibe parametros
    async execute(): Promise<Todo[]> {

        
        // Llama al metodo getAll del repositorio y retorna el resultado
        return await this.repository.getAll();
    }
}   
