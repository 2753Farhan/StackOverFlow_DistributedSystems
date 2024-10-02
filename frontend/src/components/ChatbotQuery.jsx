import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ChatbotQuery = () => {
    const { jobId } = useParams();
    const [inputData, setInputData] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:4000/api/v1/resume/chatbot/${jobId}`, { inputData });
            setResponseMessage(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message || 'Something went wrong');
        }
    };

    return (
        <div>
            <h2>Query Chatbot for Job ID: {jobId}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="inputData">Input Data:</label>
                    <input
                        type="text"
                        id="inputData"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {responseMessage && (
                <div>
                    <h3>Response:</h3>
                    <p>{responseMessage}</p>
                </div>
            )}
        </div>
    );
};

export default ChatbotQuery;
