"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const os_1 = __importDefault(require("os"));
const CpuUsage_1 = __importDefault(require("../models/CpuUsage"));
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
mongoose_1.default.connect('mongodb://localhost:27017/cpu-data', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.get('/api/cpu', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataStartTime = req.query.dataStartTime;
    const usage = os_1.default.cpus().map((cpu, index) => ({
        core: `Core ${index + 1}`,
        usage: cpu.times.user / cpu.times.idle,
        timestamp: Date.now(),
    }));
    try {
        const savedUsage = yield CpuUsage_1.default.insertMany(usage);
        const data = yield CpuUsage_1.default.find({
            timestamp: { $gte: new Date(parseInt(dataStartTime)) },
        }).sort({ timestamp: 1 });
        res.json(data);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map