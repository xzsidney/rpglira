<template>
  <div class="min-h-screen bg-background text-gray-200 font-body flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Efeitos de Fundo -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vampire/10 via-background to-background pointer-events-none"></div>
    
    <div class="w-full max-w-md bg-surface/80 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-2xl relative z-10">
      <div class="text-center mb-8">
        <h1 class="font-headline text-4xl text-gray-100 tracking-wider mb-2">LiraRPG</h1>
        <p class="text-gray-400 text-sm">Acesse o Mundo das Trevas</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="route.query.registered" class="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded text-sm text-center">
          Pacto firmado com sucesso! Faça seu primeiro acesso abaixo.
        </div>

        <div v-if="errorMsg" class="bg-red-900/50 border border-vampire text-red-200 px-4 py-3 rounded text-sm text-center">
          {{ errorMsg }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full bg-background border border-gray-700 rounded-md px-4 py-3 text-gray-200 focus:outline-none focus:border-vampire focus:ring-1 focus:ring-vampire transition-all"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Senha</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="w-full bg-background border border-gray-700 rounded-md px-4 py-3 text-gray-200 focus:outline-none focus:border-vampire focus:ring-1 focus:ring-vampire transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-vampire hover:bg-red-900 text-white font-semibold py-3 rounded-md transition-all shadow-[0_0_15px_rgba(139,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Acessando...</span>
          <span v-else>Entrar nas Sombras</span>
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-gray-500">
        Primeira vez por aqui? 
        <router-link to="/cadastro" class="text-vampire hover:text-red-400 font-medium transition-colors">Abraço Inicial</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  
  try {
    await authStore.login(email.value, password.value);
    
    const role = authStore.userRole;
    if (role === 'ADMIN') {
      router.push('/admin');
    } else if (role === 'MESTRE') {
      router.push('/mestre');
    } else {
      router.push('/jogador');
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.error || 'Erro ao conectar com o servidor.';
  } finally {
    isLoading.value = false;
  }
};
</script>