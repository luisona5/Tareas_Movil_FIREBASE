import { Todo } from "../entities/todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class ToggleTodo {
    // solamente necesita el repositorio para realizar la operacion

    constructor(private repository: TodoRepository) {}
    // el metodo execute recibe el id del todo a modificar

    async execute(id: string): Promise<Todo> {

        // primero obtenemos el todo por su id

        const todo = await this.repository.getById(id);
        // si no existe, lanzamos un error

        if (!todo) {
            throw new Error("Todo no encontrado");
        }
        // si existe, cambiamos su estado de completado
        
        return await this.repository.update({
            id,
            completed: !todo.completed,
        });
    }   
}