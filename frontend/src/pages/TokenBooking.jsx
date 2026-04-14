// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import "../components/tokenBooking.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../AuthContext";
// import { useNavigate } from "react-router-dom";

// const TokenBooking = () => {
//   const [banks, setBanks] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [services, setServices] = useState([]);
//   const [slots, setSlots] = useState([]);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     bankId: "",
//     branchId: "",
//     serviceId: "",
//     transactionType: "",
//     slotTime: "",
//     bookingDate: new Date().toISOString().split("T")[0],
//   });

//   const today = new Date();
//   const next7Days = new Date(today);
//   next7Days.setDate(today.getDate() + 7);

//   const formatDate = (date) => date.toISOString().split("T")[0];

//   /* AUTH CHECK */
//   useEffect(() => {
//     if (!authLoading && !user) navigate("/login");
//   }, [user, authLoading, navigate]);

//   /* FETCH BANKS */
//   useEffect(() => {
//     if (!user) return;
//     api.get(`/banks/user/${user.id}`)
//       .then(res => setBanks(res.data))
//       .catch(() => toast.error("Failed to load banks"));
//   }, [user]);

//   /* BANK CHANGE */
//   const handleBankChange = async (e) => {
//     const bankId = e.target.value;
//     setFormData({
//       bankId,
//       branchId: "",
//       serviceId: "",
//       transactionType: "",
//       slotTime: "",
//       bookingDate: formData.bookingDate,
//     });

//     if (!bankId) return;
//     const res = await api.get(`/branches/bank/${bankId}`);
//     setBranches(res.data);
//     setServices([]);
//     setSlots([]);
//   };

//   /* BRANCH CHANGE */
//   const handleBranchChange = async (e) => {
//     const branchId = e.target.value;
//     setFormData(prev => ({
//       ...prev,
//       branchId,
//       serviceId: "",
//       transactionType: "",
//       slotTime: "",
//     }));

//     if (!branchId) return;
//     const res = await api.get(`/services/branch/${branchId}`);
//     setServices(res.data);
//     setSlots([]);
//   };

//   /* HANDLE INPUT CHANGE */
//   const handleChange = (e) =>
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   /* FETCH SLOTS */
//   useEffect(() => {
//     if (
//       formData.branchId &&
//       formData.serviceId &&
//       formData.transactionType &&
//       formData.bookingDate
//     ) {
//       const branchName = branches.find(b => b.id == formData.branchId)?.name;
//       const serviceName = services.find(s => s.id == formData.serviceId)?.name;

//       api.get("/tokens/slots", {
//         params: {
//           date: formData.bookingDate,
//           serviceId: formData.serviceId,
//         },
//       })
//         .then(res => setSlots(res.data))
//         .catch(() => setSlots([]));
//     }
//   }, [
//     formData.branchId,
//     formData.serviceId,
//     formData.transactionType,
//     formData.bookingDate,
//     branches,
//     services,
//   ]);

//   /* SEND OTP */
//   const handleSendOtp = async (e) => {
//     e.preventDefault();

//     if (!formData.slotTime) {
//       toast.error("Please select a slot");
//       return;
//     }

//     await api.post(`/tokens/send-otp?userId=${user.id}`);
//     toast.success("OTP sent");
//     setOtpSent(true);
//   };
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();

//     if (!otp) {
//       toast.error("Please enter OTP");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await api.post(
//         `/tokens/verify-otp`,
//         {
//           ...formData,
//           userId: user.id, // goes in body (TokenRequest)
//         },
//         {
//           params: {
//             userId: user.id,
//             otp: otp,
//           },
//         }
//       );

//       toast.success("🎉 Token booked successfully!");

//       // Reset state
//       setOtp("");
//       setOtpSent(false);

//       // Navigate to My Tokens
//       navigate("/my-tokens");

//     } catch (error) {
//       console.error(error);

//       if (error.response?.data) {
//         toast.error(error.response.data); // shows "Invalid OTP"
//       } else {
//         toast.error("Something went wrong ❌");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="token-page">
//       <div className="token-booking-container">
//         <div className="token-booking-layout">

//           {/* LEFT PANEL */}
//           <div className="token-form-panel">
//             <h2>Book Your Token</h2>
//             <p className="subtitle">Fill the details and choose a slot</p>

//             {!otpSent ? (
//               <form onSubmit={handleSendOtp}>

