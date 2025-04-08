import { useEffect, useState } from "react";
import { FetchAllProfs } from "../api";
import { Link } from "react-router-dom";
import Tabs from "./Tabs";

const PageProfList = () => {
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    const fetchProfs = async () => {
      try {
        const response = await FetchAllProfs();
        setProfessors(response);
      } catch (error) {
        console.error("Error loading departments", error);
      }
    };
    fetchProfs();
  }, []);

  console.log(professors);

  return (
    <>
      <h1>All Professors </h1>
      <Tabs />

      <ul>
        {professors.map((prof) => {
          return <li key={prof.id}>{prof.name}</li>;
        })}
      </ul>
    </>
  );
};

export default PageProfList;
