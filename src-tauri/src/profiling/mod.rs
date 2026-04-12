use std::{
    collections::HashMap,
    sync::atomic::{AtomicU64, Ordering},
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use sysinfo::{get_current_pid, ProcessesToUpdate, System};
use tauri::{Manager, State, WebviewUrl, WebviewWindowBuilder};

const MAX_PROFILING_EVENTS: usize = 512;
static TRACE_INSTANCE_COUNTER: AtomicU64 = AtomicU64::new(1);

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfilingData {
    pub name: String,
    pub details: Option<Value>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MemorySnapshot {
    rss_bytes: u64,
    virtual_bytes: u64,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfilingEvent {
    id: u64,
    name: String,
    started_at_ms: u64,
    ended_at_ms: u64,
    duration_ms: u64,
    start_memory: Option<MemorySnapshot>,
    end_memory: Option<MemorySnapshot>,
    details: Value,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfilingSnapshot {
    session_id: u64,
    events: Vec<ProfilingEvent>,
}

#[derive(Clone)]
struct ActiveTrace {
    name: String,
    started_at_ms: u64,
    start_memory: Option<MemorySnapshot>,
    details: Option<Value>,
}

struct ProfilingStoreState {
    next_event_id: u64,
    session_id: u64,
    active_traces: HashMap<String, ActiveTrace>,
    events: Vec<ProfilingEvent>,
}

impl Default for ProfilingStoreState {
    fn default() -> Self {
        Self {
            next_event_id: 1,
            session_id: 1,
            active_traces: HashMap::new(),
            events: Vec::new(),
        }
    }
}

#[derive(Default)]
pub struct ProfilingStore {
    inner: Mutex<ProfilingStoreState>,
}

impl ProfilingStore {
    pub fn start_trace(&self, data: ProfilingData) {
        let mut inner = self.inner.lock().expect("profiling store poisoned");
        inner.active_traces.insert(
            data.name.clone(),
            ActiveTrace {
                name: data.name,
                started_at_ms: profiling_timestamp_ms(),
                start_memory: current_process_memory(),
                details: data.details,
            },
        );
    }

    pub fn end_trace(&self, data: ProfilingData) {
        let mut inner = self.inner.lock().expect("profiling store poisoned");
        let Some(active_trace) = inner.active_traces.remove(&data.name) else {
            return;
        };
        let ended_at_ms = profiling_timestamp_ms();

        let mut details = Map::new();
        if let Some(start_details) = active_trace.details {
            details.insert("start".into(), start_details);
        }
        if let Some(end_details) = data.details {
            details.insert("end".into(), end_details);
        }

        let event = ProfilingEvent {
            id: inner.next_event_id,
            name: active_trace.name,
            started_at_ms: active_trace.started_at_ms,
            ended_at_ms,
            duration_ms: ended_at_ms.saturating_sub(active_trace.started_at_ms),
            start_memory: active_trace.start_memory,
            end_memory: current_process_memory(),
            details: Value::Object(details),
        };

        inner.next_event_id += 1;
        inner.events.insert(0, event);

        if inner.events.len() > MAX_PROFILING_EVENTS {
            inner.events.truncate(MAX_PROFILING_EVENTS);
        }
    }

    pub fn reset(&self) {
        let mut inner = self.inner.lock().expect("profiling store poisoned");
        inner.session_id += 1;
        inner.active_traces.clear();
        inner.events.clear();
    }

    pub fn snapshot(&self) -> ProfilingSnapshot {
        let inner = self.inner.lock().expect("profiling store poisoned");

        ProfilingSnapshot {
            session_id: inner.session_id,
            events: inner.events.clone(),
        }
    }
}

fn current_process_memory() -> Option<MemorySnapshot> {
    let pid = get_current_pid().ok()?;
    let mut system = System::new();
    system.refresh_processes(ProcessesToUpdate::Some(&[pid]), true);
    let process = system.process(pid)?;

    Some(MemorySnapshot {
        rss_bytes: process.memory(),
        virtual_bytes: process.virtual_memory(),
    })
}

fn profiling_enabled() -> bool {
    std::env::var("VITE_PROFILE")
        .map(|value| value == "1")
        .unwrap_or(false)
}

pub fn ensure_profiling_enabled() -> Result<(), String> {
    if !profiling_enabled() {
        return Err("Profiling is not enabled".to_string());
    }
    Ok(())
}

fn profiling_timestamp_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}

pub fn next_trace_name(prefix: &str) -> String {
    let instance_id = TRACE_INSTANCE_COUNTER.fetch_add(1, Ordering::Relaxed);
    format!("{prefix}#{instance_id}")
}

pub fn start_internal_trace(
    profiling_store: &ProfilingStore,
    data: ProfilingData,
) -> Result<(), String> {
    if !profiling_enabled() {
        return Ok(());
    }

    profiling_store.start_trace(data);
    Ok(())
}

pub fn end_internal_trace(
    profiling_store: &ProfilingStore,
    data: ProfilingData,
) -> Result<(), String> {
    if !profiling_enabled() {
        return Ok(());
    }

    profiling_store.end_trace(data);
    Ok(())
}

pub fn ensure_profiler_window(app: &tauri::AppHandle) -> Result<(), String> {
    if !profiling_enabled() {
        return Ok(());
    }

    if let Some(window) = app.get_webview_window("profiler") {
        let _ = window.show();
        let _ = window.set_focus();
        return Ok(());
    }

    WebviewWindowBuilder::new(
        app,
        "profiler",
        WebviewUrl::App("index.html?view=profiler".into()),
    )
    .title("Ember Profiler")
    .inner_size(520.0, 760.0)
    .build()
    .map(|_| ())
    .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn profiling_start_trace(
    profiling_store: State<'_, ProfilingStore>,
    data: ProfilingData,
) -> Result<(), String> {
    ensure_profiling_enabled()?;
    profiling_store.start_trace(data);
    Ok(())
}

#[tauri::command]
pub fn profiling_end_trace(
    profiling_store: State<'_, ProfilingStore>,
    data: ProfilingData,
) -> Result<(), String> {
    ensure_profiling_enabled()?;
    profiling_store.end_trace(data);
    Ok(())
}

#[tauri::command]
pub fn profiling_reset(profiling_store: State<'_, ProfilingStore>) -> Result<(), String> {
    ensure_profiling_enabled()?;
    profiling_store.reset();
    Ok(())
}

#[tauri::command]
pub fn profiling_get_snapshot(
    profiling_store: State<'_, ProfilingStore>,
) -> Result<ProfilingSnapshot, String> {
    ensure_profiling_enabled()?;
    Ok(profiling_store.snapshot())
}
