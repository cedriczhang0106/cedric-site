/* ============ CEDRIC v3 · Cappen 式动效 ============
 * 1. Lenis 平滑滚动
 * 2. 进场:缩略图堆叠 → 散开 → 揭幕
 * 3. Hero 大字逐行翻入 + 内联视频乒乓循环
 * 4. 跑马灯 / 行列表滚动浮现 / Works 悬停跟随缩略图
 * 5. 数字计数 / 双语切换
 */

gsap.registerPlugin(ScrollTrigger);

/* ---------- 1. 平滑滚动 ---------- */
const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) { e.preventDefault(); lenis.scrollTo(target, { duration: 1.4 }); }
  });
});

/* ---------- 2. 语言切换 ---------- */
applyLang(currentLang);
document.getElementById("langToggle").addEventListener("click", () => {
  applyLang(currentLang === "zh" ? "en" : "zh");
  ScrollTrigger.refresh();
});

/* ---------- 3. 进场动画(Cappen 式放映机走片) ----------
 * ① 第一张小卡从屏幕下方升到中央
 * ② 其余图片在原位逐张向上翻过(走片,后来的盖住先前的)
 * ③ 唰地散开成一列竖排
 * ④ 整列向上飞走 + 幕布上滑,首屏大字翻入 */
const stackImgs = gsap.utils.toArray("#introStack img");
const MID = (stackImgs.length - 1) / 2;        // 竖列中点(6 张 = 2.5)
const GAP = 102;                                // 竖列间距(配合拉开时 0.55 缩放)
const intro = gsap.timeline();

/* ① 整叠从屏幕正下方边缘外冲向中央——动的是容器,图片的透明度留给走片控制 */
intro.fromTo("#introStack",
  { y: () => innerHeight / 2 + 210 },
  { y: 0, duration: 0.8, ease: "power3.out" }
);
intro.from(".intro__edge, .intro__line", {
  opacity: 0, y: 14, duration: 0.6, stagger: 0.1, ease: "power2.out"
}, "-=0.35");

/* ② 飞行途中就开始走片(绝对时间排程,起飞 0.3s 后第一切) */
intro.set(stackImgs.slice(1), { opacity: 0 }, 0);   // 起步只亮第一张
let t = 0.3;
for (let round = 0; round < 2; round++) {
  stackImgs.forEach((img, i) => {
    if (round === 0 && i === 0) return;             // 第一张已经在场
    intro.set(stackImgs, { opacity: 0 }, t)
         .set(img, { opacity: 1 }, t);
    t += 0.13;
  });
}

/* ②b 走片结束 → 墩牌(Cappen 同款):全部点亮,后面的卡片向下错位、逐层明显缩小,
 * 在主卡底下探出薄薄一条边,像一摞压实的牌 */
intro.set(stackImgs, { opacity: 1 }, t + 0.05);
intro.to(stackImgs, {
  y: i => (stackImgs.length - 1 - i) * 16,
  scale: i => 1 - (stackImgs.length - 1 - i) * 0.085,
  duration: 0.45, ease: "back.out(1.4)", stagger: 0.02
}, t + 0.08);

/* ③ 拉开:主卡(墩牌最前那张)先往上抽,其余的牌跟着在它下方依次展开
 * y 映射反转:DOM 末位(主卡)落在列顶,DOM 首位落在列底 */
intro.to(stackImgs, {
  y: i => (MID - i) * GAP,
  scale: 0.55,
  duration: 0.45, ease: "power3.inOut",
  stagger: { each: 0.025, from: "end" }            // 主卡先动,从第一张往上拉
}, "+=0.2");

