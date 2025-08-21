import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  KeyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

// GraphQL mutations for user updates
const UPDATE_NAME = gql`
  mutation UpdateName($name: String!) {
    updateName(name: $name) {
      id
      name
      email
      role
    }
  }
`;

const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      id
      name
      email
      role
    }
  }
`;

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      id
      name
      email
      role
    }
  }
`;

const UPDATE_PHONE = gql`
  mutation UpdatePhone($phone: String!) {
    updatePhone(phone: $phone) {
      id
      name
      email
      role
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      id
      name
      email
    }
  }
`;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [nameForm, setNameForm] = useState({
    name: user?.name || ''
  });

  const [emailForm, setEmailForm] = useState({
    email: user?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [phoneForm, setPhoneForm] = useState({
    phone: ''
  });

  // Mutations
  const [updateName] = useMutation(UPDATE_NAME);
  const [updateEmail] = useMutation(UPDATE_EMAIL);
  const [updatePassword] = useMutation(UPDATE_PASSWORD);
  const [updatePhone] = useMutation(UPDATE_PHONE);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      await updateName({ variables: { name: nameForm.name } });
      setSuccessMessage('Name updated successfully!');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error updating name');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      await updateEmail({ variables: { email: emailForm.email } });
      setSuccessMessage('Email updated successfully!');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error updating email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      await updatePassword({ 
        variables: { 
          currentPassword: passwordForm.currentPassword, 
          newPassword: passwordForm.newPassword 
        } 
      });
      setSuccessMessage('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      await updatePhone({ variables: { phone: phoneForm.phone } });
      setSuccessMessage('Phone number updated successfully!');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error updating phone number');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        
        await deleteUser();
        setSuccessMessage('Account deleted successfully!');
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (error: any) {
        setErrorMessage(error.message || 'Error deleting account');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {user.role}
              </span>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Security Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Name Update */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Update Name
                </h3>
                <form onSubmit={handleUpdateName} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={nameForm.name}
                      onChange={(e) => setNameForm({ name: e.target.value })}
                      placeholder="Enter your full name"
                      title="Full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Update Name
                  </button>
                </form>
              </div>

              {/* Email Update */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Update Email
                </h3>
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ email: e.target.value })}
                      placeholder="Enter your email address"
                      title="Email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Update Email
                  </button>
                </form>
              </div>

              {/* Phone Update */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Update Phone Number
                </h3>
                <form onSubmit={handleUpdatePhone} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneForm.phone}
                      onChange={(e) => setPhoneForm({ phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Update Phone
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <KeyIcon className="h-5 w-5 mr-2" />
                  Change Password
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                      title="Current password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="Enter new password"
                      title="New password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      title="Confirm new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Change Password
                  </button>
                </form>
              </div>

              {/* Delete Account Section */}
              <div className="bg-red-50 border border-red-200 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                  Delete Account
                </h3>
                <p className="text-red-700 mb-4">
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 