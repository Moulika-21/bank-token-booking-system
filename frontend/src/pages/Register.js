import ReCAPTCHA from "react-google-recaptcha";
import React, { useState,useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../components/Register.css';

const Register = () => {
    const [banks, setBanks] = useState([]);
    const [branches, setBranches] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        accountNumber: '',
        branchId: '',
        bankId: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8083/api/banks')
        .then(res => setBanks(res.data))
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (formData.bankId) {
        axios.get(`http://localhost:8083/api/branches/bank/${formData.bankId}`)
            .then(res => setBranches(res.data))
            .catch(err => setBranches([]));
        } else {
        setBranches([]);
        setFormData({ ...formData, branchId: '' });
        }
    }, [formData.bankId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
    const newErrors = {};
    
    if (!/^\d{8,18}$/.test(formData.accountNumber))
      newErrors.accountNumber = "Account number must be in between 9 to 18 digits";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const token = await window.grecaptcha.execute(
                process.env.REACT_APP_RECAPTCHA_SITE_KEY,
                { action: "register" }
            );

            const payload = {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                confirmPassword: formData.confirmPassword,
                accountNumber: formData.accountNumber,
                branchId: formData.branchId,
                bankId: formData.bankId,
            };
            console.log("Sending payload:", payload);
            const response = await axios.post("http://localhost:8083/api/users/register",{ payload,recaptchaToken: token});
            

            toast.success(response.data, {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
                onClose: () => navigate("/login")
            });

        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data, {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored"
                });

            } else {
                toast.error("Registration failed. Try again.", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored"
                });

            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                     <div className="custom-select">
                        <select
                        name="bankId"
                        value={formData.bankId}
                        onChange={handleChange}
                        required
                        >
                        <option value="">Select Bank</option>
                        {banks.map((bank) => (
                            <option key={bank.id} value={bank.id}>{bank.name}</option>
                        ))}
                        </select>
                        <span className="select-arrow"></span>
                    </div>

                    <div className="custom-select">
                        <select
                        name="branchId"
                        value={formData.branchId}
                        onChange={handleChange}
                        required
                        disabled={!formData.bankId}
                        >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                            {branch.name} — {branch.location}
                            </option>
                        ))}
                        </select>
                        <span className="select-arrow"></span>
                    </div>

                    <input
                        type="text"
                        name="accountNumber"
                        placeholder="Account Number"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        required
                    />
                    {errors.accountNumber && (
                        <p className="error">{errors.accountNumber}</p>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && (
                        <p className="error">{errors.confirmPassword}</p>
                    )}
                    

                    <button type="submit">Register</button>
                    </form>

                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
