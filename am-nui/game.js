import { createWorld, BELL_T } from "./world.js";

const STORE_KEY = "am-nui-v2";
const MIN_ANSWER = 40; // số ký tự tối thiểu cho câu trả lời đầu
const MIN_REPLY = 20;  // và cho câu đáp lại thầy
const STILL_SECONDS = 24; // ba hơi thở, mỗi hơi 8 giây (4 hít, 4 thở)
const BREATH_SECONDS = 8;

// Ba cách hành xử, không cách nào được chấm là đúng. Mỗi cách cho một màu lửa.
const STYLES = {
  thang: { name: "Thẳng", color: "#ff6a3d", dot: "🔴", note: "đối diện trực tiếp" },
  nhu: { name: "Nhu", color: "#7ee0a1", dot: "🟢", note: "nhường để giữ hòa khí" },
  kheo: { name: "Khéo", color: "#8fc5ff", dot: "🔵", note: "tìm một lối khác" },
  tue: { name: "Phá vọng", color: "#ffd166", dot: "🟡", note: "soi ra chỗ sai" },
};

const app = document.getElementById("app");
const hintEl = document.getElementById("hint");
const actionBtn = document.getElementById("action");
const today = () => new Date().toLocaleDateString("sv-SE"); // yyyy-mm-dd theo giờ máy
const byId = Object.fromEntries(KOANS.map((k) => [k.id, k]));

// ---------- trạng thái ----------
let state = { done: [] };
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY));
  if (saved && Array.isArray(saved.done)) state = saved;
} catch { /* không đọc được thì bắt đầu lại */ }
const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* vẫn chơi được trong phiên này */ } };

const doneToday = () => state.done.some((d) => d.date === today());
const nextKoan = () => KOANS[state.done.length % KOANS.length];
let session = null; // công án đang làm dở
let rung = doneToday(); // hôm nay đã gõ chuông chưa

// ---------- thế giới 3D ----------
let world = null;
try { world = createWorld(document.getElementById("world")); } catch (err) { console.warn("Không dựng được cảnh 3D:", err); }

const setMode = (m) => { document.body.dataset.mode = m; };
const hint = (text) => { if (hintEl.textContent !== text) hintEl.textContent = text; };
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const show = (html, cls = "") => {
  app.innerHTML = `<section class="panel ${cls}">${html}</section>`;
  return app.firstElementChild;
};
const hide = () => { app.innerHTML = ""; };
const on = (id, fn) => { document.getElementById(id).onclick = fn; };

// màu đèn: mỗi công án đã xong thắp một ngọn, quá mười ngọn thì quay vòng
function lanternColors() {
  const colors = new Array(KOANS.length).fill(null);
  state.done.forEach((d, i) => { colors[i % KOANS.length] = STYLES[d.style]?.color ?? STYLES.tue.color; });
  return colors;
}
function paint() {
  const colors = lanternColors();
  document.getElementById("lamps").innerHTML =
    colors.map((c) => `<i ${c ? `class="on" style="background:${c};box-shadow:0 0 8px ${c}"` : ""}></i>`).join("");
  if (!world) return;
  world.setLanterns(colors);
  world.setGrowth(Math.min(state.done.length, KOANS.length) / KOANS.length);
  world.setFireflies(12 + state.done.reduce((n, d) => n + (d.found || 0), 0) * 8);
}

