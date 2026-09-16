const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const norm = s => (s || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
global.U = {
  norm,
  id: (() => { let n = 0; return () => `id-${++n}`; })(),
  fmtQtd: n => String(Math.round(n * 100) / 100).replace('.', ','),
  hojeISO: () => '2026-09-16',
  diasAte: () => null,
  esc: s => String(s ?? '')
};
global.canonico = norm;
global.ehBasico = nome => (global.S.config.basicos || []).includes(norm(nome));
global.indiceEstoque = () => {
  const idx = {};
  for (const it of global.S.estoque) (idx[norm(it.can || it.nome)] ||= []).push(it);
  return idx;
};
global.resolverEstoque = (c, idx) => idx[c] ? c : null;
global.resolverVocab = nome => norm(nome);
global.convParaItem = (qtd, de, para) => {
  const a = norm(de), b = norm(para);
  if (a === b) return { v: qtd, estimado: false };
  const massa = { g: 1, kg: 1000 };
  if (a in massa && b in massa) return { v: qtd * massa[a] / massa[b], estimado: false };
  const vol = { ml: 1, l: 1000, 'col sopa': 15, 'col cha': 5, xic: 240 };
  if (a in vol && b in vol) return { v: qtd * vol[a] / vol[b], estimado: false };
  return null;
};

global.S = { receitas: [], estoque: [], plano: [], lista: [], config: { basicos: [], diasAlertaValidade: 3 } };
global.SuggestionProvider = { nome: 'old', sugerir: () => [] };
global.DB = { salvar: () => Promise.resolve(true) };
global.addNaLista = function() {};
global.itensFaltantes = function() {};
global.UI = {
  gerarListaDaSemana() {}, detalheReceita() {}, importarJSON() {}, abrirConfig() {}, render() {},
  toast() {}, ir() {}, fecharOverlay() {},
  cardSugestao(s) { return `<div>Falta: <b>${s.faltam.map(i => i.nome).join(', ')}</b></div>`; }
};
global.carregarTudo = async () => {};
global.confirm = () => true;
global.indexedDB = { open() { throw new Error('not used in unit tests'); } };
global.FileReader = function() {};

vm.runInThisContext(fs.readFileSync('core-fixes.js', 'utf8'), { filename: 'core-fixes.js' });

function receita(qtd, unidade = 'g') {
  return { id: 'r1', nome: 'Frango teste', porcoesBase: 1, favorito: false,
    ingredientes: [{ nome: 'frango', qtd, unidade, opcional: false, critico: true }] };
}

// 1) Quantidade parcial não pode virar "Pode fazer agora".
S.receitas = [receita(500)];
S.estoque = [{ id: 'e1', nome: 'frango', qtd: 50, unidade: 'g' }];
let sug = SuggestionProvider.sugerir({ receitas: S.receitas })[0];
assert.equal(sug.badge, 'um');
assert.equal(sug.faltam.length, 1);
assert.equal(sug.faltam[0].parcial, true);
assert.equal(sug.faltam[0].qtdFaltante, 450);
assert.deepEqual(itensFaltantes(S.receitas[0], 1).map(x => x.qtd), [450]);

// 2) Conversão kg→g e soma de lotes precisam satisfazer a necessidade.
S.estoque = [{ id: 'e1', nome: 'frango', qtd: 0.3, unidade: 'kg' }, { id: 'e2', nome: 'frango', qtd: 250, unidade: 'g' }];
sug = SuggestionProvider.sugerir({ receitas: S.receitas })[0];
assert.equal(sug.badge, 'ok');
assert.equal(sug.faltam.length, 0);

// 3) Plano semanal soma demanda antes de descontar o estoque uma única vez.
S.receitas = [{ id: 'r1', nome: 'A', porcoesBase: 1, ingredientes: [{ nome: 'frango', qtd: 400, unidade: 'g', opcional: false }] }];
S.estoque = [{ id: 'e1', nome: 'frango', qtd: 500, unidade: 'g' }];
const plano = [
  { id: 'p1', data: '2026-09-17', receitaId: 'r1', porcoes: 1 },
  { id: 'p2', data: '2026-09-18', receitaId: 'r1', porcoes: 1 }
];
const faltaPlano = ChefPrepCoreFixes.itensFaltantesPlano(plano);
assert.equal(faltaPlano.length, 1);
assert.equal(faltaPlano[0].qtd, 300);

// 4) Mesma origem: a linha existente é atualizada para o total mais recente.
S.lista = [{ id: 'l1', nome: 'frango', qtd: 100, unidade: 'g', comprado: false, origem: 'teste' }];
const alterados = addNaLista([{ nome: 'frango', qtd: 300, unidade: 'g' }], 'teste');
assert.equal(alterados, 1);
assert.equal(S.lista.length, 1);
assert.equal(S.lista[0].qtd, 300);

// 5) Reexecutar a mesma demanda/origem é idempotente.
const alterados2 = addNaLista([{ nome: 'frango', qtd: 300, unidade: 'g' }], 'teste');
assert.equal(alterados2, 0);
assert.equal(S.lista[0].qtd, 300);

// 6) A mesma origem pode reduzir o total quando o plano/requisito diminui.
const reduzidos = addNaLista([{ nome: 'frango', qtd: 200, unidade: 'g' }], 'teste');
assert.equal(reduzidos, 1);
assert.equal(S.lista[0].qtd, 200);

// 7) Mesma origem com unidade incompatível não pode ser descartada silenciosamente.
S.lista = [{ id: 'l2', nome: 'frango', qtd: 2, unidade: 'un', comprado: false, origem: 'teste' }];
const incompat = addNaLista([{ nome: 'frango', qtd: 300, unidade: 'g' }], 'teste');
assert.equal(incompat, 1);
assert.equal(S.lista.length, 2);
assert.ok(S.lista.some(x => x.unidade === 'g' && x.qtd === 300));

// 8) Demandas independentes de receitas diferentes não podem se engolir.
S.lista = [{ id: 'l3', nome: 'frango', qtd: 100, unidade: 'g', comprado: false, origem: 'receita: A' }];
const outraFonte = addNaLista([{ nome: 'frango', qtd: 200, unidade: 'g' }], 'receita: B');
assert.equal(outraFonte, 1);
assert.equal(S.lista.length, 2);
assert.ok(S.lista.some(x => x.origem === 'receita: A' && x.qtd === 100));
assert.ok(S.lista.some(x => x.origem === 'receita: B' && x.qtd === 200));

// 9) Service Worker: versão nova, patch no shell e sem cachear resposta HTTP inválida.
const sw = fs.readFileSync('sw.js', 'utf8');
assert.match(sw, /chefprep-v1\.11\.1/);
assert.match(sw, /if \(!resp\.ok\) throw new Error/);
assert.match(sw, /core-fixes\.js/);
assert.doesNotMatch(sw, /legacy\.html/);

// 10) Estrutura final: index original carrega o módulo de correção diretamente, sem bootstrap intermediário.
const index = fs.readFileSync('index.html', 'utf8');
assert.match(index, /<script src="\.\/core-fixes\.js\?v=1\.11\.1"><\/script>/);
assert.doesNotMatch(index, /legacy\.html/);
assert.match(index, /const SuggestionProvider/);

console.log('ChefPrep core regression tests: OK');
