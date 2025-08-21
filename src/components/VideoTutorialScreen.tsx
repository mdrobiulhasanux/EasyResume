import React, { useState } from 'react';
import { Play, Clock, User, BookOpen, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Tutorial {
  id: number;
  title: string;
  duration: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  views: number;
}

export function VideoTutorialScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Getting Started with Resume Builder',
      duration: '5:32',
      description: 'Learn the basics of creating your first resume with our platform',
      difficulty: 'Beginner',
      category: 'resume',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      views: 1247
    },
    {
      id: 2,
      title: 'Choosing the Right Resume Template',
      duration: '7:18',
      description: 'Discover how to select the perfect template for your industry',
      difficulty: 'Beginner',
      category: 'resume',
      thumbnail: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=225&fit=crop',
      views: 892
    },
    {
      id: 3,
      title: 'Writing Compelling Cover Letters',
      duration: '9:45',
      description: 'Master the art of writing cover letters that get noticed',
      difficulty: 'Intermediate',
      category: 'cover-letter',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=225&fit=crop',
      views: 634
    },
    {
      id: 4,
      title: 'Advanced Formatting Tips',
      duration: '12:03',
      description: 'Professional formatting techniques for standout documents',
      difficulty: 'Advanced',
      category: 'formatting',
      thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=225&fit=crop',
      views: 423
    },
    {
      id: 5,
      title: 'Interview Preparation Strategies',
      duration: '15:27',
      description: 'Comprehensive guide to preparing for your next interview',
      difficulty: 'Intermediate',
      category: 'interview',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      views: 756
    },
    {
      id: 6,
      title: 'Using AI Features Effectively',
      duration: '8:14',
      description: 'Leverage AI to enhance your resume and cover letters',
      difficulty: 'Intermediate',
      category: 'ai',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop',
      views: 1089
    }
  ];

  const categories = [
    { id: 'all', label: 'All Tutorials' },
    { id: 'resume', label: 'Resume Building' },
    { id: 'cover-letter', label: 'Cover Letters' },
    { id: 'interview', label: 'Interview Prep' },
    { id: 'formatting', label: 'Formatting' },
    { id: 'ai', label: 'AI Features' }
  ];

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Video Tutorials</h1>
        <p className="text-gray-600">Learn how to make the most of Resume Builder</p>
      </div>

      {/* Featured Tutorial */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium">Featured Tutorial</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Complete Resume Building Masterclass</h2>
          <p className="text-purple-100 mb-4">
            Everything you need to know to create professional resumes that land interviews
          </p>
          <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Play className="w-4 h-4" />
            Watch Now
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-32 bg-white/10 transform rotate-12 translate-x-8"></div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Tutorials List */}
      <div className="space-y-4">
        {filteredTutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 p-4">
              <div className="relative flex-shrink-0">
                <ImageWithFallback
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {tutorial.duration}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{tutorial.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutorial.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tutorial.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {tutorial.views.toLocaleString()} views
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Path */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Recommended Learning Path</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <div className="font-medium text-gray-800">Start with the basics</div>
              <div className="text-sm text-gray-600">Learn platform fundamentals</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <div className="font-medium text-gray-800">Build your first resume</div>
              <div className="text-sm text-gray-600">Apply what you've learned</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <div className="font-medium text-gray-800">Master advanced features</div>
              <div className="text-sm text-gray-600">Unlock professional techniques</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}