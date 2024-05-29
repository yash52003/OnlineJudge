import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import CodeSubmissionBox from './CodeSubmissionBox';

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${id}`);
        setProblem(response.data.problem);
      } catch (error) {
        console.error('Failed to fetch problem', error);
      }
    };

    fetchProblem();
  }, [id]);

  if (!problem) return <div>Loading...</div>;

  return (
    <div>
      <h1>{problem.problemName}</h1>
      <p>{problem.problemDescription}</p>
      <CodeSubmissionBox problemId={id} />
    </div>
  );
}

export default ProblemDetails;
