import Spinner from './Spinner';

function DataTable({
  columns = [],
  rows = [],
  loading = false,
  totalRows = 0,
  page = 1,
  pageSize = 50,
  onPageChange,
  sortBy,
  sortDir = 'asc',
  onSort,
}) {
  const totalPages = Math.ceil(totalRows / pageSize) || 1;

  const thClass = `
    px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider
    border-b border-gray-700 bg-[#18181b] whitespace-nowrap cursor-pointer select-none
    hover:text-gray-200 transition
  `;
  const tdClass = 'px-3 py-2 text-sm text-gray-300 border-b border-gray-800 whitespace-nowrap max-w-xs truncate';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!loading && rows.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">No data</div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-auto rounded-xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className={thClass}
                  onClick={() => onSort?.(col)}
                >
                  {col}
                  {sortBy === col && (
                    <span className="ml-1 text-blue-400">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-[#1b1b1d] transition">
                {row.map((cell, ci) => (
                  <td key={ci} className={tdClass} title={cell == null ? '' : String(cell)}>
                    {cell == null ? <span className="text-gray-600">null</span> : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{totalRows.toLocaleString()} rows total</span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            className="px-3 py-1 rounded-lg border border-gray-700 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Prev
          </button>
          <span className="px-2">{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
            className="px-3 py-1 rounded-lg border border-gray-700 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
