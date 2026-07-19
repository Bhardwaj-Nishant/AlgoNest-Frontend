import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, LogOut, Key, Trash2, Save, Loader2, AlertCircle, CheckCircle, X, Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Status for password update
  const [passwordStatus, setPasswordStatus] = useState(null); // { type: 'success' | 'error', text: string }

  // Clear password inputs and errors whenever the password modal is closed
  useEffect(() => {
    if (!showPasswordModal) {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setModalLoading(false);
    }
  }, [showPasswordModal]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/user/me");
        const userData = response.data;
        setUser(userData);
        setDisplayName(userData.displayName || "");
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setMessage({ type: "error", text: "Failed to load user data." });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Update display name
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setMessage({ type: "error", text: "Display name cannot be empty." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await api.put("/api/user/me", { displayName: displayName.trim() });
      setMessage({ type: "success", text: "Display name updated successfully!" });
      setUser((prev) => ({ ...prev, displayName: displayName.trim() }));
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update name. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Validate new password
  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  // Change password with current password verification
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // Validate new password
    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setPasswordErrors((prev) => ({ ...prev, newPassword: pwdError }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
      return;
    }

    setModalLoading(true);
    setPasswordStatus(null);

    try {
      // Step 1: Verify current password with Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) {
        setPasswordErrors((prev) => ({ ...prev, currentPassword: "Current password is incorrect." }));
        setModalLoading(false);
        return;
      }

      // Step 2: If correct, close modal and update password via backend
      // Close the modal now (user supplied correct fields); show any server errors in the Security section.
      setShowPasswordModal(false);

      await api.post("/api/user/change-password", {
        newPassword: newPassword,
        currentPassword: currentPassword,
      });

      setPasswordStatus({ type: "success", text: "Password updated successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordStatus({
        type: "error",
        text: err.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setMessage({ type: "error", text: 'Please type "DELETE" to confirm.' });
      return;
    }
    setModalLoading(true);
    setMessage(null);
    try {
      await api.delete("/api/user/me");
      // Logout after deletion
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete account.",
      });
      setModalLoading(false);
    }
  };

  const handleLogout = async () => {
    setMessage(null);
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err) {
      setMessage({ type: "error", text: "Logout failed. Please try again." });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#485E73]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500 mb-8">Manage your account settings and preferences.</p>

        {message && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-2xl p-4 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Profile</h2>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  <Mail size={18} />
                  <span>{user?.email || "—"}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Your email address is managed by Supabase.</p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1">
                  Display Name
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#485E73]/20">
                  <User size={18} className="text-slate-400" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="Your display name"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !displayName.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#485E73] px-6 py-3 font-semibold text-white transition hover:bg-[#3B4D5F] disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? "Saving..." : "Update Name"}
              </button>
            </form>
          </div>

          {/* Security Section */}
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Security</h2>
            {/* Password status message */}
            {passwordStatus && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-2xl p-3 text-sm ${
                  passwordStatus.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {passwordStatus.type === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {passwordStatus.text}
              </div>
            )}
            <div className="space-y-3">
              <button
                className="inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50"
                onClick={() => {
                  setShowPasswordModal(true);
                  setPasswordStatus(null); // Clear previous status when opening modal
                }}
              >
                <span className="flex items-center gap-3">
                  <Key size={18} className="text-slate-500" />
                  <span>Change Password</span>
                </span>
                <span className="text-sm text-[#485E73]">Change</span>
              </button>
              <button
                className="inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 transition hover:bg-red-50 hover:border-red-200"
                onClick={() => setShowDeleteModal(true)}
              >
                <span className="flex items-center gap-3 text-red-600">
                  <Trash2 size={18} />
                  <span>Delete Account</span>
                </span>
                <span className="text-sm text-red-400">Permanent</span>
              </button>
            </div>
          </div>

          {/* Logout Section */}
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Session</h2>
            <button
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-4xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordErrors({});
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setPasswordStatus(null);
                }}
                className="rounded-lg p-1 hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    className={`w-full rounded-2xl border ${passwordErrors.currentPassword ? "border-red-300" : "border-slate-200"} px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#485E73]/20`}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className={`w-full rounded-2xl border ${passwordErrors.newPassword ? "border-red-300" : "border-slate-200"} px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#485E73]/20`}
                    placeholder="New password (min 6 chars)"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className={`w-full rounded-2xl border ${passwordErrors.confirmPassword ? "border-red-300" : "border-slate-200"} px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#485E73]/20`}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordErrors({});
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPasswordStatus(null);
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 rounded-2xl bg-[#485E73] px-4 py-2 font-semibold text-white hover:bg-[#3B4D5F] transition disabled:opacity-50"
                >
                  {modalLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal (unchanged) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-4xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-600">Delete Account</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg p-1 hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600">
                This action <strong>cannot be undone</strong>. All your data, handles, and snapshots will be permanently removed.
              </p>
              <p className="text-slate-600 text-sm">
                To confirm, type <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">DELETE</span> in the field below.
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Type DELETE to confirm"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={modalLoading || deleteConfirm !== "DELETE"}
                  className="flex-1 rounded-2xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
                >
                  {modalLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}