// ---------- âm thanh ----------
let audio;
function tone(partials) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const t = audio.currentTime;
    partials.forEach(([f, vol, dur]) => {
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
const bellSound = () => tone([[131, 0.5, 8], [262, 0.3, 6], [392, 0.14, 4.5], [655, 0.07, 3]]);
const chimeSound = () => tone([[784, 0.2, 3], [1175, 0.1, 2.2], [1568, 0.05, 1.5]]);

// xác nhận bằng hai lần bấm (không dùng hộp thoại của trình duyệt)
function arm(btn, label) {
  btn.dataset.armed = "1"; btn.dataset.label = btn.textContent; btn.textContent = label;
  setTimeout(() => disarm(btn), 4000);
}
function disarm(btn) {
  if (!btn.dataset.armed) return;
  btn.textContent = btn.dataset.label; delete btn.dataset.armed;
}

// ô nhập có đếm ký tự; nút chỉ bật khi viết đủ
const writingHtml = (placeholder) => `
  <textarea placeholder="${placeholder}"></textarea>
  <div class="row"><span class="muted count"></span><button class="btn"></button></div>`;
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
}

// ---------- đi trên núi ----------
let actionFn = null, actionKey = "";
function setAction(label, fn) {
  if (actionKey === (label || "")) return;
  actionKey = label || "";
  actionFn = fn;
  actionBtn.hidden = !label;
  actionBtn.textContent = label || "";
}
actionBtn.onclick = () => actionFn && actionFn();

function walkMode() {
  hide();
  session = null;
  if (!world) return noWorldHome();
  world.release();
  world.maxT = rung ? 1 : BELL_T;
  setMode("walk");
}

function tick() {
  if (document.body.dataset.mode !== "walk") return;
  if (!rung && world.t >= BELL_T - 0.01) {
    world.focus = world.bellFocus;
    hint("Chạm vào quả chuông để gõ.");
    setAction("Gõ chuông", strikeBell);
  } else if (world.t >= 0.995) {
    world.focus = null;
    hint("");
    setAction("Vào am gặp thầy", enterAm);
  } else {
    world.focus = null;
    setAction(null);
    if (world.t < 0.02) hint("Giữ nút để bước lên núi. Kéo màn hình để nhìn quanh.");
    else if (!rung) hint("Lầu chuông ở phía trước.");
    else hint(world.t < 0.9 ? "" : "Am ở ngay trên kia.");
  }
}

function strikeBell() {
  bellSound();
  world.ringBell();
  if (rung) return;
  rung = true;
  setMode("listen");
  setAction(null);
  hint("");
  stillness(() => {
    world.focus = null;
    world.maxT = 1;
    setMode("walk");
    hint("Đường lên am đã mở.");
  });
}

// Tĩnh tâm sau tiếng chuông: thở theo vòng tròn, có thể bỏ qua.
let stillTimer = null;
function stillness(onDone) {
  setMode("listen");
  const started = Date.now();
  show(`
    <p class="eyebrow">Tĩnh tâm</p>
    <div class="breath"></div>
    <h2 id="phase">Hít vào</h2>
    <p class="muted">Thở theo vòng tròn: nở ra thì hít vào, thu lại thì thở ra.</p>
    <p class="muted" id="left"></p>
    <button class="link" id="skip">Bỏ qua</button>`, "center still");
  const finish = () => { clearInterval(stillTimer); stillTimer = null; hide(); onDone(); };
  const update = () => {
    const elapsed = (Date.now() - started) / 1000;
    if (elapsed >= STILL_SECONDS) return finish();
    document.getElementById("phase").textContent = elapsed % BREATH_SECONDS < BREATH_SECONDS / 2 ? "Hít vào" : "Thở ra";
    document.getElementById("left").textContent = `Còn ${Math.ceil(STILL_SECONDS - elapsed)} giây`;
  };
  clearInterval(stillTimer);
  stillTimer = setInterval(update, 250);
  update();
  on("skip", finish);
}

async function enterAm() {
  setMode("panel");
  hint("");
  setAction(null);
  await world.sit();
  doneToday() ? donePanel() : start();
}

function leaveAm() {
  if (world) world.t = 1;
  walkMode();
}

// ---------- các màn chữ ----------
function intro() {
  const last = state.done[state.done.length - 1];
  const n = state.done.length;
  show(`
    <p class="eyebrow">${n ? `Ngày thứ ${n + (doneToday() ? 0 : 1)}` : "Chân núi"}</p>
    <h1>${n ? "Con lại lên núi." : "Mỗi ngày một công án."}</h1>
    ${last && byId[last.id]
      ? `<p class="muted">Lần trước thầy hỏi:</p><blockquote>${esc(byId[last.id].close)}</blockquote>`
      : "<p>Trên đỉnh núi có một ngôi am. Thầy ở đó không trả lời hộ ai điều gì. Thầy chỉ hỏi, phần nghĩ là của con.</p>"}
    <p class="muted">Gõ chuông ở lưng núi, rồi lên am gặp thầy. Chừng năm phút. Nên bật tiếng.</p>
    <button class="btn" id="go">${world ? "Bắt đầu lên núi" : "Gặp thầy"}</button>`, "center");
  on("go", () => {
    if (world) return walkMode();
    if (doneToday()) return donePanel();
    bellSound(); // không có cảnh 3D thì vẫn nghe chuông và tĩnh tâm trước khi gặp thầy
    stillness(() => { setMode("panel"); start(); });
  });
}

function noWorldHome() {
  setMode("panel");
  intro();
}

function donePanel() {
  setMode("panel");
  show(`
    <p class="eyebrow">Ngày thứ ${state.done.length}</p>
    <h2>Hôm nay con đã vấn đáp xong.</h2>
    <p>Hãy để câu hỏi của thầy đi cùng con trong ngày. Mai lại lên núi.</p>
    <div class="row">
      <button class="link" id="again">Bản thử: mở luôn công án kế tiếp</button>
      <button class="link" id="card">Thẻ hôm nay</button>
      ${world ? '<button class="btn" id="leave">Ra khỏi am</button>' : ""}
    </div>`);
  on("again", start);
  on("card", shareCard);
  if (world) on("leave", leaveAm);
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
    b.onclick = () => { session.first = Number(b.dataset.i); twist(); };
  });
}

