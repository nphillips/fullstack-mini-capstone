const BASE_URL = `http://localhost:3000`;

export const attemptLoginWithToken = async (setAuth) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        authorization: token,
      },
    });
    const json = await response.json();
    if (response.ok) {
      setAuth(json);
    } else {
      window.localStorage.removeItem("token");
    }
  }
};

export const login = async (credentials, setAuth) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (response.ok) {
    window.localStorage.setItem("token", json.token);
    attemptLoginWithToken(setAuth);
  } else {
    throw new Error(json.error || "Login failed");
  }
};

export const FetchAllDepts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/departments`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("FetchAllDepts error:", error);
    return [];
  }
};

export const FetchAllProfs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/professors`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result; // ✅ this matches a raw array response
  } catch (error) {
    console.error("FetchProfs error:", error);
    return [];
  }
};

export const FetchDepartmentById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/departments/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("FetchDepartmentById error:", error);
    return null;
  }
};

export const FetchProfessorById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/professors/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("FetchProfessorById error:", error);
    return null;
  }
};
