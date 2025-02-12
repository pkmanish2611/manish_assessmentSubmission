const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