/* ④ 整列向上飞走 + 幕布上滑揭幕 */
intro
  .to(stackImgs, {
    y: i => (MID - i) * GAP - 760,
    duration: 0.75, ease: "power3.in",
    stagger: { each: 0.03, from: "end" }            // 仍由列顶的主卡领飞
  }, "+=0.3")
  .to("#intro", { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "<0.2")
  .set("#intro", { display: "none" });

/* Hero 大字逐行翻入 */
intro.from(".hword", {
  yPercent: 110, rotate: 5, duration: 1.1, stagger: 0.11, ease: "power4.out"
}, "-=0.5");
/* 注意:不要再给 .hmedia 加进场变换——它由推进转场的 ScrollTrigger 接管,
 * 两个 tween 抢同一个元素的 transform 会把它锁死在不可见状态(曾导致视频空白) */
intro.from(".hero__blurb, .hero__edge, .hero__rules i", {
  opacity: 0, y: 20, duration: 0.7, stagger: 0.06, ease: "power2.out"
}, "-=0.5");

/* ---------- 3b. 内联视频乒乓循环(升空 ⇄ 落座,永不跳帧) ----------
 * 注意:不能只挂 loadedmetadata(缓存加载时事件已错过会黑屏),
 * 启动函数对 readyState 双保险;autoplay+loop 兜底。 */
const inlineVid = document.getElementById("inlineVid");
function startPingPong() {
  inlineVid.loop = false;           // 乒乓接管循环,关掉原生 loop 防止抢跳
  inlineVid.play().catch(() => {});
  let dir = 1;
  setInterval(() => {
    if (!inlineVid.duration) return;
    if (dir === 1 && inlineVid.currentTime >= inlineVid.duration - 0.1) {
      dir = -1; inlineVid.pause();
    }
    if (dir === -1) {
      const t = inlineVid.currentTime - 0.05;
      if (t <= 0.05) { dir = 1; inlineVid.currentTime = 0; inlineVid.play().catch(() => {}); }
      else inlineVid.currentTime = t;
    }
  }, 33);
}
if (inlineVid.readyState >= 1) startPingPong();
else inlineVid.addEventListener("loadedmetadata", startPingPong, { once: true });

/* ---------- 4. 跑马灯 ---------- */
gsap.utils.toArray(".marquee__track").forEach(track => {
  const slow = track.classList.contains("marquee__track--slow");
  gsap.to(track, { xPercent: -50, duration: slow ? 30 : 18, ease: "none", repeat: -1 });
});

/* ---------- 5. 「钻进视频」转场(Cappen 式) ----------
 * Hero 钉住;滚动时标题滑出,内联视频块放大铺满全屏,
 * 全黑画面无缝接进下方黑底跑马灯+宣言章节。
 */
intro.set(".hline", { overflow: "visible" });   // 进场完成后解除裁切,放大才不被切边

const hmedia = document.querySelector(".hmedia");
function baseRect(el) {
  let x = 0, y = 0, node = el;
  while (node && node !== document.body) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}
const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=130%",
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true
  }
});
/* 文字原地不动(Cappen 原版如此),只有视频放大盖过整个版面 */
heroTL
  .to(hmedia, {
    /* 用 offset 布局坐标(不含 transform),hero 在页面顶部钉住时即视口坐标 */
    x: () => { const b = baseRect(hmedia); return innerWidth / 2 - (b.x + b.w / 2); },
    y: () => { const b = baseRect(hmedia); return innerHeight / 2 - (b.y + b.h / 2); },
    scale: () => { const b = baseRect(hmedia); return Math.max(innerWidth / b.w, innerHeight / b.h) * 1.04; },
    borderRadius: 0,
    ease: "power2.inOut",
    duration: 0.72
  }, 0.1)
  .to({}, { duration: 0.18 });   // 全屏定格一拍再交棒

/* ---------- 5b. 导航分段进度条(Cappen 式) ----------
 * 整页滚动进度 × 段数,从左到右一段段填满;末段满 = 页面读完 */
const progSegs = document.querySelectorAll(".nav__seg b");
if (progSegs.length) {
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate(self) {
      const t = self.progress * progSegs.length;
      progSegs.forEach((b, i) => {
        b.style.width = (Math.max(0, Math.min(1, t - i)) * 100).toFixed(1) + "%";
      });
    }
  });
}

