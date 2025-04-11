import { useEffect, useState } from "react";
import { FetchAllProfs } from "../api";
import { Link } from "react-router-dom";
import Tabs from "./Tabs";
import CreateProfessorForm from "./CreateProfessorForm";

const PageProfList = () => {
  const [professors, setProfessors] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchProfs = async () => {
      try {
        const response = await FetchAllProfs();
        setProfessors(response);
      } catch (error) {
        console.error("Error loading professors", error);
      }
    };
    fetchProfs();
  }, []);

  const handleProfessorCreated = async () => {
    // Refresh the professor list
    const response = await FetchAllProfs();
    setProfessors(response);
    setShowCreateForm(false);
  };

  return (
    <div className="">
      <div className="hero bg-radial-[at_50%_75%] from-[#F3E4B5]/50 via-[#F4E3A5]/50 to-[#1C398F]/50 to-90%"></div>
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold text-blue-900">All Professors</h1>
        {isLoggedIn && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showCreateForm ? "Cancel" : "Add New Professor"}
          </button>
        )}
      </div>

      <Tabs />

      {showCreateForm && isLoggedIn && (
        <div className="mb-8">
          <CreateProfessorForm onSuccess={handleProfessorCreated} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {professors.map((prof) => (
          <Link
            to={`/professors/${prof.id}`}
            key={prof.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col items-center">
              <div className=" overflow-hidden mb-4">
                <img
                  src={prof.profileImg || "/placeholder-avatar.png"}
                  alt={prof.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-center">{prof.name}</h2>
              <p className="text-gray-600 text-sm text-center mt-1">
                {prof.department_name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PageProfList;
