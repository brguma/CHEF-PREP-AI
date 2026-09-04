# CURRENT STATE

Projeto: ChefPrep
Data: 2026-09-04
Status: ATIVO — P1 no Project Mesh

## Último marco concluído
Baseline funcional mais recente identificado no histórico Git: `v1.11.0`, commit `e25cce487dbb25abccdf34751d9b4037158f9476`, com 817 receitas e melhorias no matching despensa↔receita.

## Em andamento
- Bootstrap do Project Mesh para permitir retomada por ChatGPT/Claude sem briefing conversacional completo.
- PR #1 aberto com a documentação de handoff; nenhum desenvolvimento funcional novo foi autorizado nesta rodada.

## Próximos passos
1. Revisar o bootstrap no PR #1 e, após aprovação/merge, tratá-lo como baseline de handoff do projeto.
2. Confirmar o ambiente/deploy efetivamente utilizado hoje e executar uma rodada de baseline QA no app publicado ou servido localmente.
3. Reconciliar documentação: o README ainda informa 716 receitas enquanto o histórico mais recente registra 817.
4. Validar smoke tests essenciais: primeira instalação, atualização de versão, persistência IndexedDB, offline, import/export, matching, lista→despensa e baixa de estoque.
5. Só depois escolher a próxima missão funcional do produto; antes dela, consultar BANCO IA + concorrentes/análogos + Gate 0.

## Bloqueios
- URL/ambiente de produção atual não confirmado neste bootstrap.
- Não há uma suíte de testes automatizados versionada visível na raiz; vários testes são documentados nos commits recentes, mas precisam ser transformados em baseline reproduzível se quisermos automação contínua.
- README parcialmente defasado em relação ao último commit.

## Git
- Branch de bootstrap: `chore/project-mesh-bootstrap`
- Baseline `main` antes do bootstrap: `e25cce487dbb25abccdf34751d9b4037158f9476`
- PR: #1 — `https://github.com/brguma/CHEF-PREP-AI/pull/1`

## Testes / validação
Evidência histórica recente no Git:
- v1.11.0: validação de schema/deduplicação das 817 receitas, migração de seed idempotente, matching e detecção de timers.
- v1.10.0: testes de conversões, parser de entrada em lote, substituições, plano de baixa e seeding externo.
- v1.9.1: auditoria com correções de integridade de dados, deduplicação e regressões de matching.

Estado nesta rodada:
- Nenhum teste executável foi rodado pelo bootstrap porque não houve mudança no código funcional.
- A próxima missão deve transformar os testes críticos em checklist reproduzível e, se proporcional, automação versionada.

## Deploy
- Ambiente: hospedagem estática/PWA, endpoint efetivo ainda não confirmado.
- Estado: não alterado nesta rodada.

## Riscos / dúvidas atuais
- Divergência README ↔ código/histórico pode induzir uma IA a trabalhar sobre baseline antigo.
- Arquitetura single-file facilita distribuição, mas aumenta custo de manutenção conforme o produto cresce; não migrar sem Gate 0 comparando manter/refatorar modularmente/reimplementar.
- Mudanças em Service Worker e migrações de seed têm risco elevado de regressão em atualização e dados locais.
- Matching fuzzy é capacidade central e deve ter testes negativos explícitos para evitar falsos positivos.

## Handoff
Para retomar sem depender da conversa:
- Leia primeiro `.ai/PROJECT_CONTEXT.md`, este arquivo e `.ai/DECISIONS.md`.
- O repo canônico é `brguma/CHEF-PREP-AI`; `brguma/app-creator` está arquivado e não deve substituir este projeto por padrão.
- Baseline funcional conhecido: v1.11.0 / 817 receitas / commit `e25cce4`.
- Não presuma que o README representa o estado mais recente.
- Antes de implementar nova feature: consultar BANCO IA, concorrentes/análogos e Gate 0; usar branch + PR.
