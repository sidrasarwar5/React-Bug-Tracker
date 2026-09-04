
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

export async function updateProfile({ name, phone, email, password, avatarFile }) {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (phone) formData.append("phone", phone);
  if (email) formData.append("email", email);
  if (password) formData.append("password", password);
  if (avatarFile) formData.append("avatar", avatarFile);

  // No manual Content-Type header — axios detects FormData and sets
  // "multipart/form-data; boundary=..." automatically. Setting it
  // manually strips the boundary and breaks the upload.
  const response = await api.patch("/auth/profile", formData);

  return response.data;
}