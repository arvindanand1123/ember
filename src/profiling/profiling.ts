import { invoke } from '@tauri-apps/api/core';

const profilingEnabled = import.meta.env.VITE_PROFILE === '1';

export interface ProfilingData {
  name: string;
  details?: Record<string, unknown>;
}

export interface MemorySnapshot {
  rssBytes: number;
  virtualBytes: number;
}

export interface ProfilingEvent {
  id: number;
  name: string;
  startedAtMs: number;
  endedAtMs: number;
  durationMs: number;
  startMemory: MemorySnapshot | null;
  endMemory: MemorySnapshot | null;
  details: Record<string, unknown>;
}

export interface ProfilingSnapshot {
  sessionId: number;
  events: ProfilingEvent[];
}

interface ProfilingRecorder {
  startTrace: (data: ProfilingData) => Promise<void>;
  endTrace: (data: ProfilingData) => Promise<void>;
}

export function isProfilingEnabled() {
  return profilingEnabled;
}

export function isProfilerView() {
  return new URLSearchParams(window.location.search).get('view') === 'profiler';
}

export async function resetProfilingEvents() {
  if (!profilingEnabled) {
    return;
  }

  await invoke('profiling_reset');
}

export async function getProfilingSnapshot() {
  if (!profilingEnabled) {
    return {
      sessionId: 0,
      events: [],
    } satisfies ProfilingSnapshot;
  }

  return invoke<ProfilingSnapshot>('profiling_get_snapshot');
}

async function startTrace(data: ProfilingData) {
  if (!profilingEnabled) {
    return;
  }

  await invoke('profiling_start_trace', { data });
  console.info('[profile] startTrace', data);
}

async function endTrace(data: ProfilingData) {
  if (!profilingEnabled) {
    return;
  }

  await invoke('profiling_end_trace', { data });
  console.info('[profile] endTrace', data);
}

function scopedRecorder(isActive: () => boolean): ProfilingRecorder {
  return {
    async startTrace(data: ProfilingData) {
      if (!isActive()) {
        return;
      }

      await startTrace(data);
    },

    async endTrace(data: ProfilingData) {
      if (!isActive()) {
        return;
      }

      await endTrace(data);
    },
  };
}

export const profiling: ProfilingRecorder & {
  scoped: (isActive: () => boolean) => ProfilingRecorder;
} = {
  startTrace,
  endTrace,
  scoped: scopedRecorder,
};
