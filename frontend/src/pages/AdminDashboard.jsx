import React,{useEffect, useState} from "react";
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell,ResponsiveContainer
} from 'recharts';
import "../components/dashboard.css"

const COLORS = ['#8884d8','#82ca9d','#ffc658','#ff8042'];

const CustomTooltip = ({ active, payload }) => {
  if (active && Array.isArray(payload) && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-2 border rounded shadow">
        <p className="label font-semibold">Branch: {data.branch}</p>
        <p className="desc">Tokens: {data.count}</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && Array.isArray(payload) && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-2 border rounded shadow">
        <p className="label font-semibold">Service: {data.service}</p>
        <p className="desc">Tokens: {data.count}</p>
      </div>
    );
  }
  return null;
};

const exportCSV = (data, filename,type) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        alert("No data available to download!");
        return;
    }
    const csvRows = [];

    let headers = [];
    if(type === "branch") {
        headers = ["Branch Name", "Token Count"];
    } else if(type === "service") {
        headers = ["Service Name", "Token Count"];
    }

    csvRows.push(headers.join(","));

    for (const row of data) {
        if(type === "branch") {
            csvRows.push([row.name, row.count].join(","));
        } else if(type === "service") {
            csvRows.push([row.name, row.count].join(","));
        }
    }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

const AdminDashboard =() => {
    const [byBranch, setByBranch] = useState([]);
    const [byService,setByService] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] =useState(null);
    const [selectedMonth, setSelectedMonth] = useState(""); // store month like "2025-09"

    const fetchStats = async (month="") => {
        try {
            setLoading(true);
            let branchUrl = "http://localhost:8083/api/tokens/count-by-branch";
            let serviceUrl = "http://localhost:8083/api/tokens/count-by-service";

            if(month){
                branchUrl += `?month=${month}`;
                serviceUrl += `?month=${month}`;
            }

            const [branchRes, serviceRes] = await Promise.all([
                axios.get(branchUrl),
                axios.get(serviceUrl),
            ]);

            setByBranch(branchRes.data.map(item => ({
                ...item,
                count: Math.round(item.count)
            })));
            setByService(serviceRes.data.map(item => ({
                ...item,
                count: Math.round(item.count)
            })));
            setLoading(false);

        } catch(err) {
            console.error(err);
            setError("Failed to fetch admin stats");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats(selectedMonth);
    }, [selectedMonth]); // re-fetch whenever month changes

    if(loading) return <p>Loading token summary....</p>
    if(error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div className="dashboard-container p-6">
        <div className="dashboard-content">
            <div className="dashboard-header flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-6">📊 Admin Token Summary</h2>

                {/* Month Filter */}
                <div>
                  <label className="mr-2 font-medium">Filter by Month:</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                </div>
            </div>

            <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="dashboard-section">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Tokens by Branch {selectedMonth ? `(Month: ${selectedMonth})` : "(Today)"}
                        </h3>
                        <table className="w-full border mb-4">
                            <thead>
                                <tr>
                                    <th className="border p-2">Branch Name</th>
                                    <th className="border p-2">Token Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byBranch.map((item,idx) => (
                                    <tr key={idx}>
                                        <td className="border p-2">{item.name}</td>
                                        <td className="border p-2">{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <ResponsiveContainer width={400} height={250}>
                        <BarChart data={byBranch}>
                            <XAxis dataKey="branch" />
                            <YAxis allowDecimals={false} domain={[0, 'dataMax']} tickCount={6}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="dashboard-section">
                    <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Tokens by Service {selectedMonth ? `(Month: ${selectedMonth})` : ""}
                    </h3>
                    <table className="w-full border mb-4">
                        <thead>
                            <tr>
                                <th className="border p-2">Service Name</th>
                                <th className="border p-2">Token Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {byService.map((item, idx) => (
                                <tr key={idx}>
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2">{item.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ResponsiveContainer width={400} height={250}>
                    <PieChart>
                        <Pie data={byService} dataKey="count" nameKey="service" cx="50%" cy="50%" outerRadius={80} label>
                        {byService.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend />
                    </PieChart>
                    </ResponsiveContainer>
                    </div>
                </div>
                </div>
                <div className="download-buttons">
                    <button
                        onClick={() => exportCSV(byBranch, "branch_report.csv","branch")}
                        className="download-button"
                    >Download Branch Report
                    </button>
                    <button
                        onClick={() => exportCSV(byService, "service_report.csv", "service")}
                        className="download-button"
                    >
                        Download Service Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
