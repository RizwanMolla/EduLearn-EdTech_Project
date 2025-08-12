import { useParams, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { mockCourses } from '../data/mockData';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  
  // Find the course with the matching ID
  const course = mockCourses.find(course => course.id === parseInt(courseId));
  
  useEffect(() => {
    const myCourses = JSON.parse(localStorage.getItem("myCourses") || "[]");
    setAlreadyPurchased(myCourses.includes(course.id));
  }, [course.id]);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
          <p className="mt-4 text-gray-600">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start">
          <div className="md:w-2/3 text-white">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg mb-6">{course.description}</p>
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div>
                <p className="text-sm opacity-75">Instructor</p>
                <p className="font-medium">{course.instructor}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Duration</p>
                <p className="font-medium">{course.duration}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Level</p>
                <p className="font-medium">{course.level}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Students</p>
                <p className="font-medium">{course.students.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-300 font-bold">{course.rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-yellow-300' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-300">({course.reviews} reviews)</span>
            </div>
          </div>
          <div className="md:w-1/3 mt-6 md:mt-0">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-gray-800">${course.price}</span>
              </div>
              {!alreadyPurchased && (
                <div className="flex justify-center mb-0">
                  <Link to={isAuthenticated ? `/purchase/${course.id}` : `/login?redirect=/purchase/${course.id}`} className="w-full flex justify-center">
                    <Button fullWidth>Buy Course</Button>
                  </Link>
                </div>
              )}
              {alreadyPurchased && (
                <div className="flex justify-center mb-0">
                  <span className="text-green-600 font-semibold">Already Purchased</span>
                </div>
              )}
              <p className="text-xs text-center text-gray-500 mt-4">30-Day Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
          <div className="space-y-4">
            {course.curriculum.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-lg text-gray-700">{section.section}</h3>
                  <p className="text-sm text-gray-500">{section.duration}</p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {section.lectures.map((lecture, i) => (
                    <li key={i} className="px-4 py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{lecture}</span>
                      </div>
                      <span className="text-gray-500 text-sm">Preview</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Course Includes</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.duration} of on-demand video</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Full lifetime access</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Access on mobile and TV</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Certificate of completion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;