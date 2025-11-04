import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "@/Firebaseconfig";
import { User } from "@/src/domain/entities/User";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ← NUEVO

const STORAGE_KEY = "auth_user_v1"; // ← NUEVO

export class FirebaseAuthDataSource {

  // ===== MÉTODO PRIVADO: CONVERTIR FIREBASEUSER A USER =====
  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "Usuario",
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
    };
  }

  // ===== REGISTRO DE USUARIO =====
  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // 2. Actualizar perfil en Auth (displayName)
      await updateProfile(firebaseUser, {
        displayName,
      });

      // 3. Guardar datos adicionales en Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        email,
        displayName,
        createdAt: new Date(),
      });

      const userObj: User = {
        id: firebaseUser.uid,
        email,
        displayName,
        createdAt: new Date(),
      };

      // ← NUEVO: persistir en AsyncStorage
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...userObj, createdAt: userObj.createdAt.toISOString() })
      );

      // 4. Retornar usuario mapeado
      return userObj;
    } catch (error: any) {
      console.error("Error registering user:", error);

      // Mensajes de error más amigables
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Este email ya está registrado");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Email inválido");
      } else if (error.code === "auth/weak-password") {
        throw new Error("La contraseña es muy débil");
      }

      throw new Error(error.message || "Error al registrar usuario");
    }
  }

  // ===== LOGIN =====
  async login(email: string, password: string): Promise<User> {
    try {
      // 1. Autenticar con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // 2. Obtener datos adicionales de Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userData = userDoc.data();

      const userObj: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: userData?.displayName || firebaseUser.displayName || "Usuario",
        createdAt: userData?.createdAt?.toDate() || new Date(),
      };

      // ← NUEVO: persistir en AsyncStorage
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...userObj, createdAt: userObj.createdAt.toISOString() })
      );

      // 3. Retornar usuario completo
      return userObj;
    } catch (error: any) {
      console.error("Error logging in:", error);

      // Mensajes de error más amigables
      if (error.code === "auth/user-not-found") {
        throw new Error("Usuario no encontrado");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Contraseña incorrecta");
      } else if (error.code === "auth/invalid-credential") {
        throw new Error("Credenciales inválidas");
      }

      throw new Error(error.message || "Error al iniciar sesión");
    }
  }

  // ===== LOGOUT =====
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      // ← NUEVO: borrar cache
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      console.error("Error logging out:", error);
      throw new Error(error.message || "Error al cerrar sesión");
    }
  }

  // ===== OBTENER USUARIO ACTUAL =====
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        return this.mapFirebaseUserToUser(firebaseUser);
      }

      // ← NUEVO: si firebase no tiene usuario, intentar leer AsyncStorage
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      return {
        id: parsed.id,
        email: parsed.email,
        displayName: parsed.displayName,
        createdAt: new Date(parsed.createdAt),
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // ===== OBSERVAR CAMBIOS DE AUTENTICACIÓN =====
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // Retorna función de desuscripción
    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const u = this.mapFirebaseUserToUser(firebaseUser);
        // mantener cache sync (no bloquear)
        AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...u, createdAt: u.createdAt.toISOString() })
        ).catch(() => {});
        callback(u);
      } else {
        // limpiar cache cuando firebase indica logout
        AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
        callback(null);
      }
    });
  }
}