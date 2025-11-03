export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  userId: string; // ID del usuario que creó la tarea
 
}

export interface CreateTodoDTO {
  title: string;
  userId: string; // ID del usuario que creó la tarea
}

export interface UpdateTodoDTO {
    id: string;
  title?: string;
  completed?: boolean;
  // userId No es editable(no queremos cambiar el dueño)
}