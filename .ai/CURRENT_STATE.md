# CURRENT STATE

Projeto: ChefPrep
Data: 2026-09-16
Status: ATIVO — P1 no Project Mesh

## Estado atual
O baseline publicado/canônico em `main` continua sendo `v1.11.0` / 817 receitas até merge e validação de deploy.

Há um candidato de hardening `v1.11.1` na branch `fix/core-reliability-2026-09`. Ele preserva a arquitetura vanilla/offline-first e corrige problemas de confiabilidade encontrados na auditoria do núcleo, sem introduzir framework, backend ou migração destrutiva.

## Correções do candidato v1.11.1
- Matching despensa↔receita agora considera **quantidade suficiente**, não apenas presença de algum estoque.
- Faltas parciais passam a informar a quantidade realmente faltante.
- Plano semanal consolida a demanda total de todas as refeições antes de descontar o estoque, evitando reutilizar o mesmo estoque várias vezes.
- Lista de compras atualiza a quantidade necessária de itens já existentes e preserva linhas separadas quando as unidades são incompatíveis.
- Restauração de backup foi endurecida com validação prévia e transação IndexedDB multistore atômica.
- Service Worker foi alinhado a `chefprep-v1.11.1` e não substitui cache válido por respostas HTTP com erro.
- `core-fixes.js` concentra o hardening sobre o baseline v1.11.0, deixando `index.html` praticamente intacto e facilitando revisão/rollback.

## Testes automatizados
Foi adicionada a suíte `tests/core-regression.test.cjs`, executada no GitHub Actions por `.github/workflows/test.yml`.

Casos cobertos:
- estoque parcial (ex.: 50 g disponíveis para necessidade de 500 g);
- soma de lotes com conversão kg↔g;
- consolidação de demanda repetida no plano semanal;
- atualização idempotente da lista de compras;
- preservação de demandas independentes por origem e de demandas com unidades incompatíveis;
- estrutura final de carregamento de `core-fixes.js`;
- versionamento/cache do Service Worker e rejeição de HTTP inválido antes de cachear.

A suíte passou nas rodadas anteriores do hardening; o gate para merge é manter o run final verde após qualquer ajuste adicional.

## Validação ainda necessária antes de tratar como release concluída
1. Manter CI/regressão verde no commit final da branch/PR.
2. Revisar o diff do PR e resolver qualquer achado de code review.
3. Executar QA de navegador/PWA proporcional: primeira instalação, atualização sobre instalação existente, persistência IndexedDB, offline, import/export, matching, lista→despensa e baixa de estoque.
4. Só então fazer merge/deploy para `main`.

## Deploy / privacidade
- Arquitetura: hospedagem estática/PWA via GitHub Pages.
- Repositório ainda observado como público; a decisão de estado-alvo continua sendo PRIVADO quando isso puder ser feito sem derrubar o app publicado.
- Privatização não faz parte do hardening v1.11.1 e não deve ser misturada com este PR.

## Riscos residuais
- O baseline continua majoritariamente single-file; `core-fixes.js` reduz o risco desta rodada, mas modularização estrutural futura ainda deve passar por Gate 0.
- Matching fuzzy continua sendo capacidade central e requer expansão progressiva de testes positivos e negativos.
- Há operações legadas de persistência que ainda são fire-and-forget; o hardening desta rodada corrige a restauração crítica, mas não refatora toda a camada de gravação.
- O candidato ainda precisa de QA de navegador real antes de ser classificado como release plenamente validada.

## Handoff
- Leia `.ai/PROJECT_CONTEXT.md`, este arquivo e `.ai/DECISIONS.md` antes de alterar o produto.
- Repositório canônico: `brguma/CHEF-PREP-AI`.
- `brguma/app-creator` não é a implementação atual por padrão.
- Branch de hardening atual: `fix/core-reliability-2026-09`.
- Não fazer push direto em `main`; concluir via PR + gates.
- Antes de nova feature relevante: consultar BANCO IA, concorrentes/análogos e Gate 0.
