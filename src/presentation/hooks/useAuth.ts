import { useState, useEffect } from "react";
import { container } from "@/src/di/container";
import { User } from "@/src/domain/entities/User";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Observar cambios de autenticación
  useEffect(() => {
    const unsubscribe =
      container.authRepository.onAuthStateChanged((authUser) => {
        setUser(authUser);
        setLoading(false);
      });

    // ← NUEVO: intentar obtener usuario cacheado al montar (AsyncStorage)
    (async () => {
      try {
        const current = await container.authRepository.getCurrentUser();
        if (current) {
          setUser(current);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const register = async (
 
    email: string,
    password: string,
    displayName: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await container.registerUser.execute(
        email,
        password,
        displayName
      );
      setUser(newUser);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const loggedUser = await container.loginUser.execute(email, password);
      setUser(loggedUser);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await container.logoutUser.execute();
      setUser(null);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };
};

export interface AuthRepository { 
    // Registrar nuevo usuario con datos adicionales 
    register( 
        email: string, 
        password: string, 
        displayName: string 
    ): Promise<User>; 

    // Iniciar sesión 
    login(
        email: string, 
        password: string
    ): Promise<User>; 
    
    // Cerrar sesión 
    logout(): Promise<void>; 
    
    // Obtener usuario actualmente autenticado 
    getCurrentUser(): Promise<User | null>; 
    
    // Escuchar cambios de autenticación (observer pattern) 
    onAuthStateChanged(
        callback: (user: User | null) => void
    ): () => void;

    // ← NUEVO: actualizar displayName del usuario
    updateProfile(displayName: string): Promise<User>;
}