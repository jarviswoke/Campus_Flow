import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function ImageUpload({ image, onImageChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validate = (file) => {
    if (!ALLOWED.includes(file.type)) return 'Please upload a JPEG, PNG, or WebP image.';
    if (file.size > MAX_SIZE) return 'File must be smaller than 5 MB.';
    return null;
  };

  const handleFile = (file) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError(null);
    onImageChange(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleRemove = () => {
    onImageChange(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <Upload className={`w-7 h-7 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
              </div>
              <p className="text-sm font-medium text-slate-700">{isDragging ? 'Drop image here' : 'Drag & drop or click to browse'}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>JPEG, PNG, WebP · max 5 MB</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            className="border-2 border-emerald-200 rounded-xl p-4 bg-emerald-50 relative"
          >
            <button onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-sm font-medium text-slate-900 truncate">{image?.name}</p>
                </div>
                <p className="text-xs text-slate-500">{image && (image.size / 1024).toFixed(1)} KB</p>
                <div className="mt-2 h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.5 }}
                    className="h-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
