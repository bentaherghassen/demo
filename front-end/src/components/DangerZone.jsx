// src/components/DangerZone.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Card, Modal } from 'react-bootstrap';
import axios from 'axios';

const DangerZone = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/account`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password },
      });
      // Handle successful deletion (e.g., logout and redirect)
      window.location.href = '/login';
    } catch (err) {
      setError('Failed to delete account. Please check your password.');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Card border="danger">
      <Card.Header className="bg-danger text-white">Danger Zone</Card.Header>
      <Card.Body>
        <Card.Title>Delete Your Account</Card.Title>
        <Card.Text>
          This action is irreversible. All your data will be permanently deleted.
        </Card.Text>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          Delete Account
        </Button>
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p>Please enter your password to confirm deletion.</p>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default DangerZone;
