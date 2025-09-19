import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../components/summary.css";

const AdminTokenSummary = () => {
  const [summary, setSummary] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [branchId, setBranchId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // Fetch summary + today's tokens
  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const summaryRes = await axios.get("http://localhost:8083/api/tokens/summary/today");
      const tokensRes = await axios.get("http://localhost:8083/api/tokens/today");

      setSummary(summaryRes.data);
      setTokens(tokensRes.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch token data.");
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get('http://localhost:8083/api/tokens/filter', {
        params: {
          branchId,
          serviceId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      });
      setTokens(response.data);
    } catch (error) {
      console.log('Error fetching filtered tokens:', error);
    }
  };

  const updateStatus = async (tokenId, newStatus) => {
    try {
      await axios.put(`http://localhost:8083/api/tokens/${tokenId}/status`, null, { params: { newStatus } });
      setTokens(prevTokens =>
        prevTokens.map(t =>
          t.id === tokenId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  if (loading) return <p>Loading summary...</p>;
  if (error) return <p className='error'>{error}</p>;

  return (
    <>
    <div className="summary-container">
      <h2 className='page-title'>Today's Token Summary</h2>

      {/* Summary Cards */}
      <div className="summary-cards" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <SummaryCard title="Total Tokens" count={summary.totalTokens} color="#333" />
        <SummaryCard title="Completed" count={summary.completedTokens} color="green" />
        <SummaryCard title="Booked" count={summary.bookedTokens} color="orange" />
        <SummaryCard title="Processing" count={summary.processingTokens} color="blue" />
        <SummaryCard title="Cancelled" count={summary.cancelledTokens} color="red" />
        <SummaryCard title="Expired" count={summary.expiredTokens} color="red" />
      </div>

      {/* Filter Section */}
      <div className='filter-box'>
        <h3>Filter Tokens</h3>
        <div className='filter-controls'>
          <input type="number" placeholder="Branch ID" value={branchId} onChange={(e) => setBranchId(e.target.value)} />
          <input type="number" placeholder="Service ID" value={serviceId} onChange={(e) => setServiceId(e.target.value)} />
          <DatePicker selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect dateFormat="yyyy-MM-dd'T'HH:mm" />
          <DatePicker selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect dateFormat="yyyy-MM-dd'T'HH:mm" />
          <button onClick={handleFilter} className='filter-btn'>
            Apply Filter
          </button>
        </div>
      </div>

      {/* Token Table */}
      <h3 className='table-title'>Tokens</h3>
      <table className='table-wrapper'>
        <thead className='token-table'>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Service</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(token => (
            <tr key={token.id}>
              <td>{token.id}</td>
              <td>{token.user?.name}</td>
              <td>{token.service?.name}</td>
              <td>{token.status}</td>
              <td>
                <select
                  value={token.status}
                  onChange={(e) => updateStatus(token.id, e.target.value)}
                >
                  <option value="BOOKED">Booked</option>
                  <option value="IN_PROCESS">Processing</option>
                  <option value="SERVED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <footer className="footer">
      &copy; {new Date().getFullYear()} Bank Token Booking System. All rights reserved.
    </footer>
    </>
  );
};

const SummaryCard = ({ title, count, color }) => (
  <div className='summary-card' style={{borderLeft: `6px solid ${color}`}}>
    <h4>{title}</h4>
    <p style={{ color }}>{count}</p>
  </div>
);

export default AdminTokenSummary;
