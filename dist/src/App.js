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
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const recharts_1 = require("recharts");
const App = () => {
    const [cpuData, setCpuData] = (0, react_1.useState)([]);
    const [pollingIntervalTime, setPollingIntervalTime] = (0, react_1.useState)(1);
    const [graphPeriod, setGraphPeriod] = (0, react_1.useState)(10);
    const [width, setWidth] = (0, react_1.useState)(window.innerWidth * 0.95);
    const [height, setHeight] = (0, react_1.useState)(window.innerHeight * 0.7);
    const margin = { top: 20, right: 30, bottom: 20, left: 30 };
    // Define the time range for the chart
    const dataStartTime = Date.now() - (graphPeriod * 60 * 1000);
    (0, react_1.useEffect)(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get('http://localhost:8080/api/cpu/', { params: { dataStartTime } });
                setCpuData(response.data);
            }
            catch (error) {
                console.error('Error fetching CPU data:', error);
            }
        });
        // Fetch data every 1 second by default
        const pollingInterval = setInterval(() => {
            fetchData();
        }, pollingIntervalTime * 1000);
        // Cleanup pollingInterval on amount
        return () => clearInterval(pollingInterval);
    }, [pollingIntervalTime, graphPeriod]);
    const convertedData = cpuData.map(data => {
        const convertedTimestamp = new Date(data.timestamp).toLocaleString();
        return Object.assign(Object.assign({}, data), { timestamp: convertedTimestamp });
    });
    // Group data by timestamp and create a data object for each timestamp
    const data = convertedData.reduce((result, { core, usage, timestamp }) => {
        const key = timestamp;
        if (!result[key]) {
            result[key] = { timestamp, [`${core}`]: usage };
        }
        else {
            result[key][`${core}`] = usage;
        }
        return result;
    }, {});
    // Convert data object to array of data points
    const chartData = Object.values(data);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // Get the latest usage of each core as a percentage
    const latestUsage = chartData[chartData.length - 1];
    console.log("latestUsage", latestUsage);
    // Define a custom tick formatter for XAxis
    const formatXAxis = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
    const formatCpuUsage = (value) => `${(value * 100).toFixed(2)}%`;
    const handlePollingIntervalChange = (event) => {
        const newPollingIntervalTime = parseInt(event.target.value);
        setPollingIntervalTime(newPollingIntervalTime);
    };
    const handleGraphPeriodChange = (event) => {
        const newGraphPeriod = parseInt(event.target.value);
        setGraphPeriod(newGraphPeriod);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "CPU Usage Chart per Core" }), (0, jsx_runtime_1.jsx)("label", Object.assign({ htmlFor: "pollingIntervalTimeInput" }, { children: "Polling Interval(in seconds):" })), (0, jsx_runtime_1.jsx)("input", { type: "number", value: pollingIntervalTime, onChange: handlePollingIntervalChange }), (0, jsx_runtime_1.jsx)("label", Object.assign({ htmlFor: "graphPeriod" }, { children: "Graph Period(in mins):" })), (0, jsx_runtime_1.jsx)("input", { type: "number", value: graphPeriod, onChange: handleGraphPeriodChange }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { display: "flex", flexDirection: "row" } }, { children: [(0, jsx_runtime_1.jsxs)("table", Object.assign({ style: {
                            width: "20%",
                            height: "70%",
                            marginLeft: "10px",
                            border: '1px solid black',
                            borderCollapse: 'collapse'
                        } }, { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", Object.assign({ style: { border: '1px solid black', padding: '5px' } }, { children: "ID" })), (0, jsx_runtime_1.jsx)("th", Object.assign({ style: { border: '1px solid black', padding: '5px' } }, { children: "Latest Cpu Usage % per Core" }))] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: latestUsage && Object.entries(latestUsage).map(([key, value]) => key !== "timestamp" ? ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", Object.assign({ style: { border: '1px solid black', padding: '5px' } }, { children: key })), (0, jsx_runtime_1.jsxs)("td", Object.assign({ style: {
                                                border: '1px solid black',
                                                padding: '5px'
                                            } }, { children: [(Number(value) * 100).toFixed(2), "%"] }))] }, key)) : null) })] })), (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, Object.assign({ width: "80%", aspect: 2 }, { children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, Object.assign({ data: chartData, width: width, height: height, margin: margin }, { children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "timestamp", tickFormatter: formatXAxis, allowDataOverflow: true, interval: "preserveEnd", label: {
                                        value: 'Time -->',
                                        position: 'insideBottomRight',
                                        offset: 0,
                                        dy: 5
                                    } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tickFormatter: formatCpuUsage, label: {
                                        value: 'Usage  -->',
                                        angle: -90,
                                        offset: 10,
                                        dx: -50
                                    } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { formatter: formatCpuUsage }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), chartData && chartData.length > 0 && Object.keys(chartData[0]).map((key) => key !== "timestamp" ? ((0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: key, stroke: `#${Math.floor(Math.random() * 16777215).toString(16)}`, label: ({ x, y, width, height, value }) => chartData[chartData.length - 1][key] === value ? ((0, jsx_runtime_1.jsx)(recharts_1.Text, Object.assign({ x: x + width / 2, y: y - 16, dy: -10, fontSize: 12, fill: "#666", textAnchor: "end", stroke: "white", strokeWidth: 0.5 }, { children: value.toFixed(2) }))) : null }, key)) : null)] })) }))] }))] }));
};
exports.default = App;
//# sourceMappingURL=App.js.map