import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPES } from "../constants/roles";
import RoleCard from "../components/auth/RoleCard";
import AuthSwitchLink from "../components/auth/AuthSwitchLink";

export default function AccountTypePage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  function handleSelect(type) {
    setSelectedType(type.value);

    navigate("/signup", {
      state: {
        user_type: type.value,
      },
    });
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        <div className="relative hidden h-full w-[40%] lg:block">
          <img src="/img.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative flex h-full w-full items-center justify-center overflow-y-auto px-6 py-10 lg:w-[60%]">
          <AuthSwitchLink
            prompt="Already have an account?"
            linkText="Sign in"
            to="/login"
            className="absolute right-8 top-7 hidden items-center gap-1.5 xl:flex"
          />

          <div className="mx-auto w-[80%] lg:w-[50%] max-w-150">
            <h2 className="signup-heading mb-3 mt-5">Join Us!</h2>

            <p className="para mb-4 max-w-[500px]">
              To begin this journey, tell us what type of account you'd be
              opening.
            </p>

            <div className="space-y-5">
              {ACCOUNT_TYPES.map((type) => (
                <RoleCard
                  key={type.value}
                  label={type.label}
                  description={type.description}
                  iconSrc={type.iconSrc}
                  selected={selectedType === type.value}
                  onClick={() => handleSelect(type)}
                />
              ))}
            </div>

            <AuthSwitchLink
              prompt="Already have an account?"
              linkText="Sign in"
              to="/login"
              className="mt-8 flex items-center justify-center gap-1.5 xl:hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
