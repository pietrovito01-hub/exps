// In-memory storage for demonstration purposes.
// Note: In a production serverless environment, this data will be lost
// when the function "cold starts". Connect to a database (like MongoDB/Postgres)
// for permanent storage.
let expenses = [
  { id: 1, description: 'Server Setup', amount: 15.00, date: '2023-10-27' },
  { id: 2, description: 'Domain Name', amount: 12.00, date: '2023-10-28' }
];

export default function handler(req, res) {
  // Set CORS headers to allow requests from any origin (or specify your frontend URL)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return all expenses
    return res.status(200).json(expenses);
  } 
  
  if (req.method === 'POST') {
    // Add a new expense
    try {
      const { description, amount, date } = req.body;

      // Basic validation
      if (!description || !amount) {
        return res.status(400).json({ error: 'Description and amount are required' });
      }

      const newExpense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        date: date || new Date().toISOString().split('T')[0]
      };

      expenses.push(newExpense);
      return res.status(201).json(newExpense);

    } catch (error) {
      return res.status(500).json({ error: 'Failed to process data' });
    }
  }

  // Method not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
