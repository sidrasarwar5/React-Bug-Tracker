import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPES } from "../constants/roles";
import RoleCard from "../components/auth/RoleCard";
import Button from "../components/ui/Button";
import AuthSwitchLink from "../components/auth/AuthSwitchLink";

export default function AccountTypePage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  function handleContinue() {
    if (!selectedType) return;
    navigate("/signup", { state: { user_type: selectedType } });
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

      <div className="relative flex w-full items-center justify-center overflow-y-auto px-6 pb-10 pt-20 lg:w-1/2">
        <AuthSwitchLink
          prompt="Already have an account?"
          linkText="Sign in"
          to="/login"
          className="absolute right-6 top-6 hidden lg:block"
        />

        <div className="w-full max-w-110.75 space-y-7.5">
          <h2 className="font-heading mb-5 text-h2 text-gray-900">Join Us!</h2>
          <p className="mb-5 text-body-small text-gray-500">
            To begin this journey, tell us what type of account you'd be opening.
          </p>

          <div className="space-y-3">
            {ACCOUNT_TYPES.map((type) => (
              <RoleCard
                key={type.value}
                label={type.label}
                description={type.description}
                icon={type.icon}
                selected={selectedType === type.value}
                onClick={() => setSelectedType(type.value)}
              />
            ))}
          </div>

          <Button
            className="w-full"
            disabled={!selectedType}
            onClick={handleContinue}
          >
            Continue
          </Button>

          <AuthSwitchLink
            prompt="Already have an account?"
            linkText="Sign in"
            to="/login"
            className="text-center lg:hidden"
          />
        </div>
      </div>
    </div>
  );
}