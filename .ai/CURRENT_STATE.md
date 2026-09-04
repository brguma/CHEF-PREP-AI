# CURRENT STATE

Projeto: ChefPrep
Data: 2026-09-04
Status: ATIVO — P1 no Project Mesh

## Último marco concluído
Project Mesh bootstrap incorporado à `main` pelo PR #1, squash commit `53eec059a725f25f40f63e2beeed492abc1d98b4`.

Baseline funcional conhecido permanece `v1.11.0`, commit funcional anterior `e25cce487dbb25abccdf34751d9b4037158f9476`, com 817 receitas e melhorias no matching despensa↔receita. O README foi reconciliado com esse baseline durante o bootstrap.

## Em andamento
- Hardening de governança/privacidade do repositório.
- Bruno aprovou a recomendação de tornar o repo PRIVADO como estado-alvo, sem interromper o aplicativo publicado.
- A execução da mudança de visibilidade está adiada porque o benefício/plano necessário ainda não aparece ativo no GitHub e o Pages pode ser despublicado ao privatizar agora.

## Próximos passos
1. Aguardar/confirmar ativação do GitHub Pro/benefício equivalente da conta ou escolher hospedagem estática alternativa.
2. Revalidar o gate técnico usando o estado da conta e o deploy atual.
3. Tornar `brguma/CHEF-PREP-AI` privado somente quando a transição não derrubar o app.
4. Executar baseline QA: primeira instalação, atualização de versão, persistência IndexedDB, offline, import/export, matching, lista→despensa e baixa de estoque.
5. Só depois escolher a próxima missão funcional do produto; antes dela, consultar BANCO IA + concorrentes/análogos + Gate 0.

## Bloqueios
- O conector GitHub confirma `visibility: public`, mas não expõe ação de alteração de visibilidade do repositório.
- Verificação indireta do plano em 2026-09-04: o endpoint de rulesets em repositório privado ainda retorna `Upgrade to GitHub Pro or make this repository public`, indicando que GitHub Pro ainda não está efetivamente ativo na conta.
- Documentação oficial atual do GitHub informa que GitHub Pages em repositório privado requer GitHub Pro/Team/Enterprise; tornar um repositório com Pages publicado de público para privado despublica o site automaticamente quando o plano não oferece esse suporte.
- Não há uma suíte de testes automatizados versionada visível na raiz; vários testes são documentados nos commits recentes, mas precisam virar baseline reproduzível se quisermos automação contínua.

## Git
- `main` após hardening documental: `943bcbdfebb5d35982de8ac5bfd415f85e0e1357`.
- PR #1 — MERGED.
- PR #2 — MERGED.
- Branch atual de registro do blocker: `chore/pages-plan-blocker`.
- Visibilidade observada pela API em 2026-09-04: `public`.
- README em `main`: alinhado a v1.11.0 / 817 receitas.

## Testes / validação
Evidência histórica recente no Git:
- v1.11.0: validação de schema/deduplicação das 817 receitas, migração de seed idempotente, matching e detecção de timers.
- v1.10.0: testes de conversões, parser de entrada em lote, substituições, plano de baixa e seeding externo.
- v1.9.1: auditoria com correções de integridade de dados, deduplicação e regressões de matching.

Estado nesta rodada:
- O bootstrap/README foi revisado e mergeado sem alterar lógica funcional.
- Nenhum teste funcional novo foi executado porque a rodada tratou de documentação/governança.
- A próxima missão deve transformar os testes críticos em checklist reproduzível e, se proporcional, automação versionada.

## Deploy
- Arquitetura: hospedagem estática/PWA.
- O repositório possui GitHub Pages habilitado.
- No estado atual da conta, privatizar agora cria risco concreto de despublicar o Pages; por isso a mudança foi bloqueada corretamente.
- Nenhum `CNAME` foi encontrado na raiz, portanto não há custom domain versionado a tratar nesta etapa.
- Estado: não alterado nesta rodada.

## Riscos / dúvidas atuais
- Repositório público + licença proprietária: código, histórico e documentação interna ficam acessíveis tecnicamente; decisão aprovada é migrar para privado quando seguro.
- Mesmo com repo privado, um frontend estático publicado continuará entregando HTML/JS e o seed de receitas ao navegador; a mudança protege o repositório e o processo de desenvolvimento, não transforma ativos client-side em segredo absoluto.
- Arquitetura single-file facilita distribuição, mas aumenta custo de manutenção conforme o produto cresce; não migrar sem Gate 0 comparando manter/refatorar modularmente/reimplementar.
- Mudanças em Service Worker e migrações de seed têm risco elevado de regressão em atualização e dados locais.
- Matching fuzzy é capacidade central e deve ter testes negativos explícitos para evitar falsos positivos.

## Handoff
Para retomar sem depender da conversa:
- Leia primeiro `.ai/PROJECT_CONTEXT.md`, este arquivo e `.ai/DECISIONS.md`.
- O repo canônico é `brguma/CHEF-PREP-AI`; `brguma/app-creator` está arquivado e não deve substituir este projeto por padrão.
- Baseline funcional conhecido: v1.11.0 / 817 receitas / commit `e25cce4`; bootstrap do Project Mesh está na `main` desde `53eec05`.
- Decisão confirmada: tornar o repo PRIVADO como estado-alvo.
- Execução bloqueada por enquanto: GitHub Pro ainda não aparece ativo e privatizar agora pode despublicar o GitHub Pages.
- Antes de implementar nova feature: consultar BANCO IA, concorrentes/análogos e Gate 0; usar branch + PR.
