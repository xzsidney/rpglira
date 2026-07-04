<template>
  <div class="min-h-screen bg-background text-gray-200 font-body flex items-center justify-center p-6 relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vampire/10 via-background to-background pointer-events-none"></div>
    
    <div class="w-full max-w-md bg-surface/80 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-2xl relative z-10 my-8">
      <div class="text-center mb-8">
        <h1 class="font-headline text-4xl text-gray-100 tracking-wider mb-2">O Abraço</h1>
        <p class="text-gray-400 text-sm">Crie sua conta no LiraRPG</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div v-if="errorMsg" class="bg-red-900/50 border border-vampire text-red-200 px-4 py-3 rounded text-sm text-center">
          {{ errorMsg }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Seu Nome (ou Codinome)</label>
          <input 
            v-model="name" 
            type="text" 
            required 
            class="w-full bg-background border border-gray-700 rounded-md px-4 py-3 text-gray-200 focus:outline-none focus:border-vampire focus:ring-1 focus:ring-vampire transition-all"
            placeholder="Drácula"
          />
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
            minlength="6"
            class="w-full bg-background border border-gray-700 rounded-md px-4 py-3 text-gray-200 focus:outline-none focus:border-vampire focus:ring-1 focus:ring-vampire transition-all"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
           <label class="block text-sm font-medium text-gray-400 mb-3">Qual será o seu papel?</label>
           <div class="grid grid-cols-2 gap-4">
              <label class="cursor-pointer">
                 <input type="radio" v-model="role" value="JOGADOR" class="peer sr-only" />
                 <div class="text-center p-3 border border-gray-700 rounded-md peer-checked:border-vampire peer-checked:bg-vampire/20 peer-checked:text-white transition-all">
                    Jogador
                 </div>
              </label>
              <label class="cursor-pointer">
                 <input type="radio" v-model="role" value="MESTRE" class="peer sr-only" />
                 <div class="text-center p-3 border border-gray-700 rounded-md peer-checked:border-purple-600 peer-checked:bg-purple-900/20 peer-checked:text-white transition-all">
                    Mestre (Narrador)
                 </div>
              </label>
           </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-vampire hover:bg-red-900 text-white font-semibold py-3 rounded-md transition-all mt-4 shadow-[0_0_15px_rgba(139,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Criando Pacto...</span>
          <span v-else>Aceitar o Abraço</span>
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-gray-500">
        Já possui um pacto? 
        <router-link to="/login" class="text-vampire hover:text-red-400 font-medium transition-colors">Despertar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('JOGADOR'); // Default
const isLoading = ref(false);
const errorMsg = ref('');

const handleRegister = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  
  try {
    await authStore.register(name.value, email.value, password.value, role.value);
    
    router.push({ path: '/login', query: { registered: 'true' } });
  } catch (error) {
    if (error.response?.data?.errors) {
       errorMsg.value = error.response.data.errors.map(e => e.message).join(', ');
    } else {
       errorMsg.value = error.response?.data?.error || 'Erro ao conectar com o servidor.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>