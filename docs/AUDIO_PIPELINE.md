# 🎙️ IsaiCraft Audio Processing & DSP Pipeline

IsaiCraft replaces manual digital audio workstation (DAW) tasks with an automated, programmatic audio engineering pipeline.

```
Raw Vocal Performance (.wav)
          │
          ▼
┌────────────────────────────────────────┐
│ 1. Acoustic Cleansing                  │
│    • noisereduce (Non-Stationary Noise)│
│    • Strip hardware static & ambient rm│
└────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────┐
│ 2. PyWorld Fundamental Frequency (F0)  │
│    • DIO (Distributed Info One-Step)   │
│    • StoneMask refinement              │
│    • CheapTrick (Spectral Envelope)    │
│    • D4C (Aperiodicity Extraction)     │
└────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────┐
│ 3. Humanized Soft-Pitch Correction     │
│    • SciPy Median Filter smoothing     │
│    • Nearest chromatic MIDI note target│
│    • Fractional retune (0.55 strength) │
│    • PyWorld Synthesizer resynthesis   │
└────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────┐
│ 4. Studio Vocal FX Chain (Pedalboard)  │
│    • HighpassFilter (100Hz)            │
│    • PeakFilter (300Hz boxiness carve) │
│    • HighShelfFilter (7.5kHz sheen)    │
│    • Compressor (4:1, -22dB threshold) │
│    • Studio Reverb (0.25 room size)    │
└────────────────────────────────────────┘
          │
          ├─────────────────────────────────────────┐
          │                                         │
          ▼ (Mastered Vocal Stem)                   ▼ (Conditioned Mood Prompt)
┌────────────────────────────────────────┐  ┌────────────────────────────────────────┐
│ Target Peak Normalization: 0.90        │  │ Meta MusicGen Small Backing Track      │
└────────────────────────────────────────┘  │ Instrumental EQ: HPF 40Hz, Notch 2.5kHz│
          │                                 │ Target Peak Normalization: 0.35        │
          │                                 └────────────────────────────────────────┘
          │                                                     │
          └────────────────────┬────────────────────────────────┘
                               ▼
┌────────────────────────────────────────────────────────────┐
│ 5. Dynamic Mixbus Summation & Soft-Limiting                │
│    • Array Alignment & Length Matching                     │
│    • Summation: norm_beat + norm_vocal                     │
│    • Analog Saturation / Soft-Limiting via np.tanh(sum * 1.1)│
└────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────┐
│ 6. Multi-Stem Base64 Encoding & Return                     │
│    • Master Mix Track                                      │
│    • Vocal Stem                                            │
│    • Instrumental Beat Stem                                │
└────────────────────────────────────────────────────────────┘
```

---

## 🎚️ Mathematical Details of Humanized Pitch Correction

Traditional autotuning models execute absolute quantization:
$$F_{\text{target}} = 440 \times 2^{\frac{\text{round}(\text{MIDI}) - 69}{12}}$$

When a singer's pitch fluctuates, rigid autotune causes the robotic "hard-snap" artifact. 

IsaiCraft implements **Fractional Harmonic Correction**:
$$F_{\text{corrected}} = F_{\text{current}} + \alpha \times \left(F_{\text{target}} - F_{\text{current}}\right)$$

Where $\alpha = 0.55$ (the `retune_strength`).

This formula gently draws off-key frequencies 55% toward the nearest harmonic pitch center, correcting off-key notes while preserving the singer's natural micro-intonation, vocal timbre, and organic vibrato.
