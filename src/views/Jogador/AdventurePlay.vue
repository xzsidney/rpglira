<template>
  <div class="h-screen w-screen flex items-center justify-center relative bg-[#050505] text-gray-300 font-serif overflow-hidden">
    
    <!-- Áudio Imersivo -->
    <audio ref="audioPlayer" v-if="currentScene" :src="currentScene.audioUrl || `/sounds/${currentScene.sceneIdentifier}.mp3`" autoplay loop></audio>

    <button @click="togglePanel" class="fixed top-6 left-6 z-40 bg-gray-900 border border-gray-700 text-gray-300 p-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg" title="Menu do Personagem">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Botão de Controle de Áudio -->
    <button @click="toggleAudio" class="fixed top-6 right-6 z-40 bg-gray-900 border border-gray-700 text-gray-300 p-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg" :title="isAudioMuted ? 'Ligar Som' : 'Desligar Som'">
      <svg v-if="!isAudioMuted" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
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

    <!-- FLIPBOOK CENTRAL COM PAGE-FLIP -->
    <div class="relative flex max-w-5xl w-full h-[80vh] min-h-[600px] rounded-lg overflow-visible shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)]">
      
      <!-- CONTAINER ESTÁTICO DO LIVRO -->
      <div id="book-container" class="w-full h-full relative z-10" v-once>
         <div id="book">
            <!-- PÁGINA 0 (Esquerda - Cena Atual Imagem) -->
            <div class="page" data-density="hard">
               <div class="w-full h-full bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#0a0a0a] rounded-l-lg relative overflow-hidden flex flex-col border border-gray-800 border-r-0">
                  <div class="h-3/4 w-full relative">
                     <img id="book-img-left" src="" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity">
                     <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]"></div>
                  </div>
                  <div class="h-1/4 w-full flex items-center justify-center p-8 bg-[#111]">
                     <h2 id="book-title-left" class="text-xl text-yellow-600/90 text-center font-bold tracking-wider uppercase text-shadow"></h2>
                  </div>
               </div>
            </div>

            <!-- PÁGINA 1 (Direita - Cena Atual Texto) -->
            <div class="page" data-density="hard">
               <div class="w-full h-full bg-gradient-to-l from-[#111] via-[#1a1a1a] to-[#0a0a0a] rounded-r-lg relative border border-gray-800 border-l-0 p-10 flex flex-col">
                  <div class="flex-grow overflow-y-auto pr-4 custom-scrollbar">
                     <p id="book-text-right" class="text-base md:text-lg text-gray-300 leading-loose min-h-[150px] typewriter-cursor"></p>
                  </div>
               </div>
            </div>

            <!-- PÁGINA 2 (Esquerda - Próxima Cena Imagem) -->
            <div class="page" data-density="hard">
               <div class="w-full h-full bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#0a0a0a] rounded-l-lg relative overflow-hidden flex flex-col border border-gray-800 border-r-0">
                  <div class="h-3/4 w-full relative">
                     <img id="book-img-next" src="" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity">
                     <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]"></div>
                  </div>
                  <div class="h-1/4 w-full flex items-center justify-center p-8 bg-[#111]">
                     <h2 id="book-title-next" class="text-xl text-yellow-600/90 text-center font-bold tracking-wider uppercase text-shadow"></h2>
                  </div>
               </div>
            </div>

            <!-- PÁGINA 3 (Direita - Próxima Cena Texto) -->
            <div class="page" data-density="hard">
               <div class="w-full h-full bg-gradient-to-l from-[#111] via-[#1a1a1a] to-[#0a0a0a] rounded-r-lg relative border border-gray-800 border-l-0 p-10 flex flex-col">
                  <div class="flex-grow overflow-y-auto pr-4 custom-scrollbar">
                     <p id="book-text-next" class="text-base md:text-lg text-gray-300 leading-loose min-h-[150px]"></p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- OVERLAYS INTERATIVOS (Removidos do livro para não sobrepor o texto) -->
      <div class="absolute inset-0 pointer-events-none z-20 flex">
      </div>

      <!-- ABAS LATERAIS (ESCOLHAS) - Totalmente fora do livro -->
      <div :class="['absolute -right-[160px] top-[40px] w-[160px] flex flex-col gap-[2px] z-30 transition-opacity duration-500', (isTransitioning || isRolling) ? 'opacity-0 pointer-events-none' : 'opacity-100']">
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

    <!-- OVERLAY DE ROLAGEM DE DADOS (Centralizado FORA do livro) -->
    <div v-if="isRolling || showRollResult" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="bg-[#0a0a0a] border border-gray-700 rounded-lg p-10 shadow-[0_0_50px_rgba(0,0,0,0.9)] max-w-lg w-full flex flex-col items-center scene-fade-in">
        <h3 class="text-gray-500 text-xs tracking-widest uppercase mb-8 font-sans text-center">{{ diceTargetText }}</h3>
        
        <div class="flex flex-wrap gap-4 justify-center items-center w-full mb-8">
          <div v-for="(roll, index) in diceRolls" :key="index" 
               :class="['w-[60px] h-[60px] bg-[#111] border rounded flex items-center justify-center text-3xl font-bold font-sans shadow-[inset_0_0_10px_rgba(0,0,0,0.8),0_5px_10px_rgba(0,0,0,0.5)] transition-all duration-300', 
                        isRollingAnim ? 'text-transparent border-[#333] animate-[rollDice_0.5s_infinite_linear]' : 
                        roll >= targetDiff ? 'text-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-red-500 border-red-500/50']">
            {{ isRollingAnim ? '' : roll }}
          </div>
        </div>

        <div class="transition-opacity duration-500 w-full flex flex-col items-center" :style="{ opacity: showRollResult ? 1 : 0 }">
          <h2 :class="['text-3xl font-bold uppercase tracking-widest text-center font-sans mb-4', rollResultClass]">
            {{ rollResultTitle }}
          </h2>
          <p class="text-gray-300 text-center text-base font-sans mb-8">
            {{ rollResultDesc }}
          </p>
          
          <button v-if="showRollContinue" @click="finishRoll" class="px-8 py-3 bg-yellow-700 hover:bg-yellow-600 text-black font-bold uppercase tracking-widest rounded transition-colors duration-300 shadow-[0_0_15px_rgba(180,83,9,0.5)] animate-pulse">
            Virar a Página (Continuar)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../services/api';
