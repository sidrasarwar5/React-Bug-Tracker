import api from "./axios"; 

export async function signupUser(name, email, password, user_type) {
  
  const response = await api.post("/signup", {
    name,
    email,
    password,
    user_type,
  });

  return response.data;
}

export async function loginUser(email , password ){
    const response = await api.post('/login' , {
          email, 
          password
    })
    return response.data;
}