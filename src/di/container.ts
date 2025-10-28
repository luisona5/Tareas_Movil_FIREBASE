// import { SQLiteTodoDataSource } from '@/src/data/datasources/SQLiteTodoDtaSource';
// import { TodoRepositorylmpl } from '@/src/data/repositories/TodoRepositorylmpl';
import { GetAllTodo } from '@/src/domain/usecases/GetAllTodo';
import { CreateTodo } from '@/src/domain/usecases/CreateTodo';
import { ToggleTodo } from '@/src/domain/usecases/ToogleTodo';
import { DeleteTodos } from '@/src/domain/usecases/DeleteTodos';

// cuando cambies de data source o repository, solo lo haces aquí

import { FirebaseTodoDataSource } from '../data/datasources/FirebaseTodoDataSource';
import { FirebaseTodoRepositoryImpl } from '@/data/repositories/TodoRepositoryFirebaseImpl';

// 🟢 Singleton para mantener una sola instancia
class DIContainer {
  private static instance: DIContainer;
  //private _dataSource: SQLiteTodoDataSource | null = null;

   private _dataSource: FirebaseTodoDataSource | null = null;


  // private _repository: TodoRepositorylmpl | null = null;
  private _repository: FirebaseTodoRepositoryImpl | null = null;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  async initialize(): Promise<void> {
    this._dataSource = new FirebaseTodoDataSource();
    await this._dataSource.initialize();
    this._repository = new FirebaseTodoRepositoryImpl(this._dataSource);
  }

  // 🟢 Use Cases - cada uno recibe el repository
  get getAllTodos(): GetAllTodo {
    if (!this._repository) throw new Error('Container not initialized');
    return new GetAllTodo(this._repository);
  }

  get createTodo(): CreateTodo {
    if (!this._repository) throw new Error('Container not initialized');
    return new CreateTodo(this._repository);
  }

  get toggleTodo(): ToggleTodo {
    if (!this._repository) throw new Error('Container not initialized');
    return new ToggleTodo(this._repository);
  }

  get deleteTodo(): DeleteTodos {
    if (!this._repository) throw new Error('Container not initialized');
    return new DeleteTodos(this._repository);
  }
}

export const container = DIContainer.getInstance();