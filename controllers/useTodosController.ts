import { useState, useEffect } from "react";
import { Todo } from "../model/todo";
import { todoRepository } from "../repositories/todoRepository";
import { Alert } from "react-native";


// paso 4: Implementa la logica del controlador


export function useTodosController() {
 const [todos, setTodos] = useState<Todo[]>([]);

 // carga las tareas
    useEffect(() => {
        (async () => {
            try {
                const data = await todoRepository.getAll();
                setTodos(data);
            } catch (e) {
                console.error(e);
                Alert.alert("Error", "No se pudieron cargar las tareas.");
            }   
        })();
    }, []);

    // agrega la tarea

    const addTodo = async (title: string) => {
        try {
            const created = await todoRepository.add(title);    
            setTodos((prev) => [created, ...prev]);
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo agregar la tarea.");
        }
    };


    // es lo que señala a ala tarea que se va a completar
    const toggleTodo = async (id: number) => {
        const cuurent = todos.find((t) => t.id === id);
        if (!cuurent) return;
        const next = !cuurent.completed;
        try {
            await todoRepository.updateCompleted(id, next);
            setTodos((prev) =>
                prev.map((t) =>
                    (t.id === id ? { ...t, completed: next } : t)
                )
            );
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo actualizar la tarea.");
        }
    };
    // elimina la tarea
    const deleteTodo = async (id: number) => {
        try {
            await todoRepository.remove(id);
            setTodos((prev) => prev.filter((t) => t.id !== id));
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo eliminar la tarea.");
        }
    };

// retorna las tareas y las funciones para manipularlas
    return { 
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
    };

}