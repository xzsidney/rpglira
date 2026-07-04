<template>
  <div class="min-h-screen bg-background text-gray-200 font-body">
    <header class="bg-surface border-b border-gray-800 p-4 flex justify-between items-center">
      <h1 class="font-headline text-2xl text-blue-500">LiraRPG - Admin</h1>
      <button @click="handleLogout" class="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition-colors text-white">Sair</button>
    </header>
    <main class="p-8">
      <h2 class="text-3xl font-headline mb-4">Painel de Administração</h2>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>