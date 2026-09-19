use std::ffi::c_void;
use std::os::windows::ffi::OsStrExt;
use tauri::AppHandle;

use windows::core::PCWSTR;
use windows::Win32::Foundation::{HANDLE, HWND};
use windows::Win32::Security::{GetTokenInformation, TokenElevation, TOKEN_ELEVATION, TOKEN_QUERY};
use windows::Win32::System::Threading::{GetCurrentProcess, OpenProcessToken};
use windows::Win32::UI::Shell::ShellExecuteW;
use windows::Win32::UI::WindowsAndMessaging::SW_SHOWNORMAL;

#[derive(serde::Serialize)]
pub struct ElevationStatus {
    pub is_elevated: bool,
    pub process_arch: String,
}

fn is_token_elevated() -> bool {
    unsafe {
        let mut token = HANDLE::default();
        let process = GetCurrentProcess();
        if OpenProcessToken(process, TOKEN_QUERY, &mut token).is_err() {
            return false;
        }

        let mut elevation = TOKEN_ELEVATION { TokenIsElevated: 0 };
        let mut size = 0u32;
        let status = GetTokenInformation(
            token,
            TokenElevation,
            Some(&mut elevation as *mut _ as *mut c_void),
            std::mem::size_of::<TOKEN_ELEVATION>() as u32,
            &mut size,
        );

        status.is_ok() && elevation.TokenIsElevated != 0
    }
}

#[tauri::command]
pub fn is_elevated() -> ElevationStatus {
    ElevationStatus {
        is_elevated: is_token_elevated(),
        process_arch: std::env::consts::ARCH.to_string(),
    }
}

#[tauri::command]
pub fn elevate_self(_app: AppHandle) -> Result<bool, String> {
    let exe_path = std::env::current_exe()
        .map_err(|e| format!("Failed to resolve executable path: {e}"))?;

    let mut exe_wide: Vec<u16> = exe_path.as_os_str().encode_wide().collect();
    exe_wide.push(0);

    unsafe {
        let result = ShellExecuteW(
            HWND(std::ptr::null_mut()),
            windows::core::w!("runas"),
            PCWSTR(exe_wide.as_ptr()),
            PCWSTR::null(),
            PCWSTR::null(),
            SW_SHOWNORMAL,
        );

        if result.0 as isize > 32 {
            Ok(true)
        } else {
            Err("UAC elevation request was declined or failed".to_string())
        }
    }
}