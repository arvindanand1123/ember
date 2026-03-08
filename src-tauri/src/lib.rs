pub mod core;
mod endpoints;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            endpoints::pdf::load_pdf,
            endpoints::pdf::get_page_info,
            endpoints::pdf::render_page,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
