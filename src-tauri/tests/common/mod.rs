use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct TempDir {
    path: PathBuf,
}

impl TempDir {
    pub fn new(name: &str) -> Self {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("time should move forward")
            .as_nanos();

        let path = std::env::temp_dir()
            .join(format!("ember-{name}-{timestamp}-{}", std::process::id()));

        Self { path }
    }

    pub fn join(&self, name: &str) -> PathBuf {
        self.path.join(name)
    }
}

impl Drop for TempDir {
    fn drop(&mut self) {
        if self.path.exists() {
            let _ = fs::remove_dir_all(&self.path);
        }
    }
}
