import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ISBNScannerProps {
  onScan: (isbn: string) => void;
  onClose: () => void;
}

export const ISBNScanner: React.FC<ISBNScannerProps> = ({ onScan, onClose }) => {
  const { t } = useLanguage();
  const [scanning] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scanning) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: { width: 250, height: 250 },
          fps: 5,
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Extract ISBN from barcode (assuming it's an ISBN-13)
          const isbn = decodedText.replace(/\D/g, '').slice(0, 13);
          onScan(isbn);
          onClose();
        },
        (error) => {
          console.warn(error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [scanning, onScan, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Camera className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-800">{t('scan.instruction')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div id="reader" className="w-full"></div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Placez le code-barres du livre devant la caméra
        </div>
      </motion.div>
    </motion.div>
  );
};