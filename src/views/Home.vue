<template>
  <div class="bg-background text-gray-200 min-h-screen font-body overflow-x-hidden">
    <!-- Navbar -->
    <header class="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-surface">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="font-headline text-3xl text-gray-100 tracking-wider">LiraRPG</h1>
        <nav class="hidden md:flex space-x-8">
          <a href="#sistemas" class="hover:text-vampire transition-colors">Sistemas</a>
          <a href="#narrativas" class="hover:text-vampire transition-colors">Narrativas</a>
          <a href="#estatisticas" class="hover:text-vampire transition-colors">Comunidade</a>
        </nav>
        <div class="flex items-center space-x-4">
          <router-link to="/login" class="hover:text-vampire transition-colors">Entrar</router-link>
          <router-link to="/cadastro" class="bg-vampire hover:bg-red-900 text-white px-6 py-2 rounded-md font-semibold transition-all shadow-[0_0_15px_rgba(139,0,0,0.4)] hover:shadow-[0_0_25px_rgba(139,0,0,0.6)]">
            Cadastrar-se
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center text-center">
      <div class="absolute inset-0 bg-gradient-to-b from-vampire/10 to-background pointer-events-none"></div>
      
      <div class="inline-flex items-center border border-surface bg-surface/50 rounded-full px-4 py-1.5 mb-8">
        <span class="w-2 h-2 rounded-full bg-vampire mr-2 animate-pulse"></span>
        <span class="text-sm font-medium tracking-wide">O UNIVERSO DIGITAL DA ESCURIDÃO</span>
      </div>

      <h2 class="font-headline text-5xl md:text-7xl mb-6 max-w-4xl leading-tight text-gray-100">
        Sua Próxima Crônica <br/> Começa nas <span class="italic text-vampire">Sombras</span>
      </h2>
      <p class="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
        Gerencie fichas complexas com facilidade e mergulhe em aventuras solo assíncronas no universo de World of Darkness. Onde a narrativa encontra a elegância da escuridão.
      </p>
      
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 z-10">
        <router-link to="/login" class="bg-vampire hover:bg-red-900 text-white px-8 py-3 rounded-md font-semibold text-lg transition-all shadow-[0_0_15px_rgba(139,0,0,0.4)] flex items-center justify-center">
          Começar Agora <span class="ml-2">→</span>
        </router-link>
        <a href="#sistemas" class="border border-gray-600 hover:border-gray-400 text-gray-200 px-8 py-3 rounded-md font-semibold text-lg transition-all flex items-center justify-center bg-surface/30">
          Explorar Sistemas
        </a>
      </div>
    </section>

    <!-- Sistemas Suportados (Grid) -->
    <section id="sistemas" class="py-24 px-6 bg-surface/30">
      <div class="container mx-auto max-w-6xl">
        <h3 class="font-headline text-4xl mb-4 text-gray-100">Sistemas Suportados</h3>
        <p class="text-gray-400 mb-12 max-w-2xl">Integração nativa com as regras da 5ª Edição e clássicos do WoD. Automatize sua ficha e foque no Roleplay.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Vampire -->
          <div class="group relative rounded-xl overflow-hidden h-[400px] border border-gray-800 hover:border-vampire transition-colors cursor-pointer">
            <img src="/vampire.png" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6">
              <h4 class="font-headline text-2xl text-gray-100 mb-2">Vampire: A Máscara (V5)</h4>
              <p class="text-sm text-gray-400 mb-4 line-clamp-2">Controle sua fome e mantenha sua humanidade em uma narrativa de horror aditivo.</p>
              <div class="flex space-x-2">
                <span class="text-xs bg-surface/80 border border-gray-700 px-2 py-1 rounded">Sangue Secundário</span>
                <span class="text-xs bg-surface/80 border border-gray-700 px-2 py-1 rounded">Lore Drops</span>
              </div>
            </div>
          </div>

          <!-- Werewolf -->
          <div class="group relative rounded-xl overflow-hidden h-[400px] border border-gray-800 hover:border-werewolf transition-colors cursor-pointer">
            <img src="/werewolf.png" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6">
              <h4 class="font-headline text-2xl text-gray-100 mb-2">Lobisomem (W5)</h4>
              <p class="text-sm text-gray-400 mb-4 line-clamp-2">Lute contra a corrupção da Wyrm e proteja Gaia com a fúria da sua matilha.</p>
              <div class="flex space-x-2">
                <span class="text-xs bg-surface/80 border border-gray-700 px-2 py-1 rounded">Garou Forms</span>
              </div>
            </div>
          </div>

          <!-- Mage -->
          <div class="group relative rounded-xl overflow-hidden h-[400px] border border-gray-800 hover:border-mage transition-colors cursor-pointer">
            <img src="/mage.png" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6">
              <h4 class="font-headline text-2xl text-gray-100 mb-2">Mago (M20)</h4>
              <p class="text-sm text-gray-400 mb-4 line-clamp-2">A realidade é maleável. Desperte sua vontade e remodele o universo enfrentando o Paradoxo.</p>
              <div class="flex space-x-2">
                <span class="text-xs bg-surface/80 border border-gray-700 px-2 py-1 rounded">Sistema de Esferas</span>
              </div>
            </div>
          </div>

          <!-- Hunter (Wide Card) -->
          <div class="group relative rounded-xl overflow-hidden h-[400px] md:col-span-2 lg:col-span-3 border border-gray-800 hover:border-hunter transition-colors cursor-pointer">
            <img src="/hunter.png" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80 object-top" />
            <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-background/90 to-transparent"></div>
            <div class="absolute bottom-0 left-0 md:top-0 md:bottom-auto md:my-auto p-6 md:p-12 md:max-w-2xl flex flex-col justify-center h-full">
              <span class="text-hunter text-xs font-bold tracking-widest uppercase mb-2">Lançamento Recente</span>
              <h4 class="font-headline text-3xl md:text-4xl text-gray-100 mb-4">Caçador: A Revanche (H5)</h4>
              <p class="text-gray-400 mb-6">Quando os monstros são reais, alguém precisa revidar. O sistema definitivo para caçar o que habita na noite, com ferramentas de gestão de equipamentos e motivação.</p>
              <a href="#" class="text-hunter font-semibold flex items-center hover:text-orange-500 transition-colors">
                Saiba mais sobre H5 <span class="ml-2">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Narrativas Vivas -->
    <section id="narrativas" class="py-32 px-6">
      <div class="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Representação Visual da Aventura -->
        <div class="relative w-full aspect-video bg-surface rounded-xl border border-gray-800 shadow-2xl overflow-hidden group">
          <div class="absolute -inset-1 bg-gradient-to-r from-vampire/30 to-purple-900/30 blur-2xl z-0"></div>
          <img src="/adventure.png" class="relative z-10 w-full h-full object-cover rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-transform duration-1000 group-hover:scale-105" alt="Aventura Solo LiraRPG" />
          <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
        </div>

        <div>
          <h3 class="font-headline text-4xl text-gray-100 mb-6">Narrativas <span class="italic text-vampire">Vivas</span> e Imersivas</h3>
          <p class="text-gray-400 mb-10 text-lg">Experimente nosso módulo de aventuras solo assíncronas, ideal para a união entre os RPGs clássicos de mesa e os sistemas modernos de APP. Suas escolhas moldam a crônica, com o sistema Lira calculando suas rolagens e consequências em tempo real.</p>
          
          <ul class="space-y-8">
            <li class="flex items-start">
              <div class="mt-1 w-6 h-6 rounded-full border-2 border-vampire flex items-center justify-center flex-shrink-0 text-vampire mr-4">✓</div>
              <div>
                <h4 class="text-gray-200 font-semibold mb-1">Decisões com Consequências</h4>
                <p class="text-sm text-gray-500">Cada escolha afeta permanentemente seus Atributos e Dinâmicas.</p>
              </div>
            </li>
            <li class="flex items-start">
              <div class="mt-1 w-6 h-6 rounded-full border-2 border-vampire flex items-center justify-center flex-shrink-0 text-vampire mr-4">✓</div>
              <div>
                <h4 class="text-gray-200 font-semibold mb-1">Jogue no Seu Ritmo</h4>
                <p class="text-sm text-gray-500">Sistema assíncrono que salva seu progresso instantaneamente.</p>
              </div>
            </li>
            <li class="flex items-start">
              <div class="mt-1 w-6 h-6 rounded-full border-2 border-vampire flex items-center justify-center flex-shrink-0 text-vampire mr-4">✓</div>
              <div>
                <h4 class="text-gray-200 font-semibold mb-1">Interface Focada no Texto</h4>
                <p class="text-sm text-gray-500">Elimina distrações e mergulha profundamente na atmosfera do WoD.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Estatísticas -->
    <section id="estatisticas" class="py-24 px-6 border-y border-surface bg-surface/20 text-center">
      <h3 class="font-headline text-3xl md:text-4xl text-vampire/80 uppercase tracking-widest mb-4">A Arquitetura Ideal para Narrativas Infinitas</h3>
      <p class="text-gray-400 max-w-2xl mx-auto mb-16">Construído por narradores para narradores. A ferramenta que você precisava para dar vida ao seu World of Darkness.</p>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <div>
          <p class="font-headline text-5xl text-gray-100 mb-2">15k+</p>
          <p class="text-xs uppercase tracking-widest text-gray-500 font-semibold">Fichas Criadas</p>
        </div>
        <div>
          <p class="font-headline text-5xl text-gray-100 mb-2">250+</p>
          <p class="text-xs uppercase tracking-widest text-gray-500 font-semibold">Crônicas Ativas</p>
        </div>
        <div>
          <p class="font-headline text-5xl text-gray-100 mb-2">98%</p>
          <p class="text-xs uppercase tracking-widest text-gray-500 font-semibold">Imersão Garantida</p>
        </div>
        <div>
          <p class="font-headline text-5xl text-gray-100 mb-2">24/7</p>
          <p class="text-xs uppercase tracking-widest text-gray-500 font-semibold">Disponibilidade</p>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-32 px-6">
      <div class="max-w-4xl mx-auto bg-surface/40 border border-gray-800 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-vampire to-transparent"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-vampire/10 via-transparent to-transparent"></div>
        
        <h3 class="relative z-10 font-headline text-4xl md:text-5xl text-gray-100 mb-6">Pronto para sua primeira mordida?</h3>
        <p class="relative z-10 text-gray-400 mb-10 max-w-xl mx-auto">Crie sua conta agora e ganhe acesso imediato a todas as ferramentas de criação de personagens e o prólogo da História de Lançamento!</p>
        
        <div class="relative z-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <router-link to="/cadastro" class="bg-vampire hover:bg-red-900 text-white px-10 py-4 rounded-md font-semibold text-lg transition-all shadow-[0_0_20px_rgba(139,0,0,0.5)]">
            Inscrever-se Gratuitamente
          </router-link>
          <p class="text-xs text-gray-500">Demora menos de 1 minuto.<br/>Apenas na sua Escuridão.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-surface bg-background py-12 px-6">
      <div class="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <h2 class="font-headline text-2xl text-gray-100 mb-4">LiraRPG</h2>
          <p class="text-xs text-gray-500 max-w-sm mb-6">© 2026 LiraRPG. World of Darkness. Documento gerado internamente para ilustrar narrativas épicas.</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Comunidade</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-vampire">Discord</a></li>
            <li><a href="#" class="hover:text-vampire">Instagram</a></li>
            <li><a href="#" class="hover:text-vampire">Twitter</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Legal</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-vampire">Termos de Uso</a></li>
            <li><a href="#" class="hover:text-vampire">Privacidade</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>