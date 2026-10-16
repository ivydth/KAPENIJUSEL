import React from 'react';
import {
  User,
  Coffee,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  Database,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Receipt,
  LogOut
} from 'lucide-react';
import { isSupabaseConfigured } from '../supabaseClient';
import { useCart } from '../context/CartContext';

export default function ProfileTab({ currentUser, onTrackOrder, onSignOut }) {
  const { activeOrderCode } = useCart();

  const name = currentUser?.full_name || 'Jusselle Surio';
  const phone = currentUser?.phone || '0917-888-2468';
  const email = currentUser?.email || 'jusselle@kapemuna.local';
  const branch = currentUser?.branch_name || 'Kape Muna — Main Branch';

  // Compute initials
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'KM';

  return (
    <div className="px-4 sm:px-6 py-4 space-y-4 max-w-2xl mx-auto pb-28">
      {/* Profile Header Card */}
      <div className="bg-[#FDFBF7] border border-[#ECE2D3] rounded-3xl p-5 shadow-cafe-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-caramel to-caramel-light text-white font-bold text-xl flex items-center justify-center shadow-cafe-md border-2 border-white flex-shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-roast truncate">{name}</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-caramel-gold/15 text-caramel-gold border border-caramel-gold/30">
              Gold Member
            </span>
          </div>

          <div className="text-xs text-roast/60 space-y-0.5 mt-1">
            <p className="flex items-center gap-1.5 truncate">
              <Mail className="w-3 h-3 text-caramel flex-shrink-0" />
              <span>{email}</span>
            </p>
            {phone && (
              <p className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-caramel flex-shrink-0" />
                <span>{phone}</span>
              </p>
            )}
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-caramel flex-shrink-0" />
              <span className="truncate">{branch}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Coffee Beans Loyalty Points Card */}
      <div className="bg-gradient-to-r from-[#23150D] to-[#3B2215] text-white rounded-3xl p-5 shadow-cafe-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-caramel-gold/20 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-caramel-gold text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Kape Beans Loyalty</span>
            </div>
            <p className="text-3xl font-display font-bold mt-1 text-[#FDFCF9]">
              340 <span className="text-sm font-sans font-normal text-white/70">beans</span>
            </p>
            <p className="text-[11px] text-white/70 mt-1">
              60 beans away from a free Batangas Barako Pour-Over!
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-caramel-gold" />
          </div>
        </div>
      </div>

      {/* Active Order Ticket Shortcut */}
      {activeOrderCode && (
        <div
          onClick={() => onTrackOrder?.(activeOrderCode)}
          className="bg-[#FAF4EC] border border-caramel/40 rounded-3xl p-4 shadow-cafe-sm flex items-center justify-between cursor-pointer hover:bg-[#F6ECE0] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#221610] text-[#FAF6F0] flex items-center justify-center">
              <Receipt className="w-5 h-5 text-caramel-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-roast">Active Order #{activeOrderCode}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-roast/60">Tap to track preparation in real-time</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-caramel" />
        </div>
      )}

      {/* System & Architecture Info */}
      <div className="bg-[#FDFBF7] border border-[#ECE2D3] rounded-3xl p-5 shadow-cafe-sm space-y-3">
        <h3 className="text-xs font-bold text-roast uppercase tracking-wider flex items-center gap-1.5">
          <Database className="w-4 h-4 text-caramel" />
          System & Realtime Diagnostics
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EDE3D5]">
            <span className="text-roast/70">Database Provider</span>
            <span className="font-bold text-roast">
              {isSupabaseConfigured ? 'Supabase Cloud (PostgreSQL)' : 'Express Local Engine'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EDE3D5]">
            <span className="text-roast/70">Realtime Channel</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {isSupabaseConfigured ? 'Supabase WebSocket (orders)' : 'Active SSE Event Stream'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EDE3D5]">
            <span className="text-roast/70">Row-Level Security</span>
            <span className="font-bold text-roast flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              RLS Policies Active
            </span>
          </div>
        </div>
      </div>

      {/* Past Order History */}
      <div className="bg-[#FDFBF7] border border-[#ECE2D3] rounded-3xl p-5 shadow-cafe-sm space-y-3">
        <h3 className="text-xs font-bold text-roast uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-caramel" />
          Recent Orders
        </h3>

        <div className="divide-y divide-[#EDE3D5] text-xs">
          <div className="py-2.5 flex justify-between items-center">
            <div>
              <p className="font-bold text-roast">Order #KM-108</p>
              <p className="text-[11px] text-roast/60">Batangas Barako Pour-Over (16oz) + Classic Brioche Ensaymada</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-roast">₱210.00</span>
              <p className="text-[10px] text-emerald-600 font-semibold">Active</p>
            </div>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <div>
              <p className="font-bold text-roast">Order #KM-094</p>
              <p className="text-[11px] text-roast/60">Spanish Latte (16oz) + Butter Croissant</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-roast">₱305.00</span>
              <p className="text-[10px] text-gray-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Action Button */}
      <div className="pt-2">
        <button
          onClick={onSignOut}
          className="w-full py-3 px-4 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Kape Muna</span>
        </button>
      </div>
    </div>
  );
}
