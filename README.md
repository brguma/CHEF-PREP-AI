# 🍳 ChefPrep

![version](https://img.shields.io/badge/version-1.11.0-orange) ![PWA](https://img.shields.io/badge/PWA-offline--first-blue) ![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen) ![recipes](https://img.shields.io/badge/recipes-817-red) ![license](https://img.shields.io/badge/license-proprietary-lightgrey)

**🇺🇸 [English](#-english) · 🇧🇷 [Português](#-português)**

---

## 🇺🇸 English

**ChefPrep** is an offline-first kitchen management PWA: 817 recipes with a smart pantry that actually understands what you have. Everything runs locally on your device — no accounts, no servers, no tracking. The app shell is intentionally lightweight: vanilla HTML/JS, a service worker, a PWA manifest, and an external recipe seed file.

### ✨ Features

**🧠 Smart pantry.** The pantry↔recipe matching engine tolerates typos ("shoyo" matches *molho shoyu*), brand names ("shoyo kikkoman premium"), embedded quantities ("Molho Shoyo 1 Litro"), and plural/singular variations — while refusing dangerous false positives (*pimenta* ≠ *pimentão*, *couve* ≠ *couve-flor*). Items are linked to the recipe vocabulary the moment you add them, with autocomplete over ~200 canonical ingredients.

**➕ Quantities that merge.** Add onions twice and you get one entry with the summed amount — including automatic unit conversion (500 g + 1 kg = 1.5 kg; ml↔l). When batches have expiry dates, the entry keeps the earliest one, so the alert fires for the oldest batch.

**🍽️ "What can I cook right now?"** Suggestions ranked by what's in your pantry, prioritizing ingredients about to expire. Filter recipes by *ready to cook*, *missing 1 ingredient*, or *missing 2*.

**⏲️ Cooking mode.** Step-by-step view with one-tap timers parsed from the instructions, screen wake lock, and stock deduction when you're done — converting units on the way and consuming earliest-expiry batches first. The deduction flow includes a review step before applying changes.

**🛒 Batch pantry entry.** Paste a grocery haul in free-form text and route parsed items through the same merge/conversion engine used by normal pantry entry.

**🔄 Ingredient substitutions.** Curated substitution hints are shown when an appropriate substitute is actually available in the pantry or is treated as a staple.

**🔍 Typo-tolerant search.** Searches names, categories, tags *and ingredients*: "fragno" finds chicken recipes, "costela" doesn't match "congela".

**📅 Weekly plan & shopping list.** Missing ingredients go to the list in one tap; purchased items flow back into the pantry through the same merging engine.

**📊 Statistics.** What you can cook now, pantry distribution, expiring items, and your most-cooked recipes ranking.

**↩️ Undo where destructive actions matter.** Critical flows use a short undo window or explicit review instead of relying only on irreversible one-tap actions.

**📦 817 recipes** in Brazilian Portuguese, including air fryer, microwave, burgers, quick snacks, tapiocas and fit recipes, in addition to the existing categories and technique-first steps.

### 🚀 Getting started

ChefPrep is a static site. Any static host works:

1. Clone the repo and serve `index.html`, `sw.js`, `manifest.webmanifest` and `receitas.json` from the same site root (GitHub Pages, Netlify, or `python3 -m http.server`).
2. Open it in a mobile browser and use **"Add to Home Screen"** — it installs as an app and works offline after the app shell and seed have been cached/initialized.
3. That's it. There is no build step.

The service worker uses a network-first strategy with cache fallback. `receitas.json` is the recipe seed source used for first install and seed-version migrations; keep it deployed together with the app whenever recipe data changes. Existing user data, favorites, edits and deletions are preserved by the seed migration rules.

### 🔒 Privacy

User data lives in the browser's IndexedDB. Backup and restore are available through JSON export/import in Settings. The baseline has no account or mandatory backend.

### 🛠️ Tech

- **App shell**: `index.html` (vanilla JS, no framework, no build step)
- **Recipe seed**: `receitas.json`
- **PWA**: `manifest.webmanifest` + `sw.js`
- **Storage**: IndexedDB (recipes, pantry, weekly plan, shopping list, settings)
- **Offline**: Service Worker, network-first with cache fallback
- **Matching engine**: canonical names + synonym dictionary + OSA edit distance (Damerau) + Portuguese singularization, with layered exact → fuzzy → subset/head-noun resolution
- **Recipe importing**: paste AI-generated JSON using the built-in prompt/template flow

### 📄 License

**Proprietary software** — © 2026 Bruno Machado, BM Engenharia e Consultoria Ltda. All rights reserved.

Personal, non-commercial use of the app as provided is permitted, and your data is always yours (JSON export/import). Copying, modifying, redistributing, or commercially exploiting the source code, the recipe database, or any component is prohibited without prior written permission. See the [LICENSE](LICENSE) file for the full terms. For licensing inquiries, contact the author.

---

## 🇧🇷 Português

**ChefPrep** é um PWA offline-first de gestão de cozinha: 817 receitas com uma despensa inteligente que entende de verdade o que você tem. Tudo roda localmente no aparelho — sem conta, sem servidor obrigatório e sem rastreamento no baseline atual. O shell do app continua leve: HTML/JS puro, service worker, manifesto PWA e um arquivo externo de seed de receitas.

### ✨ Funcionalidades

**🧠 Despensa inteligente.** O motor de cruzamento despensa↔receita tolera erros de digitação ("shoyo" casa com *molho shoyu*), marcas ("shoyo kikkoman premium"), quantidade embutida no nome ("Molho Shoyo 1 Litro") e singular/plural — recusando falsos positivos perigosos (*pimenta* ≠ *pimentão*, *couve* ≠ *couve-flor*). Os itens são vinculados ao vocabulário das receitas no momento em que você adiciona, com autocomplete de ~200 ingredientes canônicos.

**➕ Quantidades que se somam.** Adicionou cebola duas vezes? Vira uma entrada só, com a soma — incluindo conversão automática de unidades (500 g + 1 kg = 1,5 kg; ml↔l). Quando os lotes têm validade, a entrada guarda a data mais próxima, para o alerta disparar pelo lote mais antigo.

**🍽️ "O que dá pra fazer agora?"** Sugestões ordenadas pelo que há na despensa, priorizando ingredientes perto de vencer. Filtre as receitas por *posso fazer*, *falta 1 ingrediente* ou *faltam 2*.

**⏲️ Modo cozinhando.** Passo a passo com timers de um toque extraídos das instruções, wake lock e baixa de estoque ao terminar — com conversão de unidades, consumo dos lotes que vencem primeiro e tela de conferência antes de aplicar a baixa.

**🛒 Chegada da feira.** Cole uma compra inteira em texto livre e o app interpreta quantidade, unidade e local, usando o mesmo motor de soma/conversão da despensa.

**🔄 Substituições.** Sugestões culinárias aparecem quando o substituto adequado já está disponível na despensa ou é tratado como item básico.

**🔍 Busca tolerante a erros.** Procura em nomes, categorias, tags *e ingredientes*: "fragno" acha receitas de frango, e "costela" não casa com "congela".

**📅 Plano semanal e lista de compras.** Ingredientes faltantes vão para a lista em um toque; itens comprados voltam para a despensa pelo mesmo motor de soma.

**📊 Estatísticas.** O que você consegue cozinhar agora, distribuição do estoque, itens vencendo e o ranking das suas receitas mais feitas.

**↩️ Segurança em ações destrutivas.** Fluxos críticos usam janela de desfazer ou etapa explícita de conferência em vez de depender apenas de ações irreversíveis de um toque.

**📦 817 receitas** em português do Brasil, incluindo novos pacotes de air fryer, micro-ondas, hambúrgueres artesanais, lanches rápidos, tapiocas e receitas fit, além das categorias já existentes.

### 🚀 Como usar

O ChefPrep é um site estático. Qualquer hospedagem estática serve:

1. Clone o repositório e sirva `index.html`, `sw.js`, `manifest.webmanifest` e `receitas.json` na mesma raiz (GitHub Pages, Netlify, ou `python3 -m http.server`).
2. Abra no navegador do celular e use **"Adicionar à tela inicial"** — instala como app e funciona offline depois que o shell e o seed forem carregados/inicializados.
3. Não existe etapa de build.

O service worker usa estratégia network-first com fallback de cache. `receitas.json` é a fonte do seed usada na primeira instalação e nas migrações de versão; mantenha esse arquivo publicado junto do app sempre que o banco de receitas mudar. As regras de migração preservam dados do usuário, favoritos, edições e exclusões.

### 🔒 Privacidade

Os dados do usuário ficam no IndexedDB do navegador. Backup e restauração são feitos por exportar/importar JSON nas Configurações. O baseline atual não exige conta nem backend obrigatório.

### 🛠️ Tecnologia

- **Shell do app**: `index.html` (JavaScript puro, sem framework, sem build)
- **Seed de receitas**: `receitas.json`
- **PWA**: `manifest.webmanifest` + `sw.js`
- **Armazenamento**: IndexedDB (receitas, despensa, plano semanal, lista de compras, configurações)
- **Offline**: Service Worker, network-first com fallback de cache
- **Motor de cruzamento**: nomes canônicos + dicionário de sinônimos + distância de edição OSA (Damerau) + singularização do português, com resolução exata → fuzzy → subconjunto/cabeça do sintagma
- **Importação de receitas**: JSON gerado por IA pelo fluxo/template embutido no app

### 📄 Licença

**Software proprietário** — © 2026 Bruno Machado, BM Engenharia e Consultoria Ltda. Todos os direitos reservados.

O uso pessoal e não comercial do app, na forma disponibilizada, é permitido — e os seus dados são sempre seus (exportar/importar JSON). É proibido copiar, modificar, redistribuir ou explorar comercialmente o código-fonte, o banco de receitas ou qualquer componente sem autorização prévia por escrito. Consulte o arquivo [LICENSE](LICENSE) para os termos completos. Para licenciamento, contate o autor.
