import React,{useEffect, useState} from "react";
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import "../components/dashboard.css"

const COLORS = ['#8884d8','#82ca9d','#ffc658','#ff8042'];

const CustomTooltip = ({ active, payload }) => {
  if (active && Array.isArray(payload) && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-2 border rounded shadow">
        <p className="label font-semibold">Branch: {data.name}</p>
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
        <p className="label font-semibold">Service: {data.name}</p>
        <p className="desc">Tokens: {data.count}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard =() => {
    const [byBranch, setByBranch] = useState([])
    const [byService,setByService] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] =useState(null);

    useEffect(() => {
        const fetchStats =async () => {
            try {
                setLoading(true);
                const [branchRes, serviceRes] = await Promise.all([
                    axios.get('http://localhost:8083/api/tokens/count-by-branch'),
                    axios.get('http://localhost:8083/api/tokens/count-by-service'),
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
                setError("Failed to fetch admin stats")
                setLoading(false);
            }
        };
        fetchStats();
    },[]);

    if(loading) return <p>Loading token summary....</p>
    if(error) return <p style={{color: 'red'}}>{error}</p>;

    return (
         <div className="dashboard-container p-6">
        <div className="p-6">
            <div className="dashboard-header">
                <h2 className="text-2xl font-bold mb-6">📊 Admin Token Summary</h2>
            </div>
            <div className="dashboard-grid">
                <div className="dashboard-section">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Tokens by Branch (Today)</h3>
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
                                        <td className="border p-2">{item.branch}</td>
                                        <td className="border p-2">{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <BarChart width={400} height={250} data={byBranch}>
                            <XAxis dataKey="branch" />
                            <YAxis allowDecimals={false} domain={[0, 'dataMax']} tickCount={6}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </div>
                </div>
                <div className="dashboard-section">
                    <div>
                    <h3 className="text-xl font-semibold mb-2">Tokens by Service</h3>
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
                                <td className="border p-2">{item.service}</td>
                                <td className="border p-2">{item.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <PieChart width={400} height={250}>
                        <Pie data={byService} dataKey="count" nameKey="service" cx="50%" cy="50%" outerRadius={80} label>
                        {byService.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend />
                    </PieChart>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;