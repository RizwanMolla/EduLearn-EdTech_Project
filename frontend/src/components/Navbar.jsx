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
                {user.image && user.image.trim() !== '' ? (
                  <img src={user.image} alt="User" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U'}
                  </div>
                )}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/mycourses">My Courses</Link></li>
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