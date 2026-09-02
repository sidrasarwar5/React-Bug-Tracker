import api from "./axios";

export async function getProjects() {
  const response = await api.get("/projects");
  return response.data;
}

export async function createProject(name, description, logoFile) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description || "");
  if (logoFile) {
    formData.append("logo", logoFile);
  }

  const response = await api.post("/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}


export async function assignToProject(projectId, email, user_type) {
  const response = await api.patch(`/projects/${projectId}/assign`, {
    email,
    user_type,
  });
  return response.data;
}

export async function deleteProject(projectId) {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
}