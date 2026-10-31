import React, { useState, useMemo } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
export type UserRole = 'guest' | 'buyer' | 'creator' | 'pro_creator' | 'moderator' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'suspended' | 'unverified';

interface UserRecord {
  id: string;
  handle: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  listingsCount: number;
  ordersCount: number;
  totalSpent: string;
  totalEarned: string;
  proPlan: boolean;
  avatar: string;
}

/* ─── Mock Data ──────────────────────────────────── */
const INITIAL_USERS: UserRecord[] = [
  { id: 'usr-1', handle: '@ada_lovelace', name: 'Ada Lovelace', email: 'ada@wikiofautomation.com', role: 'super_admin', status: 'active', joinedDate: '2026-01-15T00:00:00Z', listingsCount: 12, ordersCount: 45, totalSpent: '$1,240', totalEarned: '$18,400', proPlan: true, avatar: 'A' },
  { id: 'usr-2', handle: '@builder', name: 'Alex Rivera', email: 'alex@devswarm.io', role: 'pro_creator', status: 'active', joinedDate: '2026-02-10T10:30:00Z', listingsCount: 8, ordersCount: 22, totalSpent: '$480', totalEarned: '$8,920', proPlan: true, avatar: 'B' },
  { id: 'usr-3', handle: '@marcus_dev', name: 'Marcus Vance', email: 'marcus@n8nwork.com', role: 'creator', status: 'active', joinedDate: '2026-03-01T14:15:00Z', listingsCount: 4, ordersCount: 14, totalSpent: '$210', totalEarned: '$3,400', proPlan: false, avatar: 'M' },
  { id: 'usr-4', handle: '@elena_r', name: 'Elena Rostova', email: 'elena@docker-ai.org', role: 'moderator', status: 'active', joinedDate: '2026-03-20T08:00:00Z', listingsCount: 3, ordersCount: 9, totalSpent: '$190', totalEarned: '$2,100', proPlan: true, avatar: 'E' },
  { id: 'usr-5', handle: '@sarah_ai', name: 'Sarah Chen', email: 'sarah@promptlabs.ai', role: 'pro_creator', status: 'active', joinedDate: '2026-04-05T12:00:00Z', listingsCount: 6, ordersCount: 31, totalSpent: '$620', totalEarned: '$6,800', proPlan: true, avatar: 'S' },
  { id: 'usr-6', handle: '@buyer_john', name: 'John Doe', email: 'john@techcorp.com', role: 'buyer', status: 'active', joinedDate: '2026-05-12T16:45:00Z', listingsCount: 0, ordersCount: 18, totalSpent: '$840', totalEarned: '$0', proPlan: false, avatar: 'J' },
  { id: 'usr-7', handle: '@spam_bot_42', name: 'Spam Bot 42', email: 'bot42@tempmail.org', role: 'guest', status: 'suspended', joinedDate: '2026-08-08T03:12:00Z', listingsCount: 0, ordersCount: 0, totalSpent: '$0', totalEarned: '$0', proPlan: false, avatar: 'X' },
  { id: 'usr-8', handle: '@new_dev_99', name: 'David Smith', email: 'david@gmail.com', role: 'buyer', status: 'unverified', joinedDate: '2026-08-10T02:00:00Z', listingsCount: 0, ordersCount: 1, totalSpent: '$29', totalEarned: '$0', proPlan: false, avatar: 'D' },
];

const ROLES_LIST: UserRole[] = ['guest', 'buyer', 'creator', 'pro_creator', 'moderator', 'admin', 'super_admin'];

function roleBadgeColor(role: UserRole) {
  switch (role) {
    case 'super_admin': return 'bg-[#C0F500]/20 text-[#C0F500] border-[#C0F500]/40';
    case 'admin': return 'bg-[#00DAF3]/20 text-[#00DAF3] border-[#00DAF3]/40';
    case 'moderator': return 'bg-[#6C63FF]/20 text-[#9B93FF] border-[#6C63FF]/40';
    case 'pro_creator': return 'bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/40';
    case 'creator': return 'bg-[#1E1E24] text-[#E5E1E7] border-[#353439]';
    case 'buyer': return 'bg-[#1E1E24] text-[#8B8FA3] border-[#232329]';
    default: return 'bg-[#0E0E12] text-[#5A5A68] border-[#1E1E24]';
  }
}

