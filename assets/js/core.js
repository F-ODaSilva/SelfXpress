/* SelfXpress — shell, carrinho e encomenda por WhatsApp */
(function () {
  const SX = (window.SX = window.SX || {});
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  SX.$ = $; SX.$$ = $$;
  SX.reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  SX.icon = (id) => `<svg aria-hidden="true"><use href="assets/icons.svg#${id}"/></svg>`;
  const group = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  SX.group = group;
  SX.mt = (n) => group(n) + " MT";
  SX.priceHTML = (n) => `${group(n)}<small>MT</small>`;
  SX.product = (id) => SX.products.find((p) => p.id === id);
  SX.catName = (id) => SX.categories.find((c) => c.id === id)?.name || "";
  SX.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  SX.off = (p) => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0);

  const store = {
    get(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } }
  };
  SX.store = store;

  /* ---------- carrinho ---------- */
  const KEY = "sx-cart-v1";
  let cart = store.get(KEY, []);
  const subs = new Set();
  const emit = () => { store.set(KEY, cart); subs.forEach((f) => f(cart)); };
  SX.cart = {
    items: () => cart,
    on: (f) => { subs.add(f); f(cart); },
    add(id, qty = 1) {
      const p = SX.product(id); if (!p) return;
      const l = cart.find((x) => x.id === id);
      const max = p.stock;
      if (l) l.qty = Math.min(max, l.qty + qty); else cart.push({ id, qty: Math.min(max, qty) });
      emit(); bump();
      SX.toast(`<div class="th"><img src="${p.img}" alt=""></div><div class="msg"><b>Adicionado ao carrinho</b>${SX.esc(p.name)} · total ${SX.mt(SX.cart.subtotal())}</div><button class="btn sm" data-open-cart>Ver carrinho</button>`);
    },
    set(id, q) { const l = cart.find((x) => x.id === id); if (!l) return; const p = SX.product(id); if (q <= 0) cart = cart.filter((x) => x.id !== id); else l.qty = Math.min(p.stock, q); emit(); },
    clear() { cart = []; emit(); },
    count: () => cart.reduce((s, l) => s + l.qty, 0),
    subtotal: () => cart.reduce((s, l) => s + (SX.product(l.id)?.price || 0) * l.qty, 0)
  };
  function bump() { const c = $(".cart-count"); if (!c) return; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }

  let toastEl, tT;
  SX.toast = (html, ms = 3600) => {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.append(toastEl); }
    toastEl.innerHTML = html; requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(tT); tT = setTimeout(() => toastEl.classList.remove("show"), ms);
  };

  /* ---------- cartão de produto ---------- */
  SX.card = (p) => {
    const badges = [p.was ? `<span class="badge deal">−${SX.off(p)}%</span>` : "", p.cond ? `<span class="badge cond">${p.cond}</span>` : "", p.stock <= 2 ? `<span class="badge low">Últimas ${p.stock}</span>` : ""].join("");
    return `<article class="card">
      <div class="ph${p.illus ? " illus" : ""}"><img src="${p.img}" alt="${SX.esc(p.name)}" loading="lazy" decoding="async" width="600" height="600"><div class="badges">${badges}</div></div>
      <div class="body">
        <span class="cat">${SX.catName(p.cat)}</span>
        <h3>${SX.esc(p.name)}</h3>
        <div class="foot">
          <div class="pr">${p.was ? `<span class="was num">${SX.mt(p.was)}</span>` : ""}<span class="price">${SX.priceHTML(p.price)}</span></div>
          <button class="add" data-add="${p.id}" aria-label="Adicionar ${SX.esc(p.name)} ao carrinho">${SX.icon("plus")}</button>
        </div>
      </div>
      <a class="cover" href="produto.html#${p.id}" aria-label="Ver ${SX.esc(p.name)}"></a>
    </article>`;
  };

  /* ---------- mensagem WhatsApp ---------- */
  SX.orderText = (zoneId, extra = {}) => {
    const z = SX.zones.find((x) => x.id === zoneId) || SX.zones[0];
    const sub = SX.cart.subtotal();
    const fee = z.id === "recolha" || sub >= SX.freeFrom ? 0 : z.fee;
    const lines = SX.cart.items().map((l) => { const p = SX.product(l.id); return `• ${l.qty} × ${p.name} — ${SX.mt(p.price * l.qty)}`; });
    return {
      fee, total: sub + fee,
      text: [`Olá SelfXpress! Quero encomendar:`, ``, ...lines, ``, `Subtotal: ${SX.mt(sub)}`, `Entrega (${z.name}): ${fee ? SX.mt(fee) : "grátis"}`, `Total: ${SX.mt(sub + fee)}`, ``, extra.name ? `Nome: ${extra.name}` : "", extra.address ? `Morada: ${extra.address}` : "", `Pagamento: ${extra.pay || "na entrega"}`].filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n").trim()
    };
  };

  /* ---------- shell ---------- */
  const LINKS = [["index.html", "Início", "home"], ["sobre.html", "Sobre", "about"]];
  const CATS = [["loja.html#tech", "Tech"], ["loja.html#gaming", "Gaming"], ["loja.html#casa", "Home"], ["loja.html#kids", "Kids"]];
  function shell() {
    const page = document.body.dataset.page;
    const over = document.body.hasAttribute("data-nav-over");
    const promoClosed = store.get("sx-promo-closed", false);
    const top = document.createElement("div");
    top.innerHTML = `${promoClosed || over ? "" : `<div class="promo" id="promo"><div class="wrap"><span>💰 Poupe em grande: <b>25% de desconto na compra de 3 artigos</b>. Entrega grátis acima de ${SX.mt(SX.freeFrom)}.</span><button class="icon-btn" id="promoClose" aria-label="Fechar aviso">${SX.icon("x")}</button></div></div>`}
    <header class="nav${over ? " over" : ""}"><div class="wrap">
      <a class="logo" href="index.html" aria-label="SelfXpress, início">SelfXpress</a>
      <nav aria-label="Principal"><ul class="nav-links">
        ${LINKS.map(([h, l, p]) => `<li><a href="${h}"${p === page ? ' aria-current="page"' : ""}>${l}</a></li>`).join("")}
        <li class="dd"><a href="loja.html"${["shop", "product"].includes(page) ? ' aria-current="page"' : ""} aria-haspopup="true">Produtos ${SX.icon("chevron-down")}</a>
          <ul class="dd-menu">${CATS.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}<li><a href="loja.html">Ver tudo</a></li></ul></li>
      </ul></nav>
      <button class="icon-btn cart-btn" data-open-cart aria-label="Abrir carrinho">${SX.icon("bag")}<span class="cart-count num">0</span></button>
      <a class="btn contact-btn" href="index.html#contacto">Contato</a>
      <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false"><span></span></button>
    </div></header>`;
    document.body.prepend(...top.children);

    const sheet = document.createElement("div"); sheet.className = "sheet"; sheet.setAttribute("aria-hidden", "true");
    sheet.innerHTML = `<div class="top"><a class="logo" href="index.html">SelfXpress</a><button class="icon-btn" data-close-sheet aria-label="Fechar menu">${SX.icon("x")}</button></div>
      <form class="nav-search" role="search" action="loja.html"><label class="sr-only" for="q2">Pesquisar produtos</label>${SX.icon("search")}<input id="q2" name="q" type="search" placeholder="Pesquisar produtos"></form>
      <nav aria-label="Menu móvel">${[...LINKS, ["loja.html", "Produtos", "shop"], ...CATS.map(([h, l]) => [h, l, ""]), ["index.html#contacto", "Contato", ""]].map(([h, l, p]) => `<a href="${h}"${p === page ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
      <a class="btn wa" href="https://wa.me/${SX.whatsapp}" target="_blank" rel="noopener" style="margin-top:auto">${SX.icon("whatsapp")}Falar connosco no WhatsApp</a>`;
    document.body.append(sheet);

    const scrim = document.createElement("div"); scrim.className = "scrim"; document.body.append(scrim);
    const drawer = document.createElement("aside"); drawer.className = "drawer"; drawer.setAttribute("aria-label", "Carrinho"); drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = `<header><h2>Carrinho</h2><button class="icon-btn" data-close-cart aria-label="Fechar carrinho">${SX.icon("x")}</button></header><div class="lines"></div><footer></footer>`;
    document.body.append(drawer);

    const dlg = document.createElement("dialog"); dlg.className = "modal"; dlg.id = "waModal"; dlg.setAttribute("aria-labelledby", "waTitle");
    document.body.append(dlg);

    const footer = $("footer[data-shell]");
    if (footer) {
      footer.className = "footer";
      footer.innerHTML = `<div class="wrap">
        <div class="cols">
          <div class="stack" style="max-width:38ch">
            <a class="logo" href="index.html">SelfXpress</a>
            <p style="color:var(--on-night-2)">Tecnologia, electrodomésticos e gadgets para crianças, entregues em Maputo e Matola desde 2021.</p>
            <div class="pay" aria-label="Formas de pagamento"><span>M-Pesa</span><span>e-Mola</span><span>Visa / Mastercard</span><span>Numerário</span></div>
          </div>
          <div><h4>Loja</h4><ul><li><a href="loja.html#tech">Tecnologia</a></li><li><a href="loja.html#gaming">Gaming</a></li><li><a href="loja.html#casa">Casa</a></li><li><a href="loja.html#kids">Kids</a></li></ul></div>
          <div><h4>Empresa</h4><ul><li><a href="sobre.html">Sobre nós</a></li><li><a href="sobre.html#entregas">Entregas</a></li><li><a href="index.html#contacto">Contacto</a></li><li><a href="sobre.html#garantia">Garantia e trocas</a></li></ul></div>
          <div><h4>Visite-nos</h4><ul style="color:var(--on-night-2)"><li>Rua da França, nº 123</li><li>Malhangalene A, Maputo</li><li class="num">${SX.phoneLabel}</li><li>selfxpressshop@gmail.com</li></ul></div>
        </div>
        <div class="big" aria-hidden="true">SelfXpress</div>
        <div class="legal"><span>© 2026 SelfXpress, Lda. Preços com IVA incluído.</span><span>Design e desenvolvimento: OS.Design</span></div>
      </div>`;
    }

    /* comportamento */
    $$(".nav-search, .sheet .nav-search").forEach((f) => f.addEventListener("submit", () => { try { sessionStorage.setItem("sx-q", f.querySelector("input").value); } catch { } }));
    $("#promoClose")?.addEventListener("click", () => { $("#promo").remove(); store.set("sx-promo-closed", true); });
    const tog = $(".nav-toggle");
    const openSheet = (o) => { sheet.classList.toggle("open", o); sheet.setAttribute("aria-hidden", String(!o)); tog.setAttribute("aria-expanded", String(o)); document.documentElement.style.overflow = o ? "hidden" : ""; };
    tog.addEventListener("click", () => openSheet(true));
    $("[data-close-sheet]", sheet).addEventListener("click", () => openSheet(false));
    const openCart = (o) => { drawer.classList.toggle("open", o); scrim.classList.toggle("show", o); drawer.setAttribute("aria-hidden", String(!o)); document.documentElement.style.overflow = o ? "hidden" : ""; if (o) $("[data-close-cart]", drawer).focus(); };
    SX.openCart = openCart;
    scrim.addEventListener("click", () => openCart(false));
    addEventListener("keydown", (e) => { if (e.key === "Escape") { openCart(false); openSheet(false); } });
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-cart]")) { e.preventDefault(); toastEl?.classList.remove("show"); openCart(true); }
      if (e.target.closest("[data-close-cart]")) openCart(false);
      const a = e.target.closest("[data-add]");
      if (a) { e.preventDefault(); SX.cart.add(a.dataset.add, Number(a.dataset.qty || 1)); a.classList.add("done"); setTimeout(() => a.classList.remove("done"), 1100); }
      const q = e.target.closest("[data-q]");
      if (q) { const l = SX.cart.items().find((x) => x.id === q.dataset.q); if (l) SX.cart.set(l.id, l.qty + Number(q.dataset.d)); }
      if (e.target.closest("[data-checkout]")) { openCart(false); openOrder(); }
    });

    if (over) { const nav = $(".nav"); const onS = () => nav.classList.toggle("solid", scrollY > 60); addEventListener("scroll", onS, { passive: true }); onS(); }
    const count = $(".cart-count");
    SX.cart.on(() => { const n = SX.cart.count(); count.textContent = n; count.classList.toggle("has", n > 0); renderDrawer(drawer); });
  }

  function renderDrawer(d) {
    const items = SX.cart.items(), lines = $(".lines", d), foot = $("footer", d);
    if (!items.length) {
      lines.innerHTML = `<div class="empty"><div class="ring">${SX.icon("bag")}</div><h3 style="font-family:var(--body);font-weight:600">O carrinho está vazio</h3><p>Escolha um produto e ele fica aqui enquanto continua a ver a loja.</p><a class="btn ink" href="loja.html">Ir para a loja</a></div>`;
      foot.innerHTML = ""; return;
    }
    lines.innerHTML = items.map((l) => { const p = SX.product(l.id); return `<div class="cart-line">
      <div class="th${p.illus ? " illus" : ""}"><img src="${p.img}" alt=""></div>
      <div><div class="t">${SX.esc(p.name)}</div><div class="m">${SX.mt(p.price)}${l.qty >= p.stock ? " · máximo em stock" : ""}</div></div>
      <div class="end"><strong class="num">${SX.mt(p.price * l.qty)}</strong><div class="qty"><button data-q="${l.id}" data-d="-1" aria-label="Menos um">${SX.icon(l.qty === 1 ? "trash" : "minus")}</button><output>${l.qty}</output><button data-q="${l.id}" data-d="1" aria-label="Mais um">${SX.icon("plus")}</button></div></div>
    </div>`; }).join("");
    const sub = SX.cart.subtotal(), left = Math.max(0, SX.freeFrom - sub);
    foot.innerHTML = `<div class="free-bar"><span>${left ? `Faltam <b class="num">${SX.mt(left)}</b> para a entrega grátis` : `<b>Entrega grátis</b> em Maputo e Matola`}</span><div class="track"><div class="fill" style="width:${Math.min(100, sub / SX.freeFrom * 100)}%"></div></div></div>
      <div class="sum total"><span>Subtotal</span><span class="num">${SX.mt(sub)}</span></div>
      <button class="btn wa block" data-checkout>${SX.icon("whatsapp")}Encomendar pelo WhatsApp</button>
      <p style="font-size:.8rem;color:var(--ink-3);text-align:center">Confirmamos o stock e a hora de entrega na conversa. Paga só quando receber.</p>`;
  }

  /* ---------- modal de encomenda ---------- */
  function openOrder() {
    const dlg = $("#waModal");
    dlg.innerHTML = `<div class="mb">
      <div class="row" style="justify-content:space-between"><h2 id="waTitle" style="font-size:1.4rem">Confirmar encomenda</h2><button class="icon-btn" data-close-dlg aria-label="Fechar">${SX.icon("x")}</button></div>
      <form id="waForm" class="stack" novalidate>
        <div class="grid-2">
          <div class="field"><label for="wName">Nome</label><input class="input" id="wName" autocomplete="name"><span class="err"></span></div>
          <div class="field"><label for="wZone">Entrega</label><select class="select" id="wZone">${SX.zones.map((z) => `<option value="${z.id}">${z.name}${z.fee ? " · " + SX.mt(z.fee) : " · grátis"}</option>`).join("")}</select></div>
        </div>
        <div class="field" id="addrField"><label for="wAddr">Morada ou ponto de referência</label><input class="input" id="wAddr" placeholder="Ex.: Av. Vladimir Lenine 1200, perto do Shoprite"><span class="err"></span></div>
        <div class="field"><label for="wPay">Pagamento</label><select class="select" id="wPay"><option>M-Pesa na entrega</option><option>e-Mola na entrega</option><option>Cartão na entrega</option><option>Numerário</option></select></div>
        <div class="wa-preview"><div class="wa-bubble" id="waText"></div></div>
        <p class="muted" style="font-size:.85rem" id="waEta"></p>
        <div class="row">
          <a class="btn wa" id="waGo" target="_blank" rel="noopener">${SX.icon("send")}Abrir WhatsApp</a>
          <button class="btn line" type="button" id="waCopy">Copiar mensagem</button>
        </div>
        <p style="font-size:.8rem;color:var(--ink-3)">Se o WhatsApp não abrir, copie a mensagem e envie para <span class="num">${SX.phoneLabel}</span>.</p>
      </form></div>`;
    const sync = () => {
      const zone = $("#wZone").value, z = SX.zones.find((x) => x.id === zone);
      $("#addrField").hidden = zone === "recolha";
      const o = SX.orderText(zone, { name: $("#wName").value.trim(), address: zone === "recolha" ? "Recolha na loja, Rua da França 123" : $("#wAddr").value.trim(), pay: $("#wPay").value });
      $("#waText").textContent = o.text;
      $("#waEta").textContent = `${z.eta}. Total a pagar: ${SX.mt(o.total)}.`;
      $("#waGo").href = `https://wa.me/${SX.whatsapp}?text=${encodeURIComponent(o.text)}`;
    };
    dlg.addEventListener("input", sync); sync();
    dlg.addEventListener("click", async (e) => {
      if (e.target === dlg || e.target.closest("[data-close-dlg]")) dlg.close();
      if (e.target.closest("#waCopy")) {
        const b = $("#waCopy");
        try { await navigator.clipboard.writeText($("#waText").textContent); b.textContent = "Copiada"; }
        catch { const r = document.createRange(); r.selectNodeContents($("#waText")); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = "Seleccionada, use Ctrl+C"; }
        setTimeout(() => (b.textContent = "Copiar mensagem"), 2400);
      }
      if (e.target.closest("#waGo")) {
        const n = $("#wName"), f = n.closest(".field");
        if (n.value.trim().length < 2) { e.preventDefault(); f.classList.add("invalid"); $(".err", f).textContent = "Escreva o seu nome para a encomenda."; n.focus(); return; }
        f.classList.remove("invalid"); $(".err", f).textContent = "";
      }
    });
    dlg.showModal();
  }
  SX.openOrder = openOrder;

  document.addEventListener("DOMContentLoaded", shell);
})();
