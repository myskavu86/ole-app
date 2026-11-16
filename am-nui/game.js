(() => {
  const STORE_KEY = "am-nui-v1";
  const MIN_ANSWER = 40;   // số ký tự tối thiểu cho câu trả lời đầu
  const MIN_REPLY = 20;    // và cho câu đáp lại thầy
  const STILL_SECONDS = 20;

  const app = document.getElementById("app");
  const today = () => new Date().toLocaleDateString("sv-SE"); // yyyy-mm-dd theo giờ máy

  // ---------- trạng thái ----------
  let state = { done: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved && Array.isArray(saved.done)) state = saved;
  } catch { /* dữ liệu hỏng thì bắt đầu lại */ }
  const save = () => localStorage.setItem(STORE_KEY, JSON.stringify(state));

  const doneToday = () => state.done.some((d) => d.date === today());
  const nextKoan = () => KOANS[state.done.length % KOANS.length];
  let session = null; // lượt chơi đang diễn ra

  // ---------- tiện ích ----------
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let timer = null; // đồng hồ tĩnh tâm; dừng mỗi khi đổi màn
  const show = (html, bare = false) => {
    clearInterval(timer);
    app.innerHTML = `<section class="panel${bare ? " bare" : ""}">${html}</section>`;
    window.scrollTo(0, 0);
    return app.firstElementChild;
  };

  // xác nhận bằng hai lần bấm (không dùng hộp thoại của trình duyệt)
  function arm(btn, label) {
    btn.dataset.armed = "1"; btn.dataset.label = btn.textContent; btn.textContent = label;
    setTimeout(() => disarm(btn), 4000);
  }
  function disarm(btn) {
    if (!btn.dataset.armed) return;
    btn.textContent = btn.dataset.label; delete btn.dataset.armed;
  }
  function twoStep(btn, label, action) {
    btn.onclick = () => (btn.dataset.armed ? action() : arm(btn, label));
  }

  let audio;
  function ringBell() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t = audio.currentTime;
      [[196, 0.5, 6], [392, 0.25, 4.5], [523, 0.12, 3.5], [784, 0.06, 2.5]].forEach(([f, vol, dur]) => {
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain).connect(audio.destination);
        osc.start(t); osc.stop(t + dur);
      });
    } catch { /* không có âm thanh thì vẫn chơi được */ }
  }

  function paintScene() {
    const n = state.done.length;
    document.getElementById("lamps").innerHTML =
      KOANS.map((_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");
    const grow = Math.min(n, KOANS.length) / KOANS.length;
    document.getElementById("tree").setAttribute("transform", `translate(290 475) scale(${0.4 + grow * 0.6})`);
    document.getElementById("amWindow").setAttribute("opacity", 0.35 + grow * 0.65);
    document.getElementById("amGlow").setAttribute("opacity", 0.15 + grow * 0.7);
  }

  // ô nhập có đếm ký tự; nút chỉ bật khi viết đủ
  function writingBox(min, buttonLabel, onSubmit) {
    const box = app.querySelector("textarea"), btn = app.querySelector(".btn"), count = app.querySelector(".count");
    const update = () => {
      const len = box.value.trim().length;
      btn.disabled = len < min;
      count.textContent = len < min ? `Viết thêm ${min - len} ký tự nữa` : "Đã đủ để trình thầy";
    };
    btn.textContent = buttonLabel;
    box.addEventListener("input", update);
    btn.addEventListener("click", () => onSubmit(box.value.trim()));
    update();
    box.focus();
  }
  const writingHtml = (placeholder) => `
    <textarea placeholder="${placeholder}"></textarea>
    <div class="row"><span class="muted count"></span><button class="btn"></button></div>`;

  // ---------- các màn ----------
  function home() {
    session = null;
    paintScene();
    const n = state.done.length;
    if (doneToday()) {
      show(`
        <p class="eyebrow">Ngày thứ ${n}</p>
        <h1>Hôm nay con đã vấn đáp xong.</h1>
        <p>Đèn trong am đã sáng thêm một ngọn. Hãy để câu hỏi của thầy đi cùng con trong ngày, mai lại lên núi.</p>
        <p><button class="link" id="again">Bản thử: mở luôn công án kế tiếp</button></p>`, true);
      document.getElementById("again").onclick = stillness;
    } else {
      show(`
        <p class="eyebrow">${n ? `Ngày thứ ${n + 1}` : "Đường lên am"}</p>
        <h1>${n ? "Con lại lên núi." : "Mỗi ngày một công án."}</h1>
        <p>${n ? "Thầy đang chờ trong am." : "Ở đây không ai trả lời hộ con. Thầy chỉ hỏi, phần nghĩ là của con."}</p>
        <button class="bell" id="bell">Gõ chuông</button>
        <p class="muted">Chừng năm phút. Nên bật tiếng.</p>`, true);
      document.getElementById("bell").onclick = stillness;
    }
  }

  function stillness() {
    ringBell();
    let left = STILL_SECONDS;
    show(`
      <p class="eyebrow">Tĩnh tâm</p>
      <div class="breath"></div>
      <p>Hít vào khi vòng tròn nở ra, thở ra khi nó thu lại.</p>
      <p class="muted" id="left"></p>
      <p><button class="link" id="skip">Vào gặp thầy</button></p>`, true);
    const tick = () => { document.getElementById("left").textContent = `Còn ${left} giây`; };
    tick();
    timer = setInterval(() => { left -= 1; left <= 0 ? go() : tick(); }, 1000);
    function go() { start(); }
    document.getElementById("skip").onclick = go;
  }

  function start() {
    const koan = nextKoan();
    session = { koan, date: today() };
    koan.type === "pha-vong" ? illusion() : situation();
  }

  // --- công án tình huống ---
  function situation() {
    const { koan } = session;
    show(`
      <p class="eyebrow">Công án · ${esc(koan.title)}</p>
      <p class="story">${esc(koan.story)}</p>
      ${writingHtml("Con sẽ làm gì, và vì sao? Viết bằng lời của con.")}`);
    writingBox(MIN_ANSWER, "Trình thầy", (text) => { session.answer = text; masterAsks(); });
  }

  function masterAsks() {
    const { koan, answer } = session;
    show(`
      <p class="eyebrow">Thầy hỏi lại</p>
      <div class="mine"><b>Con đã thưa</b>${esc(answer)}</div>
      <blockquote>${esc(koan.ask)}</blockquote>
      ${writingHtml("Nghĩ thêm một lượt rồi đáp lời thầy.")}`);
    writingBox(MIN_REPLY, "Thưa thầy", (text) => { session.reply = text; choosePath(); });
  }

  function choosePath() {
    const { koan } = session;
    const panel = show(`
      <p class="eyebrow">Chọn đường</p>
      <h2>Sau khi nghĩ lại, điều con sẽ làm gần với hướng nào nhất?</h2>
      <div class="choices">
        ${koan.paths.map((p, i) => `<button class="choice" data-i="${i}">${esc(p.label)}</button>`).join("")}
      </div>`);
    panel.querySelectorAll(".choice").forEach((b) => {
      b.onclick = () => { session.path = Number(b.dataset.i); karma(); };
    });
  }

  function karma() {
    const { koan, path } = session;
    const p = koan.paths[path];
    show(`
      <p class="eyebrow">Nhân quả · ${esc(p.label)}</p>
      <div class="beat"><h3>Trước mắt</h3><p>${esc(p.now)}</p></div>
      <div class="beat"><h3>Về sau</h3><p>${esc(p.later)}</p></div>
      <div class="late">
        <p class="muted">Đây là một diễn biến có thể xảy ra, không phải lời phán đúng sai.</p>
        <div class="row"><span></span><button class="btn" id="next">Nghe lời thầy</button></div>
      </div>`);
    document.getElementById("next").onclick = closing;
  }

  // --- công án phá vọng ---
  function illusion() {
    const { koan } = session;
    show(`
      <p class="eyebrow">Phá vọng · ${esc(koan.title)}</p>
      <p>Hôm nay thầy đưa con một lời khuyên nghe rất xuôi tai. Trong đó có chỗ không vững. Con hãy tự tìm.</p>
      <blockquote>${esc(koan.claim)}</blockquote>
      ${writingHtml("Chỗ nào trong lời này chưa đứng được? Vì sao?")}`);
    writingBox(MIN_ANSWER, "Trình thầy", (text) => { session.answer = text; reveal(); });
  }

  function reveal() {
    const { koan, answer } = session;
    show(`
      <p class="eyebrow">Soi lại</p>
      <div class="mine"><b>Con đã chỉ ra</b>${esc(answer)}</div>
      <p>Dưới đây là những chỗ thầy thấy chưa vững. Con tự đối chiếu xem mình đã thấy được mấy chỗ, và có thấy chỗ nào thầy chưa nêu không.</p>
      <ul>${koan.flaws.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <div class="row"><span></span><button class="btn" id="next">Nghe lời thầy</button></div>`);
    document.getElementById("next").onclick = closing;
  }

  // --- kết thúc ngày ---
  function closing() {
    const { koan } = session;
    state.done.push({
      id: koan.id, date: session.date, answer: session.answer,
      reply: session.reply || null, path: session.path ?? null,
    });
    save();
    paintScene();
    ringBell();
    show(`
      <p class="eyebrow">Mang theo xuống núi</p>
      <blockquote>${esc(koan.close)}</blockquote>
      <p>Câu này con không cần trả lời ngay. Một ngọn đèn nữa đã được thắp.</p>
      <div class="row"><button class="link" id="journal">Xem sổ tay</button><button class="btn" id="home">Xuống núi</button></div>`);
    document.getElementById("home").onclick = home;
    document.getElementById("journal").onclick = journal;
  }

  function journal() {
    const byId = Object.fromEntries(KOANS.map((k) => [k.id, k]));
    const entries = state.done.slice().reverse().map((d) => {
      const k = byId[d.id];
      if (!k) return "";
      return `<div class="entry">
        <p class="muted">${esc(d.date)} · ${k.type === "pha-vong" ? "Phá vọng" : "Công án"}</p>
        <h2>${esc(k.title)}</h2>
        <div class="mine"><b>Con đã thưa</b>${esc(d.answer)}</div>
        ${d.reply ? `<div class="mine"><b>Đáp lời thầy</b>${esc(d.reply)}</div>` : ""}
        ${d.path !== null && k.paths ? `<p class="muted">Đường đã chọn: ${esc(k.paths[d.path].label)}</p>` : ""}
      </div>`;
    }).join("");
    show(`
      <p class="eyebrow">Sổ tay</p>
      ${entries || "<p>Sổ còn trắng. Gõ chuông để nhận công án đầu tiên.</p>"}
      <div class="row">
        ${state.done.length ? '<button class="link" id="reset">Xóa sổ, bắt đầu lại</button>' : "<span></span>"}
        <button class="btn" id="home">Quay lại</button>
      </div>`);
    document.getElementById("home").onclick = home;
    const reset = document.getElementById("reset");
    if (reset) twoStep(reset, "Bấm lần nữa để xóa hết", () => { state = { done: [] }; save(); home(); });
  }

  // ---------- khởi động ----------
  const stars = document.getElementById("stars");
  for (let i = 0; i < 60; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", Math.random() * 800);
    c.setAttribute("cy", Math.random() * 300);
    c.setAttribute("r", Math.random() * 1.2 + 0.3);
    c.style.animationDelay = `${Math.random() * 4}s`;
    stars.appendChild(c);
  }
  const btnJournal = document.getElementById("btnJournal");
  btnJournal.onclick = () => {
    if (!session || btnJournal.dataset.armed) { disarm(btnJournal); journal(); return; }
    arm(btnJournal, "Bỏ dở công án?");
  };
  home();
})();
