export const authService = {
  register: async (formData: any) => {
  const response = await fetch('http://localhost:8001/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error al registrar usuario');
  }

  return await response.json();
},

login: async (username: string, password: string) => {
  const response = await fetch("http://localhost:8001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: username,
      contrasena: password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  const data = await response.json();
  const userId = data.user_id;

  // Obtener el nombre completo
  const nameRes = await fetch(`http://localhost:8001/users/${userId}/nombre_completo`);
  if (!nameRes.ok) {
    throw new Error("Error al obtener el nombre del usuario");
  }

  const nameData = await nameRes.json();

  // Guardar datos en localStorage
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: userId,
      nombre: nameData.nombre_completo,
    })
  );

  return { id: userId, nombre: nameData.nombre_completo };
}
,


  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  },
  isAuthenticated: () => {
    // Retorna true si hay un usuario guardado en localStorage
    return !!localStorage.getItem('user');
  },

  getProfile: async (user_id: string) => {
  const res = await fetch(`http://localhost:8001/users/${user_id}/perfil`);
  if (!res.ok) {
    throw new Error('No se pudo cargar el perfil');
  }
  return res.json();
  }
};

export async function fetchUserNameAndPhoto(userId: string) {
    const API_URL_USER = 'http://localhost:8001';
    const response = await fetch(`${API_URL_USER}/users/${userId}/nombre_foto`);
    
    if (!response.ok) {
        throw new Error('Error al obtener información del usuario');
    }
    
    return await response.json();
}

export async function fetchUserProfile(userId: string) {
    const API_URL_USER = 'http://localhost:8001';
    const response = await fetch(`${API_URL_USER}/users/${userId}/foto`);
    
    if (!response.ok) {
        throw new Error('Error al obtener el perfil del usuario');
    }
    
    return await response.json();
}

export async function fetchUserPublications(userId: string) {
    const API_URL_USER = 'http://localhost:8001';
    const response = await fetch(`${API_URL_USER}/users/${userId}/publicaciones`);
    
    if (!response.ok) {
        throw new Error('Error al obtener publicaciones del usuario');
    }
    
    return await response.json();
}