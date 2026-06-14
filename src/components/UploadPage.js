import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uploadDataset } from '../api/datasets';
import Navbar from './common/Navbar';
import DropZone from './upload/DropZone';
import Spinner from './common/Spinner';

function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (f) => {
    setFile(f);
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', name.trim() || file.name.replace(/\.[^.]+$/, ''));
    fd.append('description', description.trim());
    fd.append('is_public', isPublic);

    setUploading(true);
    try {
      const res = await uploadDataset(fd);
      toast.success('Upload complete!');
      navigate(`/datasets/${res.data.dataset_id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-300 transition text-sm">
            ← Dashboard
          </button>
          <span className="text-gray-700">/</span>
          <h1 className="text-lg font-bold text-white">Upload Dataset</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Drop zone */}
          <DropZone onFileSelect={handleFileSelect} />

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Dataset Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter dataset name"
              className="w-full px-4 py-2.5 rounded-xl bg-[#18181b] border border-gray-800 text-gray-200 text-sm focus:border-blue-600 outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description <span className="text-gray-600">(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe this dataset..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#18181b] border border-gray-800 text-gray-200 text-sm focus:border-blue-600 outline-none transition resize-none"
            />
          </div>

          {/* Public toggle */}
          <label className="flex items-center justify-between p-4 bg-[#18181b] border border-gray-800 rounded-xl cursor-pointer">
            <div>
              <p className="text-sm text-gray-200 font-medium">Make Public</p>
              <p className="text-xs text-gray-500 mt-0.5">Anyone can view this dataset</p>
            </div>
            <div
              onClick={() => setIsPublic(!isPublic)}
              className={`w-10 h-6 rounded-full transition relative ${isPublic ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isPublic ? 'left-5' : 'left-1'}`} />
            </div>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || !file}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition"
          >
            {uploading ? <><Spinner size="sm" /> Uploading...</> : 'Upload Dataset'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default UploadPage;
