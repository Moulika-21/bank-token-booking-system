import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/tokenBooking.css";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TokenBooking = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    branchId: "",
    serviceId: "",
    transactionType: "",
    slotTime: "",
    bookingDate: new Date().toISOString().split("T")[0],
  });
  const [message, setMessage] = useState("");
  const today = new Date();
  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get("http://localhost:8083/api/branches")
      .then((res) => setBranches(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:8083/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (formData.branchId && formData.serviceId && formData.transactionType) {
      const branchName = branches.find((b) => b.id == formData.branchId)?.name;
      const serviceName = services.find((s) => s.id == formData.serviceId)?.name;

      axios
        .get("http://localhost:8083/api/tokens/slots", {
          params: {
            branchName,
            serviceName,
            transactionType: formData.transactionType,
            date: formData.bookingDate,
          },
        })
        .then((res) => setSlots(res.data))
        .catch((err) => console.error(err));
    }
  }, [
    formData.branchId,
    formData.serviceId,
    formData.transactionType,
    formData.bookingDate,
    branches,
    services,
  ]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      setMessage("Please log in first");
      return;
    }
    if (!formData.branchId || !formData.serviceId || !formData.slotTime) {
      setMessage("Please fill in all fields");
      return;
    }
    const payload = {
      branchId: Number(formData.branchId),
      serviceId: Number(formData.serviceId),
      transactionType: formData.transactionType,
      slotTime: formData.slotTime,
      bookingDate: formData.bookingDate,
      userId: userId,
    };
    axios
      .post("http://localhost:8083/api/tokens/book", payload)
      .then((res) => {
        toast.success(`✅ Token Booked! Your Token Number is ${res.data.tokenNumber}`);
      })
      
      .catch((err) => { 
        
        const errorMsg= err.response?.data?.message || "❌ Token booking failed. Try again.";
        toast.error(errorMsg);
      })
      .finally(() => {
        setLoading(false);
      });
    };

  return (
    <div>
    <div className="token-booking-container">
      <div className="token-booking-box">
        <h2>Book a Token</h2>
        <form onSubmit={handleSubmit}>
          <label>Branch:</label>
          <select
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Branch --</option>
            {branches.map((branch) => (
              <option value={branch.id} key={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>

          <label>Service:</label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Service --</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          <label>Transaction Type:</label>
          <select
            name="transactionType"
            value={formData.transactionType}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Transaction Type --</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAW">Withdrawal</option>
          </select>

          <label>Booking Date:</label>
          <input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            min={formatDate(today)}  //  disables past dates
            max={formatDate(next7Days)} // only allows next 7 days
            onChange={handleChange}
            required
          />
        <br></br>
          <label>Select Slot:</label>
          <div className="slots-grid">
            {slots.map((slot) => (
              <button
                key={slot.slotTime}
                type="button"
                className={`slot-btn ${slot.booked ? "booked" : "available"} ${formData.slotTime === slot.slotTime ? "selected" : ""}`}
                onClick={() =>
                  !slot.booked &&
                  setFormData((prev) => ({ ...prev, slotTime: slot.slotTime }))
                }
                disabled={slot.booked}
              >
                {slot.slotTime}
              </button>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Token"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    <footer className="footer">
      &copy; {new Date().getFullYear()} Bank Token Booking System. All rights reserved.
    </footer>
    </div>
  );
};

export default TokenBooking;
