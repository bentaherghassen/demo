import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const { user, handleRegister } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    username: '',
    gender: '',
    phone_number: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Prevent logged in users from accessing register page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await handleRegister(form);

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      setError('Failed to register. Please check your inputs.');
    }

    setLoading(false);
  };

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: '500px' }}>
      <Card.Body>
        <h3 className="text-center mb-4">Register</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="first_name">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="last_name">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone_number">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="success" className="w-100" type="submit" disabled={loading}>
            {loading ? 'Registering…' : 'Register'}
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <Link to="/login">Already have an account? Login here</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Register;
