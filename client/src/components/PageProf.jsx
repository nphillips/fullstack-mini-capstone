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
    <>
      <Link to="/">Return</Link>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {professor && <h1>{professor.name}</h1>}
    </>
  );
};

export default PageProf;
