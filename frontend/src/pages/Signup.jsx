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
    return (e) => {
      setForm({
        ...form,
        [field]: e.target.value,
      });
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      return setError("Full name is required");
    }

    if (!form.email.trim()) {
      return setError("Email is required");
    }

    if (!form.password.trim()) {
      return setError("Password is required");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

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

      if (userType === "qa") {
        navigate("/qa");
      } else if (userType === "manager") {
        navigate("/manager");
      } else {
        navigate("/developer");
      }
    } catch (err) {
      console.log("signup issue frontend", err);

      setError(err.response?.data?.error || err.message || "Signup failed");
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
            <h2 className="signup-heading mb-6">Sign Up</h2>

            <p className="para mb-6 max-w-[500px]">
              Please fill your information below
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                iconSrc="/Profile.svg"
                value={form.name}
                onChange={updateField("name")}
                placeholder="Name"
              />

              <Input
                iconSrc="/phone.svg"
                value={form.phone}
                onChange={updateField("phone")}
                placeholder="Mobile Number"
              />

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
                placeholder="Password"
              />

              <Input
                iconSrc="/lock.png"
                type="password"
                isPassword
                value={form.confirmPassword}
                onChange={updateField("confirmPassword")}
                placeholder="Confirm Password"
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
                {submitting ? "Signing up..." : "Sign Up"}
              </Button>

              <AuthSwitchLink
                prompt="Already have an account?"
                linkText="Login to your account"
                to="/login"
                className="mt-6 flex w-full flex-row items-center gap-6 text-sm"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
