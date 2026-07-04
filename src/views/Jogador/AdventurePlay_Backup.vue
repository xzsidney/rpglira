<template>
  <div class="h-screen w-screen flex items-center justify-center relative bg-[#050505] text-gray-300 font-serif overflow-hidden">
    
    <!-- Áudio Imersivo -->
    <audio v-if="currentScene?.audioUrl" :src="currentScene.audioUrl" autoplay loop></audio>

    <button @click="togglePanel" class="fixed top-6 left-6 z-40 bg-gray-900 border border-gray-700 text-gray-300 p-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div id="control-panel" 
         :class="['fixed top-0 left-0 h-full w-80 bg-[#0f1115] border-r border-gray-800 shadow-2xl z-50 transform transition-transform duration-400 flex flex-col', isPanelOpen ? 'translate-x-0' : '-translate-x-full']">
      <div class="p-6 border-b border-gray-800 flex justify-between items-center bg-black/40">
        <h2 class="text-xl font-bold tracking-widest text-red-600 uppercase">Sangue e Destino</h2>
        <button @click="togglePanel" class="text-gray-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6 flex-grow space-y-6 font-sans">
        <div>
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Jogador</p>
          <p class="text-lg text-white font-bold">{{ character?.name || 'Carregando...' }}</p>
        </div>
        <div class="bg-black/50 p-4 rounded border border-gray-800">
          <p class="text-xs text-blue-500 uppercase tracking-wider font-bold mb-2">Relógio da Noite</p>
          <p class="text-2xl text-white font-mono font-bold tracking-widest">{{ remainingTime }}m</p>
        </div>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-red-500 font-bold uppercase">Sangue (Fome)</span>
              <span class="text-xs text-gray-400">{{ bloodLevel }}/{{ maxBlood }}</span>
            </div>
            <div class="text-red-600 tracking-widest text-sm">
              {{ '🔴'.repeat(bloodLevel) }}{{ '⭕'.repeat(maxBlood - bloodLevel) }}
            </div>
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-green-500 font-bold uppercase">Humanidade</span>
              <span class="text-xs text-gray-400">{{ humanityLevel }}/10</span>
            </div>
            <div class="text-green-500 tracking-widest text-sm">
              {{ '🟢'.repeat(humanityLevel) }}{{ '⚪'.repeat(10 - humanityLevel) }}
            </div>
          </div>
        </div>
        <div class="pt-6 border-t border-gray-800 space-y-3">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Ações Rápidas</p>
          <button @click="hunt" class="w-full bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 py-2 rounded text-sm font-bold transition-colors">🩸 Caçar (-30 min)</button>
          <button @click="toggleBloodSurge" class="w-full bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 py-2 rounded text-sm font-bold transition-colors">🩸 Impulso de Sangue</button>
          <button @click="toggleCautious" class="w-full bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-200 py-2 rounded text-sm font-bold transition-colors">⏳ Cautela Extrema</button>
          <p class="text-xs text-yellow-500 text-center font-bold h-4">{{ buffsText }}</p>
        </div>
      </div>
    </div>

    <!-- TOOLTIP CENTRALIZADO PARA AÇÕES -->
    <div :class="['absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-lg bg-black/90 border border-gray-700 p-6 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50 text-center transition-all duration-300 pointer-events-none', hoveredActionText ? 'opacity-100 scale-100' : 'opacity-0 scale-95']">
      <p class="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Ação Possível</p>
      <p class="text-gray-300 font-serif text-lg leading-relaxed">{{ hoveredActionText }}</p>
      <p v-if="hoveredTestStr" class="text-gray-500 font-sans text-xs mt-4 uppercase">Requisito: {{ hoveredTestStr }}</p>
    </div>

    <!-- FLIPBOOK CENTRAL -->
    <div class="relative flex max-w-5xl w-full h-[80vh] min-h-[600px] rounded-lg overflow-visible shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)]">
      
      <!-- PÁGINA ESQUERDA -->
      <div class="w-1/2 h-full bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#0a0a0a] rounded-l-lg relative overflow-hidden flex flex-col border border-gray-800 border-r-0">
        <div :class="['absolute inset-0 flex flex-col', isTransitioning ? 'scene-fade-out' : 'scene-fade-in']">
          <div class="h-3/4 w-full relative">
            <img v-if="currentScene?.imageUrl" :src="currentScene.imageUrl" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]"></div>
          </div>
          <div class="h-1/4 w-full flex items-center justify-center p-8 bg-[#111]">
            <h2 class="text-xl text-yellow-600/90 text-center font-bold tracking-wider uppercase text-shadow">{{ currentScene?.title || 'Carregando...' }}</h2>
          </div>
        </div>
      </div>

      <!-- LOMBADA CENTRAL -->
      <div class="w-[4px] bg-black shadow-[inset_0_0_5px_rgba(255,255,255,0.1)] z-10"></div>

      <!-- FLIPPING PAGE (EFEITO 3D) -->
      <div v-if="isFlipping" class="absolute top-0 right-0 w-1/2 h-full z-40" style="transform-origin: left center; transform-style: preserve-3d; animation: turnPageLeft 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;">
        
        <!-- Frente da página voando (Página Direita Antiga) -->
        <div class="absolute inset-0 bg-gradient-to-l from-[#111] via-[#1a1a1a] to-[#0a0a0a] rounded-r-lg border border-gray-800 border-l-0 flex flex-col p-10" style="backface-visibility: hidden;">
          <div class="flex-grow overflow-y-auto pr-4">
            <p class="text-base md:text-lg text-gray-300 leading-loose min-h-[150px]" v-html="oldDisplayedText"></p>
          </div>
          <div class="absolute inset-0 bg-black opacity-0 animate-[shadowFade_1.2s_forwards] pointer-events-none"></div>
        </div>

        <!-- Verso da página voando (Nova Página Esquerda) -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#0a0a0a] rounded-l-lg overflow-hidden flex flex-col border border-gray-800 border-r-0" style="backface-visibility: hidden; transform: rotateY(180deg);">
          <div class="h-3/4 w-full relative">
            <img v-if="currentScene?.imageUrl" :src="currentScene.imageUrl" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]"></div>
          </div>
          <div class="h-1/4 w-full flex items-center justify-center p-8 bg-[#111]">
            <h2 class="text-xl text-yellow-600/90 text-center font-bold tracking-wider uppercase text-shadow">{{ currentScene?.title || 'Carregando...' }}</h2>
          </div>
        </div>
      </div>

      <!-- PÁGINA DIREITA -->
      <div class="w-1/2 h-full bg-gradient-to-l from-[#111] via-[#1a1a1a] to-[#0a0a0a] rounded-r-lg relative border border-gray-800 border-l-0">
        <div :class="['absolute inset-0 p-10 flex flex-col', isTransitioning ? 'scene-fade-out' : 'scene-fade-in']">
          <div class="flex-grow overflow-y-auto pr-4 custom-scrollbar">
            <p class="text-base md:text-lg text-gray-300 leading-loose min-h-[150px] typewriter-cursor" v-html="displayedText"></p>
            
            <!-- RESULTADO INLINE DA ROLAGEM -->
            <div v-if="isRolling || showRollResult" class="mt-8 border-t border-gray-800 pt-8 pb-4">
              <h3 class="text-gray-500 text-xs tracking-widest uppercase mb-6 font-sans text-center">{{ diceTargetText }}</h3>
              <div class="flex flex-wrap gap-3 justify-center items-center w-full mb-8">
                <div v-for="(roll, index) in diceRolls" :key="index" 
                     :class="['w-[40px] h-[40px] bg-[#0a0a0a] border rounded flex items-center justify-center text-lg font-bold font-sans shadow-[inset_0_0_5px_rgba(0,0,0,0.8),0_3px_5px_rgba(0,0,0,0.5)] transition-all duration-300', 
                              isRollingAnim ? 'text-transparent border-[#222] animate-[rollDice_0.5s_infinite_linear]' : 
                              roll >= targetDiff ? 'text-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'text-red-500 border-red-500/50']">
                  {{ isRollingAnim ? '' : roll }}
                </div>
              </div>
              <div class="transition-opacity duration-500" :style="{ opacity: showRollResult ? 1 : 0 }">
                <h2 :class="['text-2xl font-bold uppercase tracking-widest text-center font-sans', rollResultClass]">
                  {{ rollResultTitle }}
                </h2>
                <p class="text-gray-400 mt-3 text-center text-sm font-sans">
                  {{ rollResultDesc }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- EFEITO DE VIRAR A PÁGINA (Canto inferior direito) -->
        <div v-if="showRollContinue" @click="finishRoll"
             class="absolute bottom-0 right-0 w-0 h-0 border-solid border-b-[60px] border-l-[60px] border-b-[#050505] border-l-[#333] cursor-pointer z-30 transition-all duration-300 hover:border-b-[75px] hover:border-l-[75px] drop-shadow-[-2px_-2px_5px_rgba(0,0,0,0.8)] scene-fade-in"
             title="Virar a página (Continuar)">
             <span class="absolute right-[5px] top-[15px] text-white/50 text-[10px] uppercase font-bold tracking-widest -rotate-45 pointer-events-none">Virar</span>
        </div>

        <!-- ABAS LATERAIS (ESCOLHAS) -->
        <div :class="['absolute -right-[160px] top-[40px] w-[160px] flex flex-col gap-[2px] z-10 transition-opacity duration-500', (isTransitioning || isRolling) ? 'opacity-0 pointer-events-none' : 'opacity-100']">
          <div v-for="(tab, i) in tabs" :key="i"
               :class="['w-full height-[40px] rounded-r-lg flex items-center justify-start px-[10px] py-[10px] font-sans font-bold text-[11px] cursor-pointer transition-all duration-200 shadow-[2px_2px_5px_rgba(0,0,0,0.5)] whitespace-nowrap', tab.colorClass]"
               :style="{ opacity: tab.empty ? 0.3 : 1, cursor: tab.empty ? 'default' : 'pointer' }"
               @click="!tab.empty && handleChoice(tab.actionLink)"
               @mouseenter="$event.target.style.transform = tab.empty ? 'none' : 'translateX(10px)'; $event.target.style.width = tab.empty ? '100%' : '170px'; setHoveredAction(tab)"
               @mouseleave="$event.target.style.transform = 'none'; $event.target.style.width = '100%'; clearHoveredAction()"
               >
            <span v-if="!tab.empty" class="truncate pr-2 w-[110px]">{{ tab.shortTitle }}</span>
            <span v-if="!tab.empty" class="text-[10px] opacity-70 ml-auto">(-15m)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../services/api';

const route = useRoute();
const charId = route.params.charId;
const advId = route.params.advId;

// State Globais
const character = ref(null);
const adventure = ref(null);
const currentScene = ref(null);

// Status Game
const remainingTime = ref(240);
const activeBloodSurge = ref(0);
const activeCautious = ref(0);
const bloodLevel = ref(10);
const maxBlood = ref(10);
const humanityLevel = ref(6);

const isPanelOpen = ref(false);
const isTransitioning = ref(false);
const isFlipping = ref(false);
const displayedText = ref('');
const oldDisplayedText = ref('');

// Dice State
const isRolling = ref(false);
const isRollingAnim = ref(false);
const diceRolls = ref([]);
const diceTargetText = ref('');
const targetDiff = ref(6);
const showRollResult = ref(false);
const showRollContinue = ref(false);
const rollResultTitle = ref('');
const rollResultDesc = ref('');
const rollResultClass = ref('');
let pendingChoiceResult = null;

// Tooltip State
const hoveredActionText = ref('');
const hoveredTestStr = ref('');

const setHoveredAction = (tab) => {
  if (tab && !tab.empty) {
    hoveredActionText.value = tab.fullText;
    hoveredTestStr.value = tab.testStr;
  }
};
const clearHoveredAction = () => {
  hoveredActionText.value = '';
  hoveredTestStr.value = '';
};

const buffsText = computed(() => {
  let text = '';
  if (activeBloodSurge.value > 0) text += `[Alvo -${activeBloodSurge.value}] `;
  if (activeCautious.value > 0) text += `[Dados +${activeCautious.value}]`;
  return text;
});

const colors = [
  'bg-[#d32f2f]', 'bg-[#f57c00]', 'bg-[#fbc02d] text-black', 'bg-[#689f38]',
  'bg-[#388e3c]', 'bg-[#0288d1]', 'bg-[#1976d2]', 'bg-[#512da8]',
  'bg-[#7b1fa2]', 'bg-[#9c27b0]', 'bg-[#c2185b]'
];

const tabs = computed(() => {
  if (!currentScene.value) return [];
  const links = currentScene.value.actions || [];
  const res = [];
  for (let i = 0; i < 11; i++) {
    if (links[i]) {
      const actionText = links[i].action.text;
      const shortText = actionText.split(' ').slice(0, 3).join(' ') + '...'; // Pega as 3 primeiras palavras

      res.push({
        empty: false,
        shortTitle: links[i].action.title || shortText,
        fullText: actionText,
        testStr: links[i].action.testStr,
        colorClass: colors[i % colors.length] + ' text-white hover:text-white hover:z-20',
        actionLink: links[i]
      });
    } else {
      res.push({ empty: true, colorClass: colors[i % colors.length] });
    }
  }
  return res;
});

const togglePanel = () => isPanelOpen.value = !isPanelOpen.value;

const toggleBloodSurge = () => {
  if (bloodLevel.value > 0) {
    bloodLevel.value--;
    activeBloodSurge.value++;
  }
};

const toggleCautious = () => {
  remainingTime.value -= 15;
  activeCautious.value++;
};

const hunt = () => {
  if (bloodLevel.value < maxBlood.value) {
    remainingTime.value -= 30;
    bloodLevel.value = Math.min(maxBlood.value, bloodLevel.value + 2);
  }
};

const typeWriterEffect = (fullHtml) => {
  displayedText.value = '';
  let index = 0;
  const loop = () => {
    if (index < fullHtml.length) {
      if (fullHtml.charAt(index) === '<') {
        let tagEnd = fullHtml.indexOf('>', index);
        if (tagEnd !== -1) index = tagEnd;
      }
      displayedText.value = fullHtml.substring(0, index + 1);
      index++;
      let char = fullHtml.charAt(index);
      let delay = 10;
      if (['.', '!', '?'].includes(char)) delay = 150;
      if (char === ',') delay = 50;
      setTimeout(loop, delay);
    }
  };
  loop();
};

const loadSceneNode = (sceneId) => {
  if (adventure.value && adventure.value.scenes) {
    const scene = adventure.value.scenes.find(as => as.sceneId === sceneId);
    if (scene) {
      currentScene.value = scene.scene;
    }
  }
};

const handleChoice = (actionLink) => {
  if (isPanelOpen.value) togglePanel();
  const timeCost = 15; // default para protótipo
  remainingTime.value -= timeCost;

  const action = actionLink.action;
  // Simular rolagem (Em um sistema completo, somaria Atributo + Habilidade do personagem real)
  const totalDice = 5 + activeCautious.value; 
  targetDiff.value = Math.max(2, 6 - activeBloodSurge.value);
  const reqSuccesses = action.difficulty || 2;

  diceTargetText.value = `Rolando ${totalDice} Dados (Alvo D10: ${targetDiff.value} | Exige: ${reqSuccesses})`;
  isRolling.value = true;
  isRollingAnim.value = true;
  showRollResult.value = false;
  showRollContinue.value = false;
  
  diceRolls.value = Array(totalDice).fill(0);

  setTimeout(() => {
    isRollingAnim.value = false;
    let successes = 0;
    diceRolls.value = diceRolls.value.map(() => {
      const r = Math.floor(Math.random() * 10) + 1;
      if (r >= targetDiff.value) successes++;
      return r;
    });

    if (successes >= reqSuccesses) {
      rollResultTitle.value = `SUCESSO! (${successes})`;
      rollResultClass.value = 'text-green-500';
      rollResultDesc.value = `A ação foi bem sucedida. O tempo gasto foi de ${timeCost} minutos.`;
      pendingChoiceResult = actionLink.successSceneId;
    } else {
      rollResultTitle.value = `FALHA! (${successes})`;
      rollResultClass.value = 'text-red-500';
      let missing = reqSuccesses - successes;
      let penalty = Math.ceil(timeCost * (0.10 * missing));
      rollResultDesc.value = `Você fracassou. Punição de tempo: +${penalty}m.`;
      remainingTime.value -= penalty;
      pendingChoiceResult = actionLink.failureSceneId;
    }

    showRollResult.value = true;
    setTimeout(() => showRollContinue.value = true, 500);

    activeBloodSurge.value = 0;
    activeCautious.value = 0;
  }, 1500);
};

const finishRoll = () => {
  isRolling.value = false;
  
  if (pendingChoiceResult) {
    oldDisplayedText.value = displayedText.value;
    displayedText.value = ''; 
    
    loadSceneNode(pendingChoiceResult);

    isFlipping.value = true;

    setTimeout(() => {
      isFlipping.value = false;
      if (currentScene.value) {
        typeWriterEffect(currentScene.value.description.replace(/\n\n/g, '<br><br>'));
        showRollResult.value = false;
        showRollContinue.value = false;
        diceTargetText.value = '';
        rollResultTitle.value = '';
        rollResultDesc.value = '';
      }
    }, 1200);
  }
};

onMounted(async () => {
  try {
    const resChar = await api.get(`/characters/${charId}`);
    character.value = resChar.data;
    
    const resAdv = await api.get(`/adventures/${advId}`);
    adventure.value = resAdv.data;

    if (adventure.value.scenes && adventure.value.scenes.length > 0) {
      const initialScene = adventure.value.scenes.find(s => s.scene.sceneIdentifier === 'Cena01') || 
                           adventure.value.scenes.sort((a,b) => a.scene.sceneIdentifier.localeCompare(b.scene.sceneIdentifier))[0];
      
      currentScene.value = initialScene.scene;
      typeWriterEffect(currentScene.value.description.replace(/\n\n/g, '<br><br>'));
    }

  } catch (error) {
    console.error("Erro carregando aventura:", error);
  }
});
</script>

<style scoped>
@keyframes turnPageLeft {
  0% { transform: perspective(2000px) rotateY(0deg); }
  100% { transform: perspective(2000px) rotateY(-180deg); }
}
@keyframes shadowFade {
  0% { opacity: 0; }
  50% { opacity: 0.5; }
  100% { opacity: 0.8; }
}

.scene-fade-out { animation: fadeOut 0.5s forwards; }
.scene-fade-in { animation: fadeIn 0.8s forwards; }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.typewriter-cursor::after {
  content: '█'; 
  animation: blink 1s step-end infinite; 
  color: #b45309; 
  margin-left: 4px; 
  font-size: 0.9em;
}
@keyframes blink { 50% { opacity: 0; } }

@keyframes rollDice {
  0% { transform: rotate(0deg) scale(1) translate(0, 0); }
  25% { transform: rotate(90deg) scale(1.1) translate(5px, -10px); }
  50% { transform: rotate(180deg) scale(1) translate(0, 0); }
  75% { transform: rotate(270deg) scale(0.9) translate(-5px, 10px); }
  100% { transform: rotate(360deg) scale(1) translate(0, 0); }
}
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
.text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
</style>
