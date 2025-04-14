import { Link } from 'react-router-dom';
import { useContext } from 'react'; // Import useContext
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Use useContext to access AuthContext

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-8">
      <div className="navbar-start">
        <Link to="/" className="text-xl font-bold">EduLearn</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-4">
          <li className='font-bold text-base'><Link to="/">Home</Link></li>
          <li className='font-bold text-base'><Link to="/courses">Courses</Link></li>
          <li className='font-bold text-base'><a href="#about">About</a></li>
          <li className='font-bold text-base'><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a>Profile</a></li>
              <li><a>My Courses</a></li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-success">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;