# CLAUDE.md

Use este arquivo apenas como adapter local. As regras globais do BANCO IA permanecem canônicas fora deste repo.

Antes de analisar ou propor mudanças:
1. leia `.ai/PROJECT_CONTEXT.md`;
2. leia `.ai/CURRENT_STATE.md`;
3. leia `.ai/DECISIONS.md`;
4. quando disponível, consulte o contexto vigente do BANCO IA e confirme frescor antes de decisão material.

Política operacional:
- Claude é reader por padrão no Project Mesh.
- Se Bruno convocar Claude como executor, trabalhar por branch + PR; nunca editar `main` diretamente por padrão.
- Não tratar `brguma/app-creator` como ChefPrep canônico.
- Preservar integridade de dados locais, migrações de seed, PWA/offline e regras de matching.
- Não transformar sugestões em decisões persistentes sem confirmação de Bruno; mudanças duráveis de governança devem voltar ao writer oficial do BANCO IA.
