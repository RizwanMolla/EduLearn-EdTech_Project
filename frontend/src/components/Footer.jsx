// src/components/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="p-10 bg-neutral text-neutral-content mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <h3 className="font-bold">Educational</h3>
          <p className="text-sm">Providing reliable education since 2023</p>
        </div>
        <div>
          <span className="footer-title">About</span>
          <Link to="#" className="link link-hover">About Us</Link>
          <Link to="#" className="link link-hover">Features</Link>
          <Link to="#" className="link link-hover">News</Link>
        </div>
        <div>
          <span className="footer-title">Quick Link</span>
          <Link to="#" className="link link-hover">Terms of use</Link>
          <Link to="#" className="link link-hover">Privacy policy</Link>
          <Link to="#" className="link link-hover">Careers</Link>
        </div>
        <div>
          <span className="footer-title">Our Service</span>
          <Link to="#" className="link link-hover">Online Learning</Link>
          <Link to="#" className="link link-hover">Certifications</Link>
          <Link to="#" className="link link-hover">Support</Link>
        </div>
        <div>
          <span className="footer-title">Company</span>
          <Link to="#" className="link link-hover">Blog</Link>
          <Link to="#" className="link link-hover">Contact</Link>
          <Link to="#" className="link link-hover">Jobs</Link>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>&copy; {new Date().getFullYear()} EduLearn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;