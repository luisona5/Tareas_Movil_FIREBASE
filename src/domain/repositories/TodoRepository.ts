
// Esta es la clave de clea Arqchitecture
// El repositorio define una interfaz para las operaciones de acceso a datos
// No depende de ninguna implementación concreta (como una base de datos específica)
// Esto permite cambiar la implementación sin afectar al resto de la aplicación

import{Todo,CreateTodoDTO,UpdateTodoDTO}from"../entities/todo";

export interface TodoRepository{
    getAll():Promise<Todo[]>;
    getById(id:string):Promise<Todo | null>;
    create(todo:CreateTodoDTO):Promise<Todo>;
    update(todo:UpdateTodoDTO):Promise<Todo>;
    delete(id:string):Promise<void>;
}