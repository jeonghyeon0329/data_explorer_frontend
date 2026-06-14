import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDataset, previewDataset, updateDataset } from '../api/datasets';
import Navbar from './common/Navbar';
import Badge from './common/Badge';
import DataTable from './common/DataTable';
import Spinner from './common/Spinner';

const OPS = ['eq', 'ne', 'contains', 'gt', 'lt', 'gte', 'lte'];

function DatasetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('preview');  // 'preview' | 'columns'

  /* preview state */
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [tableLoading, setTableLoading] = useState(false);
  const PAGE_SIZE = 50;

  /* filter state */
  const [filterCol, setFilterCol] = useState('');
  const [filterOp, setFilterOp] = useState('eq');
  const [filterVal, setFilterVal] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  /* edit name inline */
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');


  useEffect(() => {
    getDataset(id)
      .then((res) => { setDataset(res.data); setEditName(res.data.name); })
      .catch(() => toast.error('Dataset not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchPreview = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = { page, size: PAGE_SIZE };
      if (sortBy) { params.sort_by = sortBy; params.sort_dir = sortDir; }
      if (activeFilter) params.filter = JSON.stringify([activeFilter]);
      const res = await previewDataset(id, params);
      setColumns(res.data.columns || []);
      setRows(res.data.rows || []);
      setTotalRows(res.data.total_rows || 0);
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to load preview';
      toast.error(msg);
    } finally {
      setTableLoading(false);
    }
  }, [id, page, sortBy, sortDir, activeFilter]);

  useEffect(() => { if (tab === 'preview') fetchPreview(); }, [tab, fetchPreview]);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
    setPage(1);
  };

  const applyFilter = () => {
    if (!filterCol || !filterVal) { toast.error('Select a column and enter a value'); return; }
    setActiveFilter({ col: filterCol, op: filterOp, val: filterVal });
    setPage(1);
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setFilterCol('');
    setFilterVal('');
    setPage(1);
  };

  const saveName = async () => {
    if (!editName.trim()) return;
    try {
      await updateDataset(id, { name: editName.trim() });
      setDataset((d) => ({ ...d, name: editName.trim() }));
      setEditing(false);
      toast.success('Name updated');
    } catch { toast.error('Failed to update name'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center"><Spinner size="lg" /></div>
    </div>
  );

  if (!dataset) return null;

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/dashboard')} className="hover:text-gray-300 transition">Dashboard</button>
          <span>/</span>
          <span className="text-gray-300">{dataset.name}</span>
        </div>

        {/* Header card */}
        <div className="bg-[#18181b] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(false); }}
                    className="text-xl font-bold bg-transparent border-b border-blue-500 text-white outline-none flex-1"
                    autoFocus
                  />
                  <button onClick={saveName} className="text-sm text-blue-400 hover:text-blue-300">Save</button>
                  <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-300">Cancel</button>
                </div>
              ) : (
                <h1
                  className="text-xl font-bold text-white cursor-pointer hover:text-gray-300 transition"
                  onClick={() => setEditing(true)}
                  title="Click to edit name"
                >
                  {dataset.name}
                </h1>
              )}
              {dataset.description && (
                <p className="text-gray-400 text-sm mt-1">{dataset.description}</p>
              )}
            </div>
            <button
              onClick={() => navigate(`/datasets/${id}/visualize`)}
              className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
            >
              Charts →
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <Badge type={dataset.file_type} />
            <Badge type={dataset.is_public ? 'public' : 'private'} label={dataset.is_public ? 'Public' : 'Private'} />
            <span className="text-xs text-gray-500">{dataset.row_count?.toLocaleString()} rows</span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-500">{dataset.column_count} columns</span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-500">{dataset.original_filename}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-800">
          {['preview', 'columns'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium transition capitalize border-b-2 -mb-px ${
                tab === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Preview tab */}
        {tab === 'preview' && (
          <div className="flex flex-col gap-4">
            {/* Filter bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filterCol}
                onChange={(e) => setFilterCol(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#18181b] border border-gray-800 text-sm text-gray-300 outline-none"
              >
                <option value="">Column...</option>
                {columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterOp}
                onChange={(e) => setFilterOp(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#18181b] border border-gray-800 text-sm text-gray-300 outline-none"
              >
                {OPS.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
              <input
                value={filterVal}
                onChange={(e) => setFilterVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                placeholder="Value..."
                className="px-3 py-2 rounded-lg bg-[#18181b] border border-gray-800 text-sm text-gray-300 outline-none w-36"
              />
              <button onClick={applyFilter}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition">
                Apply
              </button>
              {activeFilter && (
                <button onClick={clearFilter}
                  className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-700 transition">
                  Clear
                </button>
              )}
              {activeFilter && (
                <span className="text-xs text-blue-400 bg-blue-950 px-2 py-1 rounded-lg">
                  {activeFilter.col} {activeFilter.op} "{activeFilter.val}"
                </span>
              )}
            </div>

            <DataTable
              columns={columns}
              rows={rows}
              loading={tableLoading}
              totalRows={totalRows}
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => setPage(p)}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </div>
        )}

        {/* Columns tab */}
        {tab === 'columns' && (
          <div className="overflow-auto rounded-xl border border-gray-800">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-[#18181b]">
                  {['#', 'Column', 'Type', 'Null', 'Unique', 'Min', 'Max', 'Sample'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs text-gray-400 font-semibold uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(dataset.columns || []).map((col) => (
                  <tr key={col.name} className="border-b border-gray-800 hover:bg-[#1b1b1d] transition">
                    <td className="px-4 py-2.5 text-gray-600 text-xs">{col.order + 1}</td>
                    <td className="px-4 py-2.5 text-gray-200 font-medium">{col.name}</td>
                    <td className="px-4 py-2.5"><Badge type="private" label={col.dtype} /></td>
                    <td className="px-4 py-2.5 text-gray-400">{col.null_count}</td>
                    <td className="px-4 py-2.5 text-gray-400">{col.unique_count}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{col.min_value ?? '—'}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{col.max_value ?? '—'}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs max-w-xs truncate">
                      {(col.sample_values || []).slice(0, 3).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default DatasetDetailPage;
