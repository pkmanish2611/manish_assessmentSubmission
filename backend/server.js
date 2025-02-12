const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "https://manish-assessment-submission-frontend-9qqfdw9k9.vercel.app",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
};

app.use(cors(corsOptions));

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
