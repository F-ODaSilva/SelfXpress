/* Loja: categoria pelo #hash, pesquisa (?q= ou campo), filtros e ordenação */
document.addEventListener("DOMContentLoaded", () => {
  const { $, $$ } = SX;
  const state = { cat: "all", q: "", max: 130000, promo: false, stock: false, refurb: false, sort: "rel" };
  const fromHash = () => { const h = location.hash.slice(1); state.cat = SX.categories.some((c) => c.id === h) ? h : "all"; };
  fromHash();
  try { const q = new URLSearchParams(location.search).get("q") || sessionStorage.getItem("sx-q"); sessionStorage.removeItem("sx-q"); if (q) { state.q = q; $("#shopSearch").value = q; } } catch { }

  const tabs = [{ id: "all", name: "Tudo" }, ...SX.categories];
  const renderTabs = () => {
    $("#catTabs").innerHTML = tabs.map((t) => `<a class="chip" href="#${t.id === "all" ? "" : t.id}" data-cat="${t.id}" aria-pressed="${state.cat === t.id}">${t.name} <span class="n num">${t.id === "all" ? SX.products.length : SX.products.filter((p) => p.cat === t.id).length}</span></a>`).join("");
  };
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function render() {
    renderTabs();
    const cat = SX.categories.find((c) => c.id === state.cat);
    $("#shopTitle").textContent = cat ? cat.name : "Todos os produtos";
    $("#crumbCat").textContent = cat ? cat.name : "Loja";
    document.title = `${cat ? cat.name : "Loja"} · SelfXpress`;
    const q = norm(state.q.trim());
    let list = SX.products.filter((p) =>
      (state.cat === "all" || p.cat === state.cat) &&
      (!q || norm(`${p.name} ${p.desc} ${SX.catName(p.cat)}`).includes(q)) &&
      p.price <= state.max && (!state.promo || p.was) && (!state.stock || p.stock > 2) && (!state.refurb || p.cond));
    if (state.sort === "asc") list.sort((a, b) => a.price - b.price);
    if (state.sort === "desc") list.sort((a, b) => b.price - a.price);
    if (state.sort === "off") list.sort((a, b) => SX.off(b) - SX.off(a));
    if (state.sort === "rel") list.sort((a, b) => (b.tags.includes("destaque") - a.tags.includes("destaque")));
    $("#grid").innerHTML = list.map(SX.card).join("");
    $("#count").textContent = `${list.length} ${list.length === 1 ? "produto" : "produtos"}${state.q ? ` para “${state.q}”` : ""}`;
    $("#none").hidden = list.length > 0;
  }

  addEventListener("hashchange", () => { fromHash(); render(); });
  let t; $("#shopSearch").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; render(); }, 120); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#fMax").addEventListener("input", (e) => { state.max = Number(e.target.value); $("#fMaxOut").textContent = SX.mt(state.max); render(); });
  [["fPromo", "promo"], ["fStock", "stock"], ["fRefurb", "refurb"]].forEach(([id, k]) => $("#" + id).addEventListener("change", (e) => { state[k] = e.target.checked; render(); }));
  const reset = () => { Object.assign(state, { q: "", max: 130000, promo: false, stock: false, refurb: false }); $("#shopSearch").value = ""; $("#fMax").value = 130000; $("#fMaxOut").textContent = SX.mt(130000); ["fPromo", "fStock", "fRefurb"].forEach((id) => ($("#" + id).checked = false)); render(); };
  $("#resetFilters").addEventListener("click", reset);
  $("#clearAll").addEventListener("click", () => { reset(); location.hash = ""; });
  const f = $("#filters");
  $("#openFilters").addEventListener("click", () => f.classList.add("open"));
  $("#closeFilters").addEventListener("click", () => f.classList.remove("open"));
  render();
});