/* ─── Top Bar ────────────────────────────────────── */
function TopBar({ breadcrumbs }: { breadcrumbs: string[] }) {
  return (
    <header className="fixed top-0 left-[240px] right-0 h-14 bg-[#131317]/95 backdrop-blur-md border-b border-[#232329] z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-[13px]">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#5A5A68]">/</span>}
            <span className={i === breadcrumbs.length - 1 ? 'text-[#E5E1E7]' : 'text-[#5A5A68]'}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pl-2 border-l border-[#232329]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C0F500] to-[#00DAF3] flex items-center justify-center text-[#050508] text-xs font-bold">A</div>
          <span className="text-[12px] text-[#8B8FA3] font-mono">@admin</span>
        </div>
      </div>
    </header>
  );
}

/* ─── Main Component ─────────────────────────────── */
export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [userProfileTab, setUserProfileTab] = useState<'profile' | 'listings' | 'orders' | 'revenue' | 'reports' | 'audit'>('profile');

  /* Confirmation Modal State */
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'suspend' | 'delete' | 'change_role';
    targetUserId: string;
    newRole?: UserRole;
  }>({ isOpen: false, title: '', description: '', actionType: 'suspend', targetUserId: '' });

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.handle.toLowerCase().includes(search.toLowerCase()) ||
                            u.email.toLowerCase().includes(search.toLowerCase()) ||
                            u.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (newRole === 'super_admin' || newRole === 'admin') {
      setConfirmModal({
        isOpen: true,
        title: `Promote to ${newRole.toUpperCase()}`,
        description: `Are you sure you want to give ${userId} full Administrative access to the platform?`,
        actionType: 'change_role',
        targetUserId: userId,
        newRole,
      });
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleSuspend = (userId: string) => {
    const u = users.find(x => x.id === userId);
    setConfirmModal({
      isOpen: true,
      title: u?.status === 'suspended' ? 'Unsuspend User Account' : 'Suspend User Account',
      description: u?.status === 'suspended' ? 'Re-activate this account and restore platform permissions?' : 'Suspending this user will immediately terminate their sessions and disable marketplace publishing.',
      actionType: 'suspend',
      targetUserId: userId,
    });
  };

  const handleDelete = (userId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User Account Permanently',
      description: 'WARNING: This will permanently delete all user records, listings, and payout history. This action CANNOT be undone.',
      actionType: 'delete',
      targetUserId: userId,
    });
  };

  const confirmAction = () => {
    const { actionType, targetUserId, newRole } = confirmModal;
    setUsers(prev => prev.map((u): UserRecord => {
      if (u.id === targetUserId) {
        if (actionType === 'suspend') {
          const nextStatus: UserStatus = u.status === 'suspended' ? 'active' : 'suspended';
          return { ...u, status: nextStatus };
        }
        if (actionType === 'change_role' && newRole) {
          return { ...u, role: newRole };
        }
      }
      return u;
    }).filter(u => actionType === 'delete' ? u.id !== targetUserId : true));

    setConfirmModal({ ...confirmModal, isOpen: false });
    if (actionType === 'delete' && selectedUser?.id === targetUserId) setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="users" />
      <TopBar breadcrumbs={['Admin', 'People', 'User Management']} />

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-5 max-w-[1400px]">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#E5E1E7]">User Directory & Access Control</h1>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                {users.length} registered accounts · {users.filter(u => u.role.includes('creator')).length} creators · {users.filter(u => u.status === 'suspended').length} suspended
              </p>
            </div>
            <button className="px-3.5 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span>
              Create User Account
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-[360px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A68]" style={{ fontSize: 16 }}>search</span>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search handle, name, email..."
                className="w-full bg-[#131317] border border-[#232329] rounded-lg pl-9 pr-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 placeholder:text-[#5A5A68]"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#5A5A68] font-mono">Role:</span>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-[#131317] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7]">
                <option value="All">All Roles</option>
                {ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#5A5A68] font-mono">Status:</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#131317] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7]">
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#232329] text-[11px] uppercase tracking-wider text-[#5A5A68]">
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Joined</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E24]">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#0E0E12] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C0F500]/30 to-[#00DAF3]/30 border border-[#232329] flex items-center justify-center text-[12px] font-bold text-[#E5E1E7]">
                          {user.avatar}
                        </div>
                        <div>
                          <span className="text-[13px] font-semibold text-[#E5E1E7] block">{user.name}</span>
                          <span className="text-[11px] font-mono text-[#C0F500]">{user.handle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[12px] font-mono text-[#8B8FA3]">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded border text-[10px] font-mono font-semibold uppercase ${roleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[12px] text-[#8B8FA3]">{new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center gap-1.5 text-[12px] ${
                        user.status === 'active' ? 'text-[#C0F500]' : user.status === 'suspended' ? 'text-[#FF6B6B]' : 'text-[#F5A623]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-[#C0F500]' : user.status === 'suspended' ? 'bg-[#FF6B6B]' : 'bg-[#F5A623]'}`} />
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelectedUser(user)} className="px-2.5 py-1 rounded text-[11px] bg-[#1E1E24] text-[#8B8FA3] hover:text-[#E5E1E7]">View</button>
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="bg-[#0E0E12] border border-[#232329] rounded px-2 py-1 text-[11px] text-[#E5E1E7]"
                        >
                          {ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button onClick={() => handleSuspend(user.id)} className="px-2.5 py-1 rounded text-[11px] bg-[#F5A623]/15 text-[#F5A623] hover:bg-[#F5A623]/25">
                          {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="px-2.5 py-1 rounded text-[11px] bg-[#FF6B6B]/15 text-[#FF6B6B] hover:bg-[#FF6B6B]/25">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Individual User Profile Drawer/Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-6 max-w-2xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between border-b border-[#232329] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C0F500] to-[#00DAF3] flex items-center justify-center text-[#050508] font-bold text-lg">
                      {selectedUser.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#E5E1E7]">{selectedUser.name}</h3>
                      <p className="text-[12px] font-mono text-[#C0F500]">{selectedUser.handle} · {selectedUser.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-[#5A5A68] hover:text-[#E5E1E7]">
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
                  </button>
                </div>

                {/* Profile Modal Tabs */}
                <div className="flex items-center gap-2 border-b border-[#232329] pb-2">
                  {['profile', 'listings', 'orders', 'revenue', 'reports', 'audit'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setUserProfileTab(tab as any)}
                      className={`px-3 py-1 rounded-lg text-[12px] font-mono capitalize transition-colors ${
                        userProfileTab === tab ? 'bg-[#C0F500]/15 text-[#C0F500] font-bold' : 'text-[#8B8FA3] hover:text-[#E5E1E7]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {userProfileTab === 'profile' && (
                  <div className="space-y-4 text-[13px]">
                    <div className="grid grid-cols-3 gap-3 font-mono">
                      <div className="bg-[#0E0E12] p-3 rounded-lg border border-[#1E1E24]">
                        <span className="text-[10px] text-[#5A5A68] block">Listings Published</span>
                        <span className="text-[#C0F500] text-base font-bold">{selectedUser.listingsCount}</span>
                      </div>
                      <div className="bg-[#0E0E12] p-3 rounded-lg border border-[#1E1E24]">
                        <span className="text-[10px] text-[#5A5A68] block">Orders Placed</span>
                        <span className="text-[#00DAF3] text-base font-bold">{selectedUser.ordersCount}</span>
                      </div>
                      <div className="bg-[#0E0E12] p-3 rounded-lg border border-[#1E1E24]">
                        <span className="text-[10px] text-[#5A5A68] block">Total Revenue Earned</span>
                        <span className="text-[#F5A623] text-base font-bold">{selectedUser.totalEarned}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8B8FA3]">Account Status:</span>
                        <span className="font-mono text-[#C0F500] uppercase font-bold">{selectedUser.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#8B8FA3]">Pro Creator Subscription:</span>
                        <span className="font-mono text-[#00DAF3]">{selectedUser.proPlan ? 'Active ($29/mo)' : 'Free Tier'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#232329] flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-[#1E1E24] text-[12px] text-[#E5E1E7] hover:bg-[#2A292E]">Reset Password</button>
                      <button className="px-3 py-1.5 rounded-lg bg-[#1E1E24] text-[12px] text-[#E5E1E7] hover:bg-[#2A292E]">Send Platform Email</button>
                      <button onClick={() => handleSuspend(selectedUser.id)} className="px-3 py-1.5 rounded-lg bg-[#F5A623]/20 text-[#F5A623]">Suspend Account</button>
                      <button onClick={() => handleDelete(selectedUser.id)} className="px-3 py-1.5 rounded-lg bg-[#FF6B6B]/20 text-[#FF6B6B]">Delete Account</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {confirmModal.isOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#131317] border border-[#FF6B6B]/30 rounded-xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center gap-3 text-[#FF6B6B]">
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>warning</span>
                  <h3 className="text-base font-bold">{confirmModal.title}</h3>
                </div>
                <p className="text-[13px] text-[#8B8FA3] leading-relaxed">{confirmModal.description}</p>
                <div className="flex justify-end gap-2 pt-3 border-t border-[#232329]">
                  <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-4 py-2 rounded-lg bg-[#1E1E24] text-[12px] text-[#8B8FA3]">Cancel</button>
                  <button onClick={confirmAction} className="px-4 py-2 rounded-lg bg-[#FF6B6B] text-white text-[12px] font-semibold">Confirm Action</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
