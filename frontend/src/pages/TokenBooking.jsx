import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/tokenBooking.css";

const TokenBooking = () => {
  const [branches, setBranches] = useState([]);
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

  // Fetch branches & services
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

  // Fetch slots whenever filters change
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
        setMessage(
          `✅ Token Booked! Your Token Number is ${res.data.tokenNumber}`
        );

      })
      
      .catch(() => setMessage("❌ Token booking failed. Try again."));
  };

  return (
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
            onChange={handleChange}
            required
          />
        <br></br>
          <label>Select Slot:</label>
          <select
            name="slotTime"
            value={formData.slotTime}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Slot --</option>
            {slots.map((slot) => (
              <option
                key={slot.slotTime}
                value={slot.slotTime}
                disabled={slot.booked}
                style={{
                  color: slot.isBooked ? "red" : "green",
                  fontWeight: slot.isBooked ? "bold" : "normal",
                }}
              >
                {slot.slotTime} {slot.booked ? "(Booked)" : `(Available)`};
              </option>
            ))}
          </select>

          <button type="submit">Book Token</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default TokenBooking;
