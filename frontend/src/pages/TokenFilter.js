import React,{ useState} from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TokenFilter = () => {
    const [branchId, setBranchId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [tokens, setTokens] = useState([]);

    const handleFilter =async () => {
        try{
            const response = await axios.get('http://localhost:8083/api/tokens/filter',{
                params: {
                    branchId,
                    serviceId,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });
            setTokens(response.data);
        }
        catch(error) {
            console.log('Error fetching filtered tokens:',error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Filter Tokens</h2>
            <div className="mb-4">
                <label className="block">Branch ID:</label>
                <input type="number" placeholder="Branch ID" value={branchId} onChange={(e) => setBranchId(e.target.value)} className="border p-2 rounded" /> 
            </div>
            <div className="mb-4">
                <label className="block">Service ID:</label>
                <input type="number" placeholder="Service ID" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="border p-2 rounded" />
            </div>
            <div className="mb-4">
                <label className="block">Start Time:</label>
                <DatePicker selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect placeholderText="Start Date & Time" className="border p-2 rounded" dateFormat="yyyy-MM-dd'T'HH:mm" />
            </div>
            <div className="mb-4">
                <label className="block">End Time:</label>
                <DatePicker selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect placeholderText="End Date & Time" className="border p-2 rounded" dateFormat="yyyy-MM-dd'T'HH:mm" />
            </div>

            <button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2 rounded">
                Filter
            </button>

            <div className="mt-6">
                <h3 className="text-lg font-semibold">Filtered Tokens</h3>
                <ul>
                    {tokens.map((token) => (
                        <li key={token.id} className="border p-2 my-2">
                        <p><strong>Token Number:</strong> {token.tokenNumber}</p>
                        <p><strong>Status:</strong> {token.status}</p>
                        <p><strong>Time:</strong> {token.bookingTime}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TokenFilter;