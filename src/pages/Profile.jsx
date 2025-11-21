import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profileAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.get();
      setProfile(response.data);
      setFormData({ name: response.data.name, email: response.data.email });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (formData.email !== profile.email) {
      try {
        await profileAPI.requestEmailChange(formData.email);
        setShowOTPModal(true);
        return;
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to send OTP",
        });
        return;
      }
    }
    await updateNameOnly();
  };

  const updateNameOnly = async () => {
    try {
      const response = await profileAPI.update({
        name: formData.name,
        email: formData.email,
      });

      setProfile(response.data);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      if (user) {
        updateUser({
          ...user,
          name: response.data.name,
          email: response.data.email,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Update failed",
      });
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await profileAPI.verifyEmailOTP(otp);

      setShowOTPModal(false);
      setOtp("");

      const updated = {
        ...profile,
        email: response.data.email,
        name: formData.name,
      };

      setProfile(updated);
      setEditing(false);

      updateUser(updated);

      setMessage({ type: "success", text: "Email updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Invalid OTP",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    try {
      await profileAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);
      setMessage({ type: "success", text: "Password updated successfully" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Update failed",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account settings</p>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/30 text-green-300 border border-green-800"
                : "bg-red-900/30 text-red-300 border border-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.01 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-white font-semibold">Personal Information</h2>
            <button
              onClick={() => (editing ? handleUpdateProfile() : setEditing(true))}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {editing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                />
              ) : (
                <p className="text-white">{profile?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                />
              ) : (
                <p className="text-white">{profile?.email}</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.01 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-white font-semibold">Change Password</h2>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <div className="space-y-4">
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                placeholder="Old Password"
              />

              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                placeholder="New Password"
              />

              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                placeholder="Confirm New Password"
              />

              <button
                onClick={handleChangePassword}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
              >
                Update Password
              </button>
            </div>
          )}
        </motion.div>

        <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.01 }}>
          <h2 className="text-xl text-white font-semibold mb-4">Quick Links</h2>
          <Link to="/savings" className="block text-primary-400 hover:text-primary-300">
            → Set Savings Goals
          </Link>
          <Link to="/transactions" className="block text-primary-400 hover:text-primary-300">
            → View Transactions
          </Link>
        </motion.div>
      </div>

      {showOTPModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 w-full max-w-md">
            <h2 className="text-xl text-white mb-4">Verify OTP</h2>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white mb-4"
              placeholder="Enter OTP"
            />

            <button
              onClick={verifyOTP}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
            >
              Verify
            </button>

            <button
              onClick={() => setShowOTPModal(false)}
              className="w-full mt-3 bg-gray-700 text-white py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Profile;
