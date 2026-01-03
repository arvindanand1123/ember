import Foundation
import PDFKit
import AppKit

public let PDF_SUCCESS: Int32 = 0
public let PDF_ERROR_INVALID_PATH: Int32 = 1
public let PDF_ERROR_LOAD_FAILED: Int32 = 2
public let PDF_ERROR_PAGE_NOT_FOUND: Int32 = 3
public let PDF_ERROR_RENDER_FAILED: Int32 = 4
public let PDF_ERROR_NULL_HANDLE: Int32 = 5

private class DocumentStore {
    static let shared = DocumentStore()
    
    private var documents: [UInt64: PDFDocument] = [:]
    private var nextHandle: UInt64 = 1
    private let lock = NSLock()
    
    func store(_ document: PDFDocument) -> UInt64 {
        lock.lock()
        defer { lock.unlock() }
        
        let handle = nextHandle
        nextHandle += 1
        documents[handle] = document
        return handle
    }
    
    func get(_ handle: UInt64) -> PDFDocument? {
        lock.lock()
        defer { lock.unlock() }
        return documents[handle]
    }
    
    func remove(_ handle: UInt64) {
        lock.lock()
        defer { lock.unlock() }
        documents.removeValue(forKey: handle)
    }
}

private func createString(_ string: String?) -> UnsafeMutablePointer<CChar>? {
    guard let string = string, !string.isEmpty else { return nil }
    return strdup(string)
}

@_cdecl("pdf_open")
public func pdf_open(
    _ path: UnsafePointer<CChar>?,
    _ error_out: UnsafeMutablePointer<Int32>?
) -> UInt64 {
    guard let path = path else {
        error_out?.pointee = PDF_ERROR_INVALID_PATH
        return 0
    }
    
    let pathString = String(cString: path)
    let url = URL(fileURLWithPath: pathString)
    
    guard let document = PDFDocument(url: url) else {
        error_out?.pointee = PDF_ERROR_LOAD_FAILED
        return 0
    }
    
    let handle = DocumentStore.shared.store(document)
    error_out?.pointee = PDF_SUCCESS
    return handle
}

@_cdecl("pdf_close")
public func pdf_close(_ handle: UInt64) {
    DocumentStore.shared.remove(handle)
}

@_cdecl("pdf_page_count")
public func pdf_page_count(_ handle: UInt64) -> UInt16 {
    guard let document = DocumentStore.shared.get(handle) else {
        return 0
    }
    return UInt16(document.pageCount)
}

@_cdecl("pdf_get_title")
public func pdf_get_title(_ handle: UInt64) -> UnsafeMutablePointer<CChar>? {
    guard let document = DocumentStore.shared.get(handle),
          let attrs = document.documentAttributes else {
        return nil
    }
    return createString(attrs[PDFDocumentAttribute.titleAttribute] as? String)
}

@_cdecl("pdf_get_author")
public func pdf_get_author(_ handle: UInt64) -> UnsafeMutablePointer<CChar>? {
    guard let document = DocumentStore.shared.get(handle),
          let attrs = document.documentAttributes else {
        return nil
    }
    return createString(attrs[PDFDocumentAttribute.authorAttribute] as? String)
}

@_cdecl("pdf_get_page_width")
public func pdf_get_page_width(_ handle: UInt64, _ pageIndex: UInt16) -> Float {
    guard let document = DocumentStore.shared.get(handle),
          let page = document.page(at: Int(pageIndex)) else {
        return 0
    }
    return Float(page.bounds(for: .mediaBox).width)
}

@_cdecl("pdf_get_page_height")
public func pdf_get_page_height(_ handle: UInt64, _ pageIndex: UInt16) -> Float {
    guard let document = DocumentStore.shared.get(handle),
          let page = document.page(at: Int(pageIndex)) else {
        return 0
    }
    return Float(page.bounds(for: .mediaBox).height)
}

@_cdecl("pdf_render_page")
public func pdf_render_page(
    _ handle: UInt64,
    _ pageIndex: UInt16,
    _ scale: Float,
    _ length_out: UnsafeMutablePointer<UInt32>?,
    _ error_out: UnsafeMutablePointer<Int32>?
) -> UnsafeMutablePointer<UInt8>? {
    length_out?.pointee = 0
    
    guard let document = DocumentStore.shared.get(handle) else {
        error_out?.pointee = PDF_ERROR_NULL_HANDLE
        return nil
    }
    
    guard let page = document.page(at: Int(pageIndex)) else {
        error_out?.pointee = PDF_ERROR_PAGE_NOT_FOUND
        return nil
    }
    
    let retinaScale: CGFloat = 2.0
    let effectiveScale = CGFloat(scale) * retinaScale
    let bounds = page.bounds(for: .mediaBox)
    let scaledWidth = bounds.width * effectiveScale
    let scaledHeight = bounds.height * effectiveScale
    
    let colorSpace = CGColorSpace(name: CGColorSpace.sRGB) ?? CGColorSpaceCreateDeviceRGB()
    
    let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
    
    guard let context = CGContext(
        data: nil,
        width: Int(scaledWidth),
        height: Int(scaledHeight),
        bitsPerComponent: 8,
        bytesPerRow: 0,
        space: colorSpace,
        bitmapInfo: bitmapInfo.rawValue
    ) else {
        error_out?.pointee = PDF_ERROR_RENDER_FAILED
        return nil
    }
    
    context.setAllowsAntialiasing(true)
    context.setShouldAntialias(true)
    context.interpolationQuality = .high
    context.setShouldSmoothFonts(true)
    context.setAllowsFontSmoothing(true)
    context.setAllowsFontSubpixelPositioning(true)
    context.setShouldSubpixelPositionFonts(true)
    context.setAllowsFontSubpixelQuantization(true)
    context.setShouldSubpixelQuantizeFonts(true)
    
    context.setFillColor(CGColor.white)
    context.fill(CGRect(x: 0, y: 0, width: scaledWidth, height: scaledHeight))
    
    context.scaleBy(x: effectiveScale, y: effectiveScale)
    
    if let pageRef = page.pageRef {
        context.drawPDFPage(pageRef)
    }
    
    guard let cgImage = context.makeImage() else {
        error_out?.pointee = PDF_ERROR_RENDER_FAILED
        return nil
    }
    
    let bitmapRep = NSBitmapImageRep(cgImage: cgImage)
    bitmapRep.size = NSSize(width: bounds.width * CGFloat(scale), height: bounds.height * CGFloat(scale))
    
    guard let pngData = bitmapRep.representation(using: .png, properties: [
        .interlaced: false
    ]) else {
        error_out?.pointee = PDF_ERROR_RENDER_FAILED
        return nil
    }
    
    let length = pngData.count
    let buffer = UnsafeMutablePointer<UInt8>.allocate(capacity: length)
    pngData.copyBytes(to: buffer, count: length)
    
    length_out?.pointee = UInt32(length)
    error_out?.pointee = PDF_SUCCESS
    
    return buffer
}

@_cdecl("pdf_free_image")
public func pdf_free_image(_ data: UnsafeMutablePointer<UInt8>?) {
    data?.deallocate()
}

@_cdecl("pdf_free_string")
public func pdf_free_string(_ str: UnsafeMutablePointer<CChar>?) {
    free(str)
}
