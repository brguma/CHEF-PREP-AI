# PROJECT CONTEXT

Projeto: ChefPrep
Repositório: `brguma/CHEF-PREP-AI`
Status: ATIVO
Prioridade BANCO IA: P1
Última atualização deste contexto: 2026-09-04

## Objetivo
ChefPrep é um PWA offline-first de gestão de cozinha e despensa. O produto cruza o estoque disponível com uma biblioteca de receitas para ajudar a responder “o que posso cozinhar agora?”, reduzir desperdício, organizar compras e planejamento semanal e apoiar o preparo passo a passo.

## Usuário / uso
- Uso primário atual: cozinha pessoal, com operação mobile/PWA e funcionamento offline.
- O app deve continuar útil sem conta, servidor ou conectividade permanente.
- Intenção futura de distribuição/comercialização além do uso atual não está confirmada neste arquivo e não deve ser presumida.

## Stack
- HTML5 + CSS + JavaScript vanilla em `index.html`.
- IndexedDB para dados locais do usuário.
- Service Worker em `sw.js`.
- PWA via `manifest.webmanifest`.
- Seed de receitas externo em `receitas.json`.
- Sem framework, backend obrigatório, conta ou build step no baseline atual.

## Arquitetura atual
- `index.html`: shell da aplicação e lógica principal.
- `receitas.json`: base seed de receitas; é carregada quando necessário para primeira instalação/migração de seed.
- IndexedDB: receitas instaladas, despensa, plano semanal, lista de compras, preferências e demais dados persistentes do usuário.
- `sw.js`: atualização/cache para experiência offline-first; alterações no app devem preservar a estratégia de atualização sem forçar reinstalação e sem apagar IndexedDB.
- Motor de matching: nomes canônicos + sinônimos + normalização + fuzzy matching conservador para cruzar despensa e ingredientes de receitas.
- Fluxo de estoque: suporta soma de itens, conversões de unidades e baixa após preparo, com revisão antes da aplicação e undo.

## Baseline funcional conhecido
O histórico Git mais recente indica versão funcional `v1.11.0` com 817 receitas e melhorias recentes no matching da despensa. O README ainda descreve uma versão anterior com 716 receitas; portanto README e baseline executável precisam ser reconciliados antes de tratar documentação como totalmente atual.

Capacidades já presentes no baseline:
- despensa inteligente e matching tolerante a erros;
- sugestões por disponibilidade e ingredientes faltantes;
- busca tolerante a erros;
- modo cozinhar com timers e wake lock;
- baixa de estoque com conversões e revisão;
- plano semanal e lista de compras;
- importação de receitas;
- estatísticas;
- backup/restauração local por JSON;
- operação offline-first.

## Restrições
- Preservar dados existentes do usuário em IndexedDB durante upgrades.
- Migrações de seed devem ser idempotentes e não ressuscitar receitas deletadas pelo usuário nem sobrescrever edições manuais sem regra explícita.
- `receitas.json` é dependência crítica de instalações novas e de futuras migrações do seed.
- Mudanças em cache/service worker exigem validação explícita do fluxo de atualização e do fallback offline.
- Matching fuzzy deve priorizar baixa taxa de falso positivo, especialmente entre ingredientes semanticamente distintos.
- Não migrar automaticamente para React/Lovable ou outro framework apenas por preferência tecnológica; aplicar Gate 0 antes de reescrita estrutural.

## Não-objetivos atuais
- Este bootstrap não autoriza refatoração, redesign ou migração de stack.
- Não introduzir backend/cloud/account sem missão e decisão específica.
- Não transformar o protótipo `brguma/app-creator` em implementação canônica sem reabertura explícita da decisão.

## Critérios gerais de sucesso
- Uma nova sessão/IA deve conseguir reconstruir objetivo, arquitetura, estado e próximos passos lendo o repo e `.ai/` sem depender do histórico de chat.
- Alterações funcionais devem manter integridade de dados, funcionamento offline e compatibilidade de migração.
- Para mudanças de UI, validar acessibilidade, responsividade e ausência de regressões no fluxo mobile.
- Para mudanças no matching/estoque, testar casos positivos e negativos, conversão de unidades e preservação de dados.

## Serviços / dependências
- Hospedagem estática compatível com PWA; ambiente de produção atual deve ser confirmado antes de deploy.
- Browser APIs: IndexedDB, Service Worker, Storage, Wake Lock quando disponível.
- Não há backend obrigatório no baseline atual.

## Concorrentes / análogos a consultar antes de evolução funcional relevante
Pesquisa externa inicial em 2026-09-04; aprofundar apenas quando a fase do produto exigir.
- SuperCook — forte referência em “receitas pelo que existe na despensa”, incluindo entrada de ingredientes e recomendação automática.
- Paprika Recipe Manager — referência em recipe manager, listas de compras, meal planning, timers, escala e conversão.
- Samsung Food — referência em recipe saving, meal planning, shopping list e ecossistema multiplataforma.

Não copiar funcionalidades por paridade. Usar esses produtos para identificar padrões, lacunas e decisões de UX durante análise competitiva.

## Relação com BANCO IA
Itens consultados para este projeto:
- `GitHub Spec Kit` e `Superpowers`: referência de fluxo disciplinado para mudanças futuras.
- `/code-review`: aplicar em mudanças de código relevantes.
- `/security-review`: aplicar quando mudança tocar importação, persistência, conteúdo externo, autenticação futura ou superfície equivalente.
- `web-design-guidelines`: QA gate quando houver trabalho de frontend/UI.
- `Chrome DevTools MCP`: ferramenta preferida de inspeção/QA de navegador quando disponível.
- `agent-browser`: TESTAR como benchmark/complemento em automação de testes de browser; não substituir automaticamente Chrome DevTools MCP.
- `Frontend Design Skill`, `No AI Slop` e `anti-ui-slop`: usar proporcionalmente se houver redesign; não são necessários para este bootstrap.

Itens conscientemente não aplicados agora:
- `seo-audit`: não há missão de aquisição/SEO nesta etapa.
- marketing/pricing skills: fora do escopo do bootstrap.
- builders como website-builder/OpenPage: não há decisão de reconstrução; Gate 0 favorece reutilizar o produto existente neste momento.
