import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/mytokens.css"; // Import the CSS

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchTokens = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to view your tokens");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8083/api/tokens/user/${userId}`
      );
      setTokens(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

const cancelToken = async (id) => {
    try {
      const response= await axios.put(`http://localhost:8083/api/tokens/${id}/cancel`);

      alert("Token cancelled successfully!");
      const updatedToken = response.data;

      setTokens((prevTokens) =>
        prevTokens.map((token) =>
          token.id === id ? { ...token, status: updatedToken.status } : token
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error cancelling token");
    }
  };

  const handleClearHistory = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please log in first");
      return;
    }

    try {
      await axios.delete(`http://localhost:8083/api/users/clear-history/${userId}`);
      setTokens([]); 
      setSuccess("Token history cleared successfully!");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to clear token history");
    }
  };

  return (
    <div className="tokens-container">
      <h2 className="tokens-title">🎟 My Booked Tokens</h2>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {!error && tokens.length === 0 && !loading && (
        <p className="no-tokens">No tokens found.</p>
      )}

      {tokens.length > 0 && (
        <>
          <button className="clear-history-btn" onClick={handleClearHistory}>
            Clear History
          </button>

          <table className="tokens-table">
            <thead>
              <tr>
                <th>Token Number</th>
                <th>Branch</th>
                <th>Service</th>
                <th>Status</th>
                <th>Booking Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id}>
                  <td>{token.tokenNumber}</td>
                  <td>{token.branch?.name}</td>
                  <td>{token.service?.name}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        token.status?.toLowerCase() || ""
                      }`}
                    >
                      {token.status}
                    </span>
                  </td>
                  <td>{token.slotTime}</td>
                  <td>
                    {(token.status === "BOOKED") && (
                      <button onClick ={() => cancelToken(token.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default MyTokens;
