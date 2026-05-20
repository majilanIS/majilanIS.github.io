import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function OrderButton({
  farmerId,
  farmerIdentification,
  productId = null,
  productName = 'Produce',
}) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [message, setMessage] = useState(null);

  const placeOrder = async () => {
    if (!farmerId) return setMessage('Missing farmer id');
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        farmer_id: farmerId,
        farmer_identification: farmerIdentification || null,
        product_id: productId,
        product_name: productName,
        quantity: Number(quantity) || 1,
        buyer_name: buyerName || null,
        buyer_contact: buyerContact || null,
        status: 'pending',
      };

      const { data, error } = await supabase.from('orders').insert([payload]).select().single();
      if (error) throw error;
      setMessage('Order placed — ID: ' + (data?.id || 'unknown'));
    } catch (err) {
      console.error('placeOrder error', err);
      setMessage('Failed to place order: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: 80, padding: 8 }} />
      <input placeholder="Your name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} style={{ padding: 8 }} />
      <input placeholder="Contact (phone/email)" value={buyerContact} onChange={(e) => setBuyerContact(e.target.value)} style={{ padding: 8 }} />
      <button onClick={placeOrder} disabled={loading} style={{ padding: '10px 14px', background: '#FF6B1A', color: '#fff', border: 'none', borderRadius: 8 }}>
        {loading ? 'Placing...' : 'Place order'}
      </button>
      {message && <div style={{ marginLeft: 8 }}>{message}</div>}
    </div>
  );
}
