// src/pages/Courses.jsx
import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import { mockCourses } from '../data/mockData';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Marketing', 'Mobile Development', 'Blockchain'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || course.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse All Courses</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select 
            className="select select-bordered w-full"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-xl font-semibold">No courses found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;