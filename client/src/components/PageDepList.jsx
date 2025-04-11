import { useEffect, useState } from "react";
import { FetchAllDepts, deleteDepartment } from "../api";
import { Link } from "react-router-dom";
import Tabs from "./Tabs";

const PageDepList = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchDepts = async () => {
      try {
        const response = await FetchAllDepts();
        setDepartments(response);
      } catch (error) {
        console.error("Error loading departments", error);
      }
    };
    fetchDepts();
  }, []);

  console.log(departments);

  const handleRemoveDepartment = async (departmentId) => {
    try {
      await deleteDepartment(departmentId);
      setDepartments(departments.filter((dep) => dep.id !== departmentId));
    } catch (error) {
      console.error("Error removing department:", error);
      setFormError(error.message);
    }
  };

  return (
    <div>
      <div className="hero bg-radial-[at_50%_75%] from-[#F3E4B5]/50 via-[#F4E3A5]/50 to-[#1C398F]/50 to-90%"></div>
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold text-blue-900">All Departments</h1>
      </div>

      <Tabs />
      {/* Add a department */}
      <div>
        <h2>Add a department</h2>
        <form>
          <input type="text" placeholder="Department name" />
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id}>
            <Link
              to={`/departments/${dept.name
                .toLowerCase()
                .replace(/^department of /i, "")
                .replace(/\s+/g, "-")}`}
              key={dept.id}
            >
              <img
                src={dept.bannerImage}
                alt={dept.name}
                className="w-full object-cover rounded-lg shadow-md"
              />
              {dept.name}
            </Link>
            {isLoggedIn && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => handleRemoveDepartment(dept.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageDepList;
