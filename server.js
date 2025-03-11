import express from 'express';
import apiRoutes from './routes/api.js'; // Ensure the correct path and extension
const app = express();
app.use(express.json())

app.use('/api', apiRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});