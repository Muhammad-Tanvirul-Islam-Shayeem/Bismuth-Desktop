use std::process::Command as StdCommand;

#[derive(serde::Serialize)]
pub struct OsInfo {
    pub version: String,
    pub build: String,
    pub edition: String,
    pub arch: String,
    pub computer_name: String,
}

#[tauri::command]
pub fn get_os_info() -> OsInfo {
    OsInfo {
        version: std::env::var("OS").unwrap_or_else(|_| "Windows".to_string()),
        build: run_ps("[Environment]::OSVersion.Version.Build.ToString()"),
        edition: run_ps("(Get-CimInstance Win32_OperatingSystem).Caption"),
        arch: std::env::consts::ARCH.to_string(),
        computer_name: run_ps("[Environment]::MachineName"),
    }
}

fn run_ps(script: &str) -> String {
    StdCommand::new("powershell.exe")
        .args(["-NoProfile", "-NoLogo", "-NonInteractive", "-Command", script])
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .unwrap_or_default()
        .trim()
        .to_string()
}