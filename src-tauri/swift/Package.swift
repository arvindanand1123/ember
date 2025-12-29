// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "PDFBridge",
    platforms: [
        .macOS(.v12)
    ],
    products: [
        .library(
            name: "PDFBridge",
            type: .static,
            targets: ["PDFBridge"]
        ),
    ],
    targets: [
        .target(
            name: "PDFBridge",
            path: "Sources/PDFBridge",
            publicHeadersPath: "include"
        ),
    ]
)
