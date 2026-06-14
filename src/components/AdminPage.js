import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listUsers, updateUser, deleteUser } from '../api/admin';
import { listAllDatasets } from '../api/admin';
import Navbar from './common/Navbar';
import Badge from './common/Badge';
import Spinner from './common/Spinner';
import Modal from './common/Modal';

const PAGE_SIZE = 20;

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');

  /* ── Users ───────────────────────────────────────────── */
  const [users, setUsers] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userQ, setUserQ] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(true);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    listUsers({ page: userPage, size: PAGE_SIZE, ...(userQ ? { q: userQ } : {}) })
      .then((r) => { setUsers(r.data.items || []); setUserTotal(r.data.total || 0); })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setUsersLoading(false));
  }, [userPage, userQ]);

  useEffect(() => { if (tab === 'users') fetchUsers(); }, [tab, fetchUsers]);

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  const handleActiveToggle = async (userId, is_active) => {
    try {
      await updateUser(userId, { is_active });
      toast.success(is_active ? 'User activated' : 'User deactivated');
      fetchUsers();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(deleteUserTarget);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
    finally { setDeleteUserTarget(null); }
  };

  /* ── Datasets ────────────────────────────────────────── */
  const [datasets, setDatasets] = useState([]);
  const [dsTotal, setDsTotal] = useState(0);
  const [dsPage, setDsPage] = useState(1);
  const [dsQ, setDsQ] = useState('');
  const [dsSearch, setDsSearch] = useState('');
  const [dsLoading, setDsLoading] = useState(true);

  const fetchDatasets = useCallback(() => {
    setDsLoading(true);
    listAllDatasets({ page: dsPage, size: PAGE_SIZE, ...(dsQ ? { q: dsQ } : {}) })
      .then((r) => { setDatasets(r.data.items || []); setDsTotal(r.data.total || 0); })
      .catch(() => toast.error('Failed to load datasets'))
      .finally(() => setDsLoading(false));
  }, [dsPage, dsQ]);

  useEffect(() => { if (tab === 'datasets') fetchDatasets(); }, [tab, fetchDatasets]);

  const userTotalPages = Math.ceil(userTotal / PAGE_SIZE) || 1;
  const dsTotalPages   = Math.ceil(dsTotal   / PAGE_SIZE) || 1;

  const inputCls = "px-3 py-2 rounded-lg bg-[#18181b] border border-gray-800 text-sm text-gray-300 outline-none focus:border-blue-600 transition";
  const thCls    = "px-4 py-3 text-left text-xs text-gray-400 font-semibold uppercase whitespace-nowrap border-b border-gray-700 bg-[#18181b]";
  const tdCls    = "px-4 py-3 text-sm text-gray-300 border-b border-gray-800";

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin</h1>
          <button onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-300 transition">
            ← Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-800">
          {['users', 'datasets'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium transition capitalize border-b-2 -mb-px ${
                tab === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {t} {t === 'users' ? `(${userTotal})` : `(${dsTotal})`}
            </button>
          ))}
        </div>

        {/* ── Users tab ─────────────────────────────────── */}
        {tab === 'users' && (
          <div className="flex flex-col gap-4">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setUserQ(userSearch); setUserPage(1); }}>
              <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by username or email..." className={`${inputCls} w-72`} />
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 text-sm transition">Search</button>
              {userQ && <button type="button" onClick={() => { setUserQ(''); setUserSearch(''); setUserPage(1); }}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition">Clear</button>}
            </form>

            {usersLoading ? (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : (
              <>
                <div className="overflow-auto rounded-xl border border-gray-800">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {['ID', 'Username', 'Email', 'Role', 'Active', 'Joined', 'Actions'].map((h) => (
                          <th key={h} className={thCls}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-[#1b1b1d] transition">
                          <td className={`${tdCls} text-gray-600`}>{u.id}</td>
                          <td className={tdCls}>{u.username}</td>
                          <td className={`${tdCls} text-gray-400`}>{u.email}</td>
                          <td className={tdCls}>
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="bg-[#0f0f11] border border-gray-700 text-sm text-gray-300 rounded-lg px-2 py-1 outline-none"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className={tdCls}>
                            <div
                              onClick={() => handleActiveToggle(u.id, !u.is_active)}
                              className={`w-9 h-5 rounded-full transition relative cursor-pointer ${u.is_active ? 'bg-blue-600' : 'bg-gray-700'}`}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${u.is_active ? 'left-4' : 'left-0.5'}`} />
                            </div>
                          </td>
                          <td className={`${tdCls} text-gray-500 text-xs whitespace-nowrap`}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className={tdCls}>
                            <button onClick={() => setDeleteUserTarget(u.id)}
                              className="text-xs text-red-500 hover:text-red-400 transition">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {userTotalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button disabled={userPage <= 1} onClick={() => setUserPage((p) => p - 1)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition">← Prev</button>
                    <span className="px-4 py-2 text-gray-400 text-sm">{userPage} / {userTotalPages}</span>
                    <button disabled={userPage >= userTotalPages} onClick={() => setUserPage((p) => p + 1)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition">Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Datasets tab ──────────────────────────────── */}
        {tab === 'datasets' && (
          <div className="flex flex-col gap-4">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setDsQ(dsSearch); setDsPage(1); }}>
              <input value={dsSearch} onChange={(e) => setDsSearch(e.target.value)}
                placeholder="Search by name..." className={`${inputCls} w-72`} />
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 text-sm transition">Search</button>
              {dsQ && <button type="button" onClick={() => { setDsQ(''); setDsSearch(''); setDsPage(1); }}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition">Clear</button>}
            </form>

            {dsLoading ? (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : (
              <>
                <div className="overflow-auto rounded-xl border border-gray-800">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {['ID', 'Name', 'Owner', 'Type', 'Rows', 'Public', 'Created'].map((h) => (
                          <th key={h} className={thCls}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {datasets.map((d) => (
                        <tr key={d.id} className="hover:bg-[#1b1b1d] transition cursor-pointer"
                          onClick={() => navigate(`/datasets/${d.id}`)}>
                          <td className={`${tdCls} text-gray-600`}>{d.id}</td>
                          <td className={`${tdCls} text-blue-300 hover:underline`}>{d.name}</td>
                          <td className={`${tdCls} text-gray-400`}>{d.owner}</td>
                          <td className={tdCls}><Badge type={d.file_type} /></td>
                          <td className={`${tdCls} text-gray-400`}>{d.row_count?.toLocaleString()}</td>
                          <td className={tdCls}>
                            <Badge type={d.is_public ? 'public' : 'private'} label={d.is_public ? 'Yes' : 'No'} />
                          </td>
                          <td className={`${tdCls} text-gray-500 text-xs whitespace-nowrap`}>
                            {d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {dsTotalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button disabled={dsPage <= 1} onClick={() => setDsPage((p) => p - 1)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition">← Prev</button>
                    <span className="px-4 py-2 text-gray-400 text-sm">{dsPage} / {dsTotalPages}</span>
                    <button disabled={dsPage >= dsTotalPages} onClick={() => setDsPage((p) => p + 1)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition">Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <Modal
        isOpen={!!deleteUserTarget}
        title="Delete User"
        message="Delete this user and all their data? This cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteUserTarget(null)}
      />
    </div>
  );
}

export default AdminPage;
