const { test, expect } = require('@playwright/test');

test('ChefPrep v1.11.1 browser/PWA smoke', async ({ page, context }) => {
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', err => pageErrors.push(String(err)));
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('body')).toContainText('ChefPrep');

  const baseline = await page.evaluate(() => ({
    provider: eval('SuggestionProvider.nome'),
    receitas: eval('S.receitas.length')
  }));
  expect(baseline.provider).toContain('quantitativo');
  expect(baseline.receitas).toBeGreaterThanOrEqual(817);

  const quantidade = await page.evaluate(() => eval(`(() => {
    S.estoque = [{ id:'qa-e', nome:'frango', qtd:50, unidade:'g', local:'geladeira' }];
    const r = { id:'qa-r', nome:'QA Frango', porcoesBase:1, favorito:false,
      ingredientes:[{ nome:'frango', qtd:500, unidade:'g', opcional:false, critico:true }] };
    const sug = SuggestionProvider.sugerir({ receitas:[r] })[0];
    const falta2p = itensFaltantes(r, 2)[0];
    return { badge:sug.badge, faltante:sug.faltam[0].qtdFaltante, falta2p:falta2p.qtd };
  })()`));
  expect(quantidade).toEqual({ badge: 'um', faltante: 450, falta2p: 950 });

  await page.evaluate(() => eval(`(() => {
    const item = { id:'qa-persist', nome:'tomate', local:'geladeira', qtd:3, unidade:'un', validade:null };
    S.estoque.push(item);
    return DB.salvar('estoque', item);
  })()`));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero')).toBeVisible({ timeout: 30000 });
  const persistiu = await page.evaluate(() => eval(`S.estoque.some(x => x.id === 'qa-persist')`));
  expect(persistiu).toBe(true);

  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero')).toBeVisible({ timeout: 30000 });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero')).toBeVisible({ timeout: 30000 });
  const offlineProvider = await page.evaluate(() => eval('SuggestionProvider.nome'));
  expect(offlineProvider).toContain('quantitativo');
  await context.setOffline(false);

  await page.evaluate(() => eval(`(() => {
    S.estoque = S.estoque.filter(x => x.id !== 'qa-persist');
    return DB.remover('estoque', 'qa-persist');
  })()`));

  expect(pageErrors).toEqual([]);
  expect(consoleErrors.filter(x => !x.includes('Failed to load resource'))).toEqual([]);
});
