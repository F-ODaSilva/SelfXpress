/* Página de produto: produto.html#id */
document.addEventListener("DOMContentLoaded", () => {
  const { $ } = SX;
  let p, qty = 1;
  $("#zone").innerHTML = SX.zones.map((z) => `<option value="${z.id}">${z.name}</option>`).join("");

  function syncQty() {
    $("#qOut").textContent = qty;
    $("#addBtn").textContent = qty > 1 ? `Adicionar ${qty} · ${SX.mt(p.price * qty)}` : "Adicionar ao carrinho";
  }
  function eta() {
    const z = SX.zones.find((x) => x.id === $("#zone").value);
    const free = p.price * qty >= SX.freeFrom || z.fee === 0;
    $("#eta").innerHTML = `<b>${z.eta}.</b> ${free ? "Entrega grátis para esta compra." : `Entrega ${SX.mt(z.fee)}, grátis acima de ${SX.mt(SX.freeFrom)}.`}`;
  }
  function load() {
    p = SX.product(decodeURIComponent(location.hash.slice(1))) || SX.product("xbox-series-x");
    document.title = `${p.name} · SelfXpress`;
    $("#pCat").textContent = SX.catName(p.cat); $("#pCat").href = `loja.html#${p.cat}`;
    $("#pPhoto").classList.toggle("illus", !!p.illus);
    $("#pImg").src = p.img; $("#pImg").alt = p.name;
    $("#pBadges").innerHTML = (p.cond ? `<span class="badge cond">${p.cond}</span>` : "");
    $("#pName").textContent = p.name;
    $("#pDesc").textContent = p.desc;
    $("#pStock").textContent = p.stock <= 3 ? `Restam ${p.stock} em stock` : "Em stock em Malhangalene";
    $("#pStock").classList.toggle("low", p.stock <= 3);
    $("#pPrice").innerHTML = SX.priceHTML(p.price);
    $("#pWas").textContent = p.was ? SX.mt(p.was) : "";
    $("#pOff").hidden = !p.was; $("#pOff").textContent = p.was ? `Poupa ${SX.mt(p.was - p.price)}` : "";
    const w = p.specs.find((s) => s[0] === "Garantia");
    $("#pWarranty").textContent = w ? `${w[1]} de garantia` : "12 meses de garantia";
    $("#pSpecs").innerHTML = p.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    const rel = SX.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    $("#related").innerHTML = (rel.length >= 2 ? rel : SX.products.filter((x) => x.id !== p.id && x.tags.includes("destaque")).slice(0, 4)).map(SX.card).join("");
    $("#relLink").href = `loja.html#${p.cat}`;
    qty = 1; syncQty(); eta(); scrollTo({ top: 0, behavior: "instant" });
  }
  $("#qMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); syncQty(); eta(); });
  $("#qPlus").addEventListener("click", () => {
    if (qty >= p.stock) { SX.toast(`<div class="msg"><b>Só temos ${p.stock} em stock</b>Peça mais pelo WhatsApp e encomendamos.</div>`); return; }
    qty++; syncQty(); eta();
  });
  $("#zone").addEventListener("change", eta);
  $("#addBtn").addEventListener("click", () => SX.cart.add(p.id, qty));
  $("#buyNow").addEventListener("click", () => { SX.cart.add(p.id, qty); SX.openOrder(); });
  addEventListener("hashchange", load);
  load();
});
