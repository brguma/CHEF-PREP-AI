from pathlib import Path

p = Path('core-fixes.js')
s = p.read_text(encoding='utf-8')

needle = "UI.gerarListaDaSemana = function() {"
insert = """UI.faltantesPraLista = function(id, porcoes) {
    const r = S.receitas.find(x => x.id === id);
    if (!r) return;
    const p = porcoes || r.porcoesBase;
    const n = addNaLista(itensFaltantes(r, p), 'receita: ' + r.nome);
    UI.toast(n ? `${n} ite${n === 1 ? 'm' : 'ns'} na lista de compras` : 'Itens já estavam na lista');
    UI.render();
  };

  UI.gerarListaDaSemana = function() {"""
assert needle in s, 'gerarListaDaSemana needle not found'
s = s.replace(needle, insert, 1)

needle = """    const fator = p / r.porcoesBase;
    const idx = indiceEstoque(), cacheRes = new Map();"""
repl = """    const fator = p / r.porcoesBase;
    const btnLista = [...document.querySelectorAll('#overlays button')]
      .find(btn => (btn.getAttribute('onclick') || '').includes('UI.faltantesPraLista('));
    if (btnLista) {
      btnLista.removeAttribute('onclick');
      btnLista.onclick = () => { UI.faltantesPraLista(id, p); UI.fecharOverlay(); };
    }
    const idx = indiceEstoque(), cacheRes = new Map();"""
assert needle in s, 'detail needle not found'
s = s.replace(needle, repl, 1)

old = """  const cardOriginal = UI.cardSugestao;
  UI.cardSugestao = function(s) {
    let html = cardOriginal.call(UI, s);
    for (const i of s.faltam || []) {
      if (!i.parcial || !(i.qtdFaltante > 0)) continue;
      const puro = U.esc(i.nome);
      const detalhado = `${puro} (faltam ${U.fmtQtd(i.qtdFaltante)} ${U.esc(i.unidade)})`;
      html = html.replace(`>${puro}</b>`, `>${detalhado}</b>`);
    }
    return html;
  };"""
new = """  const cardOriginal = UI.cardSugestao;
  UI.cardSugestao = function(s) {
    let html = cardOriginal.call(UI, s);
    if (!(s.faltam || []).length) return html;
    const nomes = s.faltam.map(i => {
      const nome = U.esc(i.nome);
      return i.parcial && i.qtdFaltante > 0
        ? `${nome} (faltam ${U.fmtQtd(i.qtdFaltante)} ${U.esc(i.unidade)})`
        : nome;
    }).join(', ');
    return html.replace(
      /(<div class=\"placar-legenda\">Falta: <b>)[\\s\\S]*?(<\\/b><\\/div>)/,
      (_m, inicio, fim) => inicio + nomes + fim
    );
  };"""
assert old in s, 'card wrapper block not found'
s = s.replace(old, new, 1)

needle = """  globalThis.ChefPrepCoreFixes = { coberturaIngrediente, itensFaltantesPlano, substituirTudoAtomico };
})();"""
repl = """  globalThis.ChefPrepCoreFixes = { coberturaIngrediente, itensFaltantesPlano, substituirTudoAtomico };

  // Se o IndexedDB terminou de inicializar enquanto este arquivo ainda carregava,
  // a UI pode ter sido renderizada uma vez com o motor antigo. Corrige sem causar
  // o flash de uma tela vazia no caminho normal (quando o bootstrap ainda não renderizou).
  if (typeof document !== 'undefined') {
    const tela = document.getElementById('tela');
    if (tela && String(tela.innerHTML || '').trim()) {
      try { UI.render(); } catch (e) { console.warn('ChefPrep reliability rerender:', e); }
    }
  }
})();"""
assert needle in s, 'core tail needle not found'
s = s.replace(needle, repl, 1)
p.write_text(s, encoding='utf-8')

t = Path('tests/core-regression.test.cjs')
s = t.read_text(encoding='utf-8')
s = s.replace(
    "toast() {}, ir() {}, fecharOverlay() {},\n  cardSugestao(s) { return `<div>Falta: <b>${s.faltam.map(i => i.nome).join(', ')}</b></div>`; }",
    "toast() {}, ir() {}, fecharOverlay() {},\n  cardSugestao(s) { return `<div class=\\\"placar-legenda\\\">Falta: <b>${s.faltam.map(i => i.nome).join(', ')}</b></div>`; }"
)
s = s.replace(
    "gerarListaDaSemana() {}, detalheReceita() {}, importarJSON() {}, abrirConfig() {}, render() {},",
    "gerarListaDaSemana() {}, detalheReceita() {}, importarJSON() {}, abrirConfig() {}, render() { global.__renderCount = (global.__renderCount || 0) + 1; },"
)
needle = """global.FileReader = function() {};

vm.runInThisContext(fs.readFileSync('core-fixes.js', 'utf8'), { filename: 'core-fixes.js' });"""
repl = """global.FileReader = function() {};
global.__renderCount = 0;
global.document = {
  getElementById(id) { return id === 'tela' ? { innerHTML: '<div>baseline rendered</div>' } : null; },
  querySelectorAll() { return []; }
};

vm.runInThisContext(fs.readFileSync('core-fixes.js', 'utf8'), { filename: 'core-fixes.js' });
assert.equal(global.__renderCount, 1, 'patch deve rerenderizar uma UI que já tenha sido renderizada pelo bootstrap');"""
assert needle in s, 'test bootstrap needle not found'
s = s.replace(needle, repl, 1)

needle = """assert.equal(faltaPlano[0].qtd, 300);

// 4) Mesma origem: a linha existente é atualizada para o total mais recente."""
repl = """assert.equal(faltaPlano[0].qtd, 300);

// 4) Detalhe escalonado: faltantes devem respeitar as porções escolhidas, não as porções-base.
S.receitas = [receita(500)];
S.estoque = [];
S.lista = [];
UI.faltantesPraLista('r1', 2);
assert.equal(S.lista.length, 1);
assert.equal(S.lista[0].qtd, 1000);

// 5) A legenda deve anotar falta parcial mesmo quando ela não é o primeiro ingrediente.
const cardParcial = UI.cardSugestao({ faltam: [
  { nome: 'tomate', parcial: false },
  { nome: 'frango', parcial: true, qtdFaltante: 125, unidade: 'g' }
] });
assert.match(cardParcial, /tomate, frango \\(faltam 125 g\\)/);

// 6) Mesma origem: a linha existente é atualizada para o total mais recente."""
assert needle in s, 'test insertion needle not found'
s = s.replace(needle, repl, 1)
t.write_text(s, encoding='utf-8')
