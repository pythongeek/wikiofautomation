import React, { useState } from 'react';

export interface NotificationItem {
  id: string;
  type: 'review' | 'revenue' | 'follower' | 'forum_reply';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'revenue',
    title: 'Revenue Milestone Reached! 🚀',
    message: 'Your tool "n8n Stripe Drip & Webhook Engine" crossed $2,500 in total sales.',
    timestamp: '10m ago',
    read: false,
    link: '/dashboard',
  },
  {
    id: 'notif-2',
    type: 'review',
    title: 'New ★ 5.0 Review',
    message: '@alex_m left a 5-star review on "Claude 3.7 Sonnet Master Prompt Suite": "Incredible prompt structure!"',
    timestamp: '1h ago',
    read: false,
    link: '/marketplace/prompts/claude-prompt-engineer',
  },
  {
    id: 'notif-3',
    type: 'follower',
    title: 'New Creator Follower',
    message: '@elena_r started following your creator profile and tool releases.',
    timestamp: '3h ago',
    read: false,
    link: '/profile/elena_r',
  },
  {
    id: 'notif-4',
    type: 'forum_reply',
    title: 'Reply in "Model Context Protocol Best Practices"',
    message: '@mcp_master replied: "Check out the new WebMCP bridge specs in v2.4."',
    timestamp: '1d ago',
    read: true,
    link: '/community/forum',
  },
];

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'revenue': return { icon: 'payments', color: 'text-[#C0F500]' };
      case 'review': return { icon: 'star', color: 'text-[#F5A623]' };
      case 'follower': return { icon: 'person_add', color: 'text-[#00DAF3]' };
      case 'forum_reply': return { icon: 'forum', color: 'text-[#9B93FF]' };
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-[#131317] border border-[#232329] text-[#E5E1E7] hover:text-[#C0F500] hover:border-[#C0F500]/40 transition-colors"
        aria-label="Notification Center"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF6B6B] text-[#050508] font-mono text-[10px] font-bold min-w-[18px] text-center shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#131317] border border-[#232329] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Dropdown Header */}
          <div className="px-4 py-3 bg-[#1B1B1F] border-b border-[#232329] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#E5E1E7]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#C0F500]/15 text-[#C0F500] font-mono text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-mono text-[#00DAF3] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#1E1E24]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[12px] text-[#5A5A68]">No notifications.</div>
            ) : (
              notifications.map(n => {
                const iconInfo = getTypeIcon(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => toggleRead(n.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer relative ${
                      n.read ? 'bg-[#050508] opacity-75' : 'bg-[#1B1B1F] border-l-2 border-[#C0F500]'
                    } hover:bg-[#1E1E24]`}
                  >
                    <div className={`p-2 rounded-lg bg-[#0E0E12] border border-[#232329] ${iconInfo.color} shrink-0`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{iconInfo.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[12px] font-semibold text-[#E5E1E7] truncate">{n.title}</h4>
                        <span className="text-[10px] font-mono text-[#5A5A68] shrink-0 ml-2">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#8B8FA3] line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Link */}
          <div className="px-4 py-2.5 bg-[#0E0E12] border-t border-[#232329] text-center">
            <a href="/dashboard/settings" className="text-[11px] font-mono text-[#5A5A68] hover:text-[#E5E1E7]">
              Notification Settings →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
