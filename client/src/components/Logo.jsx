import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logo flex">
      <div className="container">University Directory</div>
      <div className="ml-auto flex gap-x-4">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Logo;
