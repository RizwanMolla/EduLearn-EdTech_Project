import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const PaypalDemo = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);

  // Simulate PayPal payment
  const handlePayment = () => {
    // Save purchased course to localStorage (simulate backend)
    const myCourses = JSON.parse(localStorage.getItem("myCourses") || "[]");
    if (!myCourses.includes(courseId)) {
      myCourses.push(courseId);
      localStorage.setItem("myCourses", JSON.stringify(myCourses));
    }
    setPaid(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-600">
      <h2 className="text-2xl font-bold mb-6 text-white">Pay with PayPal</h2>
      <div className="bg-white p-8 rounded shadow text-center">
        {!paid ? (
          <>
            <p className="mb-4">
              Demo payment for course <b>{courseId}</b>
            </p>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded mb-2"
              onClick={handlePayment}
            >
              Pay with PayPal
            </button>
            <p className="text-xs text-gray-500 mt-2">
              (This is a demo. No real payment will be made.)
            </p>
          </>
        ) : (
          <>
            <p className="mb-4 text-green-600 font-semibold">
              Payment is complete.
            </p>
            <p className="mb-6">Click below to view your courses.</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded"
              onClick={() => navigate("/mycourses")}
            >
              View My Courses
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaypalDemo;