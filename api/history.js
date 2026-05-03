import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Create Supabase client with user's auth token
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(20);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ conversations: data });

  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
}