import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FarmerDashboard({ farmerId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farmerId) return;

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });
      if (error) console.error('fetch orders', error);
      if (isMounted) setOrders(data || []);
      setLoading(false);
    };

    load();

    // subscribe to realtime updates for this farmer's orders
    const channel = supabase
      .channel(`orders:farmer=${farmerId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `farmer_id=eq.${farmerId}` }, (payload) => {
        // payload.record contains the new/updated row
        const rec = payload.record;
        setOrders((prev) => {
          // upsert locally
          const exists = prev.find((p) => p.id === rec.id);
          if (exists) return prev.map((p) => (p.id === rec.id ? rec : p));
          return [rec, ...prev];
        });
      })
      .subscribe();

    return () => {
      isMounted = false;
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // fallback: unsubscribe
        channel.unsubscribe();
      }
    };
  }, [farmerId]);

  return (
    <div style={{ padding: 12 }}>
      <h3 style={{ margin: '0 0 12px' }}>Orders</h3>
      {loading && <div>Loading...</div>}
      {!loading && orders.length === 0 && <div>No orders yet.</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orders.map((o) => (
          <li key={o.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{o.product_name || 'Produce'}</strong> · {o.quantity}
                <div style={{ fontSize: 12, color: '#666' }}>{o.buyer_name || 'Buyer'} · {o.buyer_contact || '-'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13 }}>{o.status || 'pending'}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
