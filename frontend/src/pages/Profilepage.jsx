import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, Camera } from "lucide-react";
import { useAuth } from "../context/auth";
import { updateProfile } from "../api/user";
import Navbar from "../components/layout/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }
  function buildHandle(name) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    const joined = parts.join(".").toLowerCase();
    return parts.length === 1 ? `@${joined}.` : `@${joined}`;
  }
  const handle = buildHandle(user?.name);

  async function handleSubmit() {
    setError("");
    try {
      setSubmitting(true);
      const data = await updateProfile({
        name,
        phone,
        email,
        password,
        avatarFile,
      });

      updateUser(data.data);
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className=" min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200" />
      </div>

      {/* Heading — full width, aligned with Navbar's left edge */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 ">
        <h2 className="mb-6 pt-8 profile-heading">Profile Settings</h2>
      </div>

      {/* Form — separately centered, narrower */}
      <div className="flex w-full flex-col items-center px-4 sm:px-6 lg:px-8">
        <main className="w-full max-w-md pb-8">
          {/* Avatar + name/handle */}
          <div className="mb-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative"
            >
              <Avatar
                name={user?.name}
                src={avatarPreview || user?.avatarUrl}
                size="xl"
              />
              <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-2 ring-white">
                <Camera size={12} />
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <h3 className="mt-2  profile-name">{user?.name}</h3>
            <p className="name-handle">{handle}</p>
          </div>

          <div className="space-y-4 ml-16">
            <Input
              label="Name"
              iconSrc="/Auth/Profile.svg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              inputTextClassName="profile-input-value"
              showLabel="onFocus"
            />
            <Input
              label="Mobile number"
              iconSrc="/Auth/phone.svg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputTextClassName="profile-input-value"
              showLabel="onFocus"
            />
            <Input
              label="E-mail"
              iconSrc="/Auth/envelop.svg"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputTextClassName="profile-input-value"
              showLabel="onFocus"
            />
            <Input
              label="Password"
              iconSrc="/Auth/lock.png"
              value={password}
              isPassword
              onChange={(e) => setPassword(e.target.value)}
              inputTextClassName="profile-input-value"
            />
          </div>
          {error && (
            <div className="rounded-lg border border-status-pending bg-status-pending/10 px-4 py-3 text-body-small text-status-pending">
              {error}
            </div>
          )}

          <div className="mx-auto w-full flex lg:w-3/4 gap-3 pt-4">
            <Button
              variant="white"
              className="flex-1 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-sm"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
