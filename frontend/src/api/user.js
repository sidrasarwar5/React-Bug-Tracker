import api from "./axios";

export async function signupUser(name, email, password, user_type, phone) {
  const response = await api.post("/auth/signup", {
    name,
    email,
    password,
    user_type,
    phone,
  });

  return response.data;
}

export async function loginUser(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
}