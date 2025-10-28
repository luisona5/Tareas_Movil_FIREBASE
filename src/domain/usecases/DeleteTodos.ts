
import { TodoRepository } from "../repositories/TodoRepository";
// Caso de uso para eliminar un todo por su id
// No necesita validaciones adicionales, solo llama al metodo delete del repositorio
// Recibe el id del todo a eliminar
// No retorna nada

export class DeleteTodos {
    constructor(private repository: TodoRepository) {}

    async execute(id: string): Promise<void> {

        await this.repository.delete(id);
    }
}