import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Simulate fetching purchased courses from localStorage
    const myCourses = JSON.parse(localStorage.getItem("myCourses") || "[]");
    setCourses(myCourses);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow text-slate-600">
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      {courses.length === 0 ? (
        <p>You have not purchased any courses yet.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((id) => (
            <li key={id} className="border p-4 rounded flex justify-between items-center">
              <span>Course ID: <b>{id}</b></span>
              <Link to={`/courses/${id}`} className="text-blue-600 hover:underline">View Course</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCourses;