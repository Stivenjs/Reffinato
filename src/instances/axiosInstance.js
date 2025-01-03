import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosInstance = axios.create({
  baseURL: "https://reffinato-backend-production.up.railway.app/api",
});

// Interceptor para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error al obtener un nuevo token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Manejar la lógica para cuando el token haya expirado
      console.error("Token expirado, redirigiendo al login...");
      // Podrías redirigir al usuario al login o mostrar un mensaje
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