//                 <label>Bank</label>
//                 <select name="bankId" value={formData.bankId} onChange={handleBankChange} required>
//                   <option value="">-- Select Bank --</option>
//                   {banks.map(b => (
//                     <option key={b.id} value={b.id}>{b.name}</option>
//                   ))}
//                 </select>

//                 <label>Branch</label>
//                 <select name="branchId" value={formData.branchId} onChange={handleBranchChange} required>
//                   <option value="">-- Select Branch --</option>
//                   {branches.map(br => (
//                     <option key={br.id} value={br.id}>
//                       {br.name} ({br.location})
//                     </option>
//                   ))}
//                 </select>

//                 <label>Service</label>
//                 <select name="serviceId" value={formData.serviceId} onChange={handleChange} required>
//                   <option value="">-- Select Service --</option>
//                   {services.map(s => (
//                     <option key={s.id} value={s.id}>{s.name}</option>
//                   ))}
//                 </select>

//                 {/* 🔥 TRANSACTION TYPE (FULLY FIXED) */}
//                 {formData.serviceId && (() => {
//                   const selectedService = services.find(
//                     s => s.id == formData.serviceId
//                   );
//                   if (!selectedService) return null;

//                   if (selectedService.predefinedTransaction) {
//                     // if (formData.transactionType !== selectedService.predefinedTransaction) {
//                     //   setFormData(prev => ({
//                     //     ...prev,
//                     //     transactionType: selectedService.predefinedTransaction,
//                     //   }));
//                     // }
//                     useEffect(() => {
//                       const selectedService = services.find(
//                         s => s.id == formData.serviceId
//                       );

//                       if (!selectedService) return;

//                       if (selectedService.predefinedTransaction) {
//                         setFormData(prev => {
//                           if (prev.transactionType === selectedService.predefinedTransaction) {
//                             return prev; // avoid loop
//                           }

//                           return {
//                             ...prev,
//                             transactionType: selectedService.predefinedTransaction,
//                           };
//                         });
//                       }
//                     }, [formData.serviceId, services]);
//                     return (
//                       <>
//                         <label>Transaction Type</label>
//                         <input
//                           type="text"
//                           value={selectedService.predefinedTransaction}
//                           readOnly
//                           className="readonly-input"
//                         />
//                       </>
//                     );
//                   }

//                   if (selectedService.requiresTransaction) {
//                     return (
//                       <>
//                         <label>Transaction Type</label>
//                         <select
//                           name="transactionType"
//                           value={formData.transactionType}
//                           onChange={handleChange}
//                           required
//                         >
//                           <option value="">-- Select Transaction --</option>
//                           <option value="DEPOSIT">Deposit</option>
//                           <option value="WITHDRAW">Withdraw</option>
//                         </select>
//                       </>
//                     );
//                   }

//                   return null;
//                 })()}

//                 <label>Booking Date</label>
//                 <input
//                   type="date"
//                   name="bookingDate"
//                   value={formData.bookingDate}
//                   min={formatDate(today)}
//                   max={formatDate(next7Days)}
//                   onChange={handleChange}
//                   required
//                 />

//                 <button className="primary-action" type="submit">
//                   Send OTP
//                 </button>
//               </form>
//             ) : (
//               <form className="otp-section" onSubmit={handleVerifyOtp}>
//                 <h3>Verify OTP</h3>
//                 <input
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//                 <button className="primary-action" type="submit" disabled={loading}>
//                   {loading ? "Processing..." : "Verify & Book"}
//                 </button>
//               </form>
//             )}
//           </div>

//           {/* RIGHT PANEL */}
//           <div className="token-slots-panel">
//             <h3>Available Slots</h3>

//             {!formData.branchId ||
//             !formData.serviceId ||
//             !formData.transactionType ? (
//               <p className="slot-info">
//                 Select branch, service and date to view slots.
//               </p>
//             ) : slots.length === 0 ? (
//               <p className="slot-info error">
//                 No slots available for selected date.
//               </p>
//             ) : (
//               <div className="slots-grid large">
//                 {slots.map((slot) => (
//                   <button
//                     key={slot.slotTime}
//                     type="button"
//                     className={`slot-btn ${slot.booked ? "booked" : "available"} ${
//                       formData.slotTime === slot.slotTime ? "selected" : ""
//                     }`}
//                     disabled={slot.booked}
//                     onClick={() =>
//                       setFormData(prev => ({
//                         ...prev,
//                         slotTime: slot.slotTime,
//                       }))
//                     }
//                   >
//                     {slot.slotTime}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//         </div>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// };

