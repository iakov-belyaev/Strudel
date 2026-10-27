// beat2 — "NIGHT SHIFT" · techno in A minor · 132 BPM · 64 bars (~1:56)
//
// Structure (bars):  intro 8 · build 8 · drop 16 · break 8 · drop2 16 · outro 8
// Everything is one `arrange` so the sections stay in sync and the file plays as
// a finished track rather than a loop.
//
// Tweaks worth knowing:
//   setcpm(132/4)       tempo (cycles per minute = BPM/4 in 4/4)
//   .lpq() on the acid  resonance = how "acid" it sounds (8 polite, 16 screaming)
//   swap [8, build] for [4, build] to reach the drop sooner

setcpm(132 / 4)

const DR = "RolandTR909" // drum machine bank

// ────────────────────────────────────────────────────────────── drums ──
// four-on-the-floor kick, small accent on 2 and 4 so it breathes
const kick = s("bd*4").bank(DR).gain("0.95 0.90 0.95 0.86").shape(0.25)

// 16th hats with the accent on the offbeat — the classic techno "tss"
const hats = s("hh*16").bank(DR)
  .gain("[0.28 0.10 0.20 0.10]*4")
  .pan(sine.range(0.38, 0.62).fast(2))
  .room(0.08)

// open hat on every offbeat 8th
const ohat = s("~ oh ~ oh ~ oh ~ oh").bank(DR).gain(0.40).room(0.22)

// clap on 2 and 4, short room so it sits behind the kick
const clap = s("~ cp ~ cp").bank(DR).gain(0.58).room(0.35).delay(0.10)

// syncopated rim, quiet, keeps the 16th grid feeling busy
const rim = s("~ ~ ~ rd ~ ~ rd ~").bank(DR).gain(0.20).pan(0.62).room(0.28)

// euclidean toms for the second drop
const toms = s("ht:3*16").bank(DR).euclid(5, 16).gain(0.28).room(0.18)

// clap roll for the last two bars of a section (mask keeps it in one place)
const roll = s("cp*8").bank(DR).gain("0.30 0.18*7").room(0.3)
  .mask("<0 0 0 0 0 0 1 1>")

// ─────────────────────────────────────────────────────────────── bass ──
// sub sine on the beat for weight
const sub = note("a1*4").s("sine").gain(0.45).shape(0.15)

// rolling 16th bass: the first 16th of each beat is left empty for the kick
const bass = note("[~ a2 a2 a2]*4")
  .s("sawtooth")
  .lpf(340).lpq(7)
  .decay(0.09).sustain(0)
  .shape(0.35)
  .gain(0.72)

// ───────────────────────────────────────────────────────────── hooks ──
// acid line, two alternating bars; its filter sweeps over 8 bars
const acid = note("<[a2 a2 c3 a2 e3 a2 g2 a2] [a2 a2 c3 a2 f3 e3 c3 a2]>")
  .s("sawtooth")
  .lpf(sine.range(420, 2400).slow(8)).lpq(13)
  .decay(0.12).sustain(0)
  .shape(0.45)
  .delay(0.25).delaytime(0.284).delayfeedback(0.32)
  .room(0.18)
  .gain(0.42)

// dub-techno chord stabs on the offbeats (Am7 · Am7 · Fmaj7 · G)
const stab = note("<[a3,c4,e4,g4] [a3,c4,e4,g4] [f3,a3,c4,e4] [g3,b3,d4,f4]>")
  .struct("~ x ~ x ~ x ~ x")
  .s("sawtooth")
  .attack(0.004).decay(0.13).sustain(0)
  .lpf(1700).lpq(5)
  .room(0.6).delay(0.35).delaytime(0.42).delayfeedback(0.4)
  .gain(0.26)

// three-note pluck hook, an octave above the acid, for the final drop
const pluck = note("<[e5 ~ g5 ~ a5 ~ g5 ~] [e5 ~ g5 ~ a5 ~ b5 ~]>")
  .s("triangle")
  .decay(0.09).sustain(0)
  .lpf(3000)
  .delay(0.32).delaytime(0.34).delayfeedback(0.45)
  .room(0.35)
  .gain(0.20)

// pad for the break
const pad = note("<[a3,c4,e4,b4] [f3,a3,c4,e4] [c4,e4,g4,b4] [g3,b3,d4,f4]>")
  .s("sawtooth")
  .attack(1.2).release(2.6)
  .lpf(850).lpq(2)
  .room(0.75)
  .gain(0.15)

// noise risers — one gentle and long, one short and tense
const riserSoft = s("white").hpf(sine.range(280, 3200).slow(8)).gain(0.07).room(0.5)
const riserHard = s("white").hpf(sine.range(600, 7000).slow(4)).gain(0.10).room(0.4)

// ──────────────────────────────────────────────────────── arrangement ──
const intro = stack(
  kick,
  hats,
  rim,
  riserSoft
)

const build = stack(
  kick,
  hats,
  ohat,
  clap,
  bass.lpf(sine.range(260, 620).slow(8)),
  rim,
  riserHard,
  roll
)

const drop1 = stack(
  kick,
  sub,
  bass.lpf(sine.range(320, 900).slow(16)),
  hats,
  ohat,
  clap,
  stab,
  acid
)

const breakdown = stack(
  pad,
  stab.gain(0.42),
  acid.lpf(900).gain(0.16),
  hats.hpf(700).gain("[0.14 0.06 0.10 0.06]*4"),
  rim,
  riserHard.gain(0.08)
)

const drop2 = stack(
  kick,
  sub,
  bass.lpf(sine.range(380, 1100).slow(16)),
  hats,
  ohat,
  clap,
  stab.gain(0.30),
  acid.lpq(15),
  pluck,
  toms,
  rim
)

const outro = stack(
  kick,
  hats,
  bass.lpf(420).gain(0.55),
  rim
)

const track = arrange(
  [8, intro],
  [8, build],
  [16, drop1],
  [8, breakdown],
  [16, drop2],
  [8, outro]
)

track
