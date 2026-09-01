import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, Phone, ChevronRight } from "lucide-react";
import { useAuth } from "../context/auth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AuthSwitchLink from "../components/auth/AuthSwitchLink";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    user_type: location.state?.user_type || "qa",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Full name is required");
    if (!form.email.trim()) return setError("Email is required");
    if (!form.password.trim()) return setError("Password is required");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");

    try {
      setSubmitting(true);
      const data = await signup(
        form.name.trim(),
        form.email.trim().toLowerCase(),
        form.password,
        form.user_type,
        form.phone.trim() || null,
      );
      const userType = data.data.user_type;

      if (userType === "qa") navigate("/qa");
      else if (userType === "manager") navigate("/manager");
      else navigate("/developer");
    } catch (err) {
      console.log("signup issue frontend", err);
      setError(err.response?.data?.error || err.message || "signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative hidden w-1/2 lg:block">
  <img
    src="/img.jpg"
    alt=""
    className="h-full w-full object-fill"
  />
    <div className="absolute inset-0 bg-black/20" />
</div>

      <div className="flex w-full items-center justify-center overflow-y-auto px-6 py-6 lg:w-1/2">
  <div className="w-full max-w-110.75 space-y-7.5">
          <h2 className="font-heading mb-5 text-h2 text-gray-900">Sign Up</h2>
          <p className="mb-5 text-body-small text-gray-500">
            Please fill your information below
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              icon={User}
              value={form.name}
              onChange={updateField("name")}
              placeholder="Name"
            />
            <Input
              icon={Phone}
              value={form.phone}
              onChange={updateField("phone")}
              placeholder="+92 342 418 6063"
            />
            <Input
              icon={Mail}
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="E-mail"
            />
            <Input
              icon={Lock}
              type="password"
              value={form.password}
              onChange={updateField("password")}
              placeholder="Password"
            />
            <Input
              icon={Lock}
              type="password"
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
              placeholder="Confirm Password"
            />

            {error && (
              <div className="rounded-lg border border-status-pending bg-red-50 px-4 py-3 text-body-small text-status-pending">
                {error}
              </div>
            )}

            <Button
              type="submit"
              icon={<ChevronRight size={16} />}
              disabled={submitting}
            >
              {submitting ? "Signing up..." : "Sign Up"}
            </Button>

            <AuthSwitchLink
              prompt="Already have an account?"
              linkText="Login to your account"
              to="/login"
              className="text-center"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
