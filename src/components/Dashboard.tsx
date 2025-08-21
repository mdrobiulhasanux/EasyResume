import React from 'react';
import { 
  FileText, 
  Mail, 
  UserX, 
  FileImage, 
  Download, 
  MessageSquare, 
  PlayCircle, 
  Star,
  Plus
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const createOptions = [
    {
      id: 'resume-builder',
      title: 'Create CV/Resume',
      subtitle: 'Professional resume templates',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter',
      subtitle: 'Compelling cover letters',
      icon: Mail,
      color: 'bg-green-500'
    },
    {
      id: 'resignation-letter',
      title: 'Resignation Letter', 
      subtitle: 'Professional resignation',
      icon: UserX,
      color: 'bg-orange-500'
    },
    {
      id: 'other-letter',
      title: 'Other Letter',
      subtitle: 'Custom letter templates',
      icon: FileImage,
      color: 'bg-purple-500'
    }
  ];

  const otherOptions = [
    {
      id: 'downloads',
      title: 'Downloads',
      subtitle: 'Your saved documents',
      icon: Download,
      color: 'bg-teal-500'
    },
    {
      id: 'interview-questions',
      title: 'Interview Questions',
      subtitle: 'AI-powered prep',
      icon: MessageSquare,
      color: 'bg-indigo-500'
    },
    {
      id: 'video-tutorial',
      title: 'Video Tutorial',
      subtitle: 'Learn how to use the app',
      icon: PlayCircle,
      color: 'bg-red-500'
    },
    {
      id: 'feedback',
      title: 'Feedback',
      subtitle: 'Share your thoughts', 
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-teal-100 mb-4">Ready to create your next professional document?</p>
        <button
          onClick={() => onNavigate('create')}
          className="bg-white text-teal-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Start Creating
        </button>
      </div>

      {/* Create Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Options</h3>
        <div className="grid grid-cols-2 gap-4">
          {createOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => onNavigate(option.id)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-lg ${option.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">{option.title}</h4>
                    <p className="text-xs text-gray-500">{option.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Other Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Features</h3>
        <div className="grid grid-cols-2 gap-4">
          {otherOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => onNavigate(option.id)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-lg ${option.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">{option.title}</h4>
                    <p className="text-xs text-gray-500">{option.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Activity</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">0</div>
            <div className="text-sm text-gray-600">Resumes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Cover Letters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Downloads</div>
          </div>
        </div>
      </div>
    </div>
  );
}