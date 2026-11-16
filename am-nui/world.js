// Thế giới 3D: ngọn núi, đường bậc đá, lầu chuông, hàng đèn đá, cây bồ đề và ngôi am.
// Người chơi đi theo một con đường định sẵn (t từ 0 đến 1) và kéo để nhìn quanh.
import * as THREE from "./three.module.min.js";

export const BELL_T = 0.3;
const EYE = 1.65;
const WALK_SPEED = 5.2; // đơn vị / giây
const LANTERN_COUNT = 10;

// Độ cao mặt đất. Đỉnh núi được san phẳng để đặt am.
function ground(x, z) {
  const d2 = x * x + (z + 30) * (z + 30);
  const hill = 16 * Math.exp(-d2 / 1100);
  if (hill >= 13.5) return 13.5;
  const rough = 0.35 * Math.sin(x * 0.31) * Math.cos(z * 0.27);
  return hill + rough * Math.min(1, (13.5 - hill) / 2);
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x16233a, 0.016);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 1200);

  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true, ...extra });
  const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  const glowMap = glowTexture();
  const glow = (color, size) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowMap, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
    }));
    s.scale.setScalar(size);
    return s;
  };

  // ----- trời, sao, trăng -----
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(900, 24, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, fog: false, depthWrite: false,
      vertexShader: "varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying float h; void main(){ vec3 lo = vec3(0.16,0.22,0.33); vec3 hi = vec3(0.03,0.05,0.11); gl_FragColor = vec4(mix(lo, hi, smoothstep(-0.05, 0.6, h)), 1.0); }",
    }));
  scene.add(sky);

  const starPos = [];
  for (let i = 0; i < 900; i++) {
    const a = Math.random() * Math.PI * 2, y = Math.random() * 0.95 + 0.04, r = Math.sqrt(1 - y * y);
    starPos.push(Math.cos(a) * r * 800, y * 800, Math.sin(a) * r * 800);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.85 })));

  const moon = new THREE.Mesh(new THREE.SphereGeometry(26, 24, 16), new THREE.MeshBasicMaterial({ color: 0xf6ecc9, fog: false }));
  moon.position.set(-260, 330, -560);
  scene.add(moon);
  const moonGlow = glow(0xf6ecc9, 260);
  moonGlow.material.fog = false;
  moonGlow.material.opacity = 0.5;
  moonGlow.position.copy(moon.position);
  scene.add(moonGlow);

  scene.add(new THREE.HemisphereLight(0x9fb6e6, 0x18222f, 1.7));
  const moonLight = new THREE.DirectionalLight(0xbfd0ff, 1.5);
  moonLight.position.set(-0.4, 0.8, -0.5);
  scene.add(moonLight);

  // ----- mặt đất và núi xa -----
  const terrainGeo = new THREE.PlaneGeometry(320, 320, 110, 110);
  terrainGeo.rotateX(-Math.PI / 2);
  const tp = terrainGeo.attributes.position;
  for (let i = 0; i < tp.count; i++) tp.setY(i, ground(tp.getX(i), tp.getZ(i)));
  terrainGeo.computeVertexNormals();
  scene.add(new THREE.Mesh(terrainGeo, mat(0x263d48)));

  [[-150, -190, 70, 95], [60, -230, 90, 120], [190, -120, 60, 80], [-210, -40, 55, 70], [140, 60, 45, 60], [-120, 140, 50, 70]]
    .forEach(([x, z, h, r]) => {
      const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), mat(0x121c2c));
      m.position.set(x, h / 2 - 4, z);
      m.rotation.y = x;
      scene.add(m);
    });

  // ----- đường lên núi -----
  const curve = new THREE.CatmullRomCurve3(
    [[0, 44], [3, 35], [-5, 25], [5, 14], [-4, 3], [3, -8], [0, -17], [0, -24.5]]
      .map(([x, z]) => new THREE.Vector3(x, ground(x, z), z)));
  const pathLength = curve.getLength();
  const pathPoint = (t) => {
    const p = curve.getPointAt(Math.min(1, Math.max(0, t)));
    p.y = ground(p.x, p.z);
    return p;
  };
  const sideOf = (t, dist) => {
    const p = pathPoint(t), tan = curve.getTangentAt(Math.min(1, Math.max(0, t)));
    const n = new THREE.Vector3(tan.z, 0, -tan.x).normalize();
    p.addScaledVector(n, dist);
    p.y = ground(p.x, p.z);
    return p;
  };

  const stoneMat = mat(0x56606e);
  const stepCount = Math.floor(pathLength / 0.95);
  for (let i = 0; i <= stepCount; i++) {
    const t = i / stepCount, p = pathPoint(t), tan = curve.getTangentAt(t);
    const s = box(1.7 + Math.sin(i * 7.3) * 0.2, 0.16, 0.6, stoneMat);
    s.position.set(p.x, p.y + 0.05, p.z);
    s.rotation.y = Math.atan2(tan.x, tan.z);
    scene.add(s);
  }

  // ----- cổng -----
  const woodMat = mat(0x5a2a1c), darkMat = mat(0x0e151f);
  {
    const p = pathPoint(0.06), tan = curve.getTangentAt(0.06);
    const gate = new THREE.Group();
    [-1.9, 1.9].forEach((x) => { const post = box(0.35, 4.2, 0.35, woodMat); post.position.set(x, 2.1, 0); gate.add(post); });
    const beam = box(5.2, 0.3, 0.45, woodMat); beam.position.y = 3.5; gate.add(beam);
    const roof = box(6.2, 0.22, 1.3, darkMat); roof.position.y = 4.3; gate.add(roof);
    const ridge = box(5.4, 0.25, 0.5, darkMat); ridge.position.y = 4.5; gate.add(ridge);
    gate.position.copy(p);
    gate.rotation.y = Math.atan2(tan.x, tan.z);
    scene.add(gate);
  }

  // ----- lầu chuông -----
  const bellBase = sideOf(BELL_T + 0.03, 3.4);
  const bell = new THREE.Group();
  {
    const house = new THREE.Group();
    [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]].forEach(([x, z]) => {
      const post = box(0.22, 3.2, 0.22, woodMat); post.position.set(x, 1.6, z); house.add(post);
    });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.3, 4), darkMat);
    roof.position.y = 3.85; roof.rotation.y = Math.PI / 4; house.add(roof);
    const floor = box(3, 0.2, 3, stoneMat); floor.position.y = 0.1; house.add(floor);
    house.position.copy(bellBase);
    scene.add(house);

    const bronze = new THREE.MeshStandardMaterial({ color: 0xb8862f, roughness: 0.45, metalness: 0.7, emissive: 0x2a1a05 });
    const profile = [[0.0, 1.25], [0.28, 1.2], [0.5, 1.0], [0.56, 0.5], [0.6, 0.15], [0.72, 0]].map(([r, y]) => new THREE.Vector2(r, y));
    const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 20), bronze);
    body.position.y = -1.35;
    bell.add(body);
    const knob = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 8, 12), bronze);
    knob.position.y = -0.05;
    bell.add(knob);
    bell.position.set(bellBase.x, bellBase.y + 3.15, bellBase.z);
    scene.add(bell);
    const lamp = new THREE.PointLight(0xffc27a, 2.2, 14);
    lamp.position.set(bellBase.x, bellBase.y + 2.6, bellBase.z);
    scene.add(lamp);
  }
  const bellFocus = new THREE.Vector3(bellBase.x, bellBase.y + 2.2, bellBase.z);
  const ripples = [];
  let bellSwing = 0;

  // ----- hàng đèn đá -----
  const lanterns = [];
  for (let i = 0; i < LANTERN_COUNT; i++) {
    const t = 0.12 + i * 0.085;
    const p = sideOf(t, i % 2 ? 1.7 : -1.7);
    const g = new THREE.Group();
    const base = box(0.5, 0.2, 0.5, stoneMat); base.position.y = 0.1; g.add(base);
    const pillar = box(0.2, 0.9, 0.2, stoneMat); pillar.position.y = 0.65; g.add(pillar);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x222a36 });
    const house = box(0.42, 0.4, 0.42, flameMat); house.position.y = 1.3; g.add(house);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.3, 4), stoneMat);
    cap.position.y = 1.65; cap.rotation.y = Math.PI / 4; g.add(cap);
    const halo = glow(0xffffff, 0.01); halo.position.y = 1.3; halo.visible = false; g.add(halo);
    g.position.copy(p);
    scene.add(g);
    lanterns.push({ flameMat, halo, size: 0, target: 0, pos: p.clone(), t });
  }

  // ----- cây bồ đề -----
  const tree = new THREE.Group();
  {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, 3, 6), mat(0x2b1d14));
    trunk.position.y = 1.5; tree.add(trunk);
    const leaf = mat(0x2f6b52);
    [[0, 4, 0, 1.9], [-1.3, 3.3, 0.3, 1.3], [1.2, 3.5, -0.4, 1.4], [0.2, 3.2, 1.2, 1.1], [-0.3, 4.9, -0.5, 1.1]].forEach(([x, y, z, r]) => {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), leaf);
      m.position.set(x, y, z); m.rotation.set(x, y, z); tree.add(m);
    });
    tree.position.set(-6.5, 13.5, -24);
    scene.add(tree);
  }

  // ----- ngôi am và sư thầy -----
  const AM = new THREE.Vector3(0, 13.5, -31);
  {
    const am = new THREE.Group();
    const floor = box(6.4, 0.35, 5.2, mat(0x3a2a20)); floor.position.y = 0.17; am.add(floor);
    [[-2.9, -2.3], [2.9, -2.3], [-2.9, 2.3], [2.9, 2.3]].forEach(([x, z]) => {
      const post = box(0.28, 2.7, 0.28, woodMat); post.position.set(x, 1.7, z); am.add(post);
    });
    const back = box(6, 2.7, 0.15, mat(0x4a3526)); back.position.set(0, 1.7, -2.3); am.add(back);
    [-2.9, 2.9].forEach((x) => { const w = box(0.12, 1.1, 4.6, mat(0x4a3526)); w.position.set(x, 0.9, 0); am.add(w); });
    const eaves = box(8, 0.18, 6.8, darkMat); eaves.position.y = 3.1; am.add(eaves);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 2, 4), darkMat);
    roof.position.y = 4.2; roof.rotation.y = Math.PI / 4; roof.scale.z = 0.82; am.add(roof);

    const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.14, 12), mat(0x6b1f1f));
    cushion.position.set(0, 0.42, -1.2); am.add(cushion);
    const table = box(1.1, 0.3, 0.5, woodMat); table.position.set(0, 0.5, -0.2); am.add(table);
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 6), new THREE.MeshBasicMaterial({ color: 0xf2e6c8 }));
    candle.position.set(0.35, 0.76, -0.2); am.add(candle);
    const flame = glow(0xffb347, 0.32); flame.position.set(0.35, 0.95, -0.2); am.add(flame);
    am.userData.flame = flame;

    am.position.copy(AM);
    scene.add(am);
    const inner = new THREE.PointLight(0xffb060, 7, 20);
    inner.position.set(AM.x, AM.y + 2.7, AM.z + 0.9);
    scene.add(inner);
    const halo = glow(0xffa94d, 9); halo.material.opacity = 0.35;
    halo.position.set(AM.x, AM.y + 1.6, AM.z);
    scene.add(halo);
  }
  const master = new THREE.Group();
  {
    // dáng ngồi xếp bằng: vạt áo rộng ở dưới, thu dần lên vai
    const robeMat = mat(0x7a3f1a, { flatShading: false });
    const profile = [[0.64, 0], [0.68, 0.1], [0.56, 0.26], [0.38, 0.5], [0.39, 0.78], [0.3, 0.94], [0.12, 1.02], [0, 1.02]]
      .map(([r, y]) => new THREE.Vector2(r, y));
    const robe = new THREE.Mesh(new THREE.LatheGeometry(profile, 18), robeMat);
    robe.scale.z = 0.8; master.add(robe);
    const hands = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), mat(0xb98a5e, { flatShading: false }));
    hands.position.set(0, 0.3, 0.42); hands.scale.set(1.5, 0.6, 1); master.add(hands);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), mat(0xb98a5e, { flatShading: false }));
    head.position.y = 1.2; head.scale.y = 1.12; master.add(head);
    master.position.set(AM.x, AM.y + 0.49, AM.z - 1.2);
    scene.add(master);
  }
  const seatPos = new THREE.Vector3(AM.x, AM.y + 1.3, AM.z + 2.3);
  const masterLook = new THREE.Vector3(AM.x, AM.y + 0.55, AM.z - 1.2); // nhìn thấp xuống để thầy nằm ở nửa trên màn hình, phía trên khung chữ

  // ----- đom đóm -----
  const FLY_MAX = 80;
  const flySeed = Array.from({ length: FLY_MAX }, () => {
    const t = Math.random();
    const p = sideOf(t, (Math.random() - 0.5) * 16);
    return [p.x, p.y + 0.6 + Math.random() * 2.4, p.z, Math.random() * 6.28];
  });
  const flyGeo = new THREE.BufferGeometry();
  flyGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(FLY_MAX * 3), 3));
  const flies = new THREE.Points(flyGeo, new THREE.PointsMaterial({
    map: glowMap, color: 0xd8ff8a, size: 0.35, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  flyGeo.setDrawRange(0, 0);
  scene.add(flies);

  // ----- điều khiển -----
  const world = {
    t: 0, maxT: 1, walking: 0, focus: null,
    onBellClick: null, onTick: null,
    bellFocus, lanternCount: LANTERN_COUNT,
  };
  let yaw = 0, pitch = 0, bob = 0;
  let pose = null; // { fromPos, fromQuat, toPos, toQuat, start, dur, resolve }
  let held = false;
  const lookQuat = (pos, target) => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(pos, target, camera.up));

  const keys = new Set();
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "TEXTAREA") return;
    if (["KeyW", "ArrowUp", "KeyS", "ArrowDown"].includes(e.code)) { keys.add(e.code); e.preventDefault(); }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.code));
  window.addEventListener("blur", () => keys.clear());
  let wheel = 0;
  canvas.addEventListener("wheel", (e) => { wheel = Math.sign(-e.deltaY) * 0.35; e.preventDefault(); }, { passive: false });

  let drag = null;
  const ray = new THREE.Raycaster();
  canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, moved: 0 }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
    yaw = THREE.MathUtils.clamp(yaw + dx * 0.005, -2.2, 2.2);
    pitch = THREE.MathUtils.clamp(pitch + dy * 0.004, -0.6, 0.7);
  });
  canvas.addEventListener("pointerup", (e) => {
    if (drag && drag.moved < 8) {
      const r = canvas.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      if (ray.intersectObject(bell, true).length && world.onBellClick) world.onBellClick();
    }
    drag = null;
  });
  canvas.addEventListener("pointercancel", () => { drag = null; });

  // ----- hàm cho phần trò chơi gọi -----
  world.setLanterns = (colors) => lanterns.forEach((l, i) => {
    const c = colors[i];
    l.flameMat.color.set(c ?? 0x222a36);
    l.halo.visible = c != null;
    if (c != null) { l.halo.material.color.set(c); l.size = l.target = 2.6; l.halo.scale.setScalar(2.6); }
    else { l.size = l.target = 0; }
  });
  world.igniteLantern = (i, color) => {
    const l = lanterns[i];
    if (!l) return;
    l.flameMat.color.set(color);
    l.halo.material.color.set(color);
    l.halo.visible = true;
    l.size = 9; l.target = 2.6; // loé sáng rồi dịu lại
  };
  world.setGrowth = (g) => tree.scale.setScalar(0.45 + 0.75 * g);
  world.setFireflies = (n) => flyGeo.setDrawRange(0, Math.min(FLY_MAX, n));
  world.ringBell = () => {
    bellSwing = 1;
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 48),
      new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(bellBase.x, bellBase.y + 2, bellBase.z);
    scene.add(ring);
    ripples.push({ ring, age: 0 });
  };
  world.goPose = (pos, look, dur = 1.6) => new Promise((resolve) => {
    pose = { fromPos: camera.position.clone(), fromQuat: camera.quaternion.clone(), toPos: pos.clone(), toQuat: lookQuat(pos, look), start: performance.now(), dur: dur * 1000, resolve };
    held = true;
  });
  world.sit = () => world.goPose(seatPos, masterLook, 1.8);
  // đứng phía dưới ngọn đèn, nhìn ngược lên núi: đèn ở gần, am sáng ở xa
  world.viewLantern = (i) => {
    const l = lanterns[i];
    const pos = pathPoint(l.t - 0.06);
    pos.y += 1.5;
    const look = l.pos.clone();
    look.y += 1.5;
    return world.goPose(pos, look, 2.6);
  };
  world.release = () => { held = false; pose = null; yaw = 0; pitch = 0; };

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 74 : 62; // màn hình dọc cần góc rộng hơn
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();
  const base = new THREE.Vector3(), ahead = new THREE.Vector3(), dir = new THREE.Vector3(), focusDir = new THREE.Vector3();
  let focusMix = 0;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.12), now = clock.elapsedTime;

    if (pose) {
      const k = Math.min(1, (performance.now() - pose.start) / pose.dur);
      const e = k * k * (3 - 2 * k);
      camera.position.lerpVectors(pose.fromPos, pose.toPos, e);
      camera.quaternion.slerpQuaternions(pose.fromQuat, pose.toQuat, e);
      if (k >= 1) { const done = pose.resolve; pose = null; done(); }
    } else if (!held) {
      let move = world.walking;
      if (keys.has("KeyW") || keys.has("ArrowUp")) move = 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) move = -1;
      if (Math.abs(wheel) > 0.01) { move = Math.sign(wheel) * 1.6; wheel *= 0.9; }
      if (move) {
        world.t = THREE.MathUtils.clamp(world.t + (move * WALK_SPEED * dt) / pathLength, 0, world.maxT);
        bob += dt * 9;
      }
      base.copy(pathPoint(world.t));
      ahead.copy(pathPoint(Math.min(1, world.t + 0.03)));
      if (world.t > 0.97) ahead.set(AM.x, AM.y, AM.z); // cuối đường thì nhìn vào am
      camera.position.set(base.x, base.y + EYE + Math.sin(bob) * 0.035, base.z);
      dir.subVectors(ahead, base); dir.y *= 0.5; dir.normalize();
      focusMix += ((world.focus ? 1 : 0) - focusMix) * Math.min(1, dt * 2.5);
      if (world.focus && focusMix > 0.01) {
        focusDir.subVectors(world.focus, camera.position).normalize();
        dir.lerp(focusDir, focusMix).normalize();
      }
      const baseYaw = Math.atan2(-dir.x, -dir.z), basePitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
      camera.rotation.set(basePitch + pitch, baseYaw + yaw, 0, "YXZ"); // kéo màn hình như nắm lấy cảnh vật
    }

    // chuông đung đưa, vòng âm lan ra
    if (bellSwing > 0.001) { bellSwing *= Math.exp(-dt * 0.9); bell.rotation.z = Math.sin(now * 5.5) * 0.16 * bellSwing; }
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.age += dt;
      r.ring.scale.setScalar(1 + r.age * 9);
      r.ring.material.opacity = Math.max(0, 0.7 - r.age * 0.25);
      if (r.age > 2.8) { scene.remove(r.ring); r.ring.geometry.dispose(); r.ring.material.dispose(); ripples.splice(i, 1); }
    }
    lanterns.forEach((l, i) => {
      if (!l.halo.visible) return;
      l.size += (l.target - l.size) * Math.min(1, dt * 1.6);
      l.halo.scale.setScalar(l.size * (1 + Math.sin(now * 3 + i) * 0.06));
    });
    const fp = flyGeo.attributes.position;
    for (let i = 0; i < flyGeo.drawRange.count; i++) {
      const [x, y, z, ph] = flySeed[i];
      fp.setXYZ(i, x + Math.sin(now * 0.5 + ph) * 1.2, y + Math.sin(now * 0.8 + ph * 2) * 0.5, z + Math.cos(now * 0.4 + ph) * 1.2);
    }
    fp.needsUpdate = true;
    master.scale.y = 1 + Math.sin(now * 0.9) * 0.012; // thầy thở

    if (world.onTick) world.onTick();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return world;
}
