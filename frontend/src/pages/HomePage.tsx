import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Loader2 } from 'lucide-react';
import { Experience } from '../types';
import { experienceAPI } from '../services/api';

const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await experienceAPI.getAll();
      setExperiences(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load experiences. Please try again.');
      console.error('Error loading experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={loadExperiences}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-blue-600">BookIt</h1>
          <p className="text-gray-600 mt-1">Discover Amazing Experiences</p>
        </div>
      </header>

    
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Experiences
          </h2>
          <p className="text-gray-600">Find your next adventure</p>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No experiences available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                onClick={() => navigate(`/experience/${exp.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={exp.imageUrl}
                    alt={exp.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    ${exp.price}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{exp.location}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {exp.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{exp.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({exp.reviews})
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {exp.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;