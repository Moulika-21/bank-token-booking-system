import React, {useEffect, useState} from 'react';
import axios from 'axios';

const UserDashboard = () =>{
    const [tokens, setTokens] = useState([]);
    const [date, setDate] = useState('');

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchTokens();
    },[date]);

    const fetchTokens = async() => {
        try{
            let url = `/api/tokens/user/${userId}`;
            if(date){
                url += `?date=${date}`;
            }
            const res =await axios.get(url);
            setTokens(res.data);
        } catch(err){
            console.error('Error fetching tokens',err);
        }
    };

    return (
        <div className='p-4'>
            <h2 className='text-2xl font-bold mb-4'>My Tokens</h2>
            

            <div className='mb-4'>
                <label>Select Date:</label>
                <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='border p-1' />
            </div>

            <table className="w-full border">
                <thead>
                <tr>
                    <th>Token #</th>
                    <th>Branch</th>
                    <th>Service</th>
                    <th>Time</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {tokens.map((token) => (
                    <tr key={token.id}>
                    <td>{token.tokenNumber}</td>
                    <td>{token.branch.name}</td>
                    <td>{token.service.name}</td>
                    <td>{new Date(token.bookingTime).toLocaleString()}</td>
                    <td>{token.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>   
        </div>
    );
};

export default UserDashboard;