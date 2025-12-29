use std::env;
use std::path::PathBuf;
use std::process::Command;

fn main() {
    tauri_build::build();

    // Only compile Swift on macOS
    #[cfg(target_os = "macos")]
    build_swift();
}

#[cfg(target_os = "macos")]
fn build_swift() {
    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let swift_dir = manifest_dir.join("swift");
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());

    // Determine build configuration
    let profile = env::var("PROFILE").unwrap_or_else(|_| "debug".to_string());
    let swift_config = if profile == "release" {
        "release"
    } else {
        "debug"
    };

    println!("cargo:rerun-if-changed=swift/Sources/PDFBridge/PDFBridge.swift");
    println!("cargo:rerun-if-changed=swift/Package.swift");

    // Build Swift package
    println!("cargo:warning=Building Swift PDFBridge library...");

    let status = Command::new("swift")
        .args(["build", "-c", swift_config])
        .current_dir(&swift_dir)
        .status()
        .expect("Failed to execute swift build");

    if !status.success() {
        panic!("Swift build failed");
    }

    // Get the path to the built library
    let swift_build_dir = swift_dir.join(".build").join(swift_config);
    let lib_path = swift_build_dir.join("libPDFBridge.a");

    if !lib_path.exists() {
        panic!(
            "Swift library not found at {:?}. Swift build may have failed.",
            lib_path
        );
    }

    // Copy library to OUT_DIR for linking
    let dest_lib = out_dir.join("libPDFBridge.a");
    std::fs::copy(&lib_path, &dest_lib).expect("Failed to copy Swift library");

    // Tell cargo where to find the library
    println!("cargo:rustc-link-search=native={}", out_dir.display());
    println!("cargo:rustc-link-lib=static=PDFBridge");

    // Link required macOS frameworks
    println!("cargo:rustc-link-lib=framework=Foundation");
    println!("cargo:rustc-link-lib=framework=PDFKit");
    println!("cargo:rustc-link-lib=framework=AppKit");
    println!("cargo:rustc-link-lib=framework=CoreGraphics");
    println!("cargo:rustc-link-lib=framework=CoreFoundation");
    println!("cargo:rustc-link-lib=framework=Quartz");

    // Link Swift standard library
    link_swift_stdlib();

    println!("cargo:warning=Swift PDFBridge library built successfully!");
}

#[cfg(target_os = "macos")]
fn link_swift_stdlib() {
    // Find Swift toolchain library path
    let output = Command::new("xcrun")
        .args(["--toolchain", "default", "--find", "swift"])
        .output()
        .expect("Failed to find swift");

    if output.status.success() {
        let swift_path = String::from_utf8_lossy(&output.stdout).trim().to_string();
        // Go from .../usr/bin/swift to .../usr/lib/swift/macosx
        if let Some(toolchain_dir) = PathBuf::from(&swift_path)
            .parent()
            .and_then(|p| p.parent())
        {
            let swift_lib_dir = toolchain_dir.join("lib").join("swift").join("macosx");
            if swift_lib_dir.exists() {
                println!(
                    "cargo:rustc-link-search=native={}",
                    swift_lib_dir.display()
                );
            }
        }
    }

    // Also add the SDK's Swift lib path
    let sdk_output = Command::new("xcrun")
        .args(["--show-sdk-path"])
        .output()
        .ok();

    if let Some(output) = sdk_output {
        if output.status.success() {
            let sdk_path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            let swift_sdk_lib = format!("{}/usr/lib/swift", sdk_path);
            if PathBuf::from(&swift_sdk_lib).exists() {
                println!("cargo:rustc-link-search=native={}", swift_sdk_lib);
            }
        }
    }

    // Link Swift core libraries dynamically
    // These are needed for Swift runtime support
    println!("cargo:rustc-link-lib=dylib=swiftCore");
    println!("cargo:rustc-link-lib=dylib=swiftFoundation");
    println!("cargo:rustc-link-lib=dylib=swiftCoreFoundation");
    println!("cargo:rustc-link-lib=dylib=swiftDispatch");
    println!("cargo:rustc-link-lib=dylib=swiftCoreGraphics");
    println!("cargo:rustc-link-lib=dylib=swiftObjectiveC");
}
