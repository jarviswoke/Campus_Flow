import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, Calendar, Copy, Check, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, complaintId, onViewStatus }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-7"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1, duration: 0.5 }}
            className="flex justify-center mb-5"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-11 h-11 text-emerald-600" />
            </div>
          </motion.div>

          {/* Text */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Complaint Registered!</h3>
            <p className="text-slate-500 text-sm">Your complaint has been submitted and is under review.</p>
          </div>

          {/* ID card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Complaint ID</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-700 font-mono text-base">{complaintId}</span>
                <button
                  onClick={handleCopy}
                  className="w-7 h-7 rounded-lg hover:bg-blue-100 flex items-center justify-center transition-colors"
                  title="Copy ID"
                >
                  {copied
                    ? <Check className="w-3.5 h-3.5 text-emerald-600" />
                    : <Copy className="w-3.5 h-3.5 text-blue-500" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-blue-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Submitted On</span>
              </div>
              <span className="text-sm text-slate-700">{currentDate}</span>
            </div>
          </div>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Note:</span> You'll receive updates via email. Expected response: 24–48 hours.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Register Another
            </button>
            <button
              onClick={onViewStatus || onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              View Status
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
