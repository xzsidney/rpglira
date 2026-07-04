import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role || null);

  function setUser(userData, jwtToken) {
    user.value = userData;
    token.value = jwtToken;
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user, response.data.token);
    return response.data;
  }

  async function register(name, email, password, role) {
    const response = await api.post('/auth/register', { name, email, password, role });
    // Usuário cadastrado, mas não logado automaticamente. Retorna para a tela de Login.
    return response.data;
  }

  return { token, user, isAuthenticated, userRole, login, register, logout, setUser };
});
