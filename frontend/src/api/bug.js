import api from "./axios";

export async function CreateBug(projectId, formData) {
  const response = await api.post(`/projects/${projectId}/bug`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
}

export async function UpdateStatus(projectId , bugId , status) {
  const response = await api.patch(`/projects/${projectId}/bug/${bugId}/status`, { status });
  return response.data;
}

export async function BugDetail(projectId,bugId) {
  const response = await api.get(`/projects/${projectId}/bug/${bugId}`);
  return response.data;
}

export async function getProjectBugs(projectId) {
  const response = await api.get(`/projects/${projectId}/bugs`);
  return response.data;
}

