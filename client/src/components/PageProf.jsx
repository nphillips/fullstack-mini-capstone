import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FetchProfessorById } from "../api";

const PageProf = () => {
  const { id } = useParams();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        setLoading(true);
        const data = await FetchProfessorById(id);
        if (data) {
          setProfessor(data);
        } else {
          setError("Professor not found");
        }
      } catch (err) {
        setError("Error loading professor");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessor();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 bg-temporal">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Return to Home
      </Link>

      {loading && (
        <p className="text-center text-xl">Loading professor information...</p>
      )}

      {error && <p className="text-center text-red-600 text-xl">{error}</p>}

      {professor && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="max-w-60 flex-shrink-0">
              <img
                src={professor.profileImg || "/placeholder-avatar.png"}
                alt={professor.name}
                className=" object-cover"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-4">{professor.name}</h1>
              <p className="text-gray-600 mb-2">{professor.email}</p>

              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Department</h2>
                {professor.department_name ? (
                  <Link
                    to={`/departments/${professor.department_name
                      .toLowerCase()
                      .replace(/^department of /i, "")
                      .replace(/\s+/g, "-")}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {professor.department_name}
                  </Link>
                ) : (
                  <p className="text-gray-500 italic">
                    Not assigned to any department
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Biography</h2>
                <p className="text-gray-700">{professor.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageProf;
