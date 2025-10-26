// src/components/ChangeEmail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ChangeEmail = () => {
  const { user } = useContext(AuthContext);
  const [currentEmail, setCurrentEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentEmail(response.data.email);
      } catch (err) {
        setError('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [user]);

  const handleChangeEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/change-email`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('A confirmation email has been sent to your new email address.');
    } catch (err) {
      setError('Failed to initiate email change.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <p>
        Your current email address is: <strong>{currentEmail}</strong>
      </p>
      <Button onClick={handleChangeEmail} variant="primary" disabled={loading}>
        {loading ? 'Sending...' : 'Change Email'}
      </Button>
    </div>
  );
};

export default ChangeEmail;
