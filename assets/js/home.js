/* Início: hero original (carrossel), categorias, carrossel, hotspots, contagem, testemunhos, contacto */
document.addEventListener("DOMContentLoaded", () => {
  const { $, $$ } = SX;

  /* original hero carousel: fade, 10 s per slide, arrows, indicators, swipe */
  const items = $$(".hx-item"), dots = $$(".hx-indicators button");
  let cur = 0, timer;
  const go = (i) => {
    cur = (i + items.length) % items.length;
    items.forEach((el, k) => { el.classList.toggle("is-active", k === cur); el.setAttribute("aria-hidden", String(k !== cur)); });
    dots.forEach((d, k) => { d.classList.toggle("is-active", k === cur); d.setAttribute("aria-selected", String(k === cur)); });
    items[cur].querySelectorAll("img[loading=lazy]").forEach((im) => im.removeAttribute("loading"));
    clearTimeout(timer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setTimeout(() => go(cur + 1), Number(items[cur].dataset.interval || 10000));
  };
  $(".hx-ctrl.prev").addEventListener("click", () => go(cur - 1));
  $(".hx-ctrl.next").addEventListener("click", () => go(cur + 1));
  dots.forEach((d, k) => d.addEventListener("click", () => go(k)));
  let x0 = null;
  const hx = $("#heroCarousel");
  hx.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  hx.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
  hx.addEventListener("mouseenter", () => clearTimeout(timer));
  hx.addEventListener("mouseleave", () => go(cur));
  go(0);
  /* promo banner close (original behaviour) */
  $("#close-btn").addEventListener("click", () => { $("#promo-banner").remove(); hx.classList.add("no-promo"); });

  $("#cats").innerHTML = SX.categories.map((c) => {
    const n = SX.products.filter((p) => p.cat === c.id).length;
    return `<a class="cat-tile${c.illus ? " illus" : ""}" href="loja.html#${c.id}">
      <img src="${c.img}" alt="" loading="lazy" width="600" height="600">
      <span class="ct-body"><span class="ct-name">${c.name}</span><span class="ct-line">${c.line}</span></span>
      <span class="ct-n num">${n} produtos</span>
    </a>`;
  }).join("");

  const rail = $("#rail");
  rail.innerHTML = SX.products.filter((p) => p.tags.includes("destaque")).map(SX.card).join("");
  $$(".rail-btn").forEach((b) => b.addEventListener("click", () => rail.scrollBy({ left: Number(b.dataset.rail) * Math.min(rail.clientWidth * 0.8, 900), behavior: "smooth" })));

  /* hotspots */
  const card = $("#spotCard");
  let open = null;
  $$(".spot").forEach((s) => s.addEventListener("click", (e) => {
    e.stopPropagation();
    if (open === s) { card.hidden = true; s.setAttribute("aria-expanded", "false"); open = null; return; }
    $$(".spot").forEach((x) => x.setAttribute("aria-expanded", "false"));
    const p = SX.product(s.dataset.spot);
    card.innerHTML = `<img src="${p.img}" alt=""><div class="stack" style="gap:4px"><span class="sc-t">${p.name}</span><span class="price">${SX.priceHTML(p.price)}</span></div><div class="row"><button class="btn sm" data-add="${p.id}">Adicionar</button><a class="btn sm line" href="produto.html#${p.id}">Detalhes</a></div>`;
    const stage = s.parentElement.getBoundingClientRect(), r = s.getBoundingClientRect();
    const x = r.left - stage.left + r.width / 2, y = r.top - stage.top;
    card.hidden = false;
    const w = card.offsetWidth;
    card.style.left = Math.max(8, Math.min(stage.width - w - 8, x - w / 2)) + "px";
    card.style.top = Math.max(8, y - card.offsetHeight - 14) + "px";
    s.setAttribute("aria-expanded", "true"); open = s;
  }));
  document.addEventListener("click", (e) => { if (open && !e.target.closest(".spot-card")) { card.hidden = true; open.setAttribute("aria-expanded", "false"); open = null; } });

  /* contagem até domingo às 23:59 */
  const end = new Date(); end.setDate(end.getDate() + ((7 - end.getDay()) % 7)); end.setHours(23, 59, 59, 0);
  const units = Object.fromEntries($$("#countdown [data-u]").map((el) => [el.dataset.u, el]));
  const tick = () => {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400; const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); s %= 60;
    units.d.textContent = d; units.h.textContent = String(h).padStart(2, "0"); units.m.textContent = String(m).padStart(2, "0"); units.s.textContent = String(s).padStart(2, "0");
  };
  tick(); setInterval(tick, 1000);

  $("#reviews").innerHTML = SX.reviews.map((r) => `<figure class="review">
    <div class="stars" aria-label="5 estrelas">${'<svg aria-hidden="true"><use href="assets/icons.svg#star"/></svg>'.repeat(5)}</div>
    <blockquote>“${r.text}”</blockquote>
    <figcaption><img src="assets/img/${r.img}-sm.webp" alt="" loading="lazy" width="56" height="56"><span><b>${r.name}</b>${r.where}</span></figcaption>
  </figure>`).join("");

  /* contacto */
  const f = $("#contactForm");
  const err = (el, m) => { const fl = el.closest(".field"); fl.classList.toggle("invalid", !!m); $(".err", fl).textContent = m || ""; return !m; };
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("#cName"), c = $("#cEmail"), m = $("#cMsg");
    let ok = err(n, n.value.trim().length < 2 ? "Escreva o seu nome." : "");
    ok = err(c, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value.trim()) && !/^\+?[\d\s]{9,}$/.test(c.value.trim()) ? "Indique um email válido ou um número com indicativo, ex.: +258 84 000 0000." : "") && ok;
    ok = err(m, m.value.trim().length < 10 ? "Conte-nos um pouco mais, pelo menos 10 caracteres." : "") && ok;
    if (!ok) { f.querySelector(".invalid input, .invalid textarea")?.focus(); return; }
    $("#sentText").textContent = `Obrigado, ${n.value.trim().split(" ")[0]}. Respondemos até amanhã às 12h.`;
    $("#sent").hidden = false; f.reset();
  });
});
