import React from 'react';
import { X, Bell, Coffee, Sparkles, Check, Clock } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Your Batangas Barako is Queued!',
    desc: 'Order #KM-108 has been sent to our barista station at Main Branch.',
    time: '5 mins ago',
    unread: true,
    type: 'order'
  },
  {
    id: 2,
    title: 'Weekend Special: 20% OFF',
    desc: 'Enjoy 20% off all cold brew & iced espresso drinks this Saturday & Sunday.',
    time: '2 hours ago',
    unread: true,
    type: 'promo'
  },
  {
    id: 3,
    title: 'Welcome to Kape Muna Rewards',
    desc: 'You earned 50 Bean Points on your account signup!',
    time: 'Yesterday',
    unread: false,
    type: 'reward'
  }
];

export default function NotificationsModal({ isOpen, onClose, onClearAll }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-sm bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EDE3D5] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE2D3]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-caramel/15 text-caramel flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-roast">Notifications</h3>
              <p className="text-[10px] text-roast/60">Updates & Store Alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F4ECE1] text-roast flex items-center justify-center hover:bg-[#EDE3D5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-[#F2ECE2] my-3 max-h-72 overflow-y-auto no-scrollbar">
          {NOTIFICATIONS.map((item) => (
            <div key={item.id} className="py-3 flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-caramel mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-roast truncate">{item.title}</h4>
                  <span className="text-[9px] text-roast/50">{item.time}</span>
                </div>
                <p className="text-[11px] text-roast/70 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#221610] text-white text-xs font-bold rounded-2xl hover:bg-caramel transition-colors"
        >
          Close Notifications
        </button>
      </div>
    </div>
  );
}
