use std::process::Command as StdCommand;
use tauri::command;

#[derive(serde::Serialize)]
pub struct PowerShellResult {
    pub stdout: String,
    pub stderr: String,
    pub success: bool,
}

#[command]
pub fn run_powershell(command: String, elevated: bool) -> PowerShellResult {
    let ps_exe = if elevated {
        "powershell.exe"
    } else {
        "powershell.exe"
    };

    let mut cmd = StdCommand::new(ps_exe);
    cmd.args(["-NoProfile", "-NoLogo", "-NonInteractive", "-Command", &command]);

    if elevated {
        cmd.args(["-ExecutionPolicy", "Bypass"]);
    }

    match cmd.output() {
        Ok(output) => PowerShellResult {
            stdout: String::from_utf8_lossy(&output.stdout).to_string(),
            stderr: String::from_utf8_lossy(&output.stderr).to_string(),
            success: output.status.success(),
        },
        Err(e) => PowerShellResult {
            stdout: String::new(),
            stderr: format!("Failed to spawn PowerShell: {e}"),
            success: false,
        },
    }
}

#[derive(serde::Deserialize)]
pub struct RegistryAccess {
    pub hive: String,
    pub path: String,
    pub name: Option<String>,
    pub value: Option<String>,
    pub kind: Option<String>,
    pub action: String,
}

#[derive(serde::Serialize)]
pub struct RegistryResult {
    pub success: bool,
    pub value: Option<String>,
    pub error: Option<String>,
}

#[command]
pub fn access_registry(params: RegistryAccess) -> RegistryResult {
    let full_path = format!("{}\\{}", params.hive, params.path);

    let ps_script = match params.action.as_str() {
        "read" => {
            let name = params.name.unwrap_or_default();
            format!(
                "Get-ItemProperty -Path '{}' -Name '{}' -ErrorAction Stop | Select-Object -ExpandProperty '{}'",
                full_path, name, name
            )
        }
        "write" => {
            let name = params.name.unwrap_or_default();
            let value = params.value.unwrap_or_default();
            let kind = params.kind.unwrap_or_else(|| "String".to_string());
            format!(
                "Set-ItemProperty -Path '{}' -Name '{}' -Value '{}' -Type '{}' -Force",
                full_path, name, value, kind
            )
        }
        "delete" => {
            let name = params.name.unwrap_or_default();
            format!(
                "Remove-ItemProperty -Path '{}' -Name '{}' -ErrorAction Stop",
                full_path, name
            )
        }
        _ => return RegistryResult {
            success: false,
            value: None,
            error: Some(format!("Unknown action: {}", params.action)),
        },
    };

    match StdCommand::new("powershell.exe")
        .args(["-NoProfile", "-NoLogo", "-NonInteractive", "-Command", &ps_script])
        .output()
    {
        Ok(output) => {
            if output.status.success() {
                RegistryResult {
                    success: true,
                    value: Some(String::from_utf8_lossy(&output.stdout).trim().to_string()),
                    error: None,
                }
            } else {
                RegistryResult {
                    success: false,
                    value: None,
                    error: Some(String::from_utf8_lossy(&output.stderr).trim().to_string()),
                }
            }
        }
        Err(e) => RegistryResult {
            success: false,
            value: None,
            error: Some(format!("Failed to execute command: {e}")),
        },
    }
}