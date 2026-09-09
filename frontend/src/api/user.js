
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

  
  const response = await api.patch("/auth/profile", formData);



  return response.data;
}




export async function searchUsers(search, user_type) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (user_type) params.append("user_type", user_type);

  const response = await api.get(`/auth/users/search?${params.toString()}`);
  return response.data;
}