// thầy thêm một tình tiết: giữ đường hay đổi?
function twist() {
  const { koan, first } = session;
  const panel = show(`
    <p class="eyebrow">Thầy nói thêm</p>
    <p class="muted">Con đã chọn: ${esc(koan.paths[first].label)}</p>
    <blockquote class="twist">Có một điều con chưa biết. ${esc(koan.twist)}</blockquote>
    <h2>Biết thêm điều ấy, con giữ đường cũ hay đổi?</h2>
    <div class="choices">
      ${koan.paths.map((p, i) => `<button class="choice" data-i="${i}">${i === first ? "Giữ đường đã chọn" : `Đổi: ${esc(p.label)}`}</button>`).join("")}
    </div>`);
  panel.querySelectorAll(".choice").forEach((b) => {
    b.onclick = () => { session.path = Number(b.dataset.i); session.changed = session.path !== first; karma(); };
  });
}

function karma() {
  const { koan, path, changed } = session;
  const p = koan.paths[path];
  show(`
    <p class="eyebrow">Nhân quả · ${changed ? "đường mới" : "đường đã giữ"}</p>
    <h2>${esc(p.label)}</h2>
    <div class="beat"><h3>Trước mắt</h3><p>${esc(p.now)}</p></div>
    <div class="beat"><h3>Về sau</h3><p>${esc(p.later)}</p></div>
    <div class="late">
      <p class="muted">Đây là một diễn biến có thể xảy ra, không phải lời phán đúng sai.</p>
      <div class="row"><span></span><button class="btn" id="next">Nghe lời thầy</button></div>
    </div>`);
  on("next", closing);
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
  const panel = show(`
    <p class="eyebrow">Soi lại</p>
    <div class="mine"><b>Con đã chỉ ra</b>${esc(answer)}</div>
    <p>Đây là những chỗ thầy thấy chưa vững. Con tự đánh dấu những chỗ mình đã thấy. Không ai kiểm tra con ngoài con.</p>
    ${koan.flaws.map((f) => `<label class="flaw"><input type="checkbox"><span>${esc(f)}</span></label>`).join("")}
    <div class="row"><span class="muted">Mỗi chỗ con thấy được gọi thêm đom đóm về núi.</span><button class="btn" id="next">Nghe lời thầy</button></div>`);
  on("next", () => { session.found = panel.querySelectorAll("input:checked").length; closing(); });
}

// --- kết thúc ngày ---
function closing() {
  const { koan } = session;
  const style = koan.type === "pha-vong" ? "tue" : koan.paths[session.path].style;
  state.done.push({
    id: koan.id, date: session.date, answer: session.answer, style,
    reply: session.reply || null, path: session.path ?? null,
    changed: session.changed || false, found: session.found ?? null,
  });
  save();
  session = null;
  const s = STYLES[style];
  show(`
    <p class="eyebrow">Mang theo xuống núi</p>
    <blockquote>${esc(koan.close)}</blockquote>
    <p>Câu này con không cần trả lời ngay.</p>
    <p class="muted">Ngọn đèn hôm nay mang lửa <b style="color:${s.color}">${s.name}</b> (${s.note}).</p>
    <div class="row"><span></span><button class="btn" id="light">Thắp đèn</button></div>`);
  on("light", lightLantern);
}

async function lightLantern() {
  const last = state.done[state.done.length - 1];
  const index = (state.done.length - 1) % KOANS.length;
  hide();
  if (world) {
    await world.viewLantern(index);
    world.igniteLantern(index, STYLES[last.style].color);
  }
  chimeSound();
  paint();
  setTimeout(shareCard, world ? 2600 : 0);
}

