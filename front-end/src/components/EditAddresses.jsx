// src/components/EditAddresses.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert, Card, ListGroup } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const EditAddresses = () => {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    label: '',
    address_type: 'shipping',
    address_1: '',
    address_2: '',
    state: '',
    zip_code: '',
    country: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
    } catch (err) {
      setError('Failed to fetch addresses.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/api/addresses/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/addresses`;
      const method = editingId ? 'patch' : 'post';

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(`Address ${editingId ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchAddresses();
    } catch (err) {
      setError(`Failed to ${editingId ? 'update' : 'add'} address.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData(address);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Address deleted successfully!');
      fetchAddresses();
    } catch (err) {
      setError('Failed to delete address.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      label: '',
      address_type: 'shipping',
      address_1: '',
      address_2: '',
      state: '',
      zip_code: '',
      country: '',
    });
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{editingId ? 'Edit Address' : 'Add New Address'}</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Label</Form.Label>
              <Form.Control type="text" name="label" value={formData.label} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Type</Form.Label>
              <Form.Select name="address_type" value={formData.address_type} onChange={handleChange}>
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control type="text" name="address_1" value={formData.address_1} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control type="text" name="address_2" value={formData.address_2} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : (editingId ? 'Update Address' : 'Add Address')}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={resetForm} className="ms-2">
                Cancel
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Your Addresses</Card.Header>
        <ListGroup variant="flush">
          {addresses.map((address) => (
            <ListGroup.Item key={address.id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{address.label}</strong> ({address.address_type})
                <br />
                {address.address_1}, {address.state}, {address.zip_code}
              </div>
              <div>
                <Button variant="outline-primary" size="sm" onClick={() => handleEdit(address)}>Edit</Button>
                <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDelete(address.id)}>Delete</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default EditAddresses;