/* ---------- 6. 行列表滚动浮现 ---------- */
gsap.utils.toArray(".kwrow, .filerow, .workrow, .pcard").forEach(row => {
  gsap.from(row, {
    opacity: 0, y: 36, duration: 0.8, ease: "power2.out",
    clearProps: "opacity,transform",   // 结束后清掉行内样式,否则会盖住 .pcard--hot 的悬停抬起
    scrollTrigger: { trigger: row, start: "top 90%" }
  });
});
/* 宣言章节:开屏图瓷砖从四面八方飞入落位(Cappen 第二幕),
 * 落位后随滚动做轻微视差漂浮——飞入动 x/yPercent/rotation,视差动 y,互不打架 */
gsap.from(".statement__strip .sframe", {
  x: () => gsap.utils.random(-360, 360),
  yPercent: () => gsap.utils.random(160, 420),
  rotation: () => gsap.utils.random(-40, 40),
  opacity: 0,
  duration: 1.1,
  stagger: 0.07,
  ease: "power3.out",
  scrollTrigger: { trigger: ".statement", start: "top 55%" }
});
gsap.utils.toArray(".statement__strip .sframe").forEach((tile, i) => {
  gsap.to(tile, {
    y: (i % 2 ? -1 : 1) * gsap.utils.random(16, 34),   // 奇偶反向,各自速度
    ease: "none",
    scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: true }
  });
});

/* ---------- 6b. 黑→白章节熔接 ----------
 * 黑底宣言章节直接切纸白 About 太硬:
 * 让 About 的背景以墨色入场,随滚动渐变回纸白——黑色"延续"过边界再慢慢天亮 */
gsap.fromTo(".about",
  { backgroundColor: "#111110" },
  {
    backgroundColor: "#f1efec", ease: "none",
    scrollTrigger: { trigger: ".about", start: "top bottom", end: "top 10%", scrub: true }
  }
);
/* 反向熔接:白色协作章节 → 黑色联系页脚,入夜同样渐变
 * (页脚不足一屏,终点用 bottom bottom = 滚到页面尽头时正好全黑) */
gsap.fromTo(".contact",
  { backgroundColor: "#f1efec" },
  {
    backgroundColor: "#111110", ease: "none",
    scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: true }
  }
);

gsap.utils.toArray(".giant, .statement__text, .statement__sign, .done__lead, .sec-head, .contact__line, .collab__lead, .cgroup, .collab__me").forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 40, duration: 0.9, ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 88%" }
  });
});

/* ---------- 7. WORKS 悬停跟随缩略图 ---------- */
const thumb = document.getElementById("workThumb");
const worklist = document.getElementById("worklist");
if (thumb && worklist && matchMedia("(min-width: 900px)").matches) {
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener("mousemove", e => { tx = e.clientX + 24; ty = e.clientY - 140; });
  gsap.ticker.add(() => {
    cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
    thumb.style.left = cx + "px"; thumb.style.top = cy + "px";
  });
  worklist.querySelectorAll(".workrow").forEach(row => {
    row.addEventListener("mouseenter", () => {
      thumb.src = row.dataset.thumb;
      gsap.to(thumb, { opacity: 1, scale: 1, rotate: -2, duration: 0.35, ease: "power2.out" });
    });
    row.addEventListener("mouseleave", () => {
      gsap.to(thumb, { opacity: 0, scale: 0.9, rotate: 3, duration: 0.3, ease: "power2.in" });
    });
  });
}

/* ---------- 8. COLLABORATORS 卡片悬停连线(彗星流光 + 波纹抵达) ----------
 * 悬停一张卡:
 * 1. 淡墨弧线快速画向 data-links 关联卡(边缘 → 边缘)
 * 2. 橙色彗星光段沿线滑行(长度 30px,圆头似拖尾)
 * 3. 到站瞬间,在对方卡片边缘荡开一圈橙色涟漪,然后下一轮
 * 减动效偏好:只画静态底线。
 */
