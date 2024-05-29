import React, { useState } from 'react';
import api from './api';

function CodeSubmissionBox({ problemId }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/problems/${problemId}/submit`, { code, language });
      setResult(response.data);
    } catch (error) {
      console.error('Failed to submit code', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Write your code here" />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <h2>Result</h2>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
}

export default CodeSubmissionBox;
