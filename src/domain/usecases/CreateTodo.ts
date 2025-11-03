import {Todo,CreateTodoDTO} from"../entities/todo";
import {TodoRepository} from"../repositories/TodoRepository";

export class CreateTodo {
    constructor(private repository:TodoRepository){}

    async execute(data:CreateTodoDTO):Promise<Todo>{
        // Validaciones de negocio
        // Ejemplo: el titulo no puede estar vacio

        if(!data.title.trim()){
            throw new Error("El titulo no puede estar vacio");
        }   

        if(data.title.length>200){
            throw new Error("El titulo es demasiado largo");
        }   

        if(!data.userId){
            throw new Error("User ID is required");
        }

        return await this.repository.create(data);
    }
}   