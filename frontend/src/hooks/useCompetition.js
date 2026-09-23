import { useState, useEffect, useCallback } from 'react';
import { getCompetition, registerForCompetition, submitEntry } from '../services/api';

export default function useCompetition(competitionId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCompetition(competitionId);
      setData(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load competition');
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleRegister = async (paymentId) => {
    const res = await registerForCompetition(competitionId, paymentId);
    await fetch(); // refresh state
    return res.data;
  };

  const handleSubmit = async (url) => {
    const res = await submitEntry(competitionId, url);
    await fetch();
    return res.data;
  };

  return { data, loading, error, refresh: fetch, handleRegister, handleSubmit };
}