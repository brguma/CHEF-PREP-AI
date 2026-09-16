/* ChefPrep v1.11.1 — reliability patch. Keeps the v1.11.0 baseline intact and fixes core accounting. */
(() => {
  'use strict';
  const EPS = 0.01;

  function coberturaIngrediente(ing, fator = 1, idx = indiceEstoque(), cacheRes = new Map()) {
    const c = canonico(ing.nome);
    const necessario = Math.max(0, (+ing.qtd || 0) * fator);
    if (ehBasico(c)) return { status: 'ok', necessario, disponivel: Infinity, faltante: 0, fracao: 1, itens: [] };
    const k = resolverEstoque(c, idx, cacheRes);
    const itens = ((k && idx[k]) || []).filter(e => +e.qtd > 0);
    if (!itens.length) return { status: 'sem', necessario, disponivel: 0, faltante: necessario, fracao: 0, itens: [] };
    if (U.norm(ing.unidade) === 'a gosto' || necessario <= 0)
      return { status: 'ok', necessario, disponivel: necessario, faltante: 0, fracao: 1, itens };

    let disponivel = 0, convertiveis = 0;
    for (const e of itens) {
      const conv = convParaItem(+e.qtd || 0, e.unidade, ing.unidade, c);
      if (!conv) continue;
      disponivel += conv.v;
      convertiveis++;
    }
    if (!convertiveis)
      return { status: 'incompativel', necessario, disponivel: 0, faltante: necessario, fracao: 0, itens };

    const faltante = Math.max(0, necessario - disponivel);
    const fracao = necessario > 0 ? Math.min(1, disponivel / necessario) : 1;
    return {
      status: faltante <= EPS ? 'ok' : (disponivel > 0 ? 'parcial' : 'sem'),
      necessario, disponivel, faltante, fracao, itens
    };
  }

  SuggestionProvider.nome = 'deterministico-v1.1-quantitativo';
  SuggestionProvider.sugerir = function({ receitas, opcoes = {} } = {}) {
    const idx = indiceEstoque();
    const cacheRes = new Map();
    const diasAlerta = S.config.diasAlertaValidade;
    const res = [];
    for (const r of receitas) {
      const obrig = r.ingredientes.filter(i => !i.opcional);
      if (!obrig.length) continue;
      const tem = [], faltam = [];
      let usaVencendo = false, faltaCritico = false, coberturaTotal = 0;
      for (const ing of obrig) {
        const cob = coberturaIngrediente(ing, 1, idx, cacheRes);
        coberturaTotal += cob.fracao;
        if (cob.status === 'ok') tem.push(ing);
        else {
          faltam.push(Object.assign({}, ing, {
            parcial: cob.status === 'parcial',
            qtdFaltante: Math.round(cob.faltante * 100) / 100
          }));
          if (ing.critico) faltaCritico = true;
        }
        if (cob.itens.some(e => {
          const d = U.diasAte(e.validade);
          return d !== null && d >= 0 && d <= diasAlerta;
        })) usaVencendo = true;
      }
      let score = coberturaTotal / obrig.length;
      if (usaVencendo) score += 0.15;
      if (r.favorito) score += 0.10;
      if (faltaCritico) score -= 0.30;
      let badge = null;
      if (!faltam.length) badge = 'ok';
      else if (faltam.length === 1) badge = 'um';
      else if (coberturaTotal / obrig.length >= 0.7) badge = 'quase';
      res.push({ receita: r, score, tem, faltam, faltaCritico, badge, usaVencendo });
    }
    res.sort((a, b) => b.score - a.score);
    return opcoes.limite ? res.slice(0, opcoes.limite) : res;
  };

  itensFaltantes = function(receita, porcoes) {
    const idx = indiceEstoque();
    const cacheRes = new Map();
    const fator = porcoes / receita.porcoesBase;
    const faltam = [];
    for (const ing of receita.ingredientes.filter(i => !i.opcional && !ehBasico(i.nome))) {
      const cob = coberturaIngrediente(ing, fator, idx, cacheRes);
      if (cob.status === 'ok') continue;
      faltam.push({
        nome: ing.nome,
        qtd: Math.round(cob.faltante * 100) / 100,
        unidade: ing.unidade,
        parcial: cob.status === 'parcial'
      });
    }
    return faltam;
  };

  function itensFaltantesPlano(planos) {
    const demandas = [];
    for (const p of planos) {
      if (p.data && p.data < U.hojeISO()) continue;
      const r = S.receitas.find(x => x.id === p.receitaId);
      if (!r) continue;
      const fator = (p.porcoes || r.porcoesBase) / r.porcoesBase;
      for (const ing of r.ingredientes.filter(i => !i.opcional && !ehBasico(i.nome))) {
        const c = canonico(ing.nome);
        const qtd = (+ing.qtd || 0) * fator;
        let alvo = null, convertido = null;
        for (const d of demandas) {
          if (d.c !== c) continue;
          const conv = convParaItem(qtd, ing.unidade, d.unidade, c);
          if (conv) { alvo = d; convertido = conv.v; break; }
        }
        if (alvo) alvo.qtd += convertido;
        else demandas.push({ c, nome: ing.nome, qtd, unidade: ing.unidade });
      }
    }

    const idx = indiceEstoque(), cacheRes = new Map();
    const faltam = [];
    for (const d of demandas) {
      const k = resolverEstoque(d.c, idx, cacheRes);
      let disponivel = 0;
      for (const e of ((k && idx[k]) || []).filter(x => +x.qtd > 0)) {
        const conv = convParaItem(+e.qtd || 0, e.unidade, d.unidade, d.c);
        if (conv) disponivel += conv.v;
      }
      const falta = Math.max(0, d.qtd - disponivel);
      if (falta > EPS) faltam.push({ nome: d.nome, qtd: Math.round(falta * 100) / 100, unidade: d.unidade });
    }
    return faltam;
  }

  addNaLista = function(itens, origem) {
  let n = 0;
  const fonte = origem || 'manual';
  for (const it of itens) {
    const c = resolverVocab(it.nome) || canonico(it.nome);
    const candidatos = S.lista.filter(l =>
      !l.comprado &&
      (resolverVocab(l.nome) || canonico(l.nome)) === c &&
      (it.qtd == null || (l.origem || 'manual') === fonte));

    let jaTem = null;
    let convertido = null;
    if (it.qtd == null) {
      jaTem = candidatos[0] || null;
    } else {
      for (const l of candidatos) {
        if (l.qtd == null) { jaTem = l; break; }
        const conv = convParaItem(it.qtd, it.unidade || l.unidade, l.unidade, c);
        if (conv) { jaTem = l; convertido = conv.v; break; }
      }
    }

    if (jaTem) {
      if (it.qtd != null) {
        const valor = jaTem.qtd == null
          ? it.qtd
          : (convertido == null
              ? (convParaItem(it.qtd, it.unidade || jaTem.unidade, jaTem.unidade, c) || {}).v
              : convertido);
        if (valor != null && (jaTem.qtd == null || Math.abs(valor - jaTem.qtd) > EPS)) {
          jaTem.qtd = Math.round(valor * 100) / 100;
          if (!jaTem.unidade) jaTem.unidade = it.unidade || '';
          DB.salvar('lista', jaTem);
          n++;
        }
      }
      continue;
    }

    const novo = {
      id: U.id(), nome: it.nome, qtd: it.qtd == null ? null : it.qtd,
      unidade: it.unidade || '', comprado: false, origem: fonte
    };
    S.lista.push(novo);
    DB.salvar('lista', novo);
    n++;
  }
  return n;
};

UI.gerarListaDaSemana = function() {
    const todos = itensFaltantesPlano(S.plano);
    if (!todos.length) { UI.toast('Nada faltando — estoque cobre o plano ✓'); return; }
    const n = addNaLista(todos, 'plano semanal');
    UI.toast(n
      ? `${n} ite${n === 1 ? 'm' : 'ns'} incluído${n === 1 ? '' : 's'} ou atualizado${n === 1 ? '' : 's'} na lista`
      : 'A lista já cobre tudo que falta para o plano');
    UI.ir('lista');
  };

  const detalheOriginal = UI.detalheReceita;
  UI.detalheReceita = function(id, porcoes) {
    detalheOriginal.call(UI, id, porcoes);
    const r = S.receitas.find(x => x.id === id);
    if (!r || typeof document === 'undefined') return;
    const p = porcoes || r.porcoesBase;
    const fator = p / r.porcoesBase;
    const idx = indiceEstoque(), cacheRes = new Map();
    const rows = [...document.querySelectorAll('#overlays .ing-linha')].slice(0, r.ingredientes.length);
    r.ingredientes.forEach((ing, i) => {
      const row = rows[i];
      if (!row || ing.opcional || ehBasico(ing.nome)) return;
      const cob = coberturaIngrediente(ing, fator, idx, cacheRes);
      if (cob.status === 'ok') return;
      row.classList.add('sem');
      const dot = row.querySelector('.pt');
      if (dot) { dot.className = 'pt falta'; dot.title = cob.status === 'parcial' ? 'quantidade insuficiente' : 'indisponível'; }
      const label = row.children[1];
      if (label && !label.querySelector('.qtd-parcial')) {
        const br = document.createElement('br');
        const small = document.createElement('small');
        small.className = 'qtd-parcial';
        small.style.color = 'var(--mostarda)';
        small.textContent = cob.status === 'parcial'
          ? `estoque parcial — falta ${U.fmtQtd(cob.faltante)} ${ing.unidade}`
          : cob.status === 'incompativel' ? 'estoque encontrado, mas a unidade não é compatível' : 'não há quantidade disponível';
        label.append(br, small);
      }
    });
  };

  const cardOriginal = UI.cardSugestao;
  UI.cardSugestao = function(s) {
    let html = cardOriginal.call(UI, s);
    for (const i of s.faltam || []) {
      if (!i.parcial || !(i.qtdFaltante > 0)) continue;
      const puro = U.esc(i.nome);
      const detalhado = `${puro} (faltam ${U.fmtQtd(i.qtdFaltante)} ${U.esc(i.unidade)})`;
      html = html.replace(`>${puro}</b>`, `>${detalhado}</b>`);
    }
    return html;
  };

  function substituirTudoAtomico(dump, config) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('chefprep', 1);
      req.onerror = () => reject(req.error || new Error('Não foi possível abrir o banco'));
      req.onsuccess = () => {
        const db = req.result;
        let tx;
        try { tx = db.transaction(['receitas', 'estoque', 'plano', 'lista', 'config'], 'readwrite'); }
        catch (e) { db.close(); reject(e); return; }
        tx.oncomplete = () => { db.close(); resolve(true); };
        tx.onerror = () => { const e = tx.error || new Error('Falha ao restaurar backup'); db.close(); reject(e); };
        tx.onabort = () => { const e = tx.error || new Error('Restauração cancelada'); db.close(); reject(e); };
        try {
          for (const nome of ['receitas', 'estoque', 'plano', 'lista']) {
            const os = tx.objectStore(nome);
            os.clear();
            for (const item of dump[nome]) os.put(item);
          }
          const cfg = tx.objectStore('config');
          cfg.clear();
          cfg.put(config);
        } catch (e) {
          try { tx.abort(); } catch (_) {}
          reject(e);
        }
      };
    });
  }

  UI.importarJSON = function(input) {
    const f = input.files[0];
    input.value = '';
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const d = JSON.parse(reader.result);
        if (!d || typeof d !== 'object' || !Array.isArray(d.receitas)) throw new Error('formato');
        const dump = {};
        for (const nome of ['receitas', 'estoque', 'plano', 'lista']) {
          dump[nome] = (Array.isArray(d[nome]) ? d[nome] : [])
            .filter(it => it && typeof it === 'object')
            .map(it => it.id ? it : Object.assign({ id: U.id() }, it));
        }
        if (dump.receitas.some(r => !r.nome || !Array.isArray(r.ingredientes) || !Array.isArray(r.passos)))
          throw new Error('receitas inválidas');
        if (dump.estoque.some(e => !e.nome || !e.unidade || !Number.isFinite(+e.qtd) || +e.qtd < 0))
          throw new Error('estoque inválido');
        const cfg = Object.assign({}, S.config, d.config && typeof d.config === 'object' ? d.config : {}, { id: 'cfg' });
        if (!confirm('Importar vai substituir todos os dados atuais. Continuar?')) return;
        await substituirTudoAtomico(dump, cfg);
        await carregarTudo();
        UI.fecharOverlay();
        UI.toast('Dados importados ✓');
        UI.render();
      } catch (e) {
        console.error('importarJSON:', e);
        UI.toast('Arquivo inválido ou restauração interrompida — dados atuais preservados');
      }
    };
    reader.readAsText(f);
  };

  const configOriginal = UI.abrirConfig;
  UI.abrirConfig = function() {
    configOriginal.call(UI);
    if (typeof document === 'undefined') return;
    document.querySelectorAll('#overlays .dica').forEach(el => {
      if (el.textContent.includes('ChefPrep v1.11.0')) el.innerHTML = el.innerHTML.replace('ChefPrep v1.11.0', 'ChefPrep v1.11.1');
    });
  };

  globalThis.ChefPrepCoreFixes = { coberturaIngrediente, itensFaltantesPlano, substituirTudoAtomico };
})();
