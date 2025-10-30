import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as {
    success: boolean;
    bookingId?: string;
    experience?: string;
    date?: string;
    time?: string;
    guests?: number;
    total?: number;
    message?: string;
  } | null;

  if (!state) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {state.success ? (
          <>
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Your booking has been successfully confirmed. Check your email for details.
            </p>
            
            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Booking ID</span>
                <span className="font-mono font-medium">{state.bookingId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-right">{state.experience}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">
                  {state.date && new Date(state.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })} at {state.time}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Guests</span>
                <span className="font-medium">{state.guests}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total Paid</span>
                <span className="text-blue-600">${state.total}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            
            {/* Error Message */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Booking Failed
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {state.message || 'Something went wrong. Please try again.'}
            </p>
          </>
        )}
        
        {/* Action Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {state.success ? 'Book Another Experience' : 'Return Home'}
        </button>
      </div>
    </div>
  );
};

export default ResultPage;