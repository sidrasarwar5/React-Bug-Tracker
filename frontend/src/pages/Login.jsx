import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../context/auth";
import { useToast } from "../context/ToastContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AuthSwitchLink from "../components/auth/AuthSwitchLink";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email.trim()) return showError("Email is required");
    if (!form.password.trim()) return showError("Password is required");
    if (form.password.length < 6)
      return showError("Password must be at least 6 characters");

    try {
      setSubmitting(true);

      const data = await login(form.email.trim().toLowerCase(), form.password);
      const userType = data.data.user_type;

      showSuccess("Logged in successfully");

      if (userType === "qa") navigate("/qa");
      else if (userType === "manager") navigate("/manager");
      else navigate("/developer");
    } catch (err) {
      console.log("login issue frontend", err);
      showError(err.response?.data?.error || err.message || "Login failed");
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

        <div className="relative flex h-full w-full items-center justify-center overflow-hidden pl-17 lg:pl-23 py-10 lg:w-[60%]">
          <div className="mx-auto w-full max-w-[400px]">
            <h2 className="signup-heading mb-6">Login</h2>

            <p className="para mb-6 max-w-[500px]">
              Please enter your login details
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                iconSrc="/Auth/envelop.svg"
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="E-mail"
              />

              <Input
                iconSrc="/Auth/lock.png"
                type="password"
                isPassword
                value={form.password}
                onChange={updateField("password")}
                placeholder="******************"
              />

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
                className="mt-6 flex w-full flex-row items-center gap-2 lg:gap-6 text-sm"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