(function collabLinks() {
  const svg = document.getElementById("collabLines");
  const grid = document.getElementById("collabGrid");
  if (!svg || !grid || !matchMedia("(min-width: 900px)").matches) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cards = gsap.utils.toArray(".pcard");
  const byId = {};
  cards.forEach(c => { byId[c.dataset.id] = c; });
  const NS = "http://www.w3.org/2000/svg";
  const COMET = 30;             // 彗星光段长度(px)
  let active = [];

  function center(el) {
    const r = el.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    return { x: r.left + r.width / 2 - g.left, y: r.top + r.height / 2 - g.top };
  }
  /* 卡片边缘锚点:沿"本卡中心 → 对方中心"方向与卡片边框(外扩 6px)的交点 */
  function edgePoint(el, toward) {
    const r = el.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    const cx = r.left + r.width / 2 - g.left, cy = r.top + r.height / 2 - g.top;
    const dx = toward.x - cx, dy = toward.y - cy;
    const hw = r.width / 2 + 6, hh = r.height / 2 + 6;
    const t = Math.min(hw / Math.max(Math.abs(dx), 1e-6), hh / Math.max(Math.abs(dy), 1e-6));
    return { x: cx + dx * t, y: cy + dy * t };
  }

  /* 彗星 + 涟漪循环 */
  gsap.ticker.add(() => {
    if (!active.length || reduced) return;
    const dt = gsap.ticker.deltaRatio(60) / 60;
    active.forEach(L => {
      if (!L.ready) return;
      L.t += dt;
      const c = (L.t % L.cyc) / L.cyc;
      const ft = L.travel / L.cyc;
      if (c < ft) {               // 彗星滑行阶段
        const q = c / ft;
        L.comet.style.strokeDashoffset = (L.len + COMET - q * (L.len + COMET * 2)).toFixed(1);
        L.comet.setAttribute("opacity", "0.95");
        L.ring.setAttribute("opacity", "0");
      } else {                    // 抵达 → 涟漪荡开
        const w = (c - ft) / (1 - ft);
        L.comet.setAttribute("opacity", "0");
        L.ring.setAttribute("r", (4 + w * 16).toFixed(1));
        L.ring.setAttribute("opacity", (0.8 * (1 - w)).toFixed(2));
      }
    });
  });

  function clear() {
    active = [];
    svg.innerHTML = "";
    cards.forEach(c => c.classList.remove("pcard--hot", "pcard--linked"));
  }

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      clear();
      card.classList.add("pcard--hot");
      const ac = center(card);
      (card.dataset.links || "").split(",").filter(Boolean).forEach((id, i) => {
        const target = byId[id.trim()];
        if (!target) return;
        target.classList.add("pcard--linked");
        const tc = center(target);
        const a = edgePoint(card, tc), b = edgePoint(target, ac);
        const dx = b.x - a.x, dy = b.y - a.y;
        const len0 = Math.hypot(dx, dy) || 1;
        const sag = Math.min(len0 * 0.08, 18) * (i % 2 ? -1 : 1);
        const cpx = (a.x + b.x) / 2 - dy / len0 * sag;
        const cpy = (a.y + b.y) / 2 + dx / len0 * sag;
        const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cpx.toFixed(1)} ${cpy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;

        const base = document.createElementNS(NS, "path");
        base.setAttribute("class", "lbase");
        base.setAttribute("d", d);
        const comet = document.createElementNS(NS, "path");
        comet.setAttribute("class", "lcomet");
        comet.setAttribute("d", d);
        comet.setAttribute("opacity", "0");
        const ring = document.createElementNS(NS, "circle");
        ring.setAttribute("class", "lring");
        ring.setAttribute("cx", b.x.toFixed(1));
        ring.setAttribute("cy", b.y.toFixed(1));
        ring.setAttribute("r", "0");
        ring.setAttribute("opacity", "0");
        svg.appendChild(base);
        svg.appendChild(comet);
        svg.appendChild(ring);

        const len = base.getTotalLength();
        comet.style.strokeDasharray = `${COMET} ${len + COMET * 2}`;
        comet.style.strokeDashoffset = len + COMET;
        const travel = Math.min(1.6, Math.max(0.7, len / 260));
        const L = { comet, ring, len, travel, cyc: travel + 0.5, t: 0, ready: reduced ? false : false };

        if (reduced) {
          active.push(L);          // 仅静态底线
          return;
        }
        base.style.strokeDasharray = len;
        base.style.strokeDashoffset = len;
        gsap.to(base, {
          strokeDashoffset: 0, duration: 0.4, delay: i * 0.06, ease: "power2.out",
          onComplete() { L.ready = true; }
        });
        active.push(L);
      });
    });
    card.addEventListener("mouseleave", clear);
  });
})();

