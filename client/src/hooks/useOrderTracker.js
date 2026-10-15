import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom React Hook: useOrderTracker
 * Listens for real-time order updates via Supabase Realtime Channel or fallback SSE stream.
 */
export function useOrderTracker(orderCode) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  // Fetch initial order state from backend
  const fetchOrder = useCallback(async () => {
    if (!orderCode) {
      setOrder(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/orders/${orderCode}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Could not find order #${orderCode}`);
      }

      setOrder(data.order);
    } catch (err) {
      console.error('[OrderTracker] Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderCode]);

  useEffect(() => {
    fetchOrder();

    if (!orderCode) return;

    let supabaseChannel = null;

    // 1. Supabase Realtime Subscription
    if (isSupabaseConfigured && supabase) {
      console.log(`[OrderTracker] Subscribing to Supabase Realtime channel for #${orderCode}`);
      supabaseChannel = supabase
        .channel(`order-channel-${orderCode}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `order_code=eq.${orderCode}`,
          },
          (payload) => {
            console.log('[OrderTracker] Realtime Postgres change received:', payload);
            if (payload.new) {
              setOrder((prev) => ({
                ...(prev || {}),
                ...payload.new,
                items: prev?.items || [],
              }));
            }
          }
        )
        .subscribe((status) => {
          console.log(`[OrderTracker] Supabase subscription status:`, status);
        });
    }

    // 2. Realtime SSE Stream (Always active as reliable fallback or in local development)
    try {
      const sseUrl = `${API_BASE}/orders/${orderCode}/stream`;
      console.log(`[OrderTracker] Connecting to live SSE stream: ${sseUrl}`);
      const es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.data) {
            console.log('[OrderTracker] SSE live event update:', parsed.data.status);
            setOrder(parsed.data);
          }
        } catch (e) {
          console.error('[OrderTracker] Failed parsing SSE message:', e);
        }
      };

      es.onerror = (e) => {
        // SSE silently reconnects or fails gracefully if server closes connection
        console.warn('[OrderTracker] SSE stream warning (reconnecting or server offline)');
      };
    } catch (e) {
      console.warn('[OrderTracker] SSE initialization failed:', e);
    }

    return () => {
      if (supabaseChannel && supabase) {
        supabase.removeChannel(supabaseChannel);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [orderCode, fetchOrder]);

  // Cancel Order action with strict status validation
  const cancelOrder = useCallback(async () => {
    if (!orderCode) return { success: false, error: 'No order code provided' };

    try {
      const res = await fetch(`${API_BASE}/orders/${orderCode}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to cancel order');
      }

      setOrder(data.order);
      return { success: true, order: data.order };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [orderCode]);

  // Status simulation action for testing live barista flow
  const updateStatusSimulation = useCallback(
    async (newStatus, paymentStatus) => {
      if (!orderCode) return { success: false, error: 'No order code' };

      try {
        const res = await fetch(`${API_BASE}/orders/${orderCode}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, payment_status: paymentStatus }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to update order status');
        }
        setOrder(data.order);
        return { success: true, order: data.order };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [orderCode]
  );

  return {
    order,
    loading,
    error,
    refreshOrder: fetchOrder,
    cancelOrder,
    updateStatusSimulation,
  };
}
