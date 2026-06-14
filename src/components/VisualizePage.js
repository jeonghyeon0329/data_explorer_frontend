import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDataset } from '../api/datasets';
import { createChart, listCharts, getChartData, deleteChart } from '../api/charts';
import Navbar from './common/Navbar';
import Badge from './common/Badge';
import Spinner from './common/Spinner';
import Modal from './common/Modal';
import ChartRenderer from './chart/ChartRenderer';

const CHART_TYPES = ['bar', 'line', 'pie', 'scatter', 'histogram'];
const AGG_FUNCS   = ['sum', 'mean', 'count', 'min', 'max'];
const COLORS      = ['#4f83cc', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa', '#06b6d4'];

function VisualizePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [dsLoading, setDsLoading] = useState(true);

  /* chart form */
  const [title, setTitle] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');
  const [agg, setAgg] = useState('sum');
  const [color, setColor] = useState(COLORS[0]);
  const [bins, setBins] = useState(20);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);

  /* preview */
  const [previewData, setPreviewData] = useState(null);

  /* saved charts */
  const [charts, setCharts] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    getDataset(id)
      .then((r) => setDataset(r.data))
      .catch(() => toast.error('Dataset not found'))
      .finally(() => setDsLoading(false));
  }, [id]);

  const fetchCharts = useCallback(() => {
    setChartsLoading(true);
    listCharts(id)
      .then((r) => setCharts(r.data.charts || []))
      .catch(() => {})
      .finally(() => setChartsLoading(false));
  }, [id]);

  useEffect(() => { fetchCharts(); }, [fetchCharts]);

  const previewTimerRef = useRef(null);

  const runPreview = useCallback(async () => {
    if (!yCol) return;
    if (chartType !== 'histogram' && !xCol) return;
    setPreviewing(true);
    try {
      const created = await createChart(id, {
        title: title || 'Preview', chart_type: chartType,
        x_column: xCol || null, y_column: yCol || null,
        config: { aggregation: agg, color, ...(chartType === 'histogram' ? { bins } : {}) },
      });
      const chartId = created.data.chart_id;
      const dataRes = await getChartData(id, chartId);
      setPreviewData(dataRes.data);
      await deleteChart(id, chartId);
    } catch (err) {
      toast.error(err?.data?.message || 'Preview failed');
    } finally {
      setPreviewing(false);
    }
  }, [id, title, chartType, xCol, yCol, agg, color, bins]);

  useEffect(() => {
    if (!yCol) return;
    if (chartType !== 'histogram' && !xCol) return;
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = setTimeout(runPreview, 600);
    return () => clearTimeout(previewTimerRef.current);
  }, [chartType, xCol, yCol, agg, color, bins, title, runPreview]);

  const handleSave = async () => {
    if (!title) { toast.error('Enter a chart title'); return; }
    setSaving(true);
    try {
      await createChart(id, {
        title, chart_type: chartType,
        x_column: xCol || null, y_column: yCol || null,
        config: { aggregation: agg, color, ...(chartType === 'histogram' ? { bins } : {}) },
      });
      toast.success('Chart saved');
      fetchCharts();
    } catch (err) {
      toast.error(err?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadChart = async (chart) => {
    setTitle(chart.title);
    setChartType(chart.chart_type);
    setXCol(chart.x_column || '');
    setYCol(chart.y_column || '');
    try {
      const res = await getChartData(id, chart.chart_id);
      setPreviewData(res.data);
    } catch { toast.error('Failed to load chart data'); }
  };

  const handleDeleteChart = async () => {
    try {
      await deleteChart(id, deleteTarget);
      toast.success('Chart deleted');
      if (previewData) setPreviewData(null);
      fetchCharts();
    } catch { toast.error('Delete failed'); }
    finally { setDeleteTarget(null); }
  };

  const cols = dataset?.columns?.map((c) => c.name) || [];

  if (dsLoading) return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center"><Spinner size="lg" /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/dashboard')} className="hover:text-gray-300 transition">Dashboard</button>
          <span>/</span>
          <button onClick={() => navigate(`/datasets/${id}`)} className="hover:text-gray-300 transition">{dataset?.name}</button>
          <span>/</span>
          <span className="text-gray-300">Charts</span>
        </div>

        {/* Main: config + preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Config panel */}
          <div className="bg-[#18181b] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-white font-semibold">Create Chart</h2>

            {/* Title */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Chart Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Revenue by Month"
                className="w-full px-3 py-2 rounded-lg bg-[#0f0f11] border border-gray-700 text-sm text-gray-200 outline-none focus:border-blue-600 transition" />
            </div>

            {/* Chart type */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Chart Type</label>
              <div className="flex gap-2 flex-wrap">
                {CHART_TYPES.map((t) => (
                  <button key={t} onClick={() => setChartType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
                      chartType === t ? 'bg-blue-600 text-white' : 'bg-[#27272a] text-gray-400 hover:bg-[#3f3f46]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* X column */}
            {chartType !== 'histogram' && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">X Column</label>
                <select value={xCol} onChange={(e) => setXCol(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0f0f11] border border-gray-700 text-sm text-gray-300 outline-none">
                  <option value="">Select column...</option>
                  {cols.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {/* Y column */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Y Column</label>
              <select value={yCol} onChange={(e) => setYCol(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f0f11] border border-gray-700 text-sm text-gray-300 outline-none">
                <option value="">Select column...</option>
                {cols.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Aggregation (bar/line/pie) */}
            {['bar', 'line', 'pie'].includes(chartType) && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Aggregation</label>
                <div className="flex gap-2">
                  {AGG_FUNCS.map((f) => (
                    <button key={f} onClick={() => setAgg(f)}
                      className={`px-3 py-1 rounded-lg text-xs transition ${agg === f ? 'bg-blue-600 text-white' : 'bg-[#27272a] text-gray-400 hover:bg-[#3f3f46]'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bins (histogram) */}
            {chartType === 'histogram' && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Bins: {bins}</label>
                <input type="range" min={5} max={50} value={bins} onChange={(e) => setBins(+e.target.value)}
                  className="w-full accent-blue-500" />
              </div>
            )}

            {/* Color */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Color</label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* Save */}
            <button onClick={handleSave} disabled={saving}
              className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50">
              {saving ? <Spinner size="sm" /> : null} Save Chart
            </button>
          </div>

          {/* Preview panel */}
          <div className="bg-[#18181b] border border-gray-800 rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">{previewData?.title || 'Preview'}</h2>
              {previewing && <Spinner size="sm" />}
            </div>
            {previewData ? (
              <ChartRenderer chartData={previewData} height={340} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600 py-16 gap-2">
                <p className="text-4xl">📊</p>
                <p className="text-sm">{previewing ? 'Loading…' : 'Title과 Column을 선택하면 자동으로 표시됩니다'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Saved charts */}
        <div className="bg-[#18181b] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Saved Charts</h2>
          {chartsLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : charts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No saved charts yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {charts.map((c) => (
                <div key={c.chart_id}
                  className="bg-[#0f0f11] border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-gray-600 transition cursor-pointer"
                  onClick={() => handleLoadChart(c)}>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 font-medium truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge type="private" label={c.chart_type} />
                      <span className="text-xs text-gray-600">{c.x_column} / {c.y_column}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(c.chart_id); }}
                    className="text-gray-600 hover:text-red-400 transition shrink-0 text-lg leading-none">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={!!deleteTarget}
        title="Delete Chart"
        message="Delete this chart? This cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={handleDeleteChart}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default VisualizePage;
