"use client";

/**
 * Procedural monsoon audio.
 *
 * Recorded loops always eventually reveal themselves. Filtered noise
 * never does. Three noise layers approximate the body of the rain:
 *
 *  - a low "wash" (rain on distant roofs and roads)
 *  - a mid "patter" whose filter slowly wanders (rain nearby)
 *  - a soft high "hiss" (rain on leaves)
 *
 * A slow LFO drifts the intensity so the storm breathes — sometimes
 * softer, sometimes heavier — and thunder rolls in at random from
 * far away using a burst of heavily lowpassed noise.
 */
class RainEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private running = false;
  private thunderTimer: ReturnType<typeof setTimeout> | null = null;
  /** external systems (lightning flash) can listen for thunder */
  onThunder: ((intensity: number) => void) | null = null;

  private makeNoiseBuffer(ctx: AudioContext, seconds = 4) {
    const buffer = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private noiseLayer(
    ctx: AudioContext,
    out: AudioNode,
    type: BiquadFilterType,
    freq: number,
    q: number,
    gain: number
  ) {
    const src = ctx.createBufferSource();
    src.buffer = this.makeNoiseBuffer(ctx);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filter).connect(g).connect(out);
    src.start();
    return { filter, gain: g };
  }

  start() {
    if (this.running) {
      this.ctx?.resume();
      this.fadeTo(1);
      if (!this.thunderTimer) this.scheduleThunder();
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    // the body of the rain
    this.noiseLayer(ctx, master, "lowpass", 420, 0.4, 0.5);
    const patter = this.noiseLayer(ctx, master, "bandpass", 1600, 0.6, 0.32);
    this.noiseLayer(ctx, master, "highpass", 5200, 0.5, 0.05);

    // the storm breathes: two slow LFOs drift the patter filter
    const lfo1 = ctx.createOscillator();
    lfo1.frequency.value = 0.017;
    const lfo1Gain = ctx.createGain();
    lfo1Gain.gain.value = 500;
    lfo1.connect(lfo1Gain).connect(patter.filter.frequency);
    lfo1.start();

    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.043;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 0.09;
    lfo2.connect(lfo2Gain).connect(patter.gain.gain);
    lfo2.start();

    this.running = true;
    this.fadeTo(1, 5);
    this.scheduleThunder();
  }

  private fadeTo(level: number, seconds = 2.5) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(level * 0.55, now + seconds);
  }

  private scheduleThunder() {
    const delay = 14000 + Math.random() * 40000;
    this.thunderTimer = setTimeout(() => {
      this.rollThunder();
      this.scheduleThunder();
    }, delay);
  }

  private rollThunder() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const intensity = 0.3 + Math.random() * 0.7;
    this.onThunder?.(intensity);

    const src = ctx.createBufferSource();
    src.buffer = this.makeNoiseBuffer(ctx, 6);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 90 + intensity * 110;
    filter.Q.value = 0.9;
    const g = ctx.createGain();
    const now = ctx.currentTime;
    const dur = 3.5 + intensity * 3;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(intensity * 0.5, now + 0.4 + Math.random() * 0.8);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(filter).connect(g).connect(this.master);
    src.start();
    src.stop(now + dur + 0.5);
  }

  stop() {
    this.fadeTo(0, 1.5);
    if (this.thunderTimer) {
      clearTimeout(this.thunderTimer);
      this.thunderTimer = null;
    }
    // keep the context alive so resuming is instant
    setTimeout(() => {
      if (this.master && this.master.gain.value < 0.01) this.ctx?.suspend();
    }, 2000);
  }
}

export const rainAudio = new RainEngine();
