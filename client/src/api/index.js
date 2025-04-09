const BASE_URL = `http://localhost:3000`;

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