// ---------- thẻ chia sẻ ----------
function tally() {
  const t = { thang: 0, nhu: 0, kheo: 0, tue: 0 };
  state.done.forEach((d) => { t[d.style] = (t[d.style] || 0) + 1; });
  return t;
}

function wrapText(g, text, x, y, maxWidth, lineHeight) {
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (g.measureText(test).width > maxWidth && line) { g.fillText(line, x, y); line = word; y += lineHeight; }
    else line = test;
  }
  g.fillText(line, x, y);
  return y + lineHeight;
}

function drawCard() {
  const W = 720, H = 960, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#0a1020"); sky.addColorStop(0.6, "#1c2b44"); sky.addColorStop(1, "#33405a");
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = "#fff";
  for (let i = 0; i < 90; i++) { g.globalAlpha = 0.3 + ((i * 37) % 60) / 100; g.fillRect((i * 173) % W, (i * 97) % 420, 2, 2); }
  g.globalAlpha = 1;
  g.fillStyle = "#f6ecc9"; g.beginPath(); g.arc(590, 130, 38, 0, 7); g.fill();

  // núi, am và hàng đèn
  g.fillStyle = "#0e1726";
  g.beginPath(); g.moveTo(0, 640); g.lineTo(360, 300); g.lineTo(720, 640); g.lineTo(720, 700); g.lineTo(0, 700); g.fill();
  g.fillStyle = "#070c15";
  g.beginPath(); g.moveTo(310, 318); g.lineTo(360, 282); g.lineTo(410, 318); g.fill();
  g.fillRect(330, 318, 60, 26);
  g.fillStyle = "#ffb347"; g.fillRect(353, 324, 14, 20);
  const colors = lanternColors();
  colors.forEach((col, i) => {
    const k = i / (colors.length - 1);
    const x = 360 + (i % 2 ? 1 : -1) * (26 + (1 - k) * 60), y = 620 - k * 250;
    if (col) {
      const halo = g.createRadialGradient(x, y, 0, x, y, 30);
      halo.addColorStop(0, col); halo.addColorStop(1, "rgba(0,0,0,0)");
      g.globalAlpha = 0.55; g.fillStyle = halo; g.beginPath(); g.arc(x, y, 30, 0, 7); g.fill(); g.globalAlpha = 1;
    }
    g.fillStyle = col || "#2a3548"; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill();
  });
  g.fillStyle = "#0a0f1a"; g.fillRect(0, 690, W, H - 690);

  const serif = '"Noto Serif", Georgia, "Times New Roman", serif';
  g.textAlign = "center";
  g.fillStyle = "#ffb347"; g.font = `600 26px ${serif}`;
  g.fillText("A M   N Ú I", W / 2, 80);
  g.fillStyle = "#ece6d6"; g.font = `40px ${serif}`;
  g.fillText(`Ngày thứ ${state.done.length}`, W / 2, 140);

  const last = state.done[state.done.length - 1];
  g.font = `italic 30px ${serif}`;
  let y = wrapText(g, `“${byId[last.id].close}”`, W / 2, 750, 620, 42);
  const t = tally();
  g.font = `24px ${serif}`; g.fillStyle = "#b9b3a4";
  g.fillText(["thang", "nhu", "kheo", "tue"].map((k) => `${STYLES[k].name} ${t[k]}`).join("  ·  "), W / 2, Math.max(y + 16, 900));
  g.font = `20px ${serif}`; g.fillStyle = "#8d8778";
  g.fillText("Mỗi ngày một công án. Không ai nghĩ hộ bạn.", W / 2, 938);
  return c.toDataURL("image/png");
}

function shareText() {
  const last = state.done[state.done.length - 1], t = tally();
  const lamps = lanternColors().map((c, i) => (c ? STYLES[state.done.filter((_, j) => j % KOANS.length === i).pop().style].dot : "⚫")).join("");
  return [
    `Am Núi · Ngày thứ ${state.done.length}`,
    lamps,
    ["thang", "nhu", "kheo", "tue"].map((k) => `${STYLES[k].name} ${t[k]}`).join(" · "),
    `Hôm nay thầy hỏi tôi: “${byId[last.id].close}”`,
    "Còn bạn sẽ đáp sao?",
  ].join("\n");
}

