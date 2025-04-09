import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FetchDepartmentById } from "../api";

const PageDep = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const data = await FetchDepartmentById(id);
        if (data) {
          setDepartment(data);
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

    fetchDepartment();
  }, [id]);

  return (
    <>
      <Link to="/">Return</Link>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {department && <h1>{department.name}</h1>}
    </>
  );
};

export default PageDep;
