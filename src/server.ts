import express from 'express';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import os from 'os';
import CpuUsage from '../models/CpuUsage';

const app = express();
const port = 8080;

app.use(cors());

mongoose.connect('mongodb://localhost:27017/cpu-data', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as ConnectOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/api/cpu', async (req, res) => {

  const dataStartTime = req.query.dataStartTime as string;

  const usage = os.cpus().map((cpu, index) => ({
    core: `Core ${index + 1}`,
    usage: cpu.times.user / cpu.times.idle,
    timestamp: Date.now(),
  }));

  try {
    const savedUsage = await CpuUsage.insertMany(usage);
    const data = await CpuUsage.find({
    timestamp: { $gte: new Date(parseInt(dataStartTime))},
  }).sort({ timestamp: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
