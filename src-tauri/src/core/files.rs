use std::fs;
use std::io;
use std::path::{Path, PathBuf};

fn ensure_pdf_extension(path: PathBuf) -> PathBuf {
    if path.extension().is_some() {
        path
    } else {
        path.with_extension("pdf")
    }
}

pub fn save_pdf(source_path: &str, target_path: &str) -> Result<String, io::Error> {
    let source = Path::new(source_path);
    let target = ensure_pdf_extension(PathBuf::from(target_path));

    if !source.exists() {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            format!("Source PDF not found: {source_path}"),
        ));
    }

    if source != target {
        if let Some(parent) = target.parent() {
            fs::create_dir_all(parent)?;
        }
        fs::copy(source, &target)?;
    }

    Ok(target.to_string_lossy().into_owned())
}
