import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        <div className="relative hidden h-full w-[40%] lg:block">
          <img src="/img.jpg" alt="" className="h-full w-full object-cover" />

          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-6 py-10 lg:w-[60%] lg:px-12">
          <div className="mx-auto w-full max-w-[400px]">
            <h2 className="signup-heading mb-6">Login</h2>

            <p className="para mb-6 max-w-[500px]">
              Please enter your login details
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                iconSrc="/envelop.svg"
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="E-mail"
              />

              <Input
                iconSrc="/lock.png"
                type="password"
                isPassword
                value={form.password}
                onChange={updateField("password")}
                placeholder="******************"
              />

              {error && (
                <div className="rounded-lg border border-status-pending bg-status-pending/10 px-4 py-3 text-body-small text-status-pending">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                icon={<ChevronRight size={16} />}
                disabled={submitting}
                className="w-[150px] h-[45px] rounded-lg px-[18.5px] flex items-center justify-between"
              >
                {submitting ? "Logging in..." : "Login"}
              </Button>

              <AuthSwitchLink
                prompt="Don't have an account?"
                linkText="Create account"
                to="/get-started"
                className="mt-6 flex w-full flex-row items-center gap-10 text-sm"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
