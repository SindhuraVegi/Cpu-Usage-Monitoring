import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Text,
    ResponsiveContainer
} from 'recharts';

interface ICpuUsage {
    core: string;
    usage: number;
    timestamp: number;
}

const App = () => {
    const [cpuData, setCpuData] = useState<ICpuUsage[]>([]);

    const [pollingIntervalTime, setPollingIntervalTime] = useState(1);
    const [graphPeriod, setGraphPeriod] = useState(10);

    const [width, setWidth] = useState(window.innerWidth * 0.95);
    const [height, setHeight] = useState(window.innerHeight * 0.7);
    const margin = {top: 20, right: 30, bottom: 20, left: 30};

    // Define the time range for the chart
    const dataStartTime = Date.now() - (graphPeriod * 60 * 1000);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/cpu/', {params: {dataStartTime}});
                setCpuData(response.data);
            } catch (error) {
                console.error('Error fetching CPU data:', error);
            }
        };

        // Fetch data every 1 second by default
        const pollingInterval = setInterval(() => {
            fetchData();
        }, pollingIntervalTime * 1000);

        // Cleanup pollingInterval on amount
        return () => clearInterval(pollingInterval);
    }, [pollingIntervalTime, graphPeriod]);

    const convertedData = cpuData.map(data => {
        const convertedTimestamp = new Date(data.timestamp).toLocaleString();
        return {...data, timestamp: convertedTimestamp};
    });

    // Group data by timestamp and create a data object for each timestamp
    const data = convertedData.reduce((result, {core, usage, timestamp}) => {
        const key = timestamp;
        if (!result[key]) {
            result[key] = {timestamp, [`${core}`]: usage};
        } else {
            result[key][`${core}`] = usage;
        }
        return result;
    }, {} as { [key: string]: { [key: string]: string | number } });

    // Convert data object to array of data points
    const chartData = Object.values(data);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get the latest usage of each core as a percentage
    const latestUsage = chartData[chartData.length - 1];

    console.log("latestUsage", latestUsage)

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

    return (
        <div>
            <h1>CPU Usage Chart per Core</h1>
            <label htmlFor="pollingIntervalTimeInput">Polling Interval(in seconds):</label>
            <input type="number" value={pollingIntervalTime} onChange={handlePollingIntervalChange}/>
            <label htmlFor="graphPeriod">Graph Period(in mins):</label>
            <input type="number" value={graphPeriod} onChange={handleGraphPeriodChange}/>
            <div style={{display: "flex", flexDirection: "row"}}>
                <table style={{
                    width: "20%",
                    height: "70%",
                    marginLeft: "10px",
                    border: '1px solid black',
                    borderCollapse: 'collapse'
                }}>
                    <thead>
                    <tr>
                        <th style={{border: '1px solid black', padding: '5px'}}>ID</th>
                        <th style={{border: '1px solid black', padding: '5px'}}>Latest Cpu Usage % per Core</th>
                    </tr>
                    </thead>
                    <tbody>
                    {latestUsage && Object.entries(latestUsage).map(([key, value]) =>
                        key !== "timestamp" ? (
                            <tr key={key}>
                                <td style={{border: '1px solid black', padding: '5px'}}>{key}</td>
                                <td style={{
                                    border: '1px solid black',
                                    padding: '5px'
                                }}>{(Number(value) * 100).toFixed(2)}%
                                </td>
                            </tr>
                        ) : null
                    )}
                    </tbody>
                </table>
                <ResponsiveContainer width="80%" aspect={2}>
                    <LineChart data={chartData} width={width} height={height} margin={margin}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                            allowDataOverflow={true}
                            interval="preserveEnd"
                            label={{
                                value: 'Time -->',
                                position: 'insideBottomRight',
                                offset: 0,
                                dy: 5
                            }}
                        />
                        <YAxis
                            tickFormatter={formatCpuUsage}
                            label={{
                                value: 'Usage  -->',
                                angle: -90,
                                offset: 10,
                                dx: -50
                            }}
                        />
                        <Tooltip formatter={formatCpuUsage}/>
                        <Legend/>
                        {chartData && chartData.length > 0 && Object.keys(chartData[0]).map((key) =>
                            key !== "timestamp" ? (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                    label={({x, y, width, height, value}) =>
                                        chartData[chartData.length - 1][key] === value ? (
                                            <Text
                                                x={x + width / 2}
                                                y={y - 16}
                                                dy={-10}
                                                fontSize={12}
                                                fill="#666"
                                                textAnchor="end"
                                                stroke="white"
                                                strokeWidth={0.5}
                                            >
                                                {value.toFixed(2)}
                                            </Text>
                                        ) : null
                                    }
                                />
                            ) : null
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default App;

