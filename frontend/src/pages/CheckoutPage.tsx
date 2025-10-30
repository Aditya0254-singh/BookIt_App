import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Experience, Slot } from '../types';
import { bookingAPI, promoAPI } from '../services/api';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as { experience: Experience; slot: Slot } | null;
  
  if (!state || !state.experience || !state.slot) {
    navigate('/');
    return null;
  }

  const { experience, slot } = state;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    promoCode: '',
  });
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
   
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    if (formData.guests > slot.availableSpots) {
      newErrors.guests = `Only ${slot.availableSpots} spots available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePromoValidation = async () => {
    if (!formData.promoCode.trim()) {
      setPromoMessage('Please enter a promo code');
      return;
    }

    try {
      const result = await promoAPI.validate(formData.promoCode);
      if (result.valid) {
        setPromoDiscount(result.discount);
        setPromoMessage(`✓ Discount applied: $${result.discount}`);
      } else {
        setPromoDiscount(0);
        setPromoMessage('Invalid promo code');
      }
    } catch (err) {
      setPromoDiscount(0);
      setPromoMessage('Invalid promo code');
    }
  };

  const calculateSubtotal = () => {
    return experience.price * formData.guests;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - promoDiscount);
  };

  const handleBooking = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await bookingAPI.create({
        experienceId: experience.id,
        slotId: slot.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        guests: formData.guests,
        promoCode: formData.promoCode.trim() || undefined,
      });

      navigate('/result', {
        state: {
          success: result.success,
          bookingId: result.bookingId,
          experience: experience.title,
          date: slot.date,
          time: slot.time,
          guests: formData.guests,
          total: result.total || calculateTotal(),
        },
      });
    } catch (err: any) {
      console.error('Booking error:', err);
      navigate('/result', { 
        state: { 
          success: false,
          message: err.response?.data?.message || 'Failed to create booking'
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.guests ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {Array.from({ length: Math.min(slot.availableSpots, 10) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                  {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Promo Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter promo code"
                />
                <button
                  onClick={handlePromoValidation}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <div className={`mt-2 text-sm font-medium ${
                  promoDiscount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {promoMessage}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Try: <span className="font-medium">SAVE10</span> or <span className="font-medium">FLAT100</span>
              </p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
              
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-right max-w-[60%]">{experience.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{experience.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date(slot.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{slot.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{formData.guests}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per person</span>
                  <span>${experience.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${calculateSubtotal()}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">${calculateTotal()}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;