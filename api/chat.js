export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Check if API key is being picked up
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not found in environment' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20250514',
        max_tokens: 1024,
        system: 'You are a helpful Australian tax assistant. Give clear, concise answers about Australian tax. Always remind users to consult a registered tax agent for formal advice.',
        messages: [
          { role: 'user', content: message }
        ]
      })
    });

    // Get the raw response for debugging
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(500).json({ 
        error: 'Claude API error', 
        status: response.status,
        details: data 
      });
    }

    const reply = data.content[0].text;
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
}