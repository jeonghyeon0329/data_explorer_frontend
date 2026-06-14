import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listDatasets, deleteDataset } from '../api/datasets';
import Navbar from './common/Navbar';
import Badge from './common/Badge';
import Modal from './common/Modal';
import Spinner from './common/Spinner';

function DatasetCard({ dataset, onDelete, onNavigate }) {
  const [delOpen, setDelOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDataset(dataset.id);
      toast.success('Dataset deleted');
      onDelete();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setDelOpen(false);
    }
  };

  return (
    <>
      <div
        className="bg-[#18181b] border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-600 transition cursor-pointer group"
        onClick={() => onNavigate(`/datasets/${dataset.id}`)}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-blue-300 transition">
            {dataset.name}
          </h3>
          <Badge type={dataset.file_type} />
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{dataset.row_count?.toLocaleString()} rows</span>
          <span>·</span>
          <span>{dataset.column_count} cols</span>
          <span>·</span>
          <Badge
            type={dataset.is_public ? 'public' : 'private'}
            label={dataset.is_public ? 'Public' : 'Private'}
          />
        </div>

        <p className="text-xs text-gray-600">
          {dataset.created_at ? new Date(dataset.created_at).toLocaleDateString() : ''}
        </p>

        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
          <button
            className="flex-1 py-1.5 text-xs rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 transition"
            onClick={() => onNavigate(`/datasets/${dataset.id}/visualize`)}
          >
            Charts
          </button>
          <button
            className="py-1.5 px-3 text-xs rounded-lg text-red-400 hover:bg-red-950 transition"
            onClick={() => setDelOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <Modal
        isOpen={delOpen}
        title="Delete Dataset"
        message={`Delete "${dataset.name}"? This cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        danger
        onConfirm={handleDelete}
        onCancel={() => setDelOpen(false)}
      />
    </>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [mineOnly, setMineOnly] = useState(true);
  const PAGE_SIZE = 20;

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listDatasets({ page, size: PAGE_SIZE, mine: mineOnly, ...(q ? { q } : {}) });
      setDatasets(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Failed to load datasets');
    } finally {
      setLoading(false);
    }
  }, [page, q, mineOnly]);

  useEffect(() => { fetchDatasets(); }, [fetchDatasets]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQ(search);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">My Datasets</h1>
            <p className="text-gray-500 text-sm mt-0.5">{total.toLocaleString()} dataset{total !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => navigate('/datasets/upload')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
          >
            + Upload New
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="flex-1 max-w-xs px-4 py-2 rounded-lg bg-[#18181b] border border-gray-800 text-sm text-gray-200 focus:border-blue-600 outline-none transition"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 text-sm transition">
              Search
            </button>
            {q && (
              <button type="button" onClick={() => { setQ(''); setSearch(''); setPage(1); }}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition">
                Clear
              </button>
            )}
          </form>

          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
            <div
              onClick={() => { setMineOnly(!mineOnly); setPage(1); }}
              className={`w-9 h-5 rounded-full transition relative ${mineOnly ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${mineOnly ? 'left-4' : 'left-0.5'}`} />
            </div>
            Mine only
          </label>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>
        ) : datasets.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No datasets found</p>
            <p className="text-sm mt-1">Upload your first dataset to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {datasets.map((ds) => (
              <DatasetCard
                key={ds.id}
                dataset={ds}
                onDelete={fetchDatasets}
                onNavigate={navigate}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center gap-2 mt-8">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition">
              ← Prev
            </button>
            <span className="px-4 py-2 text-gray-400 text-sm">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition">
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
