// src/components/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="p-10 bg-neutral text-neutral-content mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <h3 className="font-bold">Educational</h3><br />
          <p className="text-sm">Providing reliable education since 2023</p><br />
        </div>
        <div>
          <span className="footer-title">About</span><br />
          <Link to="#" className="link link-hover">About Us</Link><br />
          <Link to="#" className="link link-hover">Features</Link><br />
          <Link to="#" className="link link-hover">News</Link><br />
        </div>
        <div>
          <span className="footer-title">Quick Link</span><br />
          <Link to="#" className="link link-hover">Terms of use</Link><br />
          <Link to="#" className="link link-hover">Privacy policy</Link><br />
          <Link to="#" className="link link-hover">Careers</Link><br />
        </div>
        <div>
          <span className="footer-title">Our Service</span><br />
          <Link to="#" className="link link-hover">Online Learning</Link><br />
          <Link to="#" className="link link-hover">Certifications</Link><br />
          <Link to="#" className="link link-hover">Support</Link><br />
        </div>
        <div>
          <span className="footer-title">Company</span><br />
          <Link to="#" className="link link-hover">Blog</Link><br />
          <Link to="#" className="link link-hover">Contact</Link><br />
          <Link to="#" className="link link-hover">Jobs</Link><br />
        </div>
      </div>
      <div className="text-center mt-8">
        <p>&copy; {new Date().getFullYear()} EduLearn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;