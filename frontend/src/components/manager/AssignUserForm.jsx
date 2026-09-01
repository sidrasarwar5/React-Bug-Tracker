import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";


export default function AssignUserForm({ onAssign }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("qa");

  function handleSubmit() {
    if (!email.trim()) return;
    onAssign(email.trim(), role);
    setEmail("");
    setRole("qa");
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="User email"
        className="flex-1"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-body-small text-gray-900 outline-none focus:border-primary"
      >
        <option value="qa">QA</option>
        <option value="developer">Developer</option>
      </select>

      <Button variant="secondary" onClick={handleSubmit}>
        Assign
      </Button>
    </div>
  );
}