// export default TokenBooking;
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../components/tokenBooking.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TokenBooking = () => {
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bankId: "",
    branchId: "",
    serviceId: "",
    transactionType: "",
    slotTime: "",
    bookingDate: new Date().toISOString().split("T")[0],
  });

  const today = new Date();
  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);

  const formatDate = (date) => date.toISOString().split("T")[0];

  /* Helper: Check if date is weekend (Saturday=6, Sunday=0) */
  const isWeekend = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  /* Helper: Get next non-weekend date */
  const getNextWeekday = (date) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    while (isWeekend(formatDate(nextDate))) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    return nextDate;
  };

  /* Helper: Get the 5th weekday from today */
  const get5thWeekday = () => {
    const date = new Date(today);
    let weekdayCount = 0;
    while (weekdayCount < 5) {
      date.setDate(date.getDate() + 1);
      if (!isWeekend(formatDate(date))) {
        weekdayCount++;
      }
    }
    return date;
  };

  /* Helper: Get nearest weekday if weekend is selected */
  const getNearestWeekday = (dateStr) => {
    if (!isWeekend(dateStr)) return dateStr;
    let date = new Date(dateStr + "T00:00:00");
    while (isWeekend(formatDate(date))) {
      date.setDate(date.getDate() - 1);
    }
    return formatDate(date);
  };

  /* Helper: Filter function to disable weekends */
  const filterWeekdays = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  /* AUTH CHECK */
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  /* FETCH BANKS */
  useEffect(() => {
    if (!user) return;
    api.get(`/banks/user/${user.id}`)
      .then(res => setBanks(res.data))
      .catch(() => toast.error("Failed to load banks"));
  }, [user]);

  /* 🔥 FIXED: SET TRANSACTION TYPE (moved from JSX) */
  useEffect(() => {
    const selectedService = services.find(
      s => s.id == formData.serviceId
    );

    if (!selectedService) return;

    if (selectedService.predefinedTransaction) {
      setFormData(prev => {
        if (prev.transactionType === selectedService.predefinedTransaction) {
          return prev;
        }

        return {
          ...prev,
          transactionType: selectedService.predefinedTransaction,
        };
      });
    }
  }, [formData.serviceId, services]);

  /* BANK CHANGE */
  const handleBankChange = async (e) => {
    const bankId = e.target.value;
    setFormData({
      bankId,
      branchId: "",
      serviceId: "",
      transactionType: "",
      slotTime: "",
      bookingDate: formData.bookingDate,
    });

    if (!bankId) return;
    const res = await api.get(`/branches/bank/${bankId}`);
    setBranches(res.data);
    setServices([]);
    setSlots([]);
  };

  /* BRANCH CHANGE */
  const handleBranchChange = async (e) => {
    const branchId = e.target.value;
    setFormData(prev => ({
      ...prev,
      branchId,
      serviceId: "",
      transactionType: "",
      slotTime: "",
    }));

    if (!branchId) return;
    const res = await api.get(`/services/branch/${branchId}`);
    setServices(res.data);
    setSlots([]);
  };

  /* HANDLE INPUT CHANGE */
  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  /* 🔥 FIXED SLOT FETCH (removed unnecessary deps) */
  useEffect(() => {
    if (
      formData.branchId &&
      formData.serviceId &&
      formData.transactionType &&
      formData.bookingDate
    ) {
      api.get("/tokens/slots", {
        params: {
          date: formData.bookingDate,
          serviceId: formData.serviceId,
        },
      })
        .then(res => setSlots(res.data))
        .catch(err => {
          console.error("Slots error:", err);
          setSlots([]);
        });
    }
  }, [
    formData.branchId,
    formData.serviceId,
    formData.transactionType,
    formData.bookingDate,
  ]);

  /* SEND OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.slotTime) {
      toast.error("Please select a slot");
      return;
    }

    await api.post(`/tokens/send-otp?userId=${user.id}`);
    toast.success("OTP sent");
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        `/tokens/verify-otp`,
        {
          ...formData,
          userId: user.id,
        },
        {
          params: {
            userId: user.id,
            otp: otp,
          },
        }
      );

      toast.success("🎉 Token booked successfully!");

      setOtp("");
      setOtpSent(false);
      navigate("/my-tokens");

    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Something went wrong ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-page">
      <div className="token-booking-container">
        <div className="token-booking-layout">

          {/* LEFT PANEL */}
          <div className="token-form-panel">
            <h2>Book Your Token</h2>
            <p className="subtitle">Fill the details and choose a slot</p>

            {!otpSent ? (
              <form onSubmit={handleSendOtp}>

                <label>Bank</label>
                <select name="bankId" value={formData.bankId} onChange={handleBankChange} required>
                  <option value="">-- Select Bank --</option>
                  {banks.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>

                <label>Branch</label>
                <select name="branchId" value={formData.branchId} onChange={handleBranchChange} required>
                  <option value="">-- Select Branch --</option>
                  {branches.map(br => (
                    <option key={br.id} value={br.id}>
                      {br.name} ({br.location})
                    </option>
                  ))}
                </select>

                <label>Service</label>
                <select name="serviceId" value={formData.serviceId} onChange={handleChange} required>
                  <option value="">-- Select Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                {/* ✅ CLEAN JSX */}
                {formData.serviceId && (() => {
                  const selectedService = services.find(
                    s => s.id == formData.serviceId
                  );
                  if (!selectedService) return null;

                  if (selectedService.predefinedTransaction) {
                    return (
                      <>
                        <label>Transaction Type</label>
                        <input
                          type="text"
                          value={selectedService.predefinedTransaction}
                          readOnly
                          className="readonly-input"
                        />
                      </>
                    );
                  }

                  if (selectedService.requiresTransaction) {
                    return (
                      <>
                        <label>Transaction Type</label>
                        <select
                          name="transactionType"
                          value={formData.transactionType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Transaction --</option>
                          <option value="DEPOSIT">Deposit</option>
                          <option value="WITHDRAW">Withdraw</option>
                        </select>
                      </>
                    );
                  }

                  return null;
                })()}

                <label>Booking Date</label>
                <DatePicker
                  selected={new Date(formData.bookingDate + "T00:00:00")}
                  onChange={(date) => {
                    if (date) {
                      const dateStr = formatDate(date);
                      setFormData(prev => ({ ...prev, bookingDate: dateStr }));
                    }
                  }}
                  minDate={today}
                  maxDate={get5thWeekday()}
                  filterDate={filterWeekdays}
                  dateFormat="yyyy-MM-dd"
                  className="date-picker-input"
                  placeholderText="Select a date"
                  required
                />

                <button className="primary-action" type="submit">
                  Send OTP
                </button>
              </form>
            ) : (
              <form className="otp-section" onSubmit={handleVerifyOtp}>
                <h3>Verify OTP</h3>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button className="primary-action" type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Verify & Book"}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="token-slots-panel">
            <h3>Available Slots</h3>

            {!formData.branchId ||
            !formData.serviceId ||
            !formData.transactionType ? (
              <p className="slot-info">
                Select branch, service and date to view slots.
              </p>
            ) : slots.length === 0 ? (
              <p className="slot-info error">
                No slots available for selected date.
              </p>
            ) : (() => {
              const currentTime = new Date();
              const currentDateStr = formatDate(currentTime);
              const isToday = formData.bookingDate === currentDateStr;
              
              const filteredSlots = slots.filter((slot) => {
                if (!isToday) return true;
                
                const [hours, minutes] = slot.slotTime.split(":");
                const slotTime = new Date();
                slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                
                return slotTime > currentTime;
              });
              
              return (
                <div className="slots-grid large">
                  {filteredSlots.length === 0 ? (
                    <p className="slot-info error" style={{gridColumn: "1/-1"}}>No future slots available for today.</p>
                  ) : (
                    filteredSlots.map((slot) => (
                      <button
                        key={slot.slotTime}
                        type="button"
                        className={`slot-btn ${slot.booked ? "booked" : "available"} ${
                          formData.slotTime === slot.slotTime ? "selected" : ""
                        }`}
                        disabled={slot.booked}
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            slotTime: slot.slotTime,
                          }))
                        }
                      >
                        {slot.slotTime}
                      </button>
                    ))
                  )}
                </div>
              );
            })()}
          </div>

        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TokenBooking;