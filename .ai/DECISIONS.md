# PROJECT DECISIONS

Use este arquivo para decisões materiais do ChefPrep. Não registrar detalhes triviais nem conclusões não confirmadas.

## 2026-09-04 — Repositório canônico do ChefPrep
**Decisão:** `brguma/CHEF-PREP-AI` permanece o projeto ChefPrep ativo/canônico no Project Mesh.

**Alternativas consideradas:**
- manter `brguma/app-creator` como segunda implementação ativa;
- promover a versão React/Lovable a canônica;
- manter o produto atual e arquivar a segunda implementação.

**Opção escolhida:** manter `CHEF-PREP-AI` ativo e classificar `app-creator` como ARQUIVAR.

**Motivo:** decisão explícita de Bruno durante a auditoria inicial do Project Mesh. O produto atual já possui histórico funcional e evolução própria; uma reescrita não deve ser presumida.

**Riscos / trade-offs:**
- a arquitetura single-file pode exigir futura modularização conforme a complexidade crescer;
- manter uma implementação arquivada exige cuidado para não usar documentação/código do repo errado como fonte atual.

**Condição de reabertura:** somente se uma missão futura demonstrar ganho material em manutenção, qualidade, velocidade ou produto e o Gate 0 justificar migrar/refatorar/reimplementar.

## 2026-09-04 — ChefPrep como prioridade P1
**Decisão:** ChefPrep é o projeto ativo de maior prioridade no Project Mesh.

**Ordem definida por Bruno:** ChefPrep → Tennis News Bot → Inspeção OAE → Jogos Mentais → Poker.

**Opção escolhida:** usar ChefPrep como primeiro projeto a receber bootstrap `.ai/` e como teste do fluxo de retomada entre sessões/IAs.

**Motivo:** prioridade operacional explícita definida por Bruno.

**Riscos / trade-offs:**
- prioridade não significa autorização para implementar features sem missão específica;
- o bootstrap deve documentar o estado sem inventar roadmap ou requisitos.

**Condição de reabertura:** quando Bruno alterar a ordem de prioridade ou o status do projeto.

## 2026-09-04 — Project Mesh local
**Decisão:** adicionar ao repo o contexto local mínimo `.ai/PROJECT_CONTEXT.md`, `.ai/CURRENT_STATE.md` e `.ai/DECISIONS.md`, com adapters curtos para agentes quando úteis.

**Alternativas consideradas:**
- continuar dependendo do histórico de conversa;
- duplicar integralmente as regras globais do BANCO IA dentro do repo;
- manter somente documentação local mínima e referenciar a governança transversal.

**Opção escolhida:** documentação local mínima, sem duplicar o CORE global.

**Motivo:** permitir handoff e retomada sem briefing do zero, reduzindo drift entre regras globais e contexto específico do projeto.

**Riscos / trade-offs:**
- `CURRENT_STATE.md` precisa ser mantido em marcos materiais para continuar útil;
- documentação desatualizada deve ser explicitamente tratada como risco, não assumida como verdade.

**Condição de reabertura:** se o padrão Project Mesh mudar no BANCO IA ou se o projeto exigir documentação adicional com ganho concreto.

## 2026-09-04 — Visibilidade do repositório: alvo PRIVADO
**Decisão:** tornar `brguma/CHEF-PREP-AI` privado como estado-alvo, preservando o aplicativo publicado por um mecanismo de deploy compatível.

**Alternativas consideradas:**
- manter repositório público com licença proprietária;
- tornar o repositório privado e manter apenas o app publicado;
- migrar imediatamente para arquitetura com backend para ocultar também lógica/seed entregues ao navegador.

**Opção escolhida:** repositório privado + app público quando necessário. Não migrar arquitetura apenas por este motivo.

**Motivo:** o projeto é proprietário e o repo público expõe histórico Git, branches, documentação interna do Project Mesh, código-fonte e `receitas.json` sem necessidade operacional. A licença restringe juridicamente o uso por terceiros, mas não impede clonagem técnica.

**Gate de execução:** a mudança de visibilidade só deve ocorrer depois de confirmar que o deploy atual/GitHub Pages continuará funcional ou depois de migrar o deploy para uma hospedagem compatível. A mudança não deve derrubar o app.

**Riscos / trade-offs:**
- tornar o repo privado pode afetar GitHub Pages dependendo do plano/benefícios ativos;
- repo privado não torna segredo absoluto o HTML/JS/seed que o navegador precisa receber em um frontend estático;
- a proteção principal obtida é sobre repositório, histórico, branches, PRs e documentação interna.

**Condição de reabertura:** somente se houver necessidade concreta de colaboração/open source, limitação de hospedagem que torne o custo desproporcional, ou mudança explícita de estratégia do produto.
