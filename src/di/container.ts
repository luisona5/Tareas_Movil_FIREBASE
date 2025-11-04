// import { SQLiteTodoDataSource } from '@/src/data/datasources/SQLiteTodoDtaSource';
// import { TodoRepositorylmpl } from '@/src/data/repositories/TodoRepositorylmpl';
import { FirebaseTodoDataSource } from '@/src/data/datasources/FirebaseTodoDataSource';
//import { FirebaseTodoRepositoryImpl } from '@/src/data/repositories/TodoRepositoryFirebaseImpl';
import { TodoRepositoryFirebaseImpl } from '../data/repositories/TodoRepositoryFirebaseImpl';
import { GetAllTodo } from '@/src/domain/usecases/GetAllTodo';
import { CreateTodo } from '@/src/domain/usecases/CreateTodo';
import { ToggleTodo } from '@/src/domain/usecases/ToogleTodo';
import { DeleteTodos } from '@/src/domain/usecases/DeleteTodos';

import { FirebaseAuthDataSource } from '../data/datasources/FirebaseAuthDataSource';
import { AuthRepositorylmpl } from '../data/repositories/AuthRepositorylmpl';
import { RegisterUser } from '../domain/usecases/RegisterUser';
import { LoginUser } from "../domain/usecases/LoginUser"; 
import { LogoutUser } from "../domain/usecases/LogoutUser"; 
import { GetCurrentUser } from "../domain/usecases/GetCurrentUser"; 
import { AuthRepository } from "../domain/repositories/AuthRepository";


// cuando cambies de data source o repository, solo lo haces aquí



// 🟢 Singleton para mantener una sola instancia
class DIContainer {
  private static instance: DIContainer;
  //private _dataSource: SQLiteTodoDataSource | null = null;

   private _dataSource: FirebaseTodoDataSource | null = null;


  // private _repository: TodoRepositorylmpl | null = null;
  private _repository: TodoRepositoryFirebaseImpl | null = null;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  

  

// ===== NUEVOS DE AUTH ===== (AGREGAR) 
private _authDataSource?: FirebaseAuthDataSource; 
private _authRepository?: AuthRepository; 
private _registerUser?: RegisterUser; 
private _loginUser?: LoginUser; 
private _logoutUser?: LogoutUser;
private _getCurrentUser?: GetCurrentUser; 
// ... método initialize existente (NO BORRAR)

async initialize(): Promise<void> {
    this._dataSource = new FirebaseTodoDataSource();
    await this._dataSource.initialize();
    this._repository = new TodoRepositoryFirebaseImpl(this._dataSource);

    this._authDataSource = new FirebaseAuthDataSource();

  }
// ===== GETTERS EXISTENTES DE TODOS === (NO BORRAR)
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

// ===== NUEVOS GETTERS DE AUTH === (AGREGAR)
get authDataSource(): FirebaseAuthDataSource {
  if (!this._authDataSource) {
    this._authDataSource = new FirebaseAuthDataSource();
  }
  return this._authDataSource;
}

get authRepository(): AuthRepository {
  if (!this._authRepository) {
    this._authRepository = new AuthRepositorylmpl(this.authDataSource);
  }
  return this._authRepository;
}

get registerUser(): RegisterUser {
  if (!this._registerUser) {
    this._registerUser = new RegisterUser(this.authRepository);
  }
  return this._registerUser;
}

get loginUser(): LoginUser {
  if (!this._loginUser) {
    this._loginUser = new LoginUser(this.authRepository);
  }
  return this._loginUser;
}

get logoutUser(): LogoutUser {
  if (!this._logoutUser) {
    this._logoutUser = new LogoutUser(this.authRepository);
  }
  return this._logoutUser;
}

get getCurrentUser(): GetCurrentUser {
  if (!this._getCurrentUser) {
    this._getCurrentUser = new GetCurrentUser(this.authRepository);
  }
  return this._getCurrentUser;
}

}

export const container = DIContainer.getInstance();