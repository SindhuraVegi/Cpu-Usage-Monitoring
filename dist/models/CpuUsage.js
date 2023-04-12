"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CpuUsageSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const CpuUsage = mongoose_1.default.model('CpuUsage', CpuUsageSchema);
exports.default = CpuUsage;
//# sourceMappingURL=CpuUsage.js.map