function shareCard() {
  setMode("panel");
  const t = tally(), changed = state.done.filter((d) => d.changed).length;
  show(`
    <p class="eyebrow">Thẻ hôm nay</p>
    <img class="card" alt="Thẻ kết quả: ngọn núi với các đèn đã thắp và câu hỏi của thầy" src="${drawCard()}">
    <div class="tally">
      ${["thang", "nhu", "kheo", "tue"].map((k) => `<span><i style="background:${STYLES[k].color}"></i>${STYLES[k].name} ${t[k]}</span>`).join("")}
      <span>Đổi đường ${changed} lần</span>
    </div>
    <p class="muted">Thẻ không chứa câu trả lời của con. Giữ ngón tay lên ảnh hoặc chụp màn hình để lưu.</p>
    <div class="row">
      <button class="link" id="copy">Sao chép lời rủ bạn</button>
      <button class="btn" id="leave">${world ? "Ra khỏi am" : "Xong"}</button>
    </div>
    <div id="copyBox"></div>`, "center");
  on("leave", world ? leaveAm : donePanel);
  on("copy", async () => {
    const text = shareText(), btn = document.getElementById("copy");
    try { await navigator.clipboard.writeText(text); btn.textContent = "Đã sao chép"; }
    catch {
      document.getElementById("copyBox").innerHTML = `<textarea class="copy" readonly>${esc(text)}</textarea>`;
      document.querySelector("textarea.copy").select();
      btn.textContent = "Chọn và sao chép đoạn dưới";
    }
  });
}

// ---------- sổ tay ----------
function journal() {
  setMode("panel");
  const entries = state.done.slice().reverse().map((d) => {
    const k = byId[d.id];
    if (!k) return "";
    const s = STYLES[d.style];
    return `<div class="entry">
      <p class="muted">${esc(d.date)} · ${k.type === "pha-vong" ? "Phá vọng" : "Công án"} · <span style="color:${s.color}">lửa ${s.name}</span></p>
      <h2>${esc(k.title)}</h2>
      <div class="mine"><b>Con đã thưa</b>${esc(d.answer)}</div>
      ${d.reply ? `<div class="mine"><b>Đáp lời thầy</b>${esc(d.reply)}</div>` : ""}
      ${d.path !== null && k.paths ? `<p class="muted">Đường đã đi: ${esc(k.paths[d.path].label)}${d.changed ? " (đổi sau khi thầy nói thêm)" : ""}</p>` : ""}
      ${d.found !== null ? `<p class="muted">Tự thấy ${d.found}/${k.flaws.length} chỗ chưa vững</p>` : ""}
    </div>`;
  }).join("");
  show(`
    <p class="eyebrow">Sổ tay</p>
    ${entries || "<p>Sổ còn trắng. Lên am để nhận công án đầu tiên.</p>"}
    <div class="row">
      ${state.done.length ? '<button class="link" id="reset">Xóa sổ, bắt đầu lại</button>' : "<span></span>"}
      <button class="btn" id="close">Đóng sổ</button>
    </div>`);
  on("close", leaveOrHome);
  const reset = document.getElementById("reset");
  if (reset) reset.onclick = () => {
    if (!reset.dataset.armed) return arm(reset, "Bấm lần nữa để xóa hết");
    state = { done: [] }; save(); rung = false; paint();
    if (world) world.t = 0;
    leaveOrHome();
  };
}
const leaveOrHome = () => (world ? walkMode() : noWorldHome());

const btnJournal = document.getElementById("btnJournal");
btnJournal.onclick = () => {
  if (document.body.dataset.mode === "listen") return;
  if (session && !btnJournal.dataset.armed) return arm(btnJournal, "Bỏ dở công án?");
  disarm(btnJournal);
  journal();
};

// ---------- nút bước ----------
function holdButton(id, value) {
  const b = document.getElementById(id);
  const set = (v) => { if (world) world.walking = v; b.classList.toggle("down", !!v); };
  b.addEventListener("pointerdown", (e) => { b.setPointerCapture(e.pointerId); set(value); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => b.addEventListener(ev, () => set(0)));
  b.addEventListener("contextmenu", (e) => e.preventDefault());
}
holdButton("walk", 1);
holdButton("back", -1);

// ---------- khởi động ----------
if (world) {
  world.onTick = tick;
  world.onBellClick = () => {
    if (document.body.dataset.mode === "walk" && Math.abs(world.t - BELL_T) < 0.1) strikeBell();
  };
  if (rung) world.maxT = 1;
}
paint();
intro();
