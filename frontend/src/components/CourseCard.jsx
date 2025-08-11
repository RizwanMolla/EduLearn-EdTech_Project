// src/components/CourseCard.jsx
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <figure>
        <img src={course.image} alt={course.title} className="h-48 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{course.title}</h2>
        <p className="text-sm text-gray-500">{course.instructor}</p>
        <div className="flex items-center mt-2">
          <div className="rating rating-sm">
            {[...Array(5)].map((_, i) => (
              <input 
                key={i}
                type="radio" 
                name={`rating-${course.id}`} 
                className="mask mask-star-2 bg-orange-400" 
                checked={i === Math.floor(course.rating) - 1}
                readOnly
              />
            ))}
          </div>
          <span className="ml-2 text-sm">{course.rating} ({course.reviews} reviews)</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold">${course.price}</span>
          <Link
            to={`/courses/${course.id}`}
            className="btn btn-primary btn-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;