import { PageFlip } from 'page-flip';

const route = useRoute();
const charId = route.params.charId;
const advId = route.params.advId;

// State Globais
const character = ref(null);
const adventure = ref(null);
const currentScene = ref(null);
const nextScene = ref(null);
let bookFlip = null;
const audioPlayer = ref(null);
const isAudioMuted = ref(false);

const toggleAudio = () => {
  isAudioMuted.value = !isAudioMuted.value;
  if (audioPlayer.value) {
    audioPlayer.value.muted = isAudioMuted.value;
    if (!isAudioMuted.value && audioPlayer.value.paused) {
      audioPlayer.value.play().catch(e => console.warn('Erro ao forçar play', e));
    }
  }
};

watch(currentScene, () => {
  nextTick(() => {
    if (audioPlayer.value) {
      audioPlayer.value.volume = 0.5;
      audioPlayer.value.muted = isAudioMuted.value;
      if (!isAudioMuted.value) {
        audioPlayer.value.play().catch(e => console.warn('Autoplay bloqueado pelo navegador:', e));
      }
    }
  });
});

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

const updateSceneVisuals = (sceneObj, isNext = false) => {
  if(!sceneObj) return;
  const suffix = isNext ? 'next' : 'left';
  const imgEl = document.getElementById('book-img-' + suffix);
  if(imgEl) {
    imgEl.src = sceneObj.imageUrl || `/images/${sceneObj.sceneIdentifier}.jpg`;
  }
  const titleEl = document.getElementById('book-title-' + suffix);
  if(titleEl) titleEl.innerText = sceneObj.title || 'Carregando...';
  
  if(isNext) {
    const textEl = document.getElementById('book-text-next');
    if(textEl) textEl.innerHTML = sceneObj.description.replace(/\n\n/g, '<br><br>');
  }
};

const typeWriterEffect = (fullHtml) => {
  const textEl = document.getElementById('book-text-right');
  if(!textEl) return;
  textEl.innerHTML = '';
  let index = 0;
  const loop = () => {
    if (index < fullHtml.length) {
      if (fullHtml.charAt(index) === '<') {
        let tagEnd = fullHtml.indexOf('>', index);
        if (tagEnd !== -1) index = tagEnd;
      }
      textEl.innerHTML = fullHtml.substring(0, index + 1);
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

const loadSceneNode = (sceneId, isNext = false) => {
  if (adventure.value && adventure.value.scenes) {
    const scene = adventure.value.scenes.find(as => as.sceneId === sceneId);
    if (scene) {
      if (isNext) {
        nextScene.value = scene.scene;
      } else {
        currentScene.value = scene.scene;
      }
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
    // Carrega a proxima cena e renderiza nos divs estáticos da p3 e p4
    loadSceneNode(pendingChoiceResult, true);
    updateSceneVisuals(nextScene.value, true);

    showRollResult.value = false;
    showRollContinue.value = false;
    diceTargetText.value = '';
    rollResultTitle.value = '';
    rollResultDesc.value = '';

    if (bookFlip) {
      bookFlip.flipNext();
    }
  }
};

onMounted(async () => {
  // Inicialização PageFlip UI
  const container = document.getElementById('book');
  if (container) {
     bookFlip = new PageFlip(container, {
        width: 512, // Metade do max-w-5xl (1024)
        height: 600,
        size: "stretch",
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1350,
        showCover: false, 
        usePortrait: false,
        maxShadowOpacity: 0.5
     });
     bookFlip.loadFromHTML(document.querySelectorAll('.page'));

     bookFlip.on('flip', (e) => {
         if (e.data === 2 || e.data === 3) {
             currentScene.value = nextScene.value;
             updateSceneVisuals(currentScene.value, false);
             bookFlip.turnToPage(0); // Volta invisivelmente
             typeWriterEffect(currentScene.value.description.replace(/\n\n/g, '<br><br>'));
         }
     });
  }

  try {
    const resChar = await api.get(`/characters/${charId}`);
    character.value = resChar.data;
    
    const resAdv = await api.get(`/adventures/${advId}`);
    adventure.value = resAdv.data;

    if (adventure.value.scenes && adventure.value.scenes.length > 0) {
      const initialScene = adventure.value.scenes.find(s => s.scene.sceneIdentifier === 'Cena01') || 
                           adventure.value.scenes.sort((a,b) => a.scene.sceneIdentifier.localeCompare(b.scene.sceneIdentifier))[0];
      
      currentScene.value = initialScene.scene;
      updateSceneVisuals(currentScene.value, false);
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
