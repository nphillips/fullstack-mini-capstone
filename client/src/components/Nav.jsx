import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const Nav = ({ isLoggedIn, user, setIsLoggedIn, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="bg-black/10 py-2 ">
      <div className="container min-h-15 flex justify-between items-center">
        <Link to="/" className="font-bold text-3xl text-blue-900">
          University Directory
        </Link>
        <div className="ml-auto flex gap-x-6  items-center">
          {isLoggedIn ? (
            <>
              <div className="text-blue-900 font-medium text-2xl">
                Welcome, {user?.username}!
              </div>
              <button
                onClick={handleLogout}
                className="text-white bg-blue-900 px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(
                  "text-white  px-4 py-2 rounded-md",
                  location.pathname === "/login" &&
                    "bg-black/50 pointer-events-none",
                  location.pathname !== "/login" && "bg-blue-900"
                )}
              >
                Login
              </Link>
              <Link
                to="/registration"
                className="text-white bg-blue-900 px-4 py-2 rounded-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
