// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Button from '../components/Button';
import { mockCourses } from '../data/mockData'; // We'll create this next

const Home = () => {
  // Get the 3 most popular courses
  const popularCourses = mockCourses.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-300 to-violet-500 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                EDUCATION IS THE <br/>
                <span className="text-primary">KEY OF SUCCESS</span>
              </h1>
              <p className="text-lg mb-6">Start, switch, or advance your career with online courses from top educators.</p>
              <div className="relative max-w-md">
                <Link
                  to="/courses"
                  className="input input-bordered w-full pr-16 text-left cursor-pointer flex items-center"
                >
                  Search Courses...
                </Link>
                <Link
                  to="/courses"
                  className="btn btn-primary absolute top-0 right-0 rounded-l-none flex items-center justify-center"
                  tabIndex={-1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img src="https://images.unsplash.com/photo-1700241956197-0b13f96fd69e?q=80&w=1461&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Students learning" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <h3 className="text-2xl font-bold">25 Lakh+</h3>
              <p>Happy Students</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">10 Lakh+</h3>
              <p>Enrollments</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">18 Lakh+</h3>
              <p>Certificates Delivered</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">24,000+</h3>
              <p>Career Transitions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Most Popular Course On Our Website</h2>
            <Link to="/courses" className="text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Online Learning" className="rounded-lg" />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Platforms That Offer Learning Courses</h2>
              <p className="mb-6">Our platform is designed to meet all your learning needs with expert-led courses, hands-on projects, and certifications.</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="black">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>High-quality video content</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="black">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Interactive assignments</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="black">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Personalized learning paths</span>
                </div>
              </div>
              <Button className="mt-6">Join Us Online</Button>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Makes Us Different From Others And What Is Our Specialty?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="black">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-gray-700">Best Tutors</h3>
              <p className="text-sm text-gray-600">Learn from industry experts who are passionate about teaching.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="black">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-gray-700">Best Curriculum</h3>
              <p className="text-sm text-gray-600">Meticulously designed curriculum to ensure comprehensive learning.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="black">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-gray-700">Certificate</h3>
              <p className="text-sm text-gray-600">Receive verifiable certificates upon course completion.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="black">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-gray-700">Creative Thinking</h3>
              <p className="text-sm text-gray-600">Develop problem-solving skills through creative approaches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Teachers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">We Have The Best Mentor To Guide You & Help You Become Your Best</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-pink-50 p-6 rounded-lg">
              <img src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Teacher" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-bold text-lg text-gray-700">Cody Fisher</h3>
              <p className="text-sm text-gray-600">UI/UX Designer | 5+ years experience</p>
              <div className="flex mt-4">
                <a href="#" className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="gray" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="gray" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <img src="https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Teacher" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-bold text-lg text-gray-700">Dianne Russel</h3>
              <p className="text-sm text-gray-600">Web Developer | 7+ years experience</p>
              <div className="flex mt-4">
                <a href="#" className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="gray" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="gray" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Teacher" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-bold text-lg text-gray-700">Arlene McCoy</h3>
              <p className="text-sm text-gray-600">Data Scientist | 6+ years experience</p>
              <div className="flex mt-4">
                <a href="#" className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="gray" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="gray" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Teacher" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-bold text-lg text-gray-700">Wade Warren</h3>
              <p className="text-sm text-gray-600">Marketing Specialist | 4+ years experience</p>
              <div className="flex mt-4">
                <a href="#" className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="gray" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="gray" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button>View All Teachers</Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">We Prepare A Very Reasonable Pricing Pack For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-gray-700 flex flex-col justify-between">
              <h3 className="text-xl font-bold mb-4">Basic Pack</h3>
              <p className="text-4xl font-bold mb-6">$199<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to 100+ courses</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic assignments & tests</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Course completion certificate</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>24/7 Support</span>
                </li>
              </ul>
              <div className="flex justify-center mt-6">
                <Button className="w-48">Choose Plan</Button>
              </div>
            </div>
            <div className="bg-primary text-white p-8 rounded-lg shadow-md flex flex-col justify-between">
              <h3 className="text-xl font-bold mb-4">Starter Pack</h3>
              <p className="text-4xl font-bold mb-6">$249<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to all Basic features</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced assignments</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Career guidance</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>1-on-1 mentorship</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              <div className="flex justify-center mt-6">
                <Button className="w-48 bg-white text-primary hover:bg-gray-100 border border-primary">Choose Plan</Button>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-gray-700 flex flex-col justify-between">
              <h3 className="text-xl font-bold mb-4">Premium Pack</h3>
              <p className="text-4xl font-bold mb-6">$399<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to all Starter features</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-world projects</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Job placement assistance</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Resume building</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Interview preparation</span>
                </li>
              </ul>
              <div className="flex justify-center mt-6">
                <Button className="w-48">Choose Plan</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">We Have All Kinds Of Courses Available For You And You Can Connect With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-4">Business And Management</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary">Digital Marketing</a></li>
                <li><a href="#" className="hover:text-primary">Entrepreneurship</a></li>
                <li><a href="#" className="hover:text-primary">Communication</a></li>
                <li><a href="#" className="hover:text-primary">Management</a></li>
                <li><a href="#" className="hover:text-primary">Sales</a></li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-4">Health And Medicine</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary">Nutrition</a></li>
                <li><a href="#" className="hover:text-primary">Public Health</a></li>
                <li><a href="#" className="hover:text-primary">Healthcare</a></li>
                <li><a href="#" className="hover:text-primary">Mental Health</a></li>
                <li><a href="#" className="hover:text-primary">Fitness</a></li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-4">Language Learning</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary">English</a></li>
                <li><a href="#" className="hover:text-primary">Spanish</a></li>
                <li><a href="#" className="hover:text-primary">French</a></li>
                <li><a href="#" className="hover:text-primary">Japanese</a></li>
                <li><a href="#" className="hover:text-primary">Chinese</a></li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-4">Fundraising</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary">Crowdfunding</a></li>
                <li><a href="#" className="hover:text-primary">Grant Writing</a></li>
                <li><a href="#" className="hover:text-primary">Nonprofit Management</a></li>
                <li><a href="#" className="hover:text-primary">Fundraising Strategy</a></li>
                <li><a href="#" className="hover:text-primary">Event Planning</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;