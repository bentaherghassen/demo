// src/pages/Settings.jsx
import React from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap';
import EditProfile from '../components/EditProfile';
import EditAddresses from '../components/EditAddresses';
import ChangePassword from '../components/ChangePassword';
import ChangeEmail from '../components/ChangeEmail';
import DangerZone from '../components/DangerZone';

const Settings = () => {
  return (
    <Card>
      <Card.Body>
        <h3 className="text-center mb-4">Settings</h3>
        <Tabs defaultActiveKey="edit-profile" id="settings-tabs" className="mb-3">
          <Tab eventKey="edit-profile" title="Edit Profile">
            <EditProfile />
          </Tab>
          <Tab eventKey="edit-addresses" title="Edit Addresses">
            <EditAddresses />
          </Tab>
          <Tab eventKey="change-auth" title="Change Authentication">
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Change Password</Card.Title>
                <ChangePassword />
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title>Change Email</Card.Title>
                <ChangeEmail />
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="danger-zone" title="Danger Zone">
            <DangerZone />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default Settings;
