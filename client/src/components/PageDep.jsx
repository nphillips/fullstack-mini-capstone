import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FetchAllDepts,
  FetchAllProfs,
  addProfessorToDepartment,
  removeProfessorFromDepartment,
} from "../api";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const getDepartmentColor = (departmentName) => {
  const colorMap = {
    "temporal-studies":
      "bg-radial-[at_50%_75%] from-[#F3E4B5]/50 via-[#F4E3A5]/50 to-[#8CA28C]/50 to-90%",
    cryptozoology:
      "bg-radial-[at_50%_75%] from-[#E2E693]/50 via-[#F5D289]/50 to-[#90C288]/50 to-90%",
    "dream-engineering":
      "bg-radial-[at_50%_75%] from-[#FED36F]/50 via-[#F5D289]/50 to-[#7785A5]/50 to-90%",
    "culinary-alchemy":
      "bg-radial-[at_50%_75%] from-[#DD9A33]/50 via-[#E7A541]/50 to-[#A03D1A]/50 to-90%",
  };

  // Convert department name to slug format to match our URL structure
  const slug = departmentName
    .toLowerCase()
    .replace(/^department of /i, "")
    .replace(/\s+/g, "-");
  return colorMap[slug] || "bg-gray-300"; // Default color if department not found
};

const PageDep = () => {
  const { name } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProfessors, setAllProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const departments = await FetchAllDepts();
        const dept = departments.find(
          (d) =>
            d.name
              .toLowerCase()
              .replace(/^department of /i, "")
              .replace(/\s+/g, "-") === name
        );
        if (dept) {
          setDepartment(dept);
        } else {
          setError("Department not found");
        }
      } catch (err) {
        setError("Error loading department");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfessors = async () => {
      try {
        const professors = await FetchAllProfs();
        setAllProfessors(professors);
      } catch (err) {
        console.error("Error loading professors:", err);
      }
    };

    fetchDepartment();
    fetchProfessors();
  }, [name]);

  const handleProfessorChange = (e) => {
    setSelectedProfessor(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedProfessor) {
      setFormError("Please select a professor");
      return;
    }

    try {
      // Call the API to add the professor to the department
      const response = await addProfessorToDepartment(
        selectedProfessor,
        department.id
      );
      if (!response) {
        throw new Error("Failed to add professor");
      }

      // Find the professor in allProfessors
      const addedProfessor = allProfessors.find(
        (p) => p.id === selectedProfessor
      );
      if (!addedProfessor) {
        throw new Error("Professor not found");
      }

      // Update the department state by adding the professor
      setDepartment((prevDepartment) => ({
        ...prevDepartment,
        professors: [
          ...prevDepartment.professors,
          {
            id: addedProfessor.id,
            name: addedProfessor.name,
            email: addedProfessor.email,
            profileImg: addedProfessor.profileImg,
            bio: addedProfessor.bio,
          },
        ],
      }));

      // Update the allProfessors state to reflect the change
      setAllProfessors((prevProfessors) =>
        prevProfessors.map((prof) =>
          prof.id === selectedProfessor
            ? {
                ...prof,
                departmentId: department.id,
                department_name: department.name,
              }
            : prof
        )
      );

      setSelectedProfessor("");
    } catch (err) {
      setFormError(err.message || "Failed to add professor");
      console.error(err);
    }
  };

  const handleRemoveProfessor = async (professorId) => {
    try {
      const response = await removeProfessorFromDepartment(professorId);
      if (!response) {
        throw new Error("Failed to remove professor");
      }

      // Update the department state by removing the professor from the current department
      setDepartment((prevDepartment) => ({
        ...prevDepartment,
        professors: prevDepartment.professors.filter(
          (p) => p.id !== professorId
        ),
      }));

      // Update the allProfessors state to reflect the change
      setAllProfessors((prevProfessors) =>
        prevProfessors.map((prof) =>
          prof.id === professorId
            ? { ...prof, departmentId: null, department_name: null }
            : prof
        )
      );
    } catch (err) {
      setError(err.message || "Failed to remove professor");
      console.error(err);
    }
  };

  const availableProfessors = allProfessors.filter((professor) => {
    if (!department || !department.professors) return true;
    return !department.professors.some((p) => p.id === professor.id);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`hero ${
          department ? getDepartmentColor(department.name) : "bg-gray-300"
        }`}
      ></div>
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Return to Departments
      </Link>

      {loading && (
        <p className="text-center text-xl">Loading department information...</p>
      )}

      {error && <p className="text-center text-red-600 text-xl">{error}</p>}

      {department && (
        <div className="w-full">
          {department.bannerImage && (
            <div className="mb-6">
              <img
                src={department.bannerImage}
                alt={`${department.name} banner`}
                className="object-cover rounded-lg shadow-md aspect-[768/512] max-w-[500px]"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold mb-6">{department.name}</h1>

          <div className="mb-6">
            <p className="text-gray-600">{department.description}</p>
          </div>

          {isLoggedIn && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="professor"
                    className="text-xl font-semibold mb-2 block"
                  >
                    Select Professor
                  </label>
                  <Select
                    id="professor"
                    name="professor"
                    value={selectedProfessor}
                    onChange={handleProfessorChange}
                    className="w-full"
                  >
                    <option value=""></option>
                    {availableProfessors.map((professor) => (
                      <option key={professor.id} value={professor.id}>
                        {professor.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={availableProfessors.length === 0}
                >
                  Add Professor
                </button>
                {formError && <p className="text-red-600">{formError}</p>}
                {availableProfessors.length === 0 && (
                  <p className="text-gray-500 italic">
                    No available professors to add
                  </p>
                )}
              </form>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4">Faculty Members</h2>

          {department.professors && department.professors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {department.professors.map((professor) => (
                <div
                  key={professor.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={professor.profileImg}
                    alt={professor.name}
                    className=" mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">
                    {professor.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {professor.email}
                  </p>
                  <p className="text-gray-700">{professor.bio}</p>
                  {isLoggedIn && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => handleRemoveProfessor(professor.id)}
                        className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove from Department
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No professors found in this department.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PageDep;
