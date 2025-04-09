import { useEffect, useState } from "react";
import { FetchAllDepts } from "../api";
import { Link } from "react-router-dom";
import Tabs from "./Tabs";

const PageDepList = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
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

  return (
    <>
      <h1>All Departments </h1>
      <Tabs />

      <ul>
        {departments.map((dep) => {
          return (
            <li key={dep.id}>
              <Link to={`/departments/${dep.id}`}>{dep.name}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PageDepList;
