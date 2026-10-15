import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import SmoothScroll from './components/layout/SmoothScroll';
import PageTransition from './components/layout/PageTransition';
import Layout from './components/layout/Layout';
import RequireAuth from './components/layout/RequireAuth';
import Home from './pages/Home';

const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Learn = lazy(() => import('./pages/Learn'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Certificate = lazy(() => import('./pages/Certificate'));
const Instructors = lazy(() => import('./pages/Instructors'));
const InstructorProfile = lazy(() => import('./pages/InstructorProfile'));
const Paths = lazy(() => import('./pages/Paths'));
const Pricing = lazy(() => import('./pages/Pricing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Journal = lazy(() => import('./pages/Journal'));
const Article = lazy(() => import('./pages/Article'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Old URLs from the first version of the site
const LegacyPurchase = () => {
  const { courseId } = useParams();
  return <Navigate to={`/checkout?course=${courseId}`} replace />;
};

const protectedPage = (element) => <RequireAuth>{element}</RequireAuth>;

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <LearningProvider>
            <BrowserRouter>
              <SmoothScroll>
                <PageTransition>
                  <Suspense fallback={null}>
                    <Routes>
                      <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="courses" element={<Courses />} />
                        <Route path="courses/:courseId" element={<CourseDetail />} />
                        <Route path="learn/:courseId" element={protectedPage(<Learn />)} />
                        <Route path="dashboard" element={protectedPage(<Dashboard />)} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="checkout" element={protectedPage(<Checkout />)} />
                        <Route path="certificate/:courseId" element={protectedPage(<Certificate />)} />
                        <Route path="instructors" element={<Instructors />} />
                        <Route path="instructors/:instructorId" element={<InstructorProfile />} />
                        <Route path="paths" element={<Paths />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="journal" element={<Journal />} />
                        <Route path="journal/:slug" element={<Article />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="profile" element={protectedPage(<Profile />)} />
                        <Route path="mycourses" element={<Navigate to="/dashboard" replace />} />
                        <Route path="purchase/:courseId" element={<LegacyPurchase />} />
                        <Route path="paypal/:courseId" element={<LegacyPurchase />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </PageTransition>
              </SmoothScroll>
            </BrowserRouter>
          </LearningProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
