import React from 'react';
import { FileText, Mail, UserX, FileImage, ArrowRight } from 'lucide-react';

interface CreateScreenProps {
  onNavigate: (screen: string) => void;
}

export function CreateScreen({ onNavigate }: CreateScreenProps) {
  const createOptions = [
    {
      id: 'resume-builder',
      title: 'Create CV/Resume',
      subtitle: 'Build a professional resume',
      description: 'Create a stunning resume with our easy-to-use templates and AI-powered suggestions.',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter',
      subtitle: 'Write compelling cover letters',
      description: 'Create persuasive cover letters that grab attention and showcase your personality.',
      icon: Mail,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'resignation-letter',
      title: 'Resignation Letter',
      subtitle: 'Professional resignation letters',
      description: 'Write professional and courteous resignation letters with proper formatting.',
      icon: UserX,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'other-letter',
      title: 'Other Letter',
      subtitle: 'Custom letter templates',
      description: 'Create any other type of professional letter with our flexible templates.',
      icon: FileImage,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create New Document</h1>
        <p className="text-gray-600">Choose the type of document you want to create</p>
      </div>

      {/* Create Options */}
      <div className="space-y-4">
        {createOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onNavigate(option.id)}
              className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${option.color}`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{option.title}</h3>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{option.subtitle}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
        <h3 className="text-lg font-semibold text-teal-800 mb-3">💡 Quick Tips</h3>
        <div className="space-y-2 text-sm text-teal-700">
          <p>• Start with a resume to showcase your skills and experience</p>
          <p>• Customize each cover letter for specific job applications</p>
          <p>• Keep resignation letters brief and professional</p>
          <p>• All documents can be downloaded as PDF files</p>
        </div>
      </div>

      {/* Recent Templates */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Templates</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No recent templates yet</p>
          <p className="text-sm text-gray-400">Your recently used templates will appear here</p>
        </div>
      </div>
    </div>
  );
}