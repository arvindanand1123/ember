import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PdfBackend = 'pdfium' | 'pdfkit';

interface PdfBackendContextType {
  backend: PdfBackend;
  setBackend: (backend: PdfBackend) => void;
  isPdfKitAvailable: boolean;
}

const STORAGE_KEY = 'phorgepdf_backend';

const PdfBackendContext = createContext<PdfBackendContextType | undefined>(undefined);

export function PdfBackendProvider({ children }: { children: ReactNode }) {
  const [backend, setBackendState] = useState<PdfBackend>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pdfkit' || stored === 'pdfium') {
      return stored;
    }
    return 'pdfium';
  });

  const isPdfKitAvailable = navigator.platform.toLowerCase().includes('mac');

  const setBackend = (newBackend: PdfBackend) => {
    setBackendState(newBackend);
    localStorage.setItem(STORAGE_KEY, newBackend);
  };

  useEffect(() => {
    if (backend === 'pdfkit' && !isPdfKitAvailable) {
      setBackend('pdfium');
    }
  }, [backend, isPdfKitAvailable]);

  return (
    <PdfBackendContext.Provider value={{ backend, setBackend, isPdfKitAvailable }}>
      {children}
    </PdfBackendContext.Provider>
  );
}

export function usePdfBackend() {
  const context = useContext(PdfBackendContext);
  if (context === undefined) {
    throw new Error('usePdfBackend must be used within a PdfBackendProvider');
  }
  return context;
}

