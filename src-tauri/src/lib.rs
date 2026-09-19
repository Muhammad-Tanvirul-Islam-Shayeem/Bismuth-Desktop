use tauri::Manager;

mod commands;
mod privilege;
mod system;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            privilege::is_elevated,
            privilege::elevate_self,
            system::get_os_info,
            commands::run_powershell,
            commands::access_registry,
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                app.get_webview_window("main").unwrap().open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Bismuth");
}