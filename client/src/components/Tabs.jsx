import { NavLink, useLocation } from "react-router-dom";

const Tabs = () => {
  const location = useLocation();

  return (
    <div className="tabs">
      <NavLink
        to="/departments"
        className={({ isActive }) =>
          isActive || location.pathname === "/" ? "tab active" : "tab"
        }
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
