import { NavLink } from "react-router-dom";

const Tabs = () => {
  return (
    <div className="tabs">
      <NavLink
        to="/departments"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        Departments
      </NavLink>
      <NavLink
        to="/professors"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        Professors
      </NavLink>
    </div>
  );
};

export default Tabs;
