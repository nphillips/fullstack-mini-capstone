import { DEFAULT_HEADERS } from "./constants";
const BASE_URL = `http://localhost:3000`;

export const attemptLoginWithToken = async (setAuth) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setAuth(json);
        return json;
      } else {
        window.localStorage.removeItem("token");
        return null;
      }
    } catch (error) {
      console.error("Error in attemptLoginWithToken:", error);
      window.localStorage.removeItem("token");
      return null;
    }
  }
  return null;
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
    // Get user data after successful login
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        authorization: json.token,
      },
    });
    const userData = await userResponse.json();
    if (userResponse.ok) {
      setAuth(userData);
      return userData;
    } else {
      window.localStorage.removeItem("token");
      throw new Error("Failed to get user data");
    }
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

export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

export const FetchAllProfs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/professors`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
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

export const createProfessor = async (professorData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${BASE_URL}/api/professors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(professorData),
    });

    if (!response.ok) {
      throw new Error("Failed to create professor");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Create professor error:", error);
    throw error;
  }
};

export const FetchAvailableProfessors = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/professors/available`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("FetchAvailableProfessors error:", error);
    return [];
  }
};

export const addProfessorToDepartment = async (professorId, departmentId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${BASE_URL}/api/professors/${professorId}/assign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ departmentId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to add professor to department"
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Add professor to department error:", error);
    throw error;
  }
};

export const removeProfessorFromDepartment = async (professorId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${BASE_URL}/api/professors/${professorId}/remove`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to remove professor from department"
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Remove professor from department error:", error);
    throw error;
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${BASE_URL}/api/departments/${departmentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete department");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Delete department error:", error);
    throw error;
  }
};
