// src/pages/Profile.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    username: '',
    birthday: '',
    gender: '',
    bio: '',
    phone_number: '',
    home_address: '',
    shipping_same_as_billing: true,
    billing_address: {
      address_1: '',
      address_2: '',
      state: '',
      zip_code: '',
      country: '',
    },
    shipping_address: {
      address_1: '',
      address_2: '',
      state: '',
      zip_code: '',
      country: '',
    },
  });
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;
        const billing = userData.addresses.find(addr => addr.address_type === 'billing') || {};
        const shipping = userData.addresses.find(addr => addr.address_type === 'shipping') || {};

        setFormData({
          ...userData,
          billing_address: {
            address_1: billing.address_1 || '',
            address_2: billing.address_2 || '',
            state: billing.state || '',
            zip_code: billing.zip_code || '',
            country: billing.country || '',
          },
          shipping_address: {
            address_1: shipping.address_1 || '',
            address_2: shipping.address_2 || '',
            state: shipping.state || '',
            zip_code: shipping.zip_code || '',
            country: shipping.country || '',
          },
        });
      } catch (err) {
        console.log(err);
        setError('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <Card.Body>
        <h3 className="text-center mb-4">Edit Profile</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="fname" value={formData.fname} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="lname" value={formData.lname} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Birthday</Form.Label>
            <Form.Control type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Control type="text" name="gender" value={formData.gender} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows={3} name="bio" value={formData.bio} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Home Address</Form.Label>
            <Form.Control type="text" name="home_address" value={formData.home_address} onChange={handleChange} />
          </Form.Group>

          {/* Billing Address */}
          <h5>Billing Address</h5>
          <Form.Group className="mb-3">
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control type="text" name="billing_address.address_1" value={formData.billing_address.address_1} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control type="text" name="billing_address.address_2" value={formData.billing_address.address_2} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control type="text" name="billing_address.state" value={formData.billing_address.state} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control type="text" name="billing_address.zip_code" value={formData.billing_address.zip_code} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" name="billing_address.country" value={formData.billing_address.country} onChange={handleChange} />
          </Form.Group>

          {/* Shipping Address */}
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Shipping address is the same as billing address" name="shipping_same_as_billing" checked={formData.shipping_same_as_billing} onChange={handleChange} />
          </Form.Group>

          {!formData.shipping_same_as_billing && (
            <>
              <h5>Shipping Address</h5>
              <Form.Group className="mb-3">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control type="text" name="shipping_address.address_1" value={formData.shipping_address.address_1} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control type="text" name="shipping_address.address_2" value={formData.shipping_address.address_2} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" name="shipping_address.state" value={formData.shipping_address.state} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control type="text" name="shipping_address.zip_code" value={formData.shipping_address.zip_code} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" name="shipping_address.country" value={formData.shipping_address.country} onChange={handleChange} />
              </Form.Group>
            </>
          )}

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Profile;
