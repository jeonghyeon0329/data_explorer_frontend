import { useRef, useState } from 'react';

const ALLOWED_EXTS = ['.csv', '.xlsx', '.json'];
const MAX_SIZE = 50 * 1024 * 1024;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DropZone({ onFileSelect }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const validate = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      setError(`지원하지 않는 형식입니다. 허용: ${ALLOWED_EXTS.join(', ')}`);
      return false;
    }
    if (f.size > MAX_SIZE) {
      setError('파일 크기는 50MB를 초과할 수 없습니다.');
      return false;
    }
    return true;
  };

  const handleFile = (f) => {
    setError('');
    if (!f) return;
    if (!validate(f)) return;
    setFile(f);
    onFileSelect?.(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
          ${dragging
            ? 'border-blue-500 bg-blue-950/30'
            : 'border-gray-700 hover:border-gray-500 bg-[#1b1b1d]'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.json"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="text-gray-200">
            <p className="font-semibold text-lg">{file.name}</p>
            <p className="text-gray-400 text-sm mt-1">{formatSize(file.size)}</p>
            <p className="text-gray-500 text-xs mt-2">Click to change file</p>
          </div>
        ) : (
          <div className="text-gray-400">
            <p className="text-4xl mb-3">📂</p>
            <p className="font-medium">Drag & drop or click to select</p>
            <p className="text-xs mt-2 text-gray-500">CSV · XLSX · JSON / max 50MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default DropZone;
