# 🎙️ IsaiCraft Audio Processing & DSP Pipeline

IsaiCraft replaces manual digital audio workstation (DAW) editing with an automated, programmatic audio engineering and neural synthesis pipeline executed in Google Colab.

```
User Vocal Performance (.wav)
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 1. Audio Upload & Librosa Loading                      │
│    • Temporary WAV file handling                       │
│    • Ingestion via librosa.load(sr=sample_rate, mono)  │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 2. Acoustic Cleansing (noisereduce)                    │
│    • Non-stationary spectral gating                    │
│    • prop_decrease = 0.85                              │
│    • Strips ambient room reflections and mic hiss      │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 3. PyWorld Pitch Extraction & Analysis                 │
│    • Fundamental Frequency (F0): DIO algorithm         │
│    • F0 Refinement: StoneMask                          │
│    • Spectral Envelope: CheapTrick                     │
│    • Aperiodicity Ratio: D4C                           │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 4. Humanized Soft-Pitch Correction (55% Retune)        │
│    • Glitch smoothing: scipy.signal.medfilt(kernel=5)  │
│    • MIDI semitone mapping: 69 + 12*log2(f/440.0)      │
│    • Target frequency calculation                      │
│    • Fractional retune: tuned = f + (target - f)*0.55  │
│    • Resynthesis: pyworld.synthesize                   │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 5. Studio Vocal FX Chain (Spotify Pedalboard)          │
│    • HighpassFilter(100Hz)                             │
│    • PeakFilter(300Hz, gain_db=-3.0, q=1.0)            │
│    • HighShelfFilter(7500Hz, gain_db=4.5)              │
│    • Compressor(-22dB, ratio=4.0, 3ms att, 100ms rel)  │
│    • Reverb(room_size=0.25, damping=0.5, wet=0.1)      │
│    • Gain(gain_db=6.0)                                 │
└────────────────────────────────────────────────────────┘
          │
          ├───────────────────────────────────────────────┐
          │ (Processed Vocal Stem)                        │ (Conditioned Mood Prompt)
          ▼                                               ▼
┌────────────────────────────────────┐  ┌────────────────────────────────────┐
│ Peak Normalization: Vocal = 0.90   │  │ Meta MusicGen Small Model          │
└────────────────────────────────────┘  │ • max_new_tokens = 1500            │
          │                             │ • Sampling Rate from model config  │
          │                             │ • Instrumental EQ (Pedalboard):    │
          │                             │   - PeakFilter(2500Hz, -6dB, q=1.0)│
          │                             │   - HighpassFilter(40Hz)           │
          │                             │ • Peak Normalization: Music = 0.35 │
          │                             └────────────────────────────────────┘
          │                                               │
          └───────────────────────┬───────────────────────┘
                                  ▼
┌────────────────────────────────────────────────────────┐
│ 6. Mix Summation & Dynamic Alignment                   │
│    • Array length matching via zero-padding            │
│    • mixed_raw = music_norm + vocal_norm               │
└────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────┐
│ 7. Mastering Compression & Soft-Limiting               │
│    • Master Pedalboard: Compressor(-12dB, ratio=2.5)   │
│    • Post Gain: +1.5dB                                 │
│    • Final Analog Soft-Saturation: np.tanh(...)        │
└────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────┐
│ 8. Multi-Stem Base64 WAV Export                        │
│    • master_track (Final master mix)                   │
│    • vocal_track (Pitch-corrected, processed vocal)    │
│    • music_track (Instrumental backing beat)           │
└────────────────────────────────────────────────────────┘
```

---

## 🎚️ Mathematical Details of Humanized Soft-Pitch Correction

Standard auto-tuning models execute rigid mathematical quantization to the nearest 12-TET semitone:

$$\text{midi\_note} = 69 + 12 \log_2\left(\frac{f}{440}\right)$$

$$\text{snapped\_midi} = \text{round}(\text{midi\_note})$$

$$f_{\text{target}} = 440 \times 2^{\frac{\text{snapped\_midi} - 69}{12}}$$

When vocalists exhibit natural intonation variations, hard quantization creates robotic "stair-stepping" artifacts.

IsaiCraft introduces **Fractional Harmonic Retuning**:

$$f_{\text{tuned}} = f + \left(f_{\text{target}} - f\right) \times \text{retune\_strength}$$

Where $\text{retune\_strength} = 0.55$.

This formula gently draws off-key frequencies 55% toward harmonic resonance, eliminating off-pitch errors while preserving the natural vibrato, timbre, and organic human expression.
