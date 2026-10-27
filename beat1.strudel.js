setcpm(170 / 4) // Sets tempo to 170 BPM

stack(
  // 1. Classic D&B Kick & Snare Syncopation
  s("bd ~ ~ [~ bd] ~ ~ sd ~")
    .bank("RolandTR909")
    .gain(0.9),

  // 2. Fast 16th-note Hi-Hats with accents
  s("hh*16")
    .bank("RolandTR909")
    .gain(sine.range(0.2, 0.7).fast(4)), // Fluctuates volume for movement

  // 3. Evolving Reese-style Bassline
  note("<c1 f1 ab1 g1>")
    .sound("sawtooth")
    .lpf(sine.range(150, 1200).slow(4)) // Filter sweeps automatically
    .gain(0.85),

  // 4. Arpeggiated Lead Riff
  note("c4 eb4 g4 bb4 c5 bb4 g4 eb4")
    .sound("square")
    .decay(0.15)
    .lpf(2000)
    .gain(0.4)
)