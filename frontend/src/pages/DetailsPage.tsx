import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Check, Loader2, AlertCircle } from 'lucide-react';
import { Experience, Slot } from '../types';
import { experienceAPI } from '../services/api';

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const expId = parseInt(id!);
      
      if (isNaN(expId)) {
        setError('Invalid experience ID');
        return;
      }

      const [expData, slotsData] = await Promise.all([
        experienceAPI.getById(expId),
        experienceAPI.getSlots(expId),
      ]);
      
      setExperience(expData);
      setSlots(slotsData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load experience details');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    if (slot.availableSpots > 0) {
      setSelectedSlot(slot);
    }
  };

  const handleContinue = () => {
    if (selectedSlot && experience) {
      navigate('/checkout', {
        state: { experience, slot: selectedSlot },
      });
    } else {
      alert('Please select a time slot');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <div className="text-xl text-red-600 mb-4">{error || 'Experience not found'}</div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Experience Details</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="w-full h-64 sm:h-80 md:h-96 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
            }}
          />
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {experience.title}
                </h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium mr-2">{experience.rating}</span>
                  <span className="text-gray-500">({experience.reviews} reviews)</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ${experience.price}
                </div>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>
            <div className="border-t pt-4 mb-6">
              <h3 className="text-lg font-semibold mb-2">About this experience</h3>
              <p className="text-gray-700 leading-relaxed">{experience.description}</p>
            </div>
            <div className="border-t pt-4 mb-6">
              <h3 className="text-lg font-semibold mb-2">Duration</h3>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-2" />
                <span>{experience.duration}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
              {slots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No available slots at the moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot)}
                      className={`border rounded-lg p-4 transition-all ${
                        slot.availableSpots === 0
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
                          : selectedSlot?.id === slot.id
                          ? 'border-blue-500 bg-blue-50 cursor-pointer'
                          : 'border-gray-300 hover:border-blue-400 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(slot.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{slot.time}</div>
                        </div>
                        <div className="text-right">
                          {slot.availableSpots === 0 ? (
                            <span className="text-sm text-red-600 font-medium">Sold Out</span>
                          ) : (
                            <>
                              <div className="text-sm text-gray-600">
                                {slot.availableSpots} / {slot.totalSpots} spots available
                              </div>
                              {selectedSlot?.id === slot.id && (
                                <Check className="w-5 h-5 text-blue-600 ml-auto mt-1" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleContinue}
              disabled={!selectedSlot}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Checkout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailsPage;