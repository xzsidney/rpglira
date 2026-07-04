const fs = require('fs');
const path = require('path');

const views = [
  'Home.vue', 'Login.vue', 'Cadastro.vue', 'Admin.vue',
  'Mestre/Dashboard.vue', 'Mestre/NPC.vue', 'Mestre/Aventura.vue',
  'Jogador/Dashboard.vue', 'Jogador/NovoPersonagem.vue', 'Jogador/Ficha.vue', 'Jogador/Loja.vue'
];

views.forEach(view => {
  const fullPath = path.join(__dirname, 'src', 'views', view);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `<template><div class="p-8"><h1 class="text-3xl text-vampire">{{ title }}</h1></div></template><script setup>import { ref } from 'vue'; const title = ref('${view}');</script>`);
});
console.log('Views criadas com sucesso!');
