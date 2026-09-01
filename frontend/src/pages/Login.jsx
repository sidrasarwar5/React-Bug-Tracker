import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ChevronRight } from "lucide-react";
import { useAuth } from "../context/auth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AuthSwitchLink from "../components/auth/AuthSwitchLink";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) return setError("Email is required");
    if (!form.password.trim()) return setError("Password is required");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");

    try {
      setSubmitting(true);

      const data = await login(form.email.trim().toLowerCase(), form.password);
      const userType = data.data.user_type;

      if (userType === "qa") navigate("/qa");
      else if (userType === "manager") navigate("/manager");
      else navigate("/developer");
    } catch (err) {
      console.log("login issue frontend", err);
      setError(err.response?.data?.error || err.message || "login failed");
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

      <div className="flex w-full items-center justify-center overflow-y-auto px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-110.75 space-y-7.5">
          <h2 className="font-heading mb-5 text-h2 text-gray-900">Login</h2>
          <p className="mb-5 text-body-small text-gray-500">
            Please enter your login details
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              {submitting ? "Logging in..." : "Login"}
            </Button>

            <AuthSwitchLink
              prompt="Don't have an account?"
              linkText="Create account"
              to="/get-started"
              className="text-center"
            />
          </form>
        </div>
      </div>
    </div>
  );
}