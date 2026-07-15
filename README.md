# 🍳 ChefPrep

![version](https://img.shields.io/badge/version-1.9.1-orange) ![PWA](https://img.shields.io/badge/PWA-offline--first-blue) ![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen) ![recipes](https://img.shields.io/badge/recipes-716-red)

**🇺🇸 [English](#-english) · 🇧🇷 [Português](#-português)**

---

## 🇺🇸 English

**ChefPrep** is an offline-first kitchen management PWA: 716 recipes with a smart pantry that actually understands what you have. Everything runs locally on your device — no accounts, no servers, no tracking. The entire app is a single HTML file.

### ✨ Features

**🧠 Smart pantry.** The pantry↔recipe matching engine tolerates typos ("shoyo" matches *molho shoyu*), brand names ("shoyo kikkoman premium"), embedded quantities ("Molho Shoyo 1 Litro"), and plural/singular variations — while refusing dangerous false positives (*pimenta* ≠ *pimentão*, *couve* ≠ *couve-flor*). Items are linked to the recipe vocabulary the moment you add them, with autocomplete over ~200 canonical ingredients.

**➕ Quantities that merge.** Add onions twice and you get one entry with the summed amount — including automatic unit conversion (500 g + 1 kg = 1.5 kg; ml↔l). When batches have expiry dates, the entry keeps the earliest one, so the alert fires for the oldest batch.

**🍽️ "What can I cook right now?"** Suggestions ranked by what's in your pantry, prioritizing ingredients about to expire. Filter recipes by *ready to cook*, *missing 1 ingredient*, or *missing 2*.

**⏲️ Cooking mode.** Step-by-step view with one-tap timers parsed from the instructions, screen wake lock, and automatic stock deduction when you're done — converting units on the way (2 tbsp of soy sauce deducts 30 ml from your 1 L bottle) and consuming earliest-expiry batches first.

**🔍 Typo-tolerant search.** Searches names, categories, tags *and ingredients*: "fragno" finds chicken recipes, "costela" doesn't match "congela".

**📅 Weekly plan & shopping list.** Missing ingredients go to the list in one tap; purchased items flow back into the pantry through the same merging engine.

**📊 Statistics.** What you can cook now, pantry distribution, expiring items, and your most-cooked recipes ranking.

**↩️ Undo everywhere.** Deleting a recipe, pantry item, list item, or plan entry shows a 5-second undo toast instead of a scary confirm dialog.

**📦 716 recipes** in Brazilian Portuguese across 8 categories — mains, salads, soups, preserves & ferments, desserts, quick meals, sides, and sauces/staples — with detailed technique-first steps, explicit timings, nutrition data, and food-safety notes on preserves.

### 🚀 Getting started

ChefPrep is a static site. Any static host works:

1. Clone the repo and serve `index.html` + `sw.js` from any web server (GitHub Pages, Netlify, or `python3 -m http.server`).
2. Open it in a mobile browser and use **"Add to Home Screen"** — it installs as an app and works fully offline.
3. That's it. There is no step 3.

Updates ship by replacing the two files: the service worker uses a network-first strategy, so users get the new version on the next online launch. New seed recipes and step improvements are applied automatically without touching user data (favorites, edits, and deletions are preserved).

### 🔒 Privacy

All data lives in your browser's IndexedDB. Nothing ever leaves your device. Backup and restore via JSON export/import in Settings.

### 🛠️ Tech

- **Single-file architecture**: one `index.html` (vanilla JS, no frameworks, no build step) + one `sw.js`
- **Storage**: IndexedDB (recipes, pantry, weekly plan, shopping list, settings)
- **Offline**: Service Worker, network-first with cache fallback
- **Matching engine**: canonical names + synonym dictionary + OSA edit distance (Damerau) + Portuguese singularization, with layered exact → fuzzy → subset resolution
- **Recipe importing**: paste AI-generated JSON (a built-in prompt template converts any recipe with tools like Claude)

### 📄 License

MIT

---

## 🇧🇷 Português

**ChefPrep** é um PWA offline-first de gestão de cozinha: 716 receitas com uma despensa inteligente que entende de verdade o que você tem. Tudo roda localmente no seu aparelho — sem conta, sem servidor, sem rastreamento. O app inteiro é um único arquivo HTML.

### ✨ Funcionalidades

**🧠 Despensa inteligente.** O motor de cruzamento despensa↔receita tolera erros de digitação ("shoyo" casa com *molho shoyu*), marcas ("shoyo kikkoman premium"), quantidade embutida no nome ("Molho Shoyo 1 Litro") e singular/plural — recusando falsos positivos perigosos (*pimenta* ≠ *pimentão*, *couve* ≠ *couve-flor*). Os itens são vinculados ao vocabulário das receitas no momento em que você adiciona, com autocomplete de ~200 ingredientes canônicos.

**➕ Quantidades que se somam.** Adicionou cebola duas vezes? Vira uma entrada só, com a soma — incluindo conversão automática de unidades (500 g + 1 kg = 1,5 kg; ml↔l). Quando os lotes têm validade, a entrada guarda a data mais próxima, para o alerta disparar pelo lote mais antigo.

**🍽️ "O que dá pra fazer agora?"** Sugestões ordenadas pelo que há na despensa, priorizando ingredientes perto de vencer. Filtre as receitas por *posso fazer*, *falta 1 ingrediente* ou *faltam 2*.

**⏲️ Modo cozinhando.** Passo a passo com timers de um toque extraídos das instruções, tela sempre acesa (wake lock) e baixa automática do estoque ao terminar — convertendo unidades no caminho (2 col. de sopa de shoyu descontam 30 ml da sua garrafa de 1 L) e consumindo primeiro os lotes que vencem antes.

**🔍 Busca tolerante a erros.** Procura em nomes, categorias, tags *e ingredientes*: "fragno" acha receitas de frango, e "costela" não casa com "congela".

**📅 Plano semanal e lista de compras.** Ingredientes faltantes vão para a lista em um toque; itens comprados voltam para a despensa pelo mesmo motor de soma.

**📊 Estatísticas.** O que você consegue cozinhar agora, distribuição do estoque, itens vencendo e o ranking das suas receitas mais feitas.

**↩️ Desfazer em tudo.** Excluir receita, item da despensa, item da lista ou entrada do plano mostra um toast de desfazer por 5 segundos, em vez de um diálogo de confirmação chato.

**📦 716 receitas** em português do Brasil, em 8 categorias — pratos principais, saladas, sopas, conservas e fermentados, doces, refeições rápidas, acompanhamentos e molhos/bases — com passos detalhados que ensinam a técnica, tempos explícitos, informação nutricional e notas de segurança alimentar nas conservas.

### 🚀 Como usar

O ChefPrep é um site estático. Qualquer hospedagem estática serve:

1. Clone o repositório e sirva `index.html` + `sw.js` de qualquer servidor web (GitHub Pages, Netlify, ou `python3 -m http.server`).
2. Abra no navegador do celular e use **"Adicionar à tela inicial"** — instala como app e funciona 100% offline.
3. Pronto. Não existe passo 3.

Atualizações são publicadas substituindo os dois arquivos: o service worker usa estratégia network-first, então os usuários recebem a nova versão na próxima abertura com internet. Receitas novas e melhorias de passos são aplicadas automaticamente sem tocar nos dados do usuário (favoritos, edições e exclusões são preservados).

### 🔒 Privacidade

Todos os dados vivem no IndexedDB do seu navegador. Nada sai do seu aparelho. Backup e restauração via exportar/importar JSON nas Configurações.

### 🛠️ Tecnologia

- **Arquitetura de arquivo único**: um `index.html` (JavaScript puro, sem frameworks, sem build) + um `sw.js`
- **Armazenamento**: IndexedDB (receitas, despensa, plano semanal, lista de compras, configurações)
- **Offline**: Service Worker, network-first com fallback de cache
- **Motor de cruzamento**: nomes canônicos + dicionário de sinônimos + distância de edição OSA (Damerau) + singularização do português, com resolução em camadas exato → fuzzy → subconjunto
- **Importação de receitas**: cole um JSON gerado por IA (o app inclui um modelo de prompt que converte qualquer receita com ferramentas como o Claude)

### 📄 Licença

MIT
