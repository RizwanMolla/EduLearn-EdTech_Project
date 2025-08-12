import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockCourses } from '../data/mockData';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

const Purchase = () => {
  const { courseId } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate(`/login?redirect=/purchase/${courseId}`);
      return;
    }
    
    // Find the course
    const foundCourse = mockCourses.find(c => c.id === parseInt(courseId));
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      navigate('/courses');
    }
  }, [courseId, isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsProcessing(true);
      
      // In a real app, this would process payment via API
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to a success page or course page
      navigate(`/courses/${courseId}?purchased=true`);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePaypalRedirect = () => {
    navigate(`/paypal/${courseId}`);
  };
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Complete your purchase</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h2>
              
              <div className="flex items-start mb-4">
                <div className="bg-gray-200 rounded-md w-20 h-20 flex-shrink-0 overflow-hidden">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-gray-500">By {course.instructor}</p>
                  <p className="text-sm text-gray-500">{course.duration}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4 text-gray-700">
                <div className="flex justify-between mb-2">
                  <span>Price</span>
                  <span>${course.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount</span>
                  <span>-$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${course.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    By completing this purchase, you agree to our Terms of Service and refund policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Method</h2>
              
              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md border ${
                    paymentMethod === 'credit' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => setPaymentMethod('credit')}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md border ${
                    paymentMethod === 'paypal' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  PayPal
                </button>
              </div>
              
              {paymentMethod === 'credit' ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="John Smith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.cardName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center">
                      <input
                        id="save-card"
                        name="saveCard"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="save-card" className="ml-2 block text-sm text-gray-900">
                        Save card for future purchases
                      </label>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay $${course.price.toFixed(2)}`}
                  </Button>
                </form>
              ) : (
                <div className="text-center p-6">
                  <p className="mb-4 text-gray-700">You'll be redirected to PayPal to complete your purchase.</p>
                  <Button
                    onClick={handlePaypalRedirect}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Redirecting...' : 'Continue to PayPal'}
                  </Button>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Your payment information is secure and encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;