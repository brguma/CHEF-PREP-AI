# CURRENT STATE

Projeto: ChefPrep
Data: 2026-09-04
Status: ATIVO — P1 no Project Mesh

## Último marco concluído
Baseline funcional mais recente identificado no histórico Git: `v1.11.0`, commit `e25cce487dbb25abccdf34751d9b4037158f9476`, com 817 receitas e melhorias no matching despensa↔receita.

## Em andamento
- Bootstrap do Project Mesh para permitir retomada por ChatGPT/Claude sem briefing conversacional completo.
- PR #1 aberto com documentação de handoff e correção documental do README; nenhum código funcional foi alterado nesta rodada.

## Próximos passos
1. Revisar o bootstrap no PR #1 e, após aprovação/merge, tratá-lo como baseline de handoff do projeto.
2. Decidir a visibilidade do repositório. Recomendação atual: PRIVADO por padrão, desde que o impacto sobre o GitHub Pages/deploy seja resolvido antes da mudança.
3. Confirmar o ambiente/deploy efetivamente utilizado hoje e executar uma rodada de baseline QA no app publicado ou servido localmente.
4. Validar smoke tests essenciais: primeira instalação, atualização de versão, persistência IndexedDB, offline, import/export, matching, lista→despensa e baixa de estoque.
5. Só depois escolher a próxima missão funcional do produto; antes dela, consultar BANCO IA + concorrentes/análogos + Gate 0.

## Bloqueios
- URL/ambiente de produção atual não confirmado neste bootstrap.
- Visibilidade do repo está pública no GitHub; falta decisão explícita de Bruno antes de alterar porque isso pode afetar GitHub Pages e é uma mudança material de permissão/visibilidade.
- Não há uma suíte de testes automatizados versionada visível na raiz; vários testes são documentados nos commits recentes, mas precisam ser transformados em baseline reproduzível se quisermos automação contínua.

## Git
- Branch de bootstrap: `chore/project-mesh-bootstrap`
- Baseline `main` antes do bootstrap: `e25cce487dbb25abccdf34751d9b4037158f9476`
- PR: #1 — `https://github.com/brguma/CHEF-PREP-AI/pull/1`
- Visibilidade observada pela API em 2026-09-04: `public`.
- README alinhado nesta branch ao baseline v1.11.0 / 817 receitas.

## Testes / validação
Evidência histórica recente no Git:
- v1.11.0: validação de schema/deduplicação das 817 receitas, migração de seed idempotente, matching e detecção de timers.
- v1.10.0: testes de conversões, parser de entrada em lote, substituições, plano de baixa e seeding externo.
- v1.9.1: auditoria com correções de integridade de dados, deduplicação e regressões de matching.

Estado nesta rodada:
- Nenhum teste executável foi rodado pelo bootstrap porque não houve mudança no código funcional.
- A próxima missão deve transformar os testes críticos em checklist reproduzível e, se proporcional, automação versionada.

## Deploy
- Ambiente: hospedagem estática/PWA; o repositório informa GitHub Pages habilitado, mas o endpoint efetivo e a dependência atual do Pages ainda precisam ser confirmados antes de tornar o repo privado.
- Estado: não alterado nesta rodada.

## Riscos / dúvidas atuais
- Repositório público + licença proprietária: o código, histórico, `receitas.json` e documentação interna do Project Mesh ficam acessíveis e copiáveis tecnicamente; a licença restringe uso jurídico, mas não impede clonagem/scraping.
- Mesmo com repo privado, um frontend estático publicado continua entregando HTML/JS e o seed de receitas ao navegador; privacidade do repo protege histórico, branches e documentação interna, não transforma código client-side em segredo absoluto.
- Arquitetura single-file facilita distribuição, mas aumenta custo de manutenção conforme o produto cresce; não migrar sem Gate 0 comparando manter/refatorar modularmente/reimplementar.
- Mudanças em Service Worker e migrações de seed têm risco elevado de regressão em atualização e dados locais.
- Matching fuzzy é capacidade central e deve ter testes negativos explícitos para evitar falsos positivos.

## Handoff
Para retomar sem depender da conversa:
- Leia primeiro `.ai/PROJECT_CONTEXT.md`, este arquivo e `.ai/DECISIONS.md`.
- O repo canônico é `brguma/CHEF-PREP-AI`; `brguma/app-creator` está arquivado e não deve substituir este projeto por padrão.
- Baseline funcional conhecido: v1.11.0 / 817 receitas / commit `e25cce4`.
- README da branch de bootstrap já foi reconciliado com esse baseline.
- Não altere visibilidade do repo sem decisão explícita de Bruno e sem verificar impacto no deploy/Pages.
- Antes de implementar nova feature: consultar BANCO IA, concorrentes/análogos e Gate 0; usar branch + PR.
