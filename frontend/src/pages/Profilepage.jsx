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

  const handle = user?.email ? `@${user.email.split("@")[0]}` : "";

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    setError("");
    try {
      setSubmitting(true);
      const data = await updateProfile({ name, phone, email, password, avatarFile });

     
    updateUser(data.data);
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  }

 

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-md px-4 py-10 sm:px-6">
        <h2 className="mb-8 font-heading text-h2 text-gray-900">Profile Settings</h2>

        {/* Avatar + name/handle */}
        <div className="mb-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative"
          >
            <Avatar name={user?.name} src={avatarPreview || user?.avatarUrl} size="xl" />
            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white ring-2 ring-white">
              <Camera size={14} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <h3 className="mt-3 text-body1 font-semibold text-gray-900">{user?.name}</h3>
          <p className="text-body-small text-primary">{handle}</p>
        </div>

       
        <div className="space-y-4">
          <Input
            label="Name"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Mobile number"
            icon={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="E-mail"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            icon={Lock}
            isPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter New Pasword"
          />

          {error && (
            <div className="rounded-lg border border-status-pending bg-red-50 px-4 py-3 text-body-small text-status-pending">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}