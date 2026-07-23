var ee = Object.defineProperty;
var ne = (e, n, a) => n in e ? ee(e, n, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[n] = a;
var v = (e, n, a) => ne(e, typeof n != "symbol" ? n + "" : n, a);
class z extends Error {
  constructor(a) {
    super(a.message_ai);
    v(this, "ov");
    this.name = "OVError", this.ov = a;
  }
  /** copyable 单行(AI 自纠 / 人肉回传通道)*/
  toLine() {
    return "ov-error:" + JSON.stringify(this.ov);
  }
}
function ae(e) {
  return e instanceof z;
}
function $(e, n) {
  return new z({
    code: "unknown-id",
    message_ai: `未知组件 id「${e}」。可用:${n.join(", ") || "(registry 为空)"}。`,
    candidates: n
  });
}
function ie(e, n, a, i, o = "data") {
  return new z({ code: "profile-violation", message_ai: i, plane: o, path: e, expected: n, got: a });
}
function oe(e, n) {
  return new z({ code: "size-exceeded", message_ai: e, details: n });
}
function V(e = "实例已销毁(use-after-destroy)") {
  return new z({ code: "disposed", message_ai: e });
}
const U = /* @__PURE__ */ new Map();
function re(e) {
  U.set(e.id, e);
}
function De() {
  return [...U.keys()];
}
function W(e) {
  const n = U.get(e);
  if (!n) throw $(e, [...U.keys()]);
  return n;
}
function te(e) {
  return U.has(e) ? null : $(e, [...U.keys()]);
}
const le = { data: 2e6, spec: 262144, state: 262144 };
function D(e, n = "data") {
  let a;
  try {
    a = structuredClone(e);
  } catch (r) {
    throw ie("", "JSON-clonable", r.message, "含函数/symbol 等不可克隆值(禁可执行值进运行时)", n);
  }
  const i = le[n] ?? 2e6, o = me(a);
  if (o > i)
    throw oe(`${n} 平面 ${(o / 1024).toFixed(0)}KB 超 ${(i / 1024).toFixed(0)}KB`, { plane: n, bytes: o, cap: i });
  return a;
}
function me(e) {
  try {
    return new TextEncoder().encode(JSON.stringify(e) ?? "").length;
  } catch {
    return 0;
  }
}
function E(e) {
  if (e === null || typeof e != "object" || Object.isFrozen(e)) return e;
  Object.freeze(e);
  for (const n of Object.keys(e)) E(e[n]);
  return e;
}
const se = /* @__PURE__ */ new Set(["viewport"]), L = (e) => typeof e == "object" && e !== null && !Array.isArray(e);
function pe(e) {
  return L(e) ? ["single", "multi", "region", "probe"].includes(e.kind) ? Array.isArray(e.refs) ? e.kind === "single" && e.refs.length > 1 ? "single 至多一个 ref" : null : "select.refs 须为数组" : `select.kind 非法(${String(e.kind)})` : "select payload 须为对象";
}
function de(e) {
  if (!L(e)) return "update payload 须为对象";
  if (e.kind !== "viewport") return `update.kind「${String(e.kind)}」未 ratify(增量 2a 只 update/viewport)`;
  const n = e.ref;
  if (!n || n.id !== "$view") return 'viewport 的 ref.id 须为 "$view"';
  const a = e.current;
  return !a || typeof a.x != "number" || typeof a.y != "number" || typeof a.zoom != "number" ? "viewport.current 须为 {x,y,zoom} 数值" : null;
}
function fe(e, n) {
  return e === "select" ? pe(n) : e === "update" ? de(n) : `动词「${e}」未 ratify(增量 2a 只 select + update/viewport;谁 emit 谁 ratify)`;
}
function ce(e) {
  let n = !1, a = null, i = 0, o = 0;
  function r(t) {
    if (t === "begin")
      return a = `${e.instance_id}:g${++i}`, a;
    if (t === "change")
      return a || (a = `${e.instance_id}:g${++i}`), a;
    const l = a ?? `${e.instance_id}:g${++i}`;
    return a = null, l;
  }
  return { emit: (t, l, A = {}) => {
    if (n) return;
    const m = A.origin ?? "user", d = A.phase ?? "end", c = fe(t, l);
    if (c) {
      console.warn(`[ov:${e.component}] emit 拒发:${c}`);
      return;
    }
    const h = L(l) ? l.kind : void 0, u = { undoable: !1, linkable: m === "user" && (t === "select" || t === "update" && !!h && se.has(h)), uplinkable: !1 }, S = {
      component: e.component,
      type: t,
      payload: l,
      meta: {
        schema_version: "1",
        event_id: `${e.instance_id}:e${++o}`,
        instance_id: e.instance_id,
        interaction_id: r(d),
        origin: m,
        phase: d,
        revision: e.getRevision(),
        flags: u
      }
    };
    if (E(S), e.onEvent)
      try {
        e.onEvent(S);
      } catch (y) {
        console.warn(`[ov:${e.component}] onEvent 抛错(隔离):${String(y)}`);
      }
    try {
      e.domHost.dispatchEvent(new CustomEvent("ov-event", { detail: S, bubbles: !0, composed: !0 }));
    } catch {
    }
  }, dispose() {
    n = !0, a = null;
  } };
}
let ue = 0;
const Ae = ":host{display:block;width:100%;position:relative}";
function ke(e) {
  if (!(typeof customElements > "u" || customElements.get(e)))
    try {
      customElements.define(e, class extends HTMLElement {
      });
    } catch {
    }
}
function J(e, n) {
  try {
    const a = new CSSStyleSheet();
    a.replaceSync(n), e.adoptedStyleSheets = [...e.adoptedStyleSheets, a];
  } catch {
    const a = document.createElement("style");
    a.textContent = n, e.appendChild(a);
  }
}
function _(e, n) {
  return ae(e) ? e : new z({ code: n, message_ai: e instanceof Error ? e.message : String(e) });
}
function Me(e, n, a, i = {}) {
  const o = (s) => {
    typeof console < "u" && console.warn(`[ov:${n}] ${s}`);
  }, r = (s, p) => {
    if (typeof console < "u" && (console.error(`[ov:${n}] mount 失败 [${s.ov.code}] ${s.ov.message_ai}`, p), console.error(s.toLine())), i.onError)
      try {
        i.onError(s, p);
      } catch (P) {
        o(`onError 抛错(隔离):${String(P)}`);
      }
  };
  let f, t;
  try {
    const s = te(n);
    if (s) throw s;
    const p = W(n);
    f = D(a, "data");
    const P = p.validateData(f);
    if (P) throw P;
    if (i.spec !== void 0 && (t = D(i.spec, "spec"), p.validateSpec)) {
      const C = p.validateSpec(t);
      if (C) throw C;
    }
    E(f), t !== void 0 && E(t);
  } catch (s) {
    const p = _(s, "init-failed");
    throw r(p, s), p;
  }
  const l = W(n), A = `ov-${n}`;
  ke(A);
  const m = document.createElement(A), d = m.attachShadow({ mode: "open" });
  J(d, Ae), e.appendChild(m);
  const c = `ov-i${++ue}`;
  let h = "initializing", F = 0, u = null, S = !1, y = !1;
  const I = new AbortController();
  let G, T;
  const R = new Promise((s, p) => {
    G = s, T = p;
  });
  R.catch(() => {
  });
  let H;
  const w = new Promise((s) => {
    H = s;
  }), { emit: Z, dispose: q } = ce({
    component: n,
    instance_id: c,
    getRevision: () => F,
    onEvent: i.onEvent,
    domHost: m
  }), Q = {
    root: d,
    data: f,
    spec: t,
    emit: Z,
    adoptStyles: (s) => J(d, s),
    signal: I.signal
  };
  (async () => {
    try {
      const s = await l.create(Q);
      if (S) {
        try {
          await s.destroy();
        } catch {
        }
        return;
      }
      u = s, h = "ready", y = !0, G();
    } catch (s) {
      const p = _(s, "init-failed");
      r(p, s), y || (y = !0, h = "error", T(p));
    }
  })();
  function Y() {
    return S || (S = !0, h = "destroyed", I.abort(), q(), y || (y = !0, T(V("destroyed during init"))), Promise.resolve().then(() => u == null ? void 0 : u.destroy()).catch((s) => o(`adapter.destroy 抛错:${String(s)}`)).finally(() => {
      try {
        m.remove();
      } catch {
      }
      H();
    })), w;
  }
  return {
    el: m,
    ready: R,
    disposed: w,
    get status() {
      return h;
    },
    async update(s, p) {
      var K;
      if (S) throw V("update after destroy");
      const P = D(s, "data"), C = l.validateData(P);
      if (C) throw C;
      let B;
      if (p !== void 0 && (B = D(p, "spec"), l.validateSpec)) {
        const O = l.validateSpec(B);
        if (O) throw O;
      }
      E(P), B !== void 0 && E(B), await R, F++, await ((K = u.update) == null ? void 0 : K.call(u, P, B));
    },
    getState() {
      var s;
      if (S) return { status: "destroyed" };
      if (h !== "ready" || !u) return { status: h };
      try {
        const p = (s = u.getState) == null ? void 0 : s.call(u);
        return p === void 0 ? null : E(structuredClone(p));
      } catch {
        return { status: "ready" };
      }
    },
    destroy() {
      return Y();
    }
  };
}
const ze = /* @__PURE__ */ JSON.parse(`[{"name":"007 - Everything or Nothing","file":"007 - Everything or Nothing (USA, Europe) (En,Fr,De).zip"},{"name":"007 - NightFire","file":"007 - NightFire (USA, Europe) (En,Fr,De).zip"},{"name":"2006 FIFA World Cup - Germany 2006","file":"2006 FIFA World Cup - Germany 2006 (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"2K Sports - Major League Baseball 2K7","file":"2K Sports - Major League Baseball 2K7 (USA).zip"},{"name":"ATV - Quad Power Racing","file":"ATV - Quad Power Racing (USA, Europe).zip"},{"name":"ATV - Thunder Ridge Riders","file":"ATV - Thunder Ridge Riders (USA).zip"},{"name":"Ace Combat Advance","file":"Ace Combat Advance (USA, Europe).zip"},{"name":"Activision Anthology","file":"Activision Anthology (USA).zip"},{"name":"Advance Guardian Heroes","file":"Advance Guardian Heroes (USA).zip"},{"name":"Advance Wars","file":"Advance Wars (USA) (Rev 1).zip"},{"name":"Advance Wars 2 - Black Hole Rising","file":"Advance Wars 2 - Black Hole Rising (USA).zip"},{"name":"Adventures of Jimmy Neutron Boy Genius vs. Jimmy Negatron, The","file":"Adventures of Jimmy Neutron Boy Genius vs. Jimmy Negatron, The (USA, Europe).zip"},{"name":"Adventures of Jimmy Neutron Boy Genius, The - Attack of the Twonkies","file":"Adventures of Jimmy Neutron Boy Genius, The - Attack of the Twonkies (USA, Europe).zip"},{"name":"Adventures of Jimmy Neutron Boy Genius, The - Jet Fusion","file":"Adventures of Jimmy Neutron Boy Genius, The - Jet Fusion (USA, Europe).zip"},{"name":"Aero the Acro-Bat - Rascal Rival Revenge","file":"Aero the Acro-Bat - Rascal Rival Revenge (USA).zip"},{"name":"Agassi Tennis Generation","file":"Agassi Tennis Generation (USA).zip"},{"name":"Aggressive Inline","file":"Aggressive Inline (USA).zip"},{"name":"AirForce Delta Storm","file":"AirForce Delta Storm (USA) (En,Ja,Fr,De).zip"},{"name":"Aladdin","file":"Aladdin (USA) (En,Fr,De,Es).zip"},{"name":"Alex Rider - Stormbreaker","file":"Alex Rider - Stormbreaker (USA).zip"},{"name":"Alien Hominid","file":"Alien Hominid (Europe) (En,Fr,De,Es,It).zip"},{"name":"Alienators - Evolution Continues","file":"Alienators - Evolution Continues (USA, Europe).zip"},{"name":"All Grown Up! - Express Yourself","file":"All Grown Up! - Express Yourself (USA, Europe).zip"},{"name":"All-Star Baseball 2003","file":"All-Star Baseball 2003 (USA).zip"},{"name":"All-Star Baseball 2004 Featuring Derek Jeter","file":"All-Star Baseball 2004 Featuring Derek Jeter (USA).zip"},{"name":"Altered Beast - Guardian of the Realms","file":"Altered Beast - Guardian of the Realms (USA).zip"},{"name":"Amazing Virtual Sea-Monkeys, The","file":"Amazing Virtual Sea-Monkeys, The (USA).zip"},{"name":"American Bass Challenge","file":"American Bass Challenge (USA).zip"},{"name":"American Dragon - Jake Long - Rise of the Huntsclan","file":"American Dragon - Jake Long - Rise of the Huntsclan (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"American Idol","file":"American Idol (USA).zip"},{"name":"American Tail, An - Fievel's Gold Rush","file":"American Tail, An - Fievel's Gold Rush (USA) (En,Es).zip"},{"name":"Animal Snap - Rescue Them 2 by 2","file":"Animal Snap - Rescue Them 2 by 2 (USA).zip"},{"name":"Ant Bully, The","file":"Ant Bully, The (USA) (En,Fr).zip"},{"name":"Antz - Extreme Racing","file":"Antz - Extreme Racing (USA).zip"},{"name":"Archer Maclean's 3D Pool","file":"Archer Maclean's 3D Pool (USA).zip"},{"name":"Arctic Tale","file":"Arctic Tale (USA).zip"},{"name":"Army Men - Operation Green","file":"Army Men - Operation Green (USA) (En,Fr,De,Es,It).zip"},{"name":"Army Men - Turf Wars","file":"Army Men - Turf Wars (USA).zip"},{"name":"Army Men Advance","file":"Army Men Advance (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Around the World in 80 Days","file":"Around the World in 80 Days (USA).zip"},{"name":"Arthur and the Invisibles","file":"Arthur and the Invisibles (USA) (En,Fr,Es).zip"},{"name":"Asterix & Obelix XXL","file":"Asterix & Obelix XXL (Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Astro Boy - Omega Factor","file":"Astro Boy - Omega Factor (USA) (En,Ja,Fr,De,Es,It).zip"},{"name":"Atari Anniversary Advance","file":"Atari Anniversary Advance (USA).zip"},{"name":"Atlantis - The Lost Empire","file":"Atlantis - The Lost Empire (USA, Europe).zip"},{"name":"Atomic Betty","file":"Atomic Betty (USA, Europe).zip"},{"name":"Avatar - The Last Airbender","file":"Avatar - The Last Airbender (USA).zip"},{"name":"Avatar - The Last Airbender - The Burning Earth","file":"Avatar - The Last Airbender - The Burning Earth (USA).zip"},{"name":"BMX Trick Racer","file":"BMX Trick Racer (USA).zip"},{"name":"Babar to the Rescue","file":"Babar to the Rescue (USA) (En,Fr,Es).zip"},{"name":"Back Track","file":"Back Track (USA, Europe).zip"},{"name":"Back to Stone","file":"Back to Stone (USA) (En,Fr).zip"},{"name":"Backyard Baseball","file":"Backyard Baseball (USA).zip"},{"name":"Backyard Baseball 2006","file":"Backyard Baseball 2006 (USA).zip"},{"name":"Backyard Basketball","file":"Backyard Basketball (USA).zip"},{"name":"Backyard Football","file":"Backyard Football (USA).zip"},{"name":"Backyard Football 2006","file":"Backyard Football 2006 (USA).zip"},{"name":"Backyard Hockey","file":"Backyard Hockey (USA).zip"},{"name":"Backyard Skateboarding","file":"Backyard Skateboarding (USA).zip"},{"name":"Backyard Sports - Baseball 2007","file":"Backyard Sports - Baseball 2007 (USA).zip"},{"name":"Backyard Sports - Basketball 2007","file":"Backyard Sports - Basketball 2007 (USA).zip"},{"name":"Backyard Sports - Football 2007","file":"Backyard Sports - Football 2007 (USA).zip"},{"name":"Bag Monster Ultimate Collector's Edition","file":"Bag Monster Ultimate Collector's Edition.zip"},{"name":"Baldur's Gate - Dark Alliance","file":"Baldur's Gate - Dark Alliance (USA).zip"},{"name":"Ballistic - Ecks vs. Sever","file":"Ballistic - Ecks vs. Sever (USA).zip"},{"name":"Banjo-Kazooie - Grunty's Revenge","file":"Banjo-Kazooie - Grunty's Revenge (USA, Europe).zip"},{"name":"Banjo-Pilot","file":"Banjo-Pilot (USA).zip"},{"name":"Barbie - The Princess and the Pauper","file":"Barbie - The Princess and the Pauper (USA).zip"},{"name":"Barbie Diaries, The - High School Mystery","file":"Barbie Diaries, The - High School Mystery (USA).zip"},{"name":"Barbie Horse Adventures - Blue Ribbon Race","file":"Barbie Horse Adventures - Blue Ribbon Race (USA).zip"},{"name":"Barbie Software - Groovy Games","file":"Barbie Software - Groovy Games (USA).zip"},{"name":"Barbie and the Magic of Pegasus","file":"Barbie and the Magic of Pegasus (USA).zip"},{"name":"Barbie as The Island Princess","file":"Barbie as The Island Princess (USA).zip"},{"name":"Barbie in the 12 Dancing Princesses","file":"Barbie in the 12 Dancing Princesses (USA).zip"},{"name":"Barnyard","file":"Barnyard (USA).zip"},{"name":"Baseball Advance","file":"Baseball Advance (USA).zip"},{"name":"Batman - Rise of Sin Tzu","file":"Batman - Rise of Sin Tzu (USA) (En,Fr,Es).zip"},{"name":"Batman - Vengeance","file":"Batman - Vengeance (USA) (En,Fr,Es).zip"},{"name":"Batman Begins","file":"Batman Begins (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Battle B-Daman","file":"Battle B-Daman (USA).zip"},{"name":"Battle B-Daman - Fire Spirits!","file":"Battle B-Daman - Fire Spirits! (USA).zip"},{"name":"BattleBots - Beyond the BattleBox","file":"BattleBots - Beyond the BattleBox (USA).zip"},{"name":"BattleBots - Design & Destroy","file":"BattleBots - Design & Destroy (USA).zip"},{"name":"Bee Game, The","file":"Bee Game, The (USA).zip"},{"name":"Berenstain Bears and the Spooky Old Tree, The","file":"Berenstain Bears and the Spooky Old Tree, The (USA).zip"},{"name":"Beyblade G-Revolution","file":"Beyblade G-Revolution (USA).zip"},{"name":"Beyblade V-Force - Ultimate Blader Jam","file":"Beyblade V-Force - Ultimate Blader Jam (USA).zip"},{"name":"Bible Game, The","file":"Bible Game, The (USA).zip"},{"name":"Big Mutha Truckers","file":"Big Mutha Truckers (USA).zip"},{"name":"Bionicle","file":"Bionicle (USA).zip"},{"name":"Bionicle - Matoran Adventures","file":"Bionicle - Matoran Adventures (USA, Europe) (En,Fr,De,Es,It,Nl,Sv,Da).zip"},{"name":"Bionicle - Maze of Shadows","file":"Bionicle - Maze of Shadows (USA).zip"},{"name":"Bionicle Heroes","file":"Bionicle Heroes (USA) (En,Fr,De,Es,It,Da).zip"},{"name":"Blackthorne","file":"Blackthorne (USA).zip"},{"name":"Blades of Thunder","file":"Blades of Thunder (USA).zip"},{"name":"Blender Bros.","file":"Blender Bros. (USA).zip"},{"name":"Board Game Classics","file":"Board Game Classics (USA).zip"},{"name":"Boktai - The Sun Is in Your Hand","file":"Boktai - The Sun Is in Your Hand (USA).zip"},{"name":"Boktai 2 - Solar Boy Django","file":"Boktai 2 - Solar Boy Django (USA).zip"},{"name":"Bomberman Max 2 - Blue Advance","file":"Bomberman Max 2 - Blue Advance (USA).zip"},{"name":"Bomberman Max 2 - Red Advance","file":"Bomberman Max 2 - Red Advance (USA).zip"},{"name":"Bomberman Tournament","file":"Bomberman Tournament (USA, Europe).zip"},{"name":"Bookworm","file":"Bookworm (USA).zip"},{"name":"Boulder Dash EX","file":"Boulder Dash EX (USA).zip"},{"name":"Boxing Fever","file":"Boxing Fever (USA, Europe).zip"},{"name":"Bratz","file":"Bratz (USA) (En,Fr,Es).zip"},{"name":"Bratz - Babyz","file":"Bratz - Babyz (USA).zip"},{"name":"Bratz - Forever Diamondz","file":"Bratz - Forever Diamondz (USA).zip"},{"name":"Bratz - Rock Angelz","file":"Bratz - Rock Angelz (USA, Europe).zip"},{"name":"Bratz - The Movie","file":"Bratz - The Movie (USA).zip"},{"name":"Breath of Fire","file":"Breath of Fire (USA).zip"},{"name":"Breath of Fire II","file":"Breath of Fire II (USA).zip"},{"name":"Britney's Dance Beat","file":"Britney's Dance Beat (USA).zip"},{"name":"Broken Sword - The Shadow of the Templars","file":"Broken Sword - The Shadow of the Templars (USA) (En,Fr,De,Es,It).zip"},{"name":"Brother Bear","file":"Brother Bear (USA).zip"},{"name":"Bruce Lee - Return of the Legend","file":"Bruce Lee - Return of the Legend (USA).zip"},{"name":"Bubble Bobble - Old & New","file":"Bubble Bobble - Old & New (USA).zip"},{"name":"Buffy the Vampire Slayer - Wrath of the Darkhul King","file":"Buffy the Vampire Slayer - Wrath of the Darkhul King (USA, Europe).zip"},{"name":"Butt-Ugly Martians - B.K.M. Battles","file":"Butt-Ugly Martians - B.K.M. Battles (USA).zip"},{"name":"CIMA - The Enemy","file":"CIMA - The Enemy (USA).zip"},{"name":"CT Special Forces","file":"CT Special Forces (USA) (En,Fr,De,Es,It,Nl).zip"},{"name":"CT Special Forces 2 - Back in the Trenches","file":"CT Special Forces 2 - Back in the Trenches (USA) (En,Fr,De,Es,It,Nl).zip"},{"name":"Cabbage Patch Kids - The Patch Puppy Rescue","file":"Cabbage Patch Kids - The Patch Puppy Rescue (USA).zip"},{"name":"Cabela's Big Game Hunter","file":"Cabela's Big Game Hunter (USA).zip"},{"name":"Cabela's Big Game Hunter - 2005 Adventures","file":"Cabela's Big Game Hunter - 2005 Adventures (USA, Europe).zip"},{"name":"Caesars Palace Advance - Millennium Gold Edition","file":"Caesars Palace Advance - Millennium Gold Edition (USA, Europe).zip"},{"name":"Camp Lazlo - Leaky Lake Games","file":"Camp Lazlo - Leaky Lake Games (USA).zip"},{"name":"Capcom Classics Mini Mix","file":"Capcom Classics Mini Mix (USA).zip"},{"name":"Car Battler Joe","file":"Car Battler Joe (USA).zip"},{"name":"Care Bears - The Care Quest","file":"Care Bears - The Care Quest (USA) (En,Fr,Es).zip"},{"name":"Cars","file":"Cars (USA, Europe).zip"},{"name":"Cars - Mater-National Championship","file":"Cars - Mater-National Championship (USA) (En,Fr).zip"},{"name":"Cartoon Network Block Party","file":"Cartoon Network Block Party (USA).zip"},{"name":"Cartoon Network Speedway","file":"Cartoon Network Speedway (USA).zip"},{"name":"Casper","file":"Casper (USA) (En,Fr,Es).zip"},{"name":"Castlevania - Aria of Sorrow","file":"Castlevania - Aria of Sorrow (USA).zip"},{"name":"Castlevania - Circle of the Moon","file":"Castlevania - Circle of the Moon (USA).zip"},{"name":"Castlevania - Harmony of Dissonance","file":"Castlevania - Harmony of Dissonance (USA).zip"},{"name":"Castlevania Double Pack","file":"Castlevania Double Pack (USA).zip"},{"name":"Cat in the Hat, The","file":"Cat in the Hat, The (USA).zip"},{"name":"Catwoman","file":"Catwoman (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Catz","file":"Catz (USA, Europe).zip"},{"name":"Celia's Stupid Romhack v1.9.5 v2 XL","file":"Celia's Stupid Romhack v1.9.5 v2 (& Knuckles) XL.zip"},{"name":"Celia's Stupid Romhack v2","file":"Celia's Stupid Romhack v2.zip"},{"name":"Charlie and the Chocolate Factory","file":"Charlie and the Chocolate Factory (USA) (En,Fr,Es,Nl).zip"},{"name":"Charlotte's Web","file":"Charlotte's Web (USA) (En,Fr,De,Es,It).zip"},{"name":"Cheetah Girls, The","file":"Cheetah Girls, The (USA).zip"},{"name":"Chessmaster","file":"Chessmaster (USA).zip"},{"name":"Chicken Little","file":"Chicken Little (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Chicken Shoot","file":"Chicken Shoot (USA).zip"},{"name":"Chicken Shoot 2","file":"Chicken Shoot 2 (USA).zip"},{"name":"Chronicles of Narnia, The - The Lion, the Witch and the Wardrobe","file":"Chronicles of Narnia, The - The Lion, the Witch and the Wardrobe (USA, Europe) (En,Fr,De,Es,It,Nl,Sv,Da).zip"},{"name":"ChuChu Rocket!","file":"ChuChu Rocket! (USA) (En,Ja,Fr,De,Es).zip"},{"name":"Cinderella - Magical Dreams","file":"Cinderella - Magical Dreams (USA) (En,Fr,De,Es,It).zip"},{"name":"Classic NES Series - Bomberman","file":"Classic NES Series - Bomberman (USA, Europe).zip"},{"name":"Classic NES Series - Castlevania","file":"Classic NES Series - Castlevania (USA).zip"},{"name":"Classic NES Series - Donkey Kong","file":"Classic NES Series - Donkey Kong (USA, Europe).zip"},{"name":"Classic NES Series - Dr. Mario","file":"Classic NES Series - Dr. Mario (USA, Europe).zip"},{"name":"Classic NES Series - Excitebike","file":"Classic NES Series - Excitebike (USA, Europe).zip"},{"name":"Classic NES Series - Ice Climber","file":"Classic NES Series - Ice Climber (USA, Europe).zip"},{"name":"Classic NES Series - Metroid","file":"Classic NES Series - Metroid (USA, Europe).zip"},{"name":"Classic NES Series - Pac-Man","file":"Classic NES Series - Pac-Man (USA, Europe).zip"},{"name":"Classic NES Series - Super Mario Bros.","file":"Classic NES Series - Super Mario Bros. (USA, Europe).zip"},{"name":"Classic NES Series - The Legend of Zelda","file":"Classic NES Series - The Legend of Zelda (USA, Europe).zip"},{"name":"Classic NES Series - Xevious","file":"Classic NES Series - Xevious (USA, Europe).zip"},{"name":"Classic NES Series - Zelda II - The Adventure of Link","file":"Classic NES Series - Zelda II - The Adventure of Link (USA, Europe).zip"},{"name":"Codename - Kids Next Door - Operation S.O.D.A.","file":"Codename - Kids Next Door - Operation S.O.D.A. (USA).zip"},{"name":"Colin McRae Rally 2.0","file":"Colin McRae Rally 2.0 (USA) (En,Fr,De).zip"},{"name":"Columns Crown","file":"Columns Crown (USA).zip"},{"name":"Contra Advance - The Alien Wars EX","file":"Contra Advance - The Alien Wars EX (USA).zip"},{"name":"Corvette","file":"Corvette (USA) (En,Fr,De,Es,It).zip"},{"name":"Crash & Spyro Superpack - Spyro Orange - The Cortex Conspiracy + Crash Bandicoot Purple - Ripto's Rampage","file":"Crash & Spyro Superpack - Spyro Orange - The Cortex Conspiracy + Crash Bandicoot Purple - Ripto's Rampage (USA).zip"},{"name":"Crash Bandicoot - The Huge Adventure","file":"Crash Bandicoot - The Huge Adventure (USA).zip"},{"name":"Crash Bandicoot 2 - N-Tranced","file":"Crash Bandicoot 2 - N-Tranced (USA).zip"},{"name":"Crash Bandicoot Purple - Ripto's Rampage","file":"Crash Bandicoot Purple - Ripto's Rampage (USA) (Rev 1).zip"},{"name":"Crash Nitro Kart","file":"Crash Nitro Kart (USA).zip"},{"name":"Crash of the Titans","file":"Crash of the Titans (USA) (En,Fr).zip"},{"name":"Crazy Chase","file":"Crazy Chase (USA).zip"},{"name":"Crazy Taxi - Catch a Ride","file":"Crazy Taxi - Catch a Ride (USA).zip"},{"name":"Crouching Tiger, Hidden Dragon","file":"Crouching Tiger, Hidden Dragon (USA) (En,Fr,Es).zip"},{"name":"Cruis'n Velocity","file":"Cruis'n Velocity (USA, Europe).zip"},{"name":"Crushed Baseball","file":"Crushed Baseball (USA).zip"},{"name":"Cubix - Robots for Everyone - Clash 'N Bash","file":"Cubix - Robots for Everyone - Clash 'N Bash (USA).zip"},{"name":"Curious George","file":"Curious George (USA).zip"},{"name":"DBZ Legend of Kakarot GBA","file":"DBZ Legend of Kakarot GBA.zip"},{"name":"DK - King of Swing","file":"DK - King of Swing (USA).zip"},{"name":"Danny Phantom - The Ultimate Enemy","file":"Danny Phantom - The Ultimate Enemy (USA).zip"},{"name":"Danny Phantom - Urban Jungle","file":"Danny Phantom - Urban Jungle (USA).zip"},{"name":"Daredevil","file":"Daredevil (USA, Europe).zip"},{"name":"Dark Arena","file":"Dark Arena (USA, Europe).zip"},{"name":"Dave Mirra Freestyle BMX 2","file":"Dave Mirra Freestyle BMX 2 (USA).zip"},{"name":"Dave Mirra Freestyle BMX 3","file":"Dave Mirra Freestyle BMX 3 (USA, Europe).zip"},{"name":"David Beckham Soccer","file":"David Beckham Soccer (USA) (En,Es).zip"},{"name":"Davis Cup","file":"Davis Cup (USA) (En,Fr,De,Es,It).zip"},{"name":"Dead to Rights","file":"Dead to Rights (USA).zip"},{"name":"Deal or No Deal","file":"Deal or No Deal (USA).zip"},{"name":"Defender","file":"Defender (USA).zip"},{"name":"Defender of the Crown","file":"Defender of the Crown (USA).zip"},{"name":"DemiKids - Dark Version","file":"DemiKids - Dark Version (USA).zip"},{"name":"DemiKids - Light Version","file":"DemiKids - Light Version (USA).zip"},{"name":"Demon Driver - Time to Burn Rubber!","file":"Demon Driver - Time to Burn Rubber! (USA).zip"},{"name":"Denki Blocks!","file":"Denki Blocks! (USA) (En,Es).zip"},{"name":"Densetsu no Stafy","file":"Densetsu no Stafy (Japan).zip"},{"name":"Desert Strike Advance","file":"Desert Strike Advance (USA).zip"},{"name":"Dexter's Laboratory - Chess Challenge","file":"Dexter's Laboratory - Chess Challenge (USA).zip"},{"name":"Dexter's Laboratory - Deesaster Strikes!","file":"Dexter's Laboratory - Deesaster Strikes! (USA) (En,Fr,De,Es,It) (Rev 1).zip"},{"name":"Digimon - Battle Spirit","file":"Digimon - Battle Spirit (USA).zip"},{"name":"Digimon - Battle Spirit 2","file":"Digimon - Battle Spirit 2 (USA) (En,Fr,De,Es,It).zip"},{"name":"Digimon Crystal v17.1.2024","file":"Digimon Crystal v17.1.2024.zip"},{"name":"Digimon Emerald","file":"Digimon Emerald.zip"},{"name":"Digimon Escape from Server Island","file":"Digimon Escape from Server Island.zip"},{"name":"Digimon New World Beta 1","file":"Digimon New World Beta 1.zip"},{"name":"Digimon Nova Red v3.2","file":"Digimon Nova Red v3.2.zip"},{"name":"Digimon Operation Digipedia","file":"Digimon Operation Digipedia.zip"},{"name":"Digimon Racing","file":"Digimon Racing (USA) (En,Fr,De,Es,It).zip"},{"name":"Dinotopia - The Timestone Pirates","file":"Dinotopia - The Timestone Pirates (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Disney Princess","file":"Disney Princess (USA, Europe).zip"},{"name":"Disney Princess - Royal Adventure","file":"Disney Princess - Royal Adventure (USA).zip"},{"name":"Disney Sports - Basketball","file":"Disney Sports - Basketball (USA).zip"},{"name":"Disney Sports - Football","file":"Disney Sports - Football (USA).zip"},{"name":"Disney Sports - Motocross","file":"Disney Sports - Motocross (USA).zip"},{"name":"Disney Sports - Skateboarding","file":"Disney Sports - Skateboarding (USA).zip"},{"name":"Disney Sports - Snowboarding","file":"Disney Sports - Snowboarding (USA).zip"},{"name":"Disney Sports - Soccer","file":"Disney Sports - Soccer (USA).zip"},{"name":"Disney's Party","file":"Disney's Party (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Dogz","file":"Dogz (USA).zip"},{"name":"Dogz - Fashion","file":"Dogz - Fashion (USA).zip"},{"name":"Dogz 2","file":"Dogz 2 (USA) (Rev 1).zip"},{"name":"Dokapon - Monster Hunter","file":"Dokapon - Monster Hunter (USA).zip"},{"name":"Donald Duck Advance","file":"Donald Duck Advance (USA).zip"},{"name":"Donkey Kong Country","file":"Donkey Kong Country (USA).zip"},{"name":"Donkey Kong Country 2","file":"Donkey Kong Country 2 (USA).zip"},{"name":"Donkey Kong Country 3","file":"Donkey Kong Country 3 (USA).zip"},{"name":"Doom","file":"Doom (USA, Europe).zip"},{"name":"Doom II","file":"Doom II (USA).zip"},{"name":"Dora the Explorer - Dora's World Adventure!","file":"Dora the Explorer - Dora's World Adventure! (USA).zip"},{"name":"Dora the Explorer - Super Spies","file":"Dora the Explorer - Super Spies (USA).zip"},{"name":"Dora the Explorer - Super Star Adventures!","file":"Dora the Explorer - Super Star Adventures! (USA).zip"},{"name":"Dora the Explorer - The Search for the Pirate Pig's Treasure","file":"Dora the Explorer - The Search for the Pirate Pig's Treasure (USA).zip"},{"name":"Double Dragon Advance","file":"Double Dragon Advance (USA).zip"},{"name":"Dr. Sudoku","file":"Dr. Sudoku (USA).zip"},{"name":"Dragon Ball - Advanced Adventure","file":"Dragon Ball - Advanced Adventure (USA).zip"},{"name":"Dragon Ball GT - Transformation","file":"Dragon Ball GT - Transformation (USA).zip"},{"name":"Dragon Ball Team Training v8 [2020]","file":"Dragon Ball Team Training v8 [2020].zip"},{"name":"Dragon Ball Z - Buu's Fury","file":"Dragon Ball Z - Buu's Fury (USA).zip"},{"name":"Dragon Ball Z - Collectible Card Game","file":"Dragon Ball Z - Collectible Card Game (USA).zip"},{"name":"Dragon Ball Z - Supersonic Warriors","file":"Dragon Ball Z - Supersonic Warriors (USA).zip"},{"name":"Dragon Ball Z - Taiketsu","file":"Dragon Ball Z - Taiketsu (USA).zip"},{"name":"Dragon Ball Z - The Legacy of Goku","file":"Dragon Ball Z - The Legacy of Goku (USA).zip"},{"name":"Dragon Ball Z - The Legacy of Goku I & II","file":"Dragon Ball Z - The Legacy of Goku I & II (USA).zip"},{"name":"Dragon Ball Z - The Legacy of Goku II","file":"Dragon Ball Z - The Legacy of Goku II (USA).zip"},{"name":"Dragon Ball Z Team Training v9.2","file":"Dragon Ball Z Team Training v9.2.zip"},{"name":"Dragon Quest Monsters - Caravan Heart English","file":"Dragon Quest Monsters - Caravan Heart English.zip"},{"name":"Dragon Tales - Dragon Adventures","file":"Dragon Tales - Dragon Adventures (USA).zip"},{"name":"Drake & Josh","file":"Drake & Josh (USA) (En,Fr).zip"},{"name":"Drill Dozer","file":"Drill Dozer (USA).zip"},{"name":"Driv3r","file":"Driv3r (USA).zip"},{"name":"Driven","file":"Driven (USA) (En,Fr,De,Es,It).zip"},{"name":"Driver 2 Advance","file":"Driver 2 Advance (USA).zip"},{"name":"Drome Racers","file":"Drome Racers (USA).zip"},{"name":"Dual Blades","file":"Dual Blades (USA).zip"},{"name":"Duel Masters - Kaijudo Showdown","file":"Duel Masters - Kaijudo Showdown (USA).zip"},{"name":"Duel Masters - Sempai Legends","file":"Duel Masters - Sempai Legends (USA).zip"},{"name":"Duel Masters - Shadow of the Code","file":"Duel Masters - Shadow of the Code (USA).zip"},{"name":"Duke Nukem Advance","file":"Duke Nukem Advance (USA).zip"},{"name":"Dungeons & Dragons - Eye of the Beholder","file":"Dungeons & Dragons - Eye of the Beholder (USA).zip"},{"name":"Dynasty Warriors Advance","file":"Dynasty Warriors Advance (USA).zip"},{"name":"E.T. - The Extra-Terrestrial","file":"E.T. - The Extra-Terrestrial (USA).zip"},{"name":"ESPN X-Games Skateboarding","file":"ESPN X-Games Skateboarding (USA).zip"},{"name":"Earthworm Jim","file":"Earthworm Jim (USA, Europe).zip"},{"name":"Earthworm Jim 2","file":"Earthworm Jim 2 (USA).zip"},{"name":"Ecks vs Sever","file":"Ecks vs Sever (USA) (En,Fr,De,Es,It).zip"},{"name":"Ed, Edd n Eddy - Jawbreakers!","file":"Ed, Edd n Eddy - Jawbreakers! (USA) (Rev 1).zip"},{"name":"Ed, Edd n Eddy - The Mis-Edventures","file":"Ed, Edd n Eddy - The Mis-Edventures (USA) (En,Fr).zip"},{"name":"Egg Mania","file":"Egg Mania (USA) (En,Fr,Es).zip"},{"name":"Elf - The Movie","file":"Elf - The Movie (USA) (En,Fr,De,Es,It).zip"},{"name":"Elf Bowling 1 & 2","file":"Elf Bowling 1 & 2 (USA).zip"},{"name":"Enchanted - Once Upon Andalasia","file":"Enchanted - Once Upon Andalasia (USA) (En,Fr).zip"},{"name":"Eragon","file":"Eragon (USA).zip"},{"name":"Extreme Ghostbusters - Code Ecto-1","file":"Extreme Ghostbusters - Code Ecto-1 (USA).zip"},{"name":"Extreme Skate Adventure","file":"Extreme Skate Adventure (USA) (Rev 1).zip"},{"name":"F-14 Tomcat","file":"F-14 Tomcat (USA, Europe).zip"},{"name":"F-Zero - Climax v1.1","file":"F-Zero - Climax v1.1 (English).zip"},{"name":"F-Zero - GP Legend","file":"F-Zero - GP Legend (USA).zip"},{"name":"F-Zero - Maximum Velocity","file":"F-Zero - Maximum Velocity (USA, Europe).zip"},{"name":"F1 2002","file":"F1 2002 (USA, Europe).zip"},{"name":"F24 Stealth Fighter","file":"F24 Stealth Fighter (USA).zip"},{"name":"FIFA Soccer 06","file":"FIFA Soccer 06 (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"FIFA Soccer 07","file":"FIFA Soccer 07 (USA, Europe) (En,Fr,De,Es).zip"},{"name":"FIFA Soccer 2003","file":"FIFA Soccer 2003 (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"FIFA Soccer 2004","file":"FIFA Soccer 2004 (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"FIFA Soccer 2005","file":"FIFA Soccer 2005 (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Fairly OddParents!, The - Breakin' da Rules","file":"Fairly OddParents!, The - Breakin' da Rules (USA).zip"},{"name":"Fairly OddParents!, The - Clash with the Anti-World","file":"Fairly OddParents!, The - Clash with the Anti-World (USA).zip"},{"name":"Fairly OddParents!, The - Enter the Cleft","file":"Fairly OddParents!, The - Enter the Cleft (USA).zip"},{"name":"Fairly OddParents!, The - Shadow Showdown","file":"Fairly OddParents!, The - Shadow Showdown (USA).zip"},{"name":"Family Feud","file":"Family Feud (USA).zip"},{"name":"Fantastic 4","file":"Fantastic 4 (USA).zip"},{"name":"Fantastic 4 - Flame On","file":"Fantastic 4 - Flame On (USA).zip"},{"name":"Fear Factor - Unleashed","file":"Fear Factor - Unleashed (USA).zip"},{"name":"Final Fantasy I & II - Dawn of Souls","file":"Final Fantasy I & II - Dawn of Souls (USA).zip"},{"name":"Final Fantasy IV Advance","file":"Final Fantasy IV Advance (USA).zip"},{"name":"Final Fantasy Tactics Advance","file":"Final Fantasy Tactics Advance (USA).zip"},{"name":"Final Fantasy V Advance","file":"Final Fantasy V Advance (USA).zip"},{"name":"Final Fantasy VI Advance","file":"Final Fantasy VI Advance (USA).zip"},{"name":"Final Fight One","file":"Final Fight One (USA).zip"},{"name":"Finding Nemo","file":"Finding Nemo (USA, Europe).zip"},{"name":"Finding Nemo - The Continuing Adventures","file":"Finding Nemo - The Continuing Adventures (USA, Europe).zip"},{"name":"Fire Emblem","file":"Fire Emblem (USA, Australia).zip"},{"name":"Fire Emblem - The Binding Blade","file":"Fire Emblem - The Binding Blade (T) (1).zip"},{"name":"Fire Emblem - the Sacred Stones GBA","file":"Fire Emblem - the Sacred Stones GBA.zip"},{"name":"Fire Emblem The Last Promise","file":"Fire Emblem The Last Promise.zip"},{"name":"Fire Pro Wrestling","file":"Fire Pro Wrestling (USA, Europe).zip"},{"name":"Fire Pro Wrestling 2","file":"Fire Pro Wrestling 2 (USA).zip"},{"name":"Flintstones, The - Big Trouble in Bedrock","file":"Flintstones, The - Big Trouble in Bedrock (USA).zip"},{"name":"Flushed Away","file":"Flushed Away (USA).zip"},{"name":"Ford Racing 3","file":"Ford Racing 3 (USA).zip"},{"name":"Fortress","file":"Fortress (USA, Europe).zip"},{"name":"Foster's Home for Imaginary Friends","file":"Foster's Home for Imaginary Friends (USA).zip"},{"name":"Franklin the Turtle","file":"Franklin the Turtle (USA) (En,Fr,De,Es,It,Sv,No,Da,Fi).zip"},{"name":"Franklin's Great Adventures","file":"Franklin's Great Adventures (USA) (En,Fr,Es).zip"},{"name":"Freekstyle","file":"Freekstyle (USA).zip"},{"name":"Frogger Advance - The Great Quest","file":"Frogger Advance - The Great Quest (USA).zip"},{"name":"Frogger's Adventures - Temple of the Frog","file":"Frogger's Adventures - Temple of the Frog (USA) (En,Fr,De,Es,It).zip"},{"name":"Frogger's Adventures 2 - The Lost Wand","file":"Frogger's Adventures 2 - The Lost Wand (USA) (En,Es).zip"},{"name":"Frogger's Journey - The Forgotten Relic","file":"Frogger's Journey - The Forgotten Relic (USA).zip"},{"name":"Fullmetal Alchemist - Sonata of Memories","file":"Fullmetal Alchemist - Sonata of Memories (English).zip"},{"name":"Fullmetal Alchemist - Stray Rondo","file":"Fullmetal Alchemist - Stray Rondo (English).zip"},{"name":"GT Advance - Championship Racing","file":"GT Advance - Championship Racing (USA, Europe).zip"},{"name":"GT Advance 2 - Rally Racing","file":"GT Advance 2 - Rally Racing (USA).zip"},{"name":"GT Advance 3 - Pro Concept Racing","file":"GT Advance 3 - Pro Concept Racing (USA).zip"},{"name":"Gadget Racers","file":"Gadget Racers (USA).zip"},{"name":"Galidor - Defenders of the Outer Dimension","file":"Galidor - Defenders of the Outer Dimension (USA) (En,Fr,De,Es,It,Nl,Sv,Da).zip"},{"name":"Game & Watch Gallery 4","file":"Game & Watch Gallery 4 (USA).zip"},{"name":"Games Explosion!","file":"Games Explosion! (USA).zip"},{"name":"Garfield - The Search for Pooky","file":"Garfield - The Search for Pooky (USA) (En,Fr,De,Es,It).zip"},{"name":"Garfield and His Nine Lives","file":"Garfield and His Nine Lives (USA).zip"},{"name":"Gauntlet - Dark Legacy","file":"Gauntlet - Dark Legacy (USA).zip"},{"name":"Gekido Advance - Kintaro's Revenge","file":"Gekido Advance - Kintaro's Revenge (USA).zip"},{"name":"Gem Smashers","file":"Gem Smashers (USA).zip"},{"name":"Gensou Suikoden - Card Stories","file":"Gensou Suikoden - Card Stories (English).zip"},{"name":"Gentlemon Classy Red","file":"Gentlemon Classy Red.zip"},{"name":"Ghost Rider","file":"Ghost Rider (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Global Star - Sudoku Fever","file":"Global Star - Sudoku Fever (USA).zip"},{"name":"Godzilla - Domination!","file":"Godzilla - Domination! (USA).zip"},{"name":"Golden Nugget Casino","file":"Golden Nugget Casino (USA, Europe).zip"},{"name":"Golden Sun","file":"Golden Sun (USA, Europe).zip"},{"name":"Golden Sun - The Lost Age","file":"Golden Sun - The Lost Age (USA, Europe).zip"},{"name":"Google Translated Pokemon Emerald","file":"Google Translated Pokemon Emerald.zip"},{"name":"Gradius Galaxies","file":"Gradius Galaxies (USA).zip"},{"name":"Grand Theft Auto","file":"Grand Theft Auto (USA).zip"},{"name":"Green Eggs and Ham by Dr. Seuss","file":"Green Eggs and Ham by Dr. Seuss (USA).zip"},{"name":"Greg Hastings' Tournament Paintball Max'd","file":"Greg Hastings' Tournament Paintball Max'd (USA).zip"},{"name":"Gremlins - Stripe vs Gizmo","file":"Gremlins - Stripe vs Gizmo (USA).zip"},{"name":"Grim Adventures of Billy & Mandy, The","file":"Grim Adventures of Billy & Mandy, The (USA).zip"},{"name":"Guilty Gear X - Advance Edition","file":"Guilty Gear X - Advance Edition (USA).zip"},{"name":"Gumby vs. the Astrobots","file":"Gumby vs. the Astrobots (USA).zip"},{"name":"Gunstar Super Heroes","file":"Gunstar Super Heroes (USA).zip"},{"name":"Hajime no Ippo - The Fighting","file":"Hajime no Ippo - The Fighting (English).zip"},{"name":"Hamtaro - Ham-Ham Games","file":"Hamtaro - Ham-Ham Games (Japan, USA) (En,Ja).zip"},{"name":"Hamtaro - Ham-Ham Heartbreak","file":"Hamtaro - Ham-Ham Heartbreak (USA).zip"},{"name":"Hamtaro - Rainbow Rescue","file":"Hamtaro - Rainbow Rescue (Europe) (En,Fr,De,Es,It).zip"},{"name":"Happy Feet","file":"Happy Feet (USA) (En,Fr).zip"},{"name":"Hardcore Pinball","file":"Hardcore Pinball (USA, Europe).zip"},{"name":"Harlem Globetrotters - World Tour","file":"Harlem Globetrotters - World Tour (USA).zip"},{"name":"Harry Potter - Quidditch World Cup","file":"Harry Potter - Quidditch World Cup (USA, Europe) (En,Fr,De,Es,It,Nl,Da).zip"},{"name":"Harry Potter and the Chamber of Secrets","file":"Harry Potter and the Chamber of Secrets (USA, Europe) (En,Fr,De,Es,It,Nl,Pt,Sv,No,Da).zip"},{"name":"Harry Potter and the Goblet of Fire","file":"Harry Potter and the Goblet of Fire (USA, Europe) (En,Fr,De,Es,It,Nl,Da).zip"},{"name":"Harry Potter and the Order of the Phoenix","file":"Harry Potter and the Order of the Phoenix (USA, Europe) (En,Fr,De,Es,It,Nl,Da).zip"},{"name":"Harry Potter and the Prisoner of Azkaban","file":"Harry Potter and the Prisoner of Azkaban (USA, Europe) (En,Fr,De,Es,It,Nl,Da).zip"},{"name":"Harry Potter and the Sorcerer's Stone","file":"Harry Potter and the Sorcerer's Stone (USA, Europe) (En,Fr,De,Es,It,Nl,Pt,Sv,No,Da).zip"},{"name":"Harvest Moon - Friends of Mineral Town","file":"Harvest Moon - Friends of Mineral Town (USA).zip"},{"name":"Harvest Moon - More Friends of Mineral Town","file":"Harvest Moon - More Friends of Mineral Town (USA).zip"},{"name":"Hello Kitty - Happy Party Pals","file":"Hello Kitty - Happy Party Pals (USA).zip"},{"name":"Herbie - Fully Loaded","file":"Herbie - Fully Loaded (USA).zip"},{"name":"Hey Arnold! - The Movie","file":"Hey Arnold! - The Movie (USA).zip"},{"name":"Hi Hi Puffy AmiYumi - Kaznapped!","file":"Hi Hi Puffy AmiYumi - Kaznapped! (USA).zip"},{"name":"High Heat Major League Baseball 2002","file":"High Heat Major League Baseball 2002 (USA, Europe).zip"},{"name":"High Heat Major League Baseball 2003","file":"High Heat Major League Baseball 2003 (USA).zip"},{"name":"High School Musical - Livin' the Dream","file":"High School Musical - Livin' the Dream (USA).zip"},{"name":"Hobbit, The - The Prelude to the Lord of the Rings","file":"Hobbit, The - The Prelude to the Lord of the Rings (USA).zip"},{"name":"Home on the Range","file":"Home on the Range (USA) (En,Fr).zip"},{"name":"Horsez","file":"Horsez (USA).zip"},{"name":"Hot Potato!","file":"Hot Potato! (USA).zip"},{"name":"Hot Wheels - All Out","file":"Hot Wheels - All Out (USA).zip"},{"name":"Hot Wheels - Burnin' Rubber","file":"Hot Wheels - Burnin' Rubber (USA).zip"},{"name":"Hot Wheels - Stunt Track Challenge","file":"Hot Wheels - Stunt Track Challenge (USA, Europe).zip"},{"name":"Hot Wheels - Velocity X","file":"Hot Wheels - Velocity X (USA).zip"},{"name":"Hot Wheels - World Race","file":"Hot Wheels - World Race (USA).zip"},{"name":"Hugo - The Evil Mirror","file":"Hugo - The Evil Mirror (USA) (En,Fr,Es).zip"},{"name":"I Spy Challenger!","file":"I Spy Challenger! (USA).zip"},{"name":"IK+","file":"IK+ (USA).zip"},{"name":"Ice Age","file":"Ice Age (USA) (En,Fr,Es).zip"},{"name":"Ice Age 2 - The Meltdown","file":"Ice Age 2 - The Meltdown (USA).zip"},{"name":"Ice Nine","file":"Ice Nine (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Incredible Hulk, The","file":"Incredible Hulk, The (USA).zip"},{"name":"Incredibles, The","file":"Incredibles, The (USA, Europe).zip"},{"name":"Incredibles, The - Rise of the Underminer","file":"Incredibles, The - Rise of the Underminer (USA, Europe).zip"},{"name":"Inspector Gadget - Advance Mission","file":"Inspector Gadget - Advance Mission (USA).zip"},{"name":"Invincible Iron Man, The","file":"Invincible Iron Man, The (USA, Europe).zip"},{"name":"Iridion 3D","file":"Iridion 3D (USA, Europe).zip"},{"name":"Iridion II","file":"Iridion II (USA).zip"},{"name":"Island Xtreme Stunts","file":"Island Xtreme Stunts (USA, Europe) (En,Fr,De,Es,It,Nl,Sv,Da).zip"},{"name":"It's Mr. Pants","file":"It's Mr. Pants (USA, Europe).zip"},{"name":"Jackie Chan Adventures - Legend of the Dark Hand","file":"Jackie Chan Adventures - Legend of the Dark Hand (USA, Europe).zip"},{"name":"James Pond - Codename Robocod","file":"James Pond - Codename Robocod (USA) (En,Fr,Es,Pt).zip"},{"name":"Jazz Jackrabbit","file":"Jazz Jackrabbit (USA, Europe).zip"},{"name":"Jet Grind Radio","file":"Jet Grind Radio (USA).zip"},{"name":"Jimmy Neutron - Boy Genius","file":"Jimmy Neutron - Boy Genius (USA).zip"},{"name":"Jonny Moseley Mad Trix","file":"Jonny Moseley Mad Trix (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Juka and the Monophonic Menace","file":"Juka and the Monophonic Menace (USA) (En,Fr,Es).zip"},{"name":"Jungle Book, The","file":"Jungle Book, The (USA) (En,Fr,De,Es,It,Nl).zip"},{"name":"Jurassic Park III - Island Attack","file":"Jurassic Park III - Island Attack (USA).zip"},{"name":"Jurassic Park III - Park Builder","file":"Jurassic Park III - Park Builder (USA).zip"},{"name":"Jurassic Park III - The DNA Factor","file":"Jurassic Park III - The DNA Factor (USA).zip"},{"name":"Justice League - Chronicles","file":"Justice League - Chronicles (USA).zip"},{"name":"Justice League - Injustice for All","file":"Justice League - Injustice for All (USA).zip"},{"name":"Justice League Heroes - The Flash","file":"Justice League Heroes - The Flash (USA).zip"},{"name":"KAO the Kangaroo","file":"KAO the Kangaroo (USA) (En,Fr,De,Es,It,Nl).zip"},{"name":"Karnaaj Rally","file":"Karnaaj Rally (USA, Europe).zip"},{"name":"Kelly Slater's Pro Surfer","file":"Kelly Slater's Pro Surfer (USA, Europe).zip"},{"name":"Kill Switch","file":"Kill Switch (USA).zip"},{"name":"Killer 3D Pool","file":"Killer 3D Pool (USA).zip"},{"name":"Kim Possible - Revenge of Monkey Fist","file":"Kim Possible - Revenge of Monkey Fist (USA).zip"},{"name":"Kim Possible 2 - Drakken's Demise","file":"Kim Possible 2 - Drakken's Demise (USA) (En,Fr).zip"},{"name":"Kim Possible 3 - Team Possible","file":"Kim Possible 3 - Team Possible (USA) (En,Fr).zip"},{"name":"King of Fighters EX 2, The - Howling Blood","file":"King of Fighters EX 2, The - Howling Blood (USA).zip"},{"name":"King of Fighters EX, The - NeoBlood","file":"King of Fighters EX, The - NeoBlood (USA) (Rev 1).zip"},{"name":"Kingdom Hearts - Chain of Memories","file":"Kingdom Hearts - Chain of Memories (USA).zip"},{"name":"Kirby & The Amazing Mirror","file":"Kirby & The Amazing Mirror (USA).zip"},{"name":"Kirby - Nightmare in Dream Land","file":"Kirby - Nightmare in Dream Land (USA).zip"},{"name":"Klonoa - Empire of Dreams","file":"Klonoa - Empire of Dreams (USA).zip"},{"name":"Klonoa 2 - Dream Champ Tournament","file":"Klonoa 2 - Dream Champ Tournament (USA).zip"},{"name":"Klonoa Heroes - The Legendary Star Medal v1.1.8","file":"Klonoa Heroes - The Legendary Star Medal v1.1.8 (English).zip"},{"name":"Knights' Kingdom","file":"Knights' Kingdom (USA).zip"},{"name":"Koala Brothers - Outback Adventures","file":"Koala Brothers - Outback Adventures (USA) (En,Fr,De,Es,It,Nl,Pt,Da).zip"},{"name":"Konami Collector's Series - Arcade Advanced","file":"Konami Collector's Series - Arcade Advanced (USA).zip"},{"name":"Konami Krazy Racers","file":"Konami Krazy Racers (USA).zip"},{"name":"Kong - King of Atlantis","file":"Kong - King of Atlantis (USA).zip"},{"name":"Kong - The 8th Wonder of the World","file":"Kong - The 8th Wonder of the World (USA) (En,Fr,Es).zip"},{"name":"Kong - The Animated Series","file":"Kong - The Animated Series (USA) (En,Fr,De,Es,It,Nl).zip"},{"name":"Kurukuru Kururin","file":"Kurukuru Kururin (Europe).zip"},{"name":"LEGO Bionicle","file":"LEGO Bionicle (USA) (En,Fr).zip"},{"name":"LEGO Island 2 - The Brickster's Revenge","file":"LEGO Island 2 - The Brickster's Revenge (USA) (En,Fr).zip"},{"name":"LEGO Racers 2","file":"LEGO Racers 2 (USA) (En,Fr).zip"},{"name":"LEGO Star Wars - The Video Game","file":"LEGO Star Wars - The Video Game (USA, Europe) (En,Fr,De,Es,It,Nl,Da).zip"},{"name":"LEGO Star Wars II - The Original Trilogy","file":"LEGO Star Wars II - The Original Trilogy (USA).zip"},{"name":"Lady Sia","file":"Lady Sia (USA) (En,Fr,De,Es,It,Nl).zip"},{"name":"Land Before Time, The","file":"Land Before Time, The (USA) (En,Es).zip"},{"name":"Land Before Time, The - Into the Mysterious Beyond","file":"Land Before Time, The - Into the Mysterious Beyond (USA) (En,Fr,Es).zip"},{"name":"Lara Croft Tomb Raider - Legend","file":"Lara Croft Tomb Raider - Legend (USA) (En,Fr,De,Es,It).zip"},{"name":"Lara Croft Tomb Raider - The Prophecy","file":"Lara Croft Tomb Raider - The Prophecy (USA) (En,Fr,De,Es,It).zip"},{"name":"Legend of Spyro, The - A New Beginning","file":"Legend of Spyro, The - A New Beginning (USA).zip"},{"name":"Legend of Spyro, The - The Eternal Night","file":"Legend of Spyro, The - The Eternal Night (USA) (En,Fr).zip"},{"name":"Legend of Zelda, The - A Link to the Past & Four Swords","file":"Legend of Zelda, The - A Link to the Past & Four Swords (USA).zip"},{"name":"Legend of Zelda, The - The Minish Cap","file":"Legend of Zelda, The - The Minish Cap (USA).zip"},{"name":"Legends of Wrestling II","file":"Legends of Wrestling II (USA, Europe).zip"},{"name":"Lemony Snicket's A Series of Unfortunate Events","file":"Lemony Snicket's A Series of Unfortunate Events (USA, Europe).zip"},{"name":"Lilo & Stitch","file":"Lilo & Stitch (USA).zip"},{"name":"Lilo & Stitch 2 - Haemsterviel Havoc","file":"Lilo & Stitch 2 - Haemsterviel Havoc (USA).zip"},{"name":"Lion King 1 1-2, The","file":"Lion King 1 1-2, The (USA).zip"},{"name":"Lion King, The","file":"Lion King, The (Europe) (En,Fr,De,Es,It,Nl,Sv,Da).zip"},{"name":"Little Einsteins","file":"Little Einsteins (USA).zip"},{"name":"Little Mermaid, The - Magic in Two Kingdoms","file":"Little Mermaid, The - Magic in Two Kingdoms (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Lizzie McGuire - On the Go!","file":"Lizzie McGuire - On the Go! (USA).zip"},{"name":"Lizzie McGuire 2 - Lizzie Diaries","file":"Lizzie McGuire 2 - Lizzie Diaries (USA) (En,Fr).zip"},{"name":"Lizzie McGuire 3 - Homecoming Havoc","file":"Lizzie McGuire 3 - Homecoming Havoc (USA).zip"},{"name":"Looney Tunes - Back in Action","file":"Looney Tunes - Back in Action (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Looney Tunes Double Pack","file":"Looney Tunes Double Pack (USA).zip"},{"name":"Lord of the Rings, The - The Fellowship of the Ring","file":"Lord of the Rings, The - The Fellowship of the Ring (USA) (Rev 1).zip"},{"name":"Lord of the Rings, The - The Return of the King","file":"Lord of the Rings, The - The Return of the King (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Lord of the Rings, The - The Third Age","file":"Lord of the Rings, The - The Third Age (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Lord of the Rings, The - The Two Towers","file":"Lord of the Rings, The - The Two Towers (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Lost Vikings, The","file":"Lost Vikings, The (USA).zip"},{"name":"Love Hina Advance","file":"Love Hina Advance (English).zip"},{"name":"Lufia - The Ruins of Lore","file":"Lufia - The Ruins of Lore (USA).zip"},{"name":"Lunar Legend","file":"Lunar Legend (USA).zip"},{"name":"M&M's - Blast!","file":"M&M's - Blast! (USA).zip"},{"name":"M&M's - Break' Em","file":"M&M's - Break' Em (USA) (Rev 1).zip"},{"name":"MLB SlugFest 2004","file":"MLB SlugFest 2004 (USA).zip"},{"name":"MOTHER 1+2 English v1.01","file":"MOTHER 1+2 English v1.01.zip"},{"name":"MX 2002 Featuring Ricky Carmichael","file":"MX 2002 Featuring Ricky Carmichael (USA, Europe).zip"},{"name":"Madagascar","file":"Madagascar (USA).zip"},{"name":"Madagascar - Operation Penguin","file":"Madagascar - Operation Penguin (USA).zip"},{"name":"Madden NFL 06","file":"Madden NFL 06 (USA).zip"},{"name":"Madden NFL 07","file":"Madden NFL 07 (USA).zip"},{"name":"Madden NFL 2002","file":"Madden NFL 2002 (USA).zip"},{"name":"Madden NFL 2003","file":"Madden NFL 2003 (USA).zip"},{"name":"Madden NFL 2004","file":"Madden NFL 2004 (USA).zip"},{"name":"Madden NFL 2005","file":"Madden NFL 2005 (USA).zip"},{"name":"Magical Quest 2 Starring Mickey & Minnie","file":"Magical Quest 2 Starring Mickey & Minnie (USA) (En,Fr,De).zip"},{"name":"Magical Quest 3 Starring Mickey & Donald","file":"Magical Quest 3 Starring Mickey & Donald (USA) (En,Fr,De).zip"},{"name":"Magical Quest Starring Mickey & Minnie","file":"Magical Quest Starring Mickey & Minnie (USA).zip"},{"name":"Magical Vacation","file":"Magical Vacation (English).zip"},{"name":"March of the Penguins","file":"March of the Penguins (USA).zip"},{"name":"Mario & Luigi - Superstar Saga","file":"Mario & Luigi - Superstar Saga (USA).zip"},{"name":"Mario Golf - Advance Tour","file":"Mario Golf - Advance Tour (USA).zip"},{"name":"Mario Kart - Super Circuit","file":"Mario Kart - Super Circuit (USA).zip"},{"name":"Mario Mon v1.3","file":"Mario Mon v1.3.zip"},{"name":"Mario Party Advance","file":"Mario Party Advance (USA).zip"},{"name":"Mario Pinball Land","file":"Mario Pinball Land (USA, Australia).zip"},{"name":"Mario Tennis - Power Tour","file":"Mario Tennis - Power Tour (USA, Australia) (En,Fr,De,Es,It).zip"},{"name":"Mario vs. Donkey Kong","file":"Mario vs. Donkey Kong (USA, Australia).zip"},{"name":"Marvel - Ultimate Alliance","file":"Marvel - Ultimate Alliance (USA).zip"},{"name":"Mary-Kate and Ashley - Sweet 16 - Licensed to Drive","file":"Mary-Kate and Ashley - Sweet 16 - Licensed to Drive (USA, Europe).zip"},{"name":"Masters of the Universe - He-Man - Power of Grayskull","file":"Masters of the Universe - He-Man - Power of Grayskull (USA).zip"},{"name":"Mat Hoffman's Pro BMX","file":"Mat Hoffman's Pro BMX (USA, Europe).zip"},{"name":"Mat Hoffman's Pro BMX 2","file":"Mat Hoffman's Pro BMX 2 (USA, Europe).zip"},{"name":"Max Payne","file":"Max Payne (USA).zip"},{"name":"Mazes of Fate","file":"Mazes of Fate (USA) (En,Fr,De,Es,It).zip"},{"name":"Mech Platoon","file":"Mech Platoon (USA).zip"},{"name":"Medabots - Metabee","file":"Medabots - Metabee (USA).zip"},{"name":"Medabots - Rokusho","file":"Medabots - Rokusho (USA).zip"},{"name":"Medabots AX - Metabee Ver.","file":"Medabots AX - Metabee Ver. (USA).zip"},{"name":"Medabots AX - Rokusho Ver.","file":"Medabots AX - Rokusho Ver. (USA).zip"},{"name":"Medal of Honor - Infiltrator","file":"Medal of Honor - Infiltrator (USA, Europe) (En,Fr,De).zip"},{"name":"Medal of Honor - Underground","file":"Medal of Honor - Underground (USA).zip"},{"name":"Meet the Robinsons","file":"Meet the Robinsons (USA).zip"},{"name":"Mega Man Battle Network","file":"Mega Man Battle Network (USA).zip"},{"name":"Mega Man Battle Network 2","file":"Mega Man Battle Network 2 (USA).zip"},{"name":"Mega Man Battle Network 3 - Blue Version","file":"Mega Man Battle Network 3 - Blue Version (USA).zip"},{"name":"Mega Man Battle Network 3 - White Version","file":"Mega Man Battle Network 3 - White Version (USA).zip"},{"name":"Mega Man Zero","file":"Mega Man Zero (USA, Europe).zip"},{"name":"Mega Man Zero 2","file":"Mega Man Zero 2 (USA).zip"},{"name":"Mega Man Zero 3","file":"Mega Man Zero 3 (USA).zip"},{"name":"Mega Man Zero 4","file":"Mega Man Zero 4 (USA).zip"},{"name":"Mega Moemon FireRed","file":"Mega Moemon FireRed (v1.4b).zip"},{"name":"Mega Moemon FireRed v1.4c","file":"Mega Moemon FireRed v1.4c.zip"},{"name":"Megaman & Bass","file":"Megaman & Bass (USA).zip"},{"name":"Megaman - Battle Chip Challenge","file":"Megaman - Battle Chip Challenge (USA).zip"},{"name":"Megaman - Battle Network 4 - Blue Moon","file":"Megaman - Battle Network 4 - Blue Moon (USA).zip"},{"name":"Megaman - Battle Network 4 - Red Sun","file":"Megaman - Battle Network 4 - Red Sun (USA).zip"},{"name":"Megaman - Battle Network 5 - Team Colonel","file":"Megaman - Battle Network 5 - Team Colonel (USA).zip"},{"name":"Megaman - Battle Network 5 - Team Protoman","file":"Megaman - Battle Network 5 - Team Protoman (USA).zip"},{"name":"Megaman - Battle Network 6 - Cybeast Falzar","file":"Megaman - Battle Network 6 - Cybeast Falzar (USA).zip"},{"name":"Megaman - Battle Network 6 - Cybeast Gregar","file":"Megaman - Battle Network 6 - Cybeast Gregar (USA).zip"},{"name":"Men in Black - The Series","file":"Men in Black - The Series (USA).zip"},{"name":"Metal Slug Advance","file":"Metal Slug Advance (USA).zip"},{"name":"Metroid - Zero Mission","file":"Metroid - Zero Mission (USA).zip"},{"name":"Metroid Fusion","file":"Metroid Fusion (USA).zip"},{"name":"Midnight Club - Street Racing","file":"Midnight Club - Street Racing (USA).zip"},{"name":"Midway's Greatest Arcade Hits","file":"Midway's Greatest Arcade Hits (USA, Europe).zip"},{"name":"Mike Tyson Boxing","file":"Mike Tyson Boxing (USA) (En,Fr,De,Es,It).zip"},{"name":"Minicraft","file":"Minicraft (World) (v1.0) (Aftermarket) (Homebrew).zip"},{"name":"Minority Report - Everybody Runs","file":"Minority Report - Everybody Runs (USA, Europe).zip"},{"name":"Mission Impossible - Operation Surma","file":"Mission Impossible - Operation Surma (USA) (En,Fr,Es).zip"},{"name":"Mobile Suit Gundam Seed - Battle Assault","file":"Mobile Suit Gundam Seed - Battle Assault (USA).zip"},{"name":"Moemon AshGray","file":"Moemon AshGray.zip"},{"name":"Moemon Bonds BETA_v1.0.2.gba","file":"Moemon Bonds BETA_v1.0.2.gba.zip"},{"name":"Moemon Emerald","file":"Moemon Emerald.zip"},{"name":"Moemon FireRed v2.0","file":"Moemon FireRed v2.0.zip"},{"name":"Moemon Leaf Green Completed_April_21_2018","file":"Moemon Leaf Green Completed_April_21_2018.zip"},{"name":"Moemon Mega FireRed v1_3c","file":"Moemon Mega FireRed v1_3c.zip"},{"name":"Moemon Mystical completed_v1_fixed","file":"Moemon Mystical completed_v1_fixed.zip"},{"name":"Moemon Ruby v2.0.0.gba","file":"Moemon Ruby v2.0.0.gba.zip"},{"name":"Moemon Sapphire","file":"Moemon Sapphire.zip"},{"name":"Moemon Star Emerald v1.1a","file":"Moemon Star Emerald v1.1a.zip"},{"name":"Moemon Star Emerald v1.1b","file":"Moemon Star Emerald v1.1b.zip"},{"name":"Moemon Star Emerald","file":"Moemon Star Emerald.zip"},{"name":"Monopoly","file":"Monopoly (USA).zip"},{"name":"Monster Force","file":"Monster Force (USA).zip"},{"name":"Monster House","file":"Monster House (USA) (En,Fr).zip"},{"name":"Monster Jam - Maximum Destruction","file":"Monster Jam - Maximum Destruction (USA).zip"},{"name":"Monster Rancher Advance","file":"Monster Rancher Advance (USA).zip"},{"name":"Monster Rancher Advance 2","file":"Monster Rancher Advance 2 (USA).zip"},{"name":"Monster Truck Madness","file":"Monster Truck Madness (USA, Europe).zip"},{"name":"Monster Trucks","file":"Monster Trucks (USA, Europe).zip"},{"name":"Monster! Bass Fishing","file":"Monster! Bass Fishing (USA).zip"},{"name":"Monsters, Inc.","file":"Monsters, Inc. (USA, Europe).zip"},{"name":"Mortal Kombat - Deadly Alliance","file":"Mortal Kombat - Deadly Alliance (USA) (En,Fr,De,Es,It).zip"},{"name":"Mortal Kombat - Tournament Edition","file":"Mortal Kombat - Tournament Edition (USA) (En,Fr,De,Es,It).zip"},{"name":"Mortal Kombat Advance","file":"Mortal Kombat Advance (USA).zip"},{"name":"Mother 1+2","file":"Mother 1+2 (Japan).zip"},{"name":"Mother 3","file":"Mother 3 (Tr).zip"},{"name":"MotoGP","file":"MotoGP (USA) (En,Fr,De,Es,It).zip"},{"name":"Motocross Maniacs Advance","file":"Motocross Maniacs Advance (USA) (En,Es).zip"},{"name":"Motoracer Advance","file":"Motoracer Advance (USA) (En,Fr,De,Es,It).zip"},{"name":"Mr. Driller 2","file":"Mr. Driller 2 (USA).zip"},{"name":"Ms. Pac-Man - Maze Madness","file":"Ms. Pac-Man - Maze Madness (USA).zip"},{"name":"Mucha Lucha! - Mascaritas of the Lost Code","file":"Mucha Lucha! - Mascaritas of the Lost Code (USA) (En,Fr,Es).zip"},{"name":"Mummy, The","file":"Mummy, The (USA) (En,Fr,De,Es,It).zip"},{"name":"Muppet Pinball Mayhem","file":"Muppet Pinball Mayhem (USA).zip"},{"name":"Muppets, The - On with the Show!","file":"Muppets, The - On with the Show! (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"My Little Pony - Crystal Princess - The Runaway Rainbow","file":"My Little Pony - Crystal Princess - The Runaway Rainbow (USA).zip"},{"name":"NASCAR Heat 2002","file":"NASCAR Heat 2002 (USA).zip"},{"name":"NBA Jam 2002","file":"NBA Jam 2002 (USA, Europe).zip"},{"name":"NFL Blitz 2002","file":"NFL Blitz 2002 (USA).zip"},{"name":"NFL Blitz 2003","file":"NFL Blitz 2003 (USA).zip"},{"name":"NHL 2002","file":"NHL 2002 (USA).zip"},{"name":"NHL Hitz 2003","file":"NHL Hitz 2003 (USA).zip"},{"name":"Namco Museum","file":"Namco Museum (USA).zip"},{"name":"Namco Museum - 50th Anniversary","file":"Namco Museum - 50th Anniversary (USA).zip"},{"name":"Nancy Drew - Message in a Haunted Mansion","file":"Nancy Drew - Message in a Haunted Mansion (USA).zip"},{"name":"Naruto - Ninja Council","file":"Naruto - Ninja Council (USA).zip"},{"name":"Naruto - Ninja Council 2","file":"Naruto - Ninja Council 2 (USA).zip"},{"name":"Need for Speed - Carbon - Own the City","file":"Need for Speed - Carbon - Own the City (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Need for Speed - Most Wanted","file":"Need for Speed - Most Wanted (USA, Europe) (En,Fr,De,It).zip"},{"name":"Need for Speed - Porsche Unleashed","file":"Need for Speed - Porsche Unleashed (USA).zip"},{"name":"Need for Speed - Underground","file":"Need for Speed - Underground (USA, Europe) (En,Fr,De,It).zip"},{"name":"Need for Speed - Underground 2","file":"Need for Speed - Underground 2 (USA, Europe) (En,Fr,De,It).zip"},{"name":"Nicktoons - Attack of the Toybots","file":"Nicktoons - Attack of the Toybots (USA).zip"},{"name":"Nicktoons - Battle for Volcano Island","file":"Nicktoons - Battle for Volcano Island (USA).zip"},{"name":"Nicktoons - Freeze Frame Frenzy","file":"Nicktoons - Freeze Frame Frenzy (USA).zip"},{"name":"Nicktoons Racing","file":"Nicktoons Racing (USA).zip"},{"name":"Nicktoons Unite!","file":"Nicktoons Unite! (USA).zip"},{"name":"Ninja Five-0","file":"Ninja Five-0 (USA).zip"},{"name":"No Rules - Get Phat","file":"No Rules - Get Phat (USA, Europe) (En,Fr,De,Es,It,Nl).zip"},{"name":"Oddworld - Munch's Oddysee","file":"Oddworld - Munch's Oddysee (USA, Europe).zip"},{"name":"One Piece","file":"One Piece (USA).zip"},{"name":"Onimusha Tactics","file":"Onimusha Tactics (USA).zip"},{"name":"Open Season","file":"Open Season (USA) (En,Fr,Es).zip"},{"name":"Operation Armored Liberty","file":"Operation Armored Liberty (USA).zip"},{"name":"Oriental Blue - Ao no Tengai","file":"Oriental Blue - Ao no Tengai (English).zip"},{"name":"Over the Hedge","file":"Over the Hedge (USA).zip"},{"name":"Over the Hedge - Hammy Goes Nuts!","file":"Over the Hedge - Hammy Goes Nuts! (USA).zip"},{"name":"Ozzy & Drix","file":"Ozzy & Drix (USA).zip"},{"name":"POKeMON SkyBlue","file":"POKeMON SkyBlue.zip"},{"name":"Pac-Man Collection","file":"Pac-Man Collection (USA).zip"},{"name":"Pac-Man Pinball Advance","file":"Pac-Man Pinball Advance (USA).zip"},{"name":"Pac-Man World","file":"Pac-Man World (USA).zip"},{"name":"Pac-Man World 2","file":"Pac-Man World 2 (USA).zip"},{"name":"Paws & Claws - Best Friends - Dogs & Cats","file":"Paws & Claws - Best Friends - Dogs & Cats (USA).zip"},{"name":"Paws & Claws - Pet Resort","file":"Paws & Claws - Pet Resort (USA).zip"},{"name":"Paws & Claws - Pet Vet","file":"Paws & Claws - Pet Vet (USA).zip"},{"name":"Peter Pan - Return to Neverland","file":"Peter Pan - Return to Neverland (USA) (Rev 1).zip"},{"name":"Peter Pan - The Motion Picture Event","file":"Peter Pan - The Motion Picture Event (USA).zip"},{"name":"Petz - Hamsterz Life 2","file":"Petz - Hamsterz Life 2 (USA).zip"},{"name":"Petz Vet","file":"Petz Vet (USA).zip"},{"name":"Phalanx","file":"Phalanx (USA).zip"},{"name":"Phantasy Star Collection","file":"Phantasy Star Collection (USA).zip"},{"name":"Phil of the Future","file":"Phil of the Future (USA).zip"},{"name":"Piglet's Big Game","file":"Piglet's Big Game (USA).zip"},{"name":"Pikamon Yellow","file":"Pikamon Yellow.zip"},{"name":"Pinball Tycoon","file":"Pinball Tycoon (USA).zip"},{"name":"Pinball of the Dead, The","file":"Pinball of the Dead, The (USA).zip"},{"name":"Pink Panther - Pinkadelic Pursuit","file":"Pink Panther - Pinkadelic Pursuit (USA).zip"},{"name":"Pinobee - Wings of Adventure","file":"Pinobee - Wings of Adventure (USA, Europe).zip"},{"name":"Pirates of the Caribbean - Dead Man's Chest","file":"Pirates of the Caribbean - Dead Man's Chest (USA, Europe) (En,Fr,De,Es,It).zip"},{"name":"Pirates of the Caribbean - The Curse of the Black Pearl","file":"Pirates of the Caribbean - The Curse of the Black Pearl (USA) (En,Fr,De,Es,It).zip"},{"name":"Pit of 100 Trials - Roguelite Style Hack v1.3.1","file":"Pit of 100 Trials - Roguelite Style Hack v1.3.1.zip"},{"name":"Pitfall - The Lost Expedition","file":"Pitfall - The Lost Expedition (USA).zip"},{"name":"Pitfall - The Mayan Adventure","file":"Pitfall - The Mayan Adventure (USA, Europe).zip"},{"name":"Planet Monsters","file":"Planet Monsters (USA) (En,Fr,De,Es,It,Nl).zip"},{"name":"Planet of the Apes","file":"Planet of the Apes (USA) (En,Fr,De,Es,It,Nl).zip"},{"name":"Pocket Dogs","file":"Pocket Dogs (USA).zip"},{"name":"Pocket Gaiden 2 v1.1.0","file":"Pocket Gaiden 2 v1.1.0.zip"},{"name":"Pocket Gaiden v1.3","file":"Pocket Gaiden v1.3.zip"},{"name":"Pocket Monsters Kaizen v1.1","file":"Pocket Monsters Kaizen v1.1.zip"},{"name":"Pocket Mosters Scale x Fang","file":"Pocket Mosters Scale x Fang (v1.0.2).zip"},{"name":"Pocky & Rocky with Becky","file":"Pocky & Rocky with Becky (USA).zip"},{"name":"PokeBots Rescue Team v0.1","file":"PokeBots Rescue Team v0.1.zip"},{"name":"PokeLand 0 - Episode 1","file":"PokeLand 0 - Episode 1 (v2).zip"},{"name":"PokeLand 0 - Episode 1 v1.1","file":"PokeLand 0 - Episode 1 v1.1.zip"},{"name":"PokeLand 0 - Episode 2","file":"PokeLand 0 - Episode 2 (v1.0.1).zip"},{"name":"PokeLand 0 - Episode 3","file":"PokeLand 0 - Episode 3.zip"},{"name":"PokeMetroid 2.0.gba","file":"PokeMetroid 2.0.gba.zip"},{"name":"PokeMetroid v3.0","file":"PokeMetroid v3.0.zip"},{"name":"Pokefang Red","file":"Pokefang Red.zip"},{"name":"Pokeless Sokoban","file":"Pokeless Sokoban.zip"},{"name":"Pokeluv","file":"Pokeluv.zip"},{"name":"Pokemal","file":"Pokemal.zip"},{"name":"Pokemblem","file":"Pokemblem (May 1 2023 Release).zip"},{"name":"Pokemblem v1.06","file":"Pokemblem v1.06.zip"},{"name":"Pokemblem v1.08","file":"Pokemblem v1.08.zip"},{"name":"Pokemblem v1.12","file":"Pokemblem v1.12.zip"},{"name":"Pokemblem v1.14","file":"Pokemblem v1.14.zip"},{"name":"Pokemon Emerald Kaizo v2.0","file":"Pokemon  Emerald Kaizo v2.0.zip"},{"name":"Pokemon - Archie Made an Oopsie","file":"Pokemon - Archie Made an Oopsie.zip"},{"name":"Pokemon - Ash's Quest","file":"Pokemon - Ash's Quest.zip"},{"name":"Pokemon - AshGray 4.5.3","file":"Pokemon - AshGray 4.5.3.zip"},{"name":"Pokemon - Battle Fire bfinal","file":"Pokemon - Battle Fire bfinal.zip"},{"name":"Pokemon - Better than Fire Red v1.1","file":"Pokemon - Better than Fire Red v1.1.zip"},{"name":"Pokemon - Doubles FireRed 1.01","file":"Pokemon - Doubles FireRed 1.01.zip"},{"name":"Pokemon - DoublesFireRed 1.1","file":"Pokemon - DoublesFireRed 1.1.zip"},{"name":"Pokemon - Emerald Essence v1","file":"Pokemon - Emerald Essence v1.zip"},{"name":"Pokemon - Emerald Version","file":"Pokemon - Emerald Version (USA, Europe).zip"},{"name":"Pokemon - Exceeded 7.2","file":"Pokemon - Exceeded 7.2.zip"},{"name":"Pokemon - FireRed Version","file":"Pokemon - FireRed Version (USA, Europe) (Rev 1).zip"},{"name":"Pokemon - LeafGreen Version","file":"Pokemon - LeafGreen Version (USA, Europe) (Rev 1).zip"},{"name":"Pokemon - Ruby Version","file":"Pokemon - Ruby Version (USA, Europe) (Rev 2).zip"},{"name":"Pokemon - Sapphire Version","file":"Pokemon - Sapphire Version (USA, Europe) (Rev 2).zip"},{"name":"Pokemon - The Teal Mask GBA 1.0","file":"Pokemon - The Teal Mask GBA 1.0.zip"},{"name":"Pokemon - The Teal Mask GBA 1.5","file":"Pokemon - The Teal Mask GBA 1.5.zip"},{"name":"Pokemon - The Venofree Conspiracy","file":"Pokemon - The Venofree Conspiracy.zip"},{"name":"Pokemon - Thunder Yellow","file":"Pokemon - Thunder Yellow.zip"},{"name":"Pokemon - Water Blue","file":"Pokemon - Water Blue.zip"},{"name":"Pokemon 2 Heroes","file":"Pokemon 2 Heroes.zip"},{"name":"Pokemon 2050 v0.0.1","file":"Pokemon 2050 v0.0.1.zip"},{"name":"Pokemon 2Awesome","file":"Pokemon 2Awesome.zip"},{"name":"Pokemon A Grand Day Out","file":"Pokemon A Grand Day Out.zip"},{"name":"Pokemon A New Dawn v0.2","file":"Pokemon A New Dawn v0.2.zip"},{"name":"Pokemon Abandoned Ruby","file":"Pokemon Abandoned Ruby.zip"},{"name":"Pokemon Abra Adventure v1","file":"Pokemon Abra Adventure v1 (1).zip"},{"name":"Pokemon Accept Defeat V2","file":"Pokemon Accept Defeat V2.zip"},{"name":"Pokemon Adamantite","file":"Pokemon Adamantite.zip"},{"name":"Pokemon Advanced Adventure 2018-final","file":"Pokemon Advanced Adventure 2018-final.zip"},{"name":"Pokemon Advanced Version v3.0","file":"Pokemon Advanced Version v3.0.zip"},{"name":"Pokemon Adventure Blue Chapter b1.1","file":"Pokemon Adventure Blue Chapter b1.1.zip"},{"name":"Pokemon Adventure Gold Chapter v1.2","file":"Pokemon Adventure Gold Chapter v1.2.zip"},{"name":"Pokemon Adventure Green Chapter b3","file":"Pokemon Adventure Green Chapter b3.zip"},{"name":"Pokemon Adventure Red Chapter Beta_15_Expansion_Fix_Patch_C.gba","file":"Pokemon Adventure Red Chapter Beta_15_Expansion_Fix_Patch_C.gba.zip"},{"name":"Pokemon Adventure Yellow Chapter","file":"Pokemon Adventure Yellow Chapter.zip"},{"name":"Pokemon Adventure to Empire Isle v0.6.2","file":"Pokemon Adventure to Empire Isle v0.6.2.zip"},{"name":"Pokemon Adventures Norman","file":"Pokemon Adventures Norman.zip"},{"name":"Pokemon Altair Minus v11-22-2020","file":"Pokemon Altair Minus v11-22-2020.zip"},{"name":"Pokemon Altair and Sirius","file":"Pokemon Altair and Sirius.zip"},{"name":"Pokemon AlteRed","file":"Pokemon AlteRed (v2.1).zip"},{"name":"Pokemon AlteRed v2.5.3","file":"Pokemon AlteRed v2.5.3.zip"},{"name":"Pokemon Altered Emerald v3.07c","file":"Pokemon Altered Emerald v3.07c.zip"},{"name":"Pokemon Altered Emerald v4.15c","file":"Pokemon Altered Emerald v4.15c.zip"},{"name":"Pokemon Altered Emerald v4.2c","file":"Pokemon Altered Emerald v4.2c.zip"},{"name":"Pokemon Alternate Evolutions","file":"Pokemon Alternate Evolutions.zip"},{"name":"Pokemon Alternate Nusantara v0.1.6","file":"Pokemon Alternate Nusantara v0.1.6.zip"},{"name":"Pokemon Aluminum v0.1","file":"Pokemon Aluminum v0.1.zip"},{"name":"Pokemon Amalga Magenta 1.3.1","file":"Pokemon Amalga Magenta 1.3.1.zip"},{"name":"Pokemon Amalga Magenta v1.4","file":"Pokemon Amalga Magenta v1.4.zip"},{"name":"Pokemon Amarillo Solar","file":"Pokemon Amarillo Solar.zip"},{"name":"Pokemon Amaryllis v1.0","file":"Pokemon Amaryllis v1.0.zip"},{"name":"Pokemon Amatista","file":"Pokemon Amatista.zip"},{"name":"Pokemon Amazing Cortana v2.0","file":"Pokemon Amazing Cortana v2.0.zip"},{"name":"Pokemon Ambar","file":"Pokemon Ambar.zip"},{"name":"Pokemon Amnesia","file":"Pokemon Amnesia.zip"},{"name":"Pokemon Ancient","file":"Pokemon Ancient.zip"},{"name":"Pokemon Animon v1.11","file":"Pokemon Animon v1.11.zip"},{"name":"Pokemon Animon v1.12","file":"Pokemon Animon v1.12.zip"},{"name":"Pokemon Animon v1.13","file":"Pokemon Animon v1.13.zip"},{"name":"Pokemon Another Dimension v1.1","file":"Pokemon Another Dimension v1.1.zip"},{"name":"Pokemon Another Emerald v1.11b","file":"Pokemon Another Emerald v1.11b.zip"},{"name":"Pokemon Apollo v0.3","file":"Pokemon Apollo v0.3.zip"},{"name":"Pokemon Aqua Blue","file":"Pokemon Aqua Blue.zip"},{"name":"Pokemon Aqua Sapphire","file":"Pokemon Aqua Sapphire.zip"},{"name":"Pokemon Aqua Splash v4.0","file":"Pokemon Aqua Splash v4.0.zip"},{"name":"Pokemon Aqua","file":"Pokemon Aqua.zip"},{"name":"Pokemon Aquamarine 2.0.2","file":"Pokemon Aquamarine 2.0.2.zip"},{"name":"Pokemon Aquamarine 3.0.0","file":"Pokemon Aquamarine 3.0.0.zip"},{"name":"Pokemon Aquila 2 v0.21","file":"Pokemon Aquila 2 v0.21.zip"},{"name":"Pokemon Aquila v1.03x","file":"Pokemon Aquila v1.03x.zip"},{"name":"Pokemon Arceus Legend","file":"Pokemon Arceus Legend.zip"},{"name":"Pokemon Arcoiris English","file":"Pokemon Arcoiris English.zip"},{"name":"Pokemon Arcoiris V2.1","file":"Pokemon Arcoiris V2.1.zip"},{"name":"Pokemon Arcoiris","file":"Pokemon Arcoiris.zip"},{"name":"Pokemon Armageddon","file":"Pokemon Armageddon.zip"},{"name":"Pokemon Ascent Alpha v5","file":"Pokemon Ascent Alpha v5.zip"},{"name":"Pokemon Ash H2K Battle Frontier","file":"Pokemon Ash H2K Battle Frontier (Completed).zip"},{"name":"Pokemon Ash Hoenn Version","file":"Pokemon Ash Hoenn Version (USA).zip"},{"name":"Pokemon Ash Johto Version","file":"Pokemon Ash Johto Version.zip"},{"name":"Pokemon Ash Kanto MSB","file":"Pokemon Ash Kanto MSB (USA).zip"},{"name":"Pokemon Ash Orange League","file":"Pokemon Ash Orange League.zip"},{"name":"Pokemon Ash Red","file":"Pokemon Ash Red.zip"},{"name":"Pokemon Ash's Adventure v1.2","file":"Pokemon Ash's Adventure v1.2.zip"},{"name":"Pokemon AshGray 4.5.3","file":"Pokemon AshGray 4.5.3.zip"},{"name":"Pokemon AshGray v4.6","file":"Pokemon AshGray v4.6.zip"},{"name":"Pokemon Ashes Journey","file":"Pokemon Ashes Journey.zip"},{"name":"Pokemon Ashes v1.1","file":"Pokemon Ashes v1.1.zip"},{"name":"Pokemon Aspera","file":"Pokemon Aspera.zip"},{"name":"Pokemon Astral Red v1.2","file":"Pokemon Astral Red v1.2.zip"},{"name":"Pokemon Atlas Emerald","file":"Pokemon Atlas Emerald (Deluxe v0.9yi).zip"},{"name":"Pokemon Atlas Emerald v1.0rs","file":"Pokemon Atlas Emerald v1.0rs.zip"},{"name":"Pokemon Aurora Stone","file":"Pokemon Aurora Stone.zip"},{"name":"Pokemon Aurora b1.3.1","file":"Pokemon Aurora b1.3.1.zip"},{"name":"Pokemon Autumn Orange v1.2","file":"Pokemon Autumn Orange v1.2.zip"},{"name":"Pokemon Autumn Orange","file":"Pokemon Autumn Orange.zip"},{"name":"Pokemon Avventura a Fento v6.2","file":"Pokemon Avventura a Fento v6.2.zip"},{"name":"Pokemon Awesome Version XD","file":"Pokemon Awesome Version XD.zip"},{"name":"Pokemon Awful v2.05","file":"Pokemon Awful v2.05.zip"},{"name":"Pokemon Azotic Fire","file":"Pokemon Azotic Fire.zip"},{"name":"Pokemon Azure Blue v06","file":"Pokemon Azure Blue v06.zip"},{"name":"Pokemon Azure Horizons","file":"Pokemon Azure Horizons (True Continued Version 2023).zip"},{"name":"Pokemon Badge of Darkness","file":"Pokemon Badge of Darkness.zip"},{"name":"Pokemon Badluck Emerald","file":"Pokemon Badluck Emerald.zip"},{"name":"Pokemon Balanced Sapphire","file":"Pokemon Balanced Sapphire.zip"},{"name":"Pokemon BasedRedCringeGreen 5.0","file":"Pokemon BasedRedCringeGreen 5.0.zip"},{"name":"Pokemon Battle Labyrinth-v1.3.1","file":"Pokemon Battle Labyrinth-v1.3.1.zip"},{"name":"Pokemon Battle Ultimate","file":"Pokemon Battle Ultimate.zip"},{"name":"Pokemon Battle World v2.0","file":"Pokemon Battle World v2.0.zip"},{"name":"Pokemon Beta Emerald - Down + Dirty","file":"Pokemon Beta Emerald - Down + Dirty.zip"},{"name":"Pokemon Beta Emerald v.1.0.3","file":"Pokemon Beta Emerald v.1.0.3.zip"},{"name":"Pokemon Beta Gold Remake Alpha 1","file":"Pokemon Beta Gold Remake Alpha 1.zip"},{"name":"Pokemon Better Than Better Emerald 2","file":"Pokemon Better Than Better Emerald 2.zip"},{"name":"Pokemon Better than Better Emerald","file":"Pokemon Better than Better Emerald.zip"},{"name":"Pokemon Bianco Svapo","file":"Pokemon Bianco Svapo.zip"},{"name":"Pokemon Bidoof v0.3.0","file":"Pokemon Bidoof v0.3.0.zip"},{"name":"Pokemon Big Blue","file":"Pokemon Big Blue.zip"},{"name":"Pokemon Bismuth v0.2 Eng","file":"Pokemon Bismuth v0.2 Eng.zip"},{"name":"Pokemon Bizarre Version","file":"Pokemon Bizarre Version.zip"},{"name":"Pokemon Black Dark","file":"Pokemon Black Dark.zip"},{"name":"Pokemon Black Orb v2","file":"Pokemon Black Orb v2.zip"},{"name":"Pokemon Black Pearl Emerald v1.0.1","file":"Pokemon Black Pearl Emerald v1.0.1.zip"},{"name":"Pokemon Black Pearl Emerald v1.0","file":"Pokemon Black Pearl Emerald v1.0.zip"},{"name":"Pokemon Black and White GBA","file":"Pokemon Black and White GBA.zip"},{"name":"Pokemon BlackGranite X","file":"Pokemon BlackGranite X.zip"},{"name":"Pokemon Blackened Night v3.1","file":"Pokemon Blackened Night v3.1.zip"},{"name":"Pokemon Blasting Off","file":"Pokemon Blasting Off.zip"},{"name":"Pokemon Blazed-Glazed-v1.3","file":"Pokemon Blazed-Glazed-v1.3.zip"},{"name":"Pokemon Blazing FireRed","file":"Pokemon Blazing FireRed (v2.4) (1).zip"},{"name":"Pokemon Blazing","file":"Pokemon Blazing.zip"},{"name":"Pokemon Bloodline’s Error v3.0","file":"Pokemon Bloodline’s Error v3.0.zip"},{"name":"Pokemon Bloody Red","file":"Pokemon Bloody Red.zip"},{"name":"Pokemon Blossom v073118","file":"Pokemon Blossom v073118.zip"},{"name":"Pokemon Blu Acqua","file":"Pokemon Blu Acqua.zip"},{"name":"Pokemon Blu Idro","file":"Pokemon Blu Idro.zip"},{"name":"Pokemon Blue G1S v2","file":"Pokemon Blue G1S v2.zip"},{"name":"Pokemon Blue Ice Mx","file":"Pokemon Blue Ice Mx.zip"},{"name":"Pokemon Blue Legend","file":"Pokemon Blue Legend.zip"},{"name":"Pokemon Blue Moon","file":"Pokemon Blue Moon.zip"},{"name":"Pokemon Blue Sea Edition v1.0.gba","file":"Pokemon Blue Sea Edition v1.0.gba.zip"},{"name":"Pokemon Blue Stars 4 v1.5","file":"Pokemon Blue Stars 4 v1.5.zip"},{"name":"Pokemon Blue Stars 4 v2.1","file":"Pokemon Blue Stars 4 v2.1.zip"},{"name":"Pokemon Blue Stars 4","file":"Pokemon Blue Stars 4.zip"},{"name":"Pokemon Blue Stars Battle","file":"Pokemon Blue Stars Battle.zip"},{"name":"Pokemon BlueDream","file":"Pokemon BlueDream.zip"},{"name":"Pokemon Bluestars 4 v2.0","file":"Pokemon Bluestars 4 v2.0.zip"},{"name":"Pokemon Brasul v2.0","file":"Pokemon Brasul v2.0.zip"},{"name":"Pokemon Brasul v2.1","file":"Pokemon Brasul v2.1.zip"},{"name":"Pokemon Brown-tpp","file":"Pokemon Brown-tpp.zip"},{"name":"Pokemon Brunocity Adventures v2","file":"Pokemon Brunocity Adventures v2.zip"},{"name":"Pokemon Brutal Version","file":"Pokemon Brutal Version.zip"},{"name":"Pokemon Bubbleblue","file":"Pokemon Bubbleblue.zip"},{"name":"Pokemon Bubbleblue_beta_1","file":"Pokemon Bubbleblue_beta_1.zip"},{"name":"Pokemon Bug Version","file":"Pokemon Bug Version.zip"},{"name":"Pokemon Burning Ruby","file":"Pokemon Burning Ruby.zip"},{"name":"Pokemon CAOS 2","file":"Pokemon CAOS 2.zip"},{"name":"Pokemon CAOS","file":"Pokemon CAOS.zip"},{"name":"Pokemon CAWPS Full","file":"Pokemon CAWPS Full.zip"},{"name":"Pokemon Camp Baker v1.1","file":"Pokemon Camp Baker v1.1.zip"},{"name":"Pokemon Camp v1.3","file":"Pokemon Camp v1.3.zip"},{"name":"Pokemon Castform Killed my Father","file":"Pokemon Castform Killed my Father.zip"},{"name":"Pokemon Catastrophe v0.6","file":"Pokemon Catastrophe v0.6.zip"},{"name":"Pokemon Celebi’s Return v1.01","file":"Pokemon Celebi’s Return v1.01.zip"},{"name":"Pokemon Celebi’s Return v1.02","file":"Pokemon Celebi’s Return v1.02.zip"},{"name":"Pokemon Celestial Version Beta_Release_1_Nov_2021","file":"Pokemon Celestial Version Beta_Release_1_Nov_2021.zip"},{"name":"Pokemon Celestium","file":"Pokemon Celestium.zip"},{"name":"Pokemon Cerice v1.5","file":"Pokemon Cerice v1.5.zip"},{"name":"Pokemon Cerulean Aquarium","file":"Pokemon Cerulean Aquarium.zip"},{"name":"Pokemon Chalice","file":"Pokemon Chalice.zip"},{"name":"Pokemon Champions v10.0 Final","file":"Pokemon Champions v10.0 Final.zip"},{"name":"Pokemon Champions v8.0","file":"Pokemon Champions v8.0.zip"},{"name":"Pokemon Chaos Emerald v2.4","file":"Pokemon Chaos Emerald v2.4.zip"},{"name":"Pokemon Charcoal v16.0","file":"Pokemon Charcoal v16.0.zip"},{"name":"Pokemon Charcoal v8.0","file":"Pokemon Charcoal v8.0.zip"},{"name":"Pokemon Charged Red","file":"Pokemon Charged Red (v2.0.3) (2).zip"},{"name":"Pokemon Charged Red v3","file":"Pokemon Charged Red v3.zip"},{"name":"Pokemon Charles’s FireRed","file":"Pokemon Charles’s FireRed.zip"},{"name":"Pokemon Charmeleon Version","file":"Pokemon Charmeleon Version.zip"},{"name":"Pokemon Chileno v5.0","file":"Pokemon Chileno v5.0.zip"},{"name":"Pokemon Chileno v6.0","file":"Pokemon Chileno v6.0.zip"},{"name":"Pokemon ChonkyRed","file":"Pokemon ChonkyRed.zip"},{"name":"Pokemon Chroma Beta 2","file":"Pokemon Chroma Beta 2.zip"},{"name":"Pokemon Chroma b1","file":"Pokemon Chroma b1.zip"},{"name":"Pokemon Chrome v0.6","file":"Pokemon Chrome v0.6.zip"},{"name":"Pokemon Chronicles of Soala beta_9.0","file":"Pokemon Chronicles of Soala beta_9.0.zip"},{"name":"Pokemon Ciano’s Quest Alpha 1","file":"Pokemon Ciano’s Quest Alpha 1.zip"},{"name":"Pokemon Cintrine Final Version 1.051.gba","file":"Pokemon Cintrine Final Version 1.051.gba.zip"},{"name":"Pokemon Citrite v1.3.1","file":"Pokemon Citrite v1.3.1.zip"},{"name":"Pokemon Citrite v1.3","file":"Pokemon Citrite v1.3.zip"},{"name":"Pokemon Classic","file":"Pokemon Classic (v1.3).zip"},{"name":"Pokemon Classic 1.1","file":"Pokemon Classic 1.1.zip"},{"name":"Pokemon Classic v1.2","file":"Pokemon Classic v1.2.zip"},{"name":"Pokemon Classified","file":"Pokemon Classified.zip"},{"name":"Pokemon Clays Calamity v10","file":"Pokemon Clays Calamity v10.zip"},{"name":"Pokemon Clay’s Calamity 2 v5.1","file":"Pokemon Clay’s Calamity 2 v5.1.zip"},{"name":"Pokemon Clay’s Calamity 3","file":"Pokemon Clay’s Calamity 3.zip"},{"name":"Pokemon Clear Ocean","file":"Pokemon Clear Ocean.zip"},{"name":"Pokemon Climax v3.0","file":"Pokemon Climax v3.0.zip"},{"name":"Pokemon Cloud White 2 v237","file":"Pokemon Cloud White 2 v237.zip"},{"name":"Pokemon Cloud White 2 v279","file":"Pokemon Cloud White 2 v279.zip"},{"name":"Pokemon Cloud White 3 v277","file":"Pokemon Cloud White 3 v277.zip"},{"name":"Pokemon Cloud White v523d","file":"Pokemon Cloud White v523d.zip"},{"name":"Pokemon Clover v1.3.1","file":"Pokemon Clover v1.3.1.zip"},{"name":"Pokemon Clover v1.3.3","file":"Pokemon Clover v1.3.3.zip"},{"name":"Pokemon Coastal Version v.1.4","file":"Pokemon Coastal Version v.1.4.zip"},{"name":"Pokemon Coastal Version v1.1.1","file":"Pokemon Coastal Version v1.1.1.zip"},{"name":"Pokemon Coastal Version v1.3","file":"Pokemon Coastal Version v1.3.zip"},{"name":"Pokemon Coastal Version v1.5","file":"Pokemon Coastal Version v1.5.zip"},{"name":"Pokemon Coastal v1.6","file":"Pokemon Coastal v1.6.zip"},{"name":"Pokemon Cobalt v1.4","file":"Pokemon Cobalt v1.4.zip"},{"name":"Pokemon Cobalto Azul","file":"Pokemon Cobalto Azul.zip"},{"name":"Pokemon Coliseo Eterno","file":"Pokemon Coliseo Eterno.zip"},{"name":"Pokemon Collapse","file":"Pokemon Collapse.zip"},{"name":"Pokemon Coltan Edition v9.1","file":"Pokemon Coltan Edition v9.1.zip"},{"name":"Pokemon Coltan Edition","file":"Pokemon Coltan Edition.zip"},{"name":"Pokemon Complete Safari v1.3","file":"Pokemon Complete Safari v1.3.zip"},{"name":"Pokemon Confusing Emerald","file":"Pokemon Confusing Emerald.zip"},{"name":"Pokemon Congbu","file":"Pokemon Congbu.zip"},{"name":"Pokemon Conjure v0.0.1","file":"Pokemon Conjure v0.0.1.zip"},{"name":"Pokemon Constraint Of Evil Idea 1","file":"Pokemon Constraint Of Evil Idea 1.zip"},{"name":"Pokemon Conversion Emerald v1.76","file":"Pokemon Conversion Emerald v1.76.zip"},{"name":"Pokemon Cool Spot Version v1.3","file":"Pokemon Cool Spot Version v1.3.zip"},{"name":"Pokemon Cool Spot Version","file":"Pokemon Cool Spot Version.zip"},{"name":"Pokemon Cool Spot v1.1","file":"Pokemon Cool Spot v1.1.zip"},{"name":"Pokemon Cope Version v0.9.5","file":"Pokemon Cope Version v0.9.5.zip"},{"name":"Pokemon Corona Edition","file":"Pokemon Corona Edition.zip"},{"name":"Pokemon Cosmic Emerald v12-24-019","file":"Pokemon Cosmic Emerald v12-24-019.zip"},{"name":"Pokemon Cosmic v0.0","file":"Pokemon Cosmic v0.0.zip"},{"name":"Pokemon Crazy Vie v1.3","file":"Pokemon Crazy Vie v1.3.zip"},{"name":"Pokemon Creepy Black v0.05","file":"Pokemon Creepy Black v0.05.zip"},{"name":"Pokemon Creepy v1.4","file":"Pokemon Creepy v1.4.zip"},{"name":"Pokemon Crimson Red","file":"Pokemon Crimson Red.zip"},{"name":"Pokemon Crimson","file":"Pokemon Crimson.zip"},{"name":"Pokemon Cristal de Jade","file":"Pokemon Cristal de Jade.zip"},{"name":"Pokemon Crono","file":"Pokemon Crono.zip"},{"name":"Pokemon Crossed Universes","file":"Pokemon Crossed Universes.zip"},{"name":"Pokemon Crown","file":"Pokemon Crown (Beta 1 v9).zip"},{"name":"Pokemon Crush final","file":"Pokemon Crush final.zip"},{"name":"Pokemon Cryptic Lynch v1.2","file":"Pokemon Cryptic Lynch v1.2.zip"},{"name":"Pokemon Crystal Advance Redux","file":"Pokemon Crystal Advance Redux (21-10-2023).zip"},{"name":"Pokemon Crystal Advance Redux 28-12-2023","file":"Pokemon Crystal Advance Redux 28-12-2023.zip"},{"name":"Pokemon Crystal Advance Redux update 01-02-24","file":"Pokemon Crystal Advance Redux update 01-02-24.zip"},{"name":"Pokemon Crystal Advance Redux v01-04-24","file":"Pokemon Crystal Advance Redux v01-04-24.zip"},{"name":"Pokemon Crystal Advance Redux v01-06-24","file":"Pokemon Crystal Advance Redux v01-06-24.zip"},{"name":"Pokemon Crystal Advance Redux v01-09-24","file":"Pokemon Crystal Advance Redux v01-09-24.zip"},{"name":"Pokemon Crystal Advance Redux v03-05-24","file":"Pokemon Crystal Advance Redux v03-05-24.zip"},{"name":"Pokemon Crystal Advance Redux v04-10-24","file":"Pokemon Crystal Advance Redux v04-10-24.zip"},{"name":"Pokemon Crystal Advance Redux v06-07-24","file":"Pokemon Crystal Advance Redux v06-07-24.zip"},{"name":"Pokemon Crystal Advance Redux v07-06-24","file":"Pokemon Crystal Advance Redux v07-06-24.zip"},{"name":"Pokemon Crystal Advance Redux v08-09-24","file":"Pokemon Crystal Advance Redux v08-09-24.zip"},{"name":"Pokemon Crystal Advance Redux v10-05-24","file":"Pokemon Crystal Advance Redux v10-05-24.zip"},{"name":"Pokemon Crystal Advance Redux v10-10-24","file":"Pokemon Crystal Advance Redux v10-10-24.zip"},{"name":"Pokemon Crystal Advance Redux v11-03-24","file":"Pokemon Crystal Advance Redux v11-03-24.zip"},{"name":"Pokemon Crystal Advance Redux v12-2-24","file":"Pokemon Crystal Advance Redux v12-2-24.zip"},{"name":"Pokemon Crystal Advance Redux v13-07-24","file":"Pokemon Crystal Advance Redux v13-07-24.zip"},{"name":"Pokemon Crystal Advance Redux v13-08-24","file":"Pokemon Crystal Advance Redux v13-08-24.zip"},{"name":"Pokemon Crystal Advance Redux v13-09-24","file":"Pokemon Crystal Advance Redux v13-09-24.zip"},{"name":"Pokemon Crystal Advance Redux v14-10-24","file":"Pokemon Crystal Advance Redux v14-10-24.zip"},{"name":"Pokemon Crystal Advance Redux v15-2-24","file":"Pokemon Crystal Advance Redux v15-2-24.zip"},{"name":"Pokemon Crystal Advance Redux v16-05-24","file":"Pokemon Crystal Advance Redux v16-05-24.zip"},{"name":"Pokemon Crystal Advance Redux v17-03-24","file":"Pokemon Crystal Advance Redux v17-03-24.zip"},{"name":"Pokemon Crystal Advance Redux v17-06-24","file":"Pokemon Crystal Advance Redux v17-06-24.zip"},{"name":"Pokemon Crystal Advance Redux v18-08-24","file":"Pokemon Crystal Advance Redux v18-08-24.zip"},{"name":"Pokemon Crystal Advance Redux v20-04-24","file":"Pokemon Crystal Advance Redux v20-04-24.zip"},{"name":"Pokemon Crystal Advance Redux v20-07-24","file":"Pokemon Crystal Advance Redux v20-07-24.zip"},{"name":"Pokemon Crystal Advance Redux v21-06-24","file":"Pokemon Crystal Advance Redux v21-06-24.zip"},{"name":"Pokemon Crystal Advance Redux v22-09-24","file":"Pokemon Crystal Advance Redux v22-09-24.zip"},{"name":"Pokemon Crystal Advance Redux v23-02-24","file":"Pokemon Crystal Advance Redux v23-02-24.zip"},{"name":"Pokemon Crystal Advance Redux v24-03-24","file":"Pokemon Crystal Advance Redux v24-03-24.zip"},{"name":"Pokemon Crystal Advance Redux v24-08-24","file":"Pokemon Crystal Advance Redux v24-08-24.zip"},{"name":"Pokemon Crystal Advance Redux v25-05-24","file":"Pokemon Crystal Advance Redux v25-05-24.zip"},{"name":"Pokemon Crystal Advance Redux v25-07-24","file":"Pokemon Crystal Advance Redux v25-07-24.zip"},{"name":"Pokemon Crystal Advance Redux v26-06-24","file":"Pokemon Crystal Advance Redux v26-06-24.zip"},{"name":"Pokemon Crystal Advance Redux v27-04-24","file":"Pokemon Crystal Advance Redux v27-04-24.zip"},{"name":"Pokemon Crystal Advance Redux v28-09-24","file":"Pokemon Crystal Advance Redux v28-09-24.zip"},{"name":"Pokemon Crystal Advance Redux v29-02-24","file":"Pokemon Crystal Advance Redux v29-02-24.zip"},{"name":"Pokemon Crystal Advance Redux v29-07-24","file":"Pokemon Crystal Advance Redux v29-07-24.zip"},{"name":"Pokemon Crystal Advance Redux v31-07-24","file":"Pokemon Crystal Advance Redux v31-07-24.zip"},{"name":"Pokemon Crystal Clear Standard Version","file":"Pokemon Crystal Clear Standard Version (v2.5.9).zip"},{"name":"Pokemon Crystal Dust v3.0.0","file":"Pokemon Crystal Dust v3.0.0.zip"},{"name":"Pokemon Crystal Kaizo","file":"Pokemon Crystal Kaizo.zip"},{"name":"Pokemon Crystal Shards v1.0","file":"Pokemon Crystal Shards v1.0.zip"},{"name":"Pokemon Crystallos","file":"Pokemon Crystallos.zip"},{"name":"Pokemon Cursed v1.2","file":"Pokemon Cursed v1.2.zip"},{"name":"Pokemon Cyan b3","file":"Pokemon Cyan b3.zip"},{"name":"Pokemon DAVD Edition v2.2","file":"Pokemon DAVD Edition v2.2.zip"},{"name":"Pokemon DNA Spanish","file":"Pokemon DNA Spanish.zip"},{"name":"Pokemon DNA","file":"Pokemon DNA.zip"},{"name":"Pokemon DPS Ultimate v1.1","file":"Pokemon DPS Ultimate v1.1.zip"},{"name":"Pokemon DPS Ultimate v1.3","file":"Pokemon DPS Ultimate v1.3.zip"},{"name":"Pokemon DR v1.0.2","file":"Pokemon DR v1.0.2.zip"},{"name":"Pokemon Daia","file":"Pokemon Daia.zip"},{"name":"Pokemon Dardusk v0.1","file":"Pokemon Dardusk v0.1.zip"},{"name":"Pokemon Dark Begin","file":"Pokemon Dark Begin.zip"},{"name":"Pokemon Dark Knight v1.2","file":"Pokemon Dark Knight v1.2.zip"},{"name":"Pokemon Dark Phantom v4.5","file":"Pokemon Dark Phantom v4.5.zip"},{"name":"Pokemon Dark Realm b3.0","file":"Pokemon Dark Realm b3.0.zip"},{"name":"Pokemon Dark Rising Order Destroyed","file":"Pokemon Dark Rising Order Destroyed.zip"},{"name":"Pokemon Dark Rising Origins Worlds Collide","file":"Pokemon Dark Rising Origins Worlds Collide.zip"},{"name":"Pokemon Dark Rising Rebirth","file":"Pokemon Dark Rising Rebirth.zip"},{"name":"Pokemon Dark Worship ENGLISH COMPLETE","file":"Pokemon Dark Worship ENGLISH COMPLETE.zip"},{"name":"Pokemon Dark Worship Oficial 2.6","file":"Pokemon Dark Worship Oficial 2.6.zip"},{"name":"Pokemon DarkCry FixedHotfixAlpha2d6d7RTC-pokemonerdotcom","file":"Pokemon DarkCry FixedHotfixAlpha2d6d7RTC-pokemonerdotcom.zip"},{"name":"Pokemon DarkJasper","file":"Pokemon DarkJasper.zip"},{"name":"Pokemon DarkRed","file":"Pokemon DarkRed.zip"},{"name":"Pokemon Darkfire -b1.0.4","file":"Pokemon Darkfire -b1.0.4.zip"},{"name":"Pokemon Darkfire v2.0.5","file":"Pokemon Darkfire v2.0.5.zip"},{"name":"Pokemon Darkfire v2.1","file":"Pokemon Darkfire v2.1.zip"},{"name":"Pokemon Darkstar - Road To Dreams","file":"Pokemon Darkstar - Road To Dreams.zip"},{"name":"Pokemon Delta Fusion","file":"Pokemon Delta Fusion.zip"},{"name":"Pokemon Delta Green","file":"Pokemon Delta Green.zip"},{"name":"Pokemon Demon Island v1.3d","file":"Pokemon Demon Island v1.3d.zip"},{"name":"Pokemon Demon Island v1.3f2","file":"Pokemon Demon Island v1.3f2.zip"},{"name":"Pokemon Deneb 2018-04-01","file":"Pokemon Deneb 2018-04-01.zip"},{"name":"Pokemon Derpizard","file":"Pokemon Derpizard.zip"},{"name":"Pokemon Desert Bus","file":"Pokemon Desert Bus.zip"},{"name":"Pokemon Desert Version a0.2","file":"Pokemon Desert Version a0.2.zip"},{"name":"Pokemon Desolate","file":"Pokemon Desolate.zip"},{"name":"Pokemon Destiny","file":"Pokemon Destiny (v1).zip"}]`), he = 360, j = 40, Se = "https://cdn.jsdelivr.net/gh/vbaemulator/GBA-Roms@master/", X = "https://cdn.jsdelivr.net/npm/@emulatorjs/emulatorjs@4.2.3/data/", b = "https://cdn.jsdelivr.net/npm/@emulatorjs/core-mgba@4.2.3/", Pe = `${X}loader.js`, x = ze, ve = `
:host{display:block;width:100%}
*{box-sizing:border-box}
.retroemu{
  width:100%;
  max-width:760px;
  margin:0 auto;
  overflow:hidden;
  border:1px solid #252a35;
  border-radius:10px;
  background:#090b10;
  box-shadow:0 8px 24px rgba(0,0,0,.22);
}
.screen{
  display:block;
  width:100%;
  height:var(--retroemu-height,360px);
  border:0;
  background:#000;
}
.picker{
  width:100%;
  padding:8px;
  background:#10141c;
}
.search{
  display:block;
  width:100%;
  height:42px;
  margin:0 0 7px;
  padding:0 12px;
  border:1px solid #343b49;
  border-radius:7px;
  outline:0;
  background:#090c12;
  color:#eef1f6;
  font:14px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.search::placeholder{color:#7f8796}
.search:focus-visible{border-color:#8099ed;box-shadow:0 0 0 2px rgba(128,153,237,.24)}
.results{
  max-height:calc(var(--retroemu-height,360px) - 57px);
  min-height:132px;
  overflow:auto;
  overscroll-behavior:contain;
  border:1px solid #282e39;
  border-radius:7px;
  background:#0b0e14;
}
.result{
  display:block;
  width:100%;
  min-height:44px;
  padding:9px 11px;
  border:0;
  border-bottom:1px solid #202530;
  border-radius:0;
  background:transparent;
  color:#e8ebf1;
  font:13px/1.25 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  text-align:left;
  cursor:pointer;
  touch-action:manipulation;
  -webkit-tap-highlight-color:transparent;
}
.result:last-child{border-bottom:0}
.result:hover,.result:focus-visible{outline:0;background:#1b2230}
.result:active{background:#263147}
.no-results{
  display:grid;
  min-height:132px;
  place-items:center;
  padding:16px;
  color:#858d9b;
  font:13px/1.3 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.controller{
  display:flex;
  flex-direction:column;
  gap:8px;
  width:100%;
  min-width:0;
  padding:10px 12px 12px;
  border-top:1px solid #1d222c;
  background:linear-gradient(180deg,#171b24,#0e1118);
  touch-action:none;
  user-select:none;
  -webkit-user-select:none;
}
.shoulders{
  display:flex;
  justify-content:space-between;
  gap:8px;
}
.shoulders .control{
  width:96px;
  min-height:34px;
  border-radius:8px;
  font-size:13px;
  color:#cbd1dc;
}
.main-controls{
  display:grid;
  grid-template-columns:132px minmax(56px,1fr) auto;
  align-items:center;
  gap:8px;
}
.dpad{
  display:grid;
  grid-template-columns:repeat(3,44px);
  grid-template-rows:repeat(3,44px);
}
.dpad [data-index="4"]{grid-column:2;grid-row:1}
.dpad [data-index="6"]{grid-column:1;grid-row:2}
.dpad [data-index="7"]{grid-column:3;grid-row:2}
.dpad [data-index="5"]{grid-column:2;grid-row:3}
.system-buttons{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:6px;
  min-width:0;
}
.action-buttons{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:8px;
}
.control{
  display:grid;
  min-width:44px;
  min-height:44px;
  margin:0;
  padding:0;
  place-items:center;
  border:1px solid #414958;
  color:#f4f6f9;
  background:#262c38;
  font:700 18px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  cursor:pointer;
  touch-action:none;
  -webkit-tap-highlight-color:transparent;
}
.control:focus-visible{outline:2px solid #8ca3ff;outline-offset:2px}
.control[data-pressed="true"]{
  transform:translateY(1px) scale(.96);
  border-color:#7b8aa7;
  background:#4b576e;
}
.dpad .control{border-radius:8px}
.system-buttons .control{
  width:58px;
  border-radius:999px;
  color:#cbd1dc;
  font-size:9px;
  letter-spacing:.04em;
  text-transform:uppercase;
}
.action-buttons .control{
  width:52px;
  height:52px;
  border-color:#7d394f;
  border-radius:50%;
  background:#70263f;
}
.action-buttons .control[data-pressed="true"]{
  border-color:#d56a8d;
  background:#a1395d;
}
@media(max-width:420px){
  .controller{
    grid-template-columns:132px minmax(50px,1fr) 52px;
    gap:5px;
    padding:8px 6px 10px;
  }
  .action-buttons{flex-direction:column;gap:6px}
  .action-buttons .control{width:48px;height:48px}
}
`;
function M(e) {
  return e.normalize("NFKD").toLocaleLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
}
function N(e) {
  return Se + encodeURIComponent(e.file);
}
function ge(e) {
  const n = M(e.trim());
  if (!n) return;
  let a;
  for (const i of x) {
    const o = M(i.name), r = o === n ? 3 : o.includes(n) ? 2 : n.includes(o) ? 1 : 0;
    r && (!a || r > a.rank || r === a.rank && i.name.length < a.game.name.length) && (a = { game: i, rank: r });
  }
  return a == null ? void 0 : a.game;
}
function ye(e) {
  var i, o;
  const n = (i = e.romUrl) == null ? void 0 : i.trim();
  if (n)
    return {
      gameName: ((o = e.gameName) == null ? void 0 : o.trim()) || "Game Boy Advance",
      romUrl: n
    };
  const a = e.gameName ? ge(e.gameName) : void 0;
  return a ? { gameName: a.name, romUrl: N(a) } : void 0;
}
function g(e) {
  return JSON.stringify(e).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function Ee(e) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
html,body,#game{width:100%;height:100%;margin:0;overflow:hidden;background:#000}
*{box-sizing:border-box}
.ejs_virtualGamepad_parent,.ejs_virtualGamepad_top,.ejs_virtualGamepad_left,
.ejs_virtualGamepad_right,.ejs_virtualGamepad_bottom,
[class*="ejs_virtualGamepad"],[class*="virtual-gamepad"]{display:none!important}
</style>
</head>
<body>
<div id="game"></div>
<script>
window.EJS_player = '#game';
window.EJS_core = 'gba';
window.EJS_pathtodata = ${g(X)};
// EJS_paths(=config.filePaths):按文件名把 mGBA 核心重定向到 jsDelivr @emulatorjs/core-mgba,
// 摆脱 cdn.emulatorjs.org failsafe → 全链路 jsDelivr,兼容 AI 宿主白名单。
window.EJS_paths = {
  'mgba.json': ${g(b + "reports/mgba.json")},
  'mgba-legacy-wasm.data': ${g(b + "mgba-legacy-wasm.data")},
  'mgba-wasm.data': ${g(b + "mgba-wasm.data")},
  'mgba-thread-wasm.data': ${g(b + "mgba-thread-wasm.data")},
  'mgba-thread-legacy-wasm.data': ${g(b + "mgba-thread-legacy-wasm.data")}
};
window.EJS_gameUrl = ${g(e.romUrl)};
window.EJS_gameName = ${g(e.gameName)};
window.EJS_startOnLoaded = true;
window.EJS_Buttons = { gamepad: false };

const ovKeys = {
  0: { key: 'x', code: 'KeyX', keyCode: 88 },
  2: { key: 'v', code: 'KeyV', keyCode: 86 },
  3: { key: 'Enter', code: 'Enter', keyCode: 13 },
  4: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
  5: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
  6: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
  7: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
  8: { key: 'z', code: 'KeyZ', keyCode: 90 },
  10: { key: 'a', code: 'KeyA', keyCode: 65 },
  11: { key: 's', code: 'KeyS', keyCode: 83 }
};

function ovKeyboardFallback(index, value) {
  const mapping = ovKeys[index];
  if (!mapping) return;
  const keyboardEvent = new KeyboardEvent(value ? 'keydown' : 'keyup', {
    key: mapping.key,
    code: mapping.code,
    bubbles: true,
    cancelable: true
  });
  try {
    Object.defineProperties(keyboardEvent, {
      keyCode: { get: () => mapping.keyCode },
      which: { get: () => mapping.keyCode }
    });
  } catch (_) {}
  document.dispatchEvent(keyboardEvent);
}

window.addEventListener('message', (event) => {
  const message = event.data;
  if (!message || message.type !== 'ov-input') return;

  const index = Number(message.index);
  const value = message.value ? 1 : 0;
  let handled = false;
  try {
    const functions = window.EJS_emulator &&
      window.EJS_emulator.gameManager &&
      window.EJS_emulator.gameManager.functions;
    if (functions && typeof functions.simulateInput === 'function') {
      functions.simulateInput(0, index, value);
      handled = true;
    }
  } catch (_) {}

  if (!handled) ovKeyboardFallback(index, value);
});
<\/script>
<script src="${Pe}"><\/script>
</body>
</html>`;
}
function k(e, n, a = e) {
  const i = document.createElement("button");
  return i.type = "button", i.className = "control", i.textContent = a, i.dataset.index = String(n), i.dataset.pressed = "false", i.setAttribute("aria-label", e), i;
}
class Ue {
  constructor(n) {
    v(this, "root");
    v(this, "context");
    v(this, "frame", null);
    v(this, "renderAbort", null);
    v(this, "releaseInputs", []);
    v(this, "state", {
      gameName: null,
      romUrl: null
    });
    this.root = n.root, this.context = n, this.render(n.data);
  }
  update(n) {
    this.render(n);
  }
  getState() {
    return { ...this.state };
  }
  destroy() {
    this.teardownRender(), this.root.replaceChildren();
  }
  teardownRender() {
    var n;
    for (const a of this.releaseInputs) a();
    this.releaseInputs = [], (n = this.renderAbort) == null || n.abort(), this.renderAbort = null, this.frame && (this.frame.src = "about:blank", this.frame.removeAttribute("srcdoc"), this.frame = null);
  }
  render(n) {
    this.teardownRender();
    const a = n, i = ye(a), o = Math.round(a.height ?? he), r = new AbortController();
    this.renderAbort = r;
    const f = document.createElement("style");
    f.textContent = ve;
    const t = document.createElement("div");
    if (t.className = "retroemu", t.style.setProperty("--retroemu-height", `${o}px`), i) {
      const l = document.createElement("iframe");
      l.className = "screen", l.title = `${i.gameName} GBA emulator`, l.setAttribute("allow", "autoplay; fullscreen; gamepad"), l.srcdoc = Ee(i), this.frame = l, t.append(l, this.createController(r.signal)), this.state = { gameName: i.gameName, romUrl: i.romUrl };
    } else
      t.appendChild(this.createPicker(o, r.signal)), this.state = { gameName: null, romUrl: null };
    this.root.replaceChildren(f, t);
  }
  createPicker(n, a) {
    const i = document.createElement("div");
    i.className = "picker";
    const o = document.createElement("input");
    o.className = "search", o.type = "search", o.placeholder = "Search games", o.autocomplete = "off", o.spellcheck = !1, o.setAttribute("aria-label", "Search Game Boy Advance games");
    const r = document.createElement("div");
    r.className = "results", r.setAttribute("role", "listbox"), r.setAttribute("aria-label", "Game Boy Advance games");
    const f = (l) => {
      this.context.emit("select", {
        gameName: l.name,
        romUrl: N(l)
      }), this.render({
        gameName: l.name,
        romUrl: N(l),
        height: n
      });
    }, t = () => {
      const l = M(o.value.trim()), A = l ? x.filter((d) => M(d.name).includes(l)).slice(0, j) : x.slice(0, j);
      if (r.replaceChildren(), !A.length) {
        const d = document.createElement("div");
        d.className = "no-results", d.textContent = "No matches", r.appendChild(d);
        return;
      }
      const m = document.createDocumentFragment();
      for (const d of A) {
        const c = document.createElement("button");
        c.type = "button", c.className = "result", c.textContent = d.name, c.setAttribute("role", "option"), c.addEventListener("click", () => f(d), { signal: a }), m.appendChild(c);
      }
      r.appendChild(m);
    };
    return o.addEventListener("input", t, { signal: a }), i.append(o, r), t(), queueMicrotask(() => {
      a.aborted || o.focus({ preventScroll: !0 });
    }), i;
  }
  createController(n) {
    const a = document.createElement("div");
    a.className = "controller", a.setAttribute("aria-label", "Game Boy Advance controls");
    const i = document.createElement("div");
    i.className = "shoulders", i.append(
      k("L", 10),
      k("R", 11)
    );
    const o = document.createElement("div");
    o.className = "dpad", o.append(
      k("Up", 4, "↑"),
      k("Left", 6, "←"),
      k("Right", 7, "→"),
      k("Down", 5, "↓")
    );
    const r = document.createElement("div");
    r.className = "system-buttons", r.append(
      k("Select", 2),
      k("Start", 3)
    );
    const f = document.createElement("div");
    f.className = "action-buttons", f.append(
      k("B", 0),
      k("A", 8)
    );
    const t = document.createElement("div");
    t.className = "main-controls", t.append(o, r, f), a.append(i, t);
    for (const l of a.querySelectorAll(".control"))
      this.bindInput(l, Number(l.dataset.index), n);
    return a;
  }
  bindInput(n, a, i) {
    let o = !1;
    const r = (m) => {
      var d, c;
      o !== !!m && (o = !!m, n.dataset.pressed = String(o), (c = (d = this.frame) == null ? void 0 : d.contentWindow) == null || c.postMessage({ type: "ov-input", index: a, value: m }, "*"));
    }, f = (m) => {
      if (m.preventDefault(), typeof PointerEvent < "u" && m instanceof PointerEvent)
        try {
          n.setPointerCapture(m.pointerId);
        } catch {
        }
      r(1);
    }, t = (m) => {
      m.preventDefault(), r(0);
    }, l = (m) => {
      m.key !== " " && m.key !== "Enter" || (m.preventDefault(), r(1));
    }, A = (m) => {
      m.key !== " " && m.key !== "Enter" || (m.preventDefault(), r(0));
    };
    n.addEventListener("pointerdown", f, { signal: i }), n.addEventListener("pointerup", t, { signal: i }), n.addEventListener("pointerleave", t, { signal: i }), n.addEventListener("pointercancel", t, { signal: i }), n.addEventListener("touchstart", f, { passive: !1, signal: i }), n.addEventListener("touchend", t, { passive: !1, signal: i }), n.addEventListener("touchcancel", t, { passive: !1, signal: i }), n.addEventListener("keydown", l, { signal: i }), n.addEventListener("keyup", A, { signal: i }), n.addEventListener("contextmenu", (m) => m.preventDefault(), { signal: i }), this.releaseInputs.push(() => r(0));
  }
}
function Ce(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return new z({
      code: "schema-invalid",
      plane: "data",
      path: "$",
      expected: "{ romUrl?: string, gameName?: string, height?: number }",
      got: e,
      message_ai: "retroemu data must be an object."
    });
  const n = e;
  return n.romUrl !== void 0 && typeof n.romUrl != "string" ? new z({
    code: "schema-invalid",
    plane: "data",
    path: "$.romUrl",
    expected: "string",
    got: n.romUrl,
    message_ai: "retroemu data.romUrl must be a string."
  }) : n.gameName !== void 0 && typeof n.gameName != "string" ? new z({
    code: "schema-invalid",
    plane: "data",
    path: "$.gameName",
    expected: "string",
    got: n.gameName,
    message_ai: "retroemu data.gameName must be a string."
  }) : n.height !== void 0 && (typeof n.height != "number" || !Number.isFinite(n.height) || n.height <= 0) ? new z({
    code: "schema-invalid",
    plane: "data",
    path: "$.height",
    expected: "positive finite number",
    got: n.height,
    message_ai: "retroemu data.height must be a positive finite number."
  }) : null;
}
const Be = {
  id: "retroemu",
  validateData: Ce,
  create: (e) => new Ue(e)
};
re(Be);
export {
  z as OVError,
  De as listIds,
  Me as mount
};
