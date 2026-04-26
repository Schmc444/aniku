// src/services/AuthService.js
// Servicio de autenticación con Firebase

import { createLogger } from "../utils/logger";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "../../firebaseConfig";

const logger = createLogger("auth");

class AuthService {
  // 👤 Obtener usuario actual
  static getCurrentUser() {
    try {
      const auth = getFirebaseAuth();
      return auth?.currentUser || null;
    } catch (e) {
      logger.debug("⚠️ Firebase not configured, getCurrentUser returning null");
      return null;
    }
  }

  // 🔐 Iniciar sesión con email y contraseña
  static async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
      );
      logger.debug("✅ Usuario autenticado:", userCredential.user.email);
      return {
        success: true,
        user: userCredential.user,
        message: "Sesión iniciada correctamente",
      };
    } catch (error) {
      logger.error("❌ Error al iniciar sesión:", error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
        code: error.code,
      };
    }
  }

  // 📝 Registrar nuevo usuario
  static async signUpWithEmail(email, password, displayName = null) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
      );

      // Actualizar nombre de usuario si se proporciona
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      logger.debug("✅ Usuario registrado:", userCredential.user.email);
      return {
        success: true,
        user: userCredential.user,
        message: "Cuenta creada correctamente",
      };
    } catch (error) {
      logger.error("❌ Error al registrar usuario:", error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
        code: error.code,
      };
    }
  }

  // 🚪 Cerrar sesión
  static async signOut() {
    try {
      await signOut(getFirebaseAuth());
      logger.debug("✅ Sesión cerrada");
      return {
        success: true,
        message: "Sesión cerrada correctamente",
      };
    } catch (error) {
      logger.error("❌ Error al cerrar sesión:", error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // 🔄 Restablecer contraseña
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      logger.debug("✅ Email de restablecimiento enviado a:", email);
      return {
        success: true,
        message: "Se ha enviado un enlace de restablecimiento a tu email",
      };
    } catch (error) {
      logger.error("❌ Error al enviar email de restablecimiento:", error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // 👁️ Observar cambios en el estado de autenticación
  static onAuthStateChange(callback) {
    return onAuthStateChanged(getFirebaseAuth(), callback);
  }

  // 🔍 Verificar si el usuario está autenticado
  static isAuthenticated() {
    return getFirebaseAuth()?.currentUser !== null;
  }

  // 📧 Obtener email del usuario actual
  static getCurrentUserEmail() {
    return getFirebaseAuth()?.currentUser?.email || null;
  }

  // 👤 Obtener información del usuario actual
  static getCurrentUserInfo() {
    const user = getFirebaseAuth()?.currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    };
  }

  // 🔧 Obtener mensaje de error legible
  static getErrorMessage(errorCode) {
    const errorMessages = {
      "auth/user-not-found": "No existe una cuenta con este email",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/email-already-in-use": "Este email ya está registrado",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
      "auth/too-many-requests": "Demasiados intentos. Intenta más tarde",
      "auth/network-request-failed": "Error de conexión. Verifica tu internet",
      "auth/invalid-credential": "Credenciales inválidas",
    };

    return errorMessages[errorCode] || "Error desconocido. Intenta nuevamente";
  }

  // 🧪 Método de debug
  static debugAuth() {
    const user = getFirebaseAuth()?.currentUser;
    logger.debug("🔍 DEBUG AUTH:");
    logger.debug("   Usuario actual:", user ? user.email : "No autenticado");
    logger.debug("   UID:", user?.uid || "N/A");
    logger.debug("   Email verificado:", user?.emailVerified || false);
    logger.debug("   Nombre:", user?.displayName || "No definido");
  }
}

export default AuthService;