/* ---------- 9. 水墨鼠标轨迹 ----------
 * 原理:canvas 上沿鼠标轨迹盖"墨章"——不规则毛边墨团,
 * 落纸后先晕开(半径渐大)再淡去,multiply 混合让墨只染浅色纸面。
 */
(function inkTrail() {
  if (matchMedia("(max-width: 900px)").matches) return;            // 移动端无鼠标,跳过
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("inkCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }
  resize();
  window.addEventListener("resize", resize);

  /* Cappen 式水波反色(液态金属球 metaball 技法):
   * - 低分辨率离屏画布上画普通白圆(黑底)
   * - 主画布用 blur+contrast 滤镜合成 → 圆与圆平滑融合,边缘如水银
   * - canvas 整体 difference 混合:白=反色,黑=不变
   * - 视频区直接覆盖纯黑(差值混合下黑色=中和),天然无缝、永不反色
   * 单个水波生命:涨开(ease-out)→ 短暂停留 → 收缩吸回(ease-in)
   */
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d");
  const OFF_SCALE = 0.4;                      // 离屏低清,模糊后看不出,省性能
  function resizeOff() { off.width = W * OFF_SCALE; off.height = H * OFF_SCALE; }
  resizeOff();
  window.addEventListener("resize", resizeOff);

  /* —— 彗星缎带模型(逐帧分析 Cappen 全段录屏的最终结论)——
   * 头部:光标处一团最大的液体,平滑跟随(轻微滞后 = 丝滑感)
   * 尾部:轨迹点按"年龄"单调变细,整条收成尖 → 锥形缎带,像甩动的丝巾
   * 消散:尾端优雅地变细蒸发(<1秒),末梢偶有一两缕飘丝,无孔洞无锯齿
   * 轻盈感 = 锥形渐细 + 平滑曲线 + 快速蒸发,三者缺一不可
   */
  const pts = [];
  const LIFE = 0.018;                   // 每帧老化量 → 全程约 0.9 秒
  let mx = -9999, my = -9999, px = -9999, py = -9999, seedAcc = 0;
  let headSize = 92;                    // 头部尺寸:刚落上大,拖动中变小,停下回涨
  const hash = s => { const v = Math.sin(s) * 43758.5453; return v - Math.floor(v); };

  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    if (px < -999) { px = mx; py = my; }
  });

  gsap.ticker.add(() => {
    const st = heroTL.scrollTrigger;
    const active = st && st.isActive && heroTL.progress() <= 0.06;
    const vr = hmedia.getBoundingClientRect();
    const overVideo = mx > vr.left - 8 && mx < vr.right + 8 && my > vr.top - 8 && my < vr.bottom + 8;
    const emit = active && !overVideo && mx > -999;
    const rush = active ? 1 : 3;

    /* 头部平滑跟随:足够跟手又带一点液体滞后 */
    const speed = Math.hypot(mx - px, my - py);
    px += (mx - px) * 0.3;
    py += (my - py) * 0.3;

    /* 头部尺寸:静止(刚放上去)时涨向 56,拖动时随速度缩到最小 30;
     * 收缩快、回涨慢 → "落墨一大团,拖走变细流,停笔又聚拢" */
    const headTarget = Math.max(52, 92 - speed * 0.7);
    headSize += (headTarget - headSize) * (headTarget < headSize ? 0.18 : 0.04);

    /* 每帧落一个轨迹点(静止时点叠在原地 = 一团呼吸的墨;移动时拉出缎带) */
    if (emit) {
      seedAcc += 1.37;
      pts.push({
        x: px, y: py,
        w: headSize * 0.78 + Math.min(speed, 60) * 0.14,  // 尾宽跟随头部尺寸
        age: 0, seed: seedAcc,
        /* 消散漂移:每个点带一个微小的随机风向,后半生顺着它飘散 */
        dx: (Math.random() - 0.5) * 0.9,
        dy: -0.2 - Math.random() * 0.7
      });
      if (pts.length > 110) pts.splice(0, pts.length - 110);
    }

    if (!pts.length) { ctx.clearRect(0, 0, W, H); return; }

    /* 老化 + 计算锥形半径:r = w · (1-age)^1.7,单调收尖 */
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      p.age += LIFE * rush;
      if (p.age >= 1) { pts.splice(i, 1); continue; }
      /* 消散漂移:后半生像烟一样轻轻飘开(随年龄加速) */
      if (p.age > 0.45) {
        const drift = (p.age - 0.45) * 2.2;
        p.x += p.dx * drift;
        p.y += p.dy * drift;
      }
      let r = p.w * Math.pow(1 - p.age, 1.7);
      /* 末梢飘丝:很细的时候偶尔断开一两点,轻轻的 */
      if (r < 12 && hash(p.seed * 3.1) < 0.3) r = 0;
      p.r = r < 1 ? 0 : r;
    }

    const k = dpr * OFF_SCALE;
    offCtx.fillStyle = "#000";
    offCtx.fillRect(0, 0, off.width, off.height);
    offCtx.strokeStyle = "#fff";
    offCtx.fillStyle = "#fff";
    offCtx.lineCap = "round";
    offCtx.lineJoin = "round";

    /* 缎带:相邻点连粗线段(圆头),宽度随年龄渐细 → 平滑锥形 */
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      if (!a.r || !b.r) continue;
      if (Math.hypot(b.x - a.x, b.y - a.y) > 90) continue;  // 笔画间不连
      offCtx.lineWidth = (a.r + b.r) * k;
      offCtx.beginPath();
      offCtx.moveTo(a.x * k, a.y * k);
      offCtx.lineTo(b.x * k, b.y * k);
      offCtx.stroke();
    }
    /* 头部主团(尺寸随静止/拖动变化,带轻微呼吸) */
    if (emit) {
      const t = performance.now() / 1000;
      offCtx.beginPath();
      offCtx.arc(px * k, py * k, (headSize + 3 * Math.sin(t * 2.2)) * k, 0, Math.PI * 2);
      offCtx.fill();
    }

    /* 主画布:大模糊+高对比 → 丝绸般顺滑的液态边缘 */
    ctx.clearRect(0, 0, W, H);
    ctx.filter = `blur(${11 * dpr}px) contrast(28)`;
    ctx.drawImage(off, 0, 0, W, H);
    ctx.filter = "none";

    /* 视频区覆盖纯黑 = 差值混合下"不反色",接缝全黑无缝(vr 已在上方取得) */
    ctx.fillStyle = "#000";
    ctx.fillRect(vr.left * dpr, vr.top * dpr, vr.width * dpr, vr.height * dpr);
  });
})();

/* ---------- 收尾 ---------- */
ScrollTrigger.sort();
window.addEventListener("load", () => ScrollTrigger.refresh());
