import mongoose from 'mongoose';

interface ICpuUsage extends mongoose.Document {
  core: string;
  usage: number;
  timestamp: number;
}

const CpuUsageSchema = new mongoose.Schema(
  {
    core: {
      type: String,
      required: true,
    },
    usage: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const CpuUsage = mongoose.model<ICpuUsage>('CpuUsage', CpuUsageSchema);

export default CpuUsage;
