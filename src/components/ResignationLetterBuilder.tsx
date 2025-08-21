import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Eye, Calendar, MapPin, Building } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface ResignationLetterBuilderProps {
  onBack: () => void;
}

export function ResignationLetterBuilder({ onBack }: ResignationLetterBuilderProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [resignationData, setResignationData] = useState({
    basic: {
      fullName: '',
      jobTitle: '',
      department: '',
      employeeId: '',
      date: new Date().toISOString().split('T')[0]
    },
    company: {
      companyName: '',
      supervisorName: '',
      supervisorTitle: '',
      companyAddress: ''
    },
    resignation: {
      lastWorkingDate: '',
      reason: '',
      reasonCategory: '',
      noticeWeeks: '2',
      handoverNotes: '',
      feedback: ''
    }
  });

  const [saving, setSaving] = useState(false);

  const sections = [
    { id: 'basic', label: 'Personal Info', icon: '👤' },
    { id: 'company', label: 'Company Info', icon: '🏢' },
    { id: 'resignation', label: 'Resignation Details', icon: '📝' }
  ];

  const reasonCategories = [
    'Career Advancement',
    'Better Opportunity',
    'Personal Reasons',
    'Relocation',
    'Education/Study',
    'Health Reasons',
    'Family Commitments',
    'Retirement',
    'Other'
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        alert('Please sign in to save your resignation letter');
        return;
      }

      const documentData = {
        type: 'resignation-letter',
        title: `Resignation Letter - ${resignationData.company.companyName || 'Untitled'}`,
        data: resignationData,
        userId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e9c2316f/save-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(documentData)
      });

      if (!response.ok) {
        throw new Error('Failed to save resignation letter');
      }

      alert('Resignation letter saved successfully!');
    } catch (error) {
      console.error('Error saving resignation letter:', error);
      alert('Failed to save resignation letter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    const requiredFields = [
      resignationData.basic.fullName,
      resignationData.basic.jobTitle,
      resignationData.company.companyName,
      resignationData.company.supervisorName,
      resignationData.resignation.lastWorkingDate,
      resignationData.resignation.reason
    ];
    
    const completedFields = requiredFields.filter(field => field.trim() !== '').length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Preview Resignation Letter"
            onClick={() => alert('Resignation letter preview coming soon!')}
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl text-gray-800 mb-2">Resignation Letter Builder</h1>
        <p className="text-gray-600">Create a professional resignation letter</p>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {activeSection === 'basic' && (
          <div className="space-y-6">
            <h2 className="text-lg text-gray-800">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={resignationData.basic.fullName}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    basic: { ...resignationData.basic, fullName: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Current Job Title *
                </label>
                <input
                  type="text"
                  value={resignationData.basic.jobTitle}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    basic: { ...resignationData.basic, jobTitle: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={resignationData.basic.department}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    basic: { ...resignationData.basic, department: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Engineering"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={resignationData.basic.employeeId}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    basic: { ...resignationData.basic, employeeId: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="EMP001"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={resignationData.basic.date}
                    onChange={(e) => setResignationData({
                      ...resignationData,
                      basic: { ...resignationData.basic, date: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'company' && (
          <div className="space-y-6">
            <h2 className="text-lg text-gray-800">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={resignationData.company.companyName}
                    onChange={(e) => setResignationData({
                      ...resignationData,
                      company: { ...resignationData.company, companyName: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Apple Inc."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Supervisor Name *
                </label>
                <input
                  type="text"
                  value={resignationData.company.supervisorName}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    company: { ...resignationData.company, supervisorName: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Supervisor Title
                </label>
                <input
                  type="text"
                  value={resignationData.company.supervisorTitle}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    company: { ...resignationData.company, supervisorTitle: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Engineering Manager"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Company Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={resignationData.company.companyAddress}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    company: { ...resignationData.company, companyAddress: e.target.value }
                  })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Apple Park&#10;One Apple Park Way&#10;Cupertino, CA 95014"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'resignation' && (
          <div className="space-y-6">
            <h2 className="text-lg text-gray-800">Resignation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Last Working Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={resignationData.resignation.lastWorkingDate}
                    onChange={(e) => setResignationData({
                      ...resignationData,
                      resignation: { ...resignationData.resignation, lastWorkingDate: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Notice Period (Weeks)
                </label>
                <select
                  value={resignationData.resignation.noticeWeeks}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    resignation: { ...resignationData.resignation, noticeWeeks: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="1">1 Week</option>
                  <option value="2">2 Weeks</option>
                  <option value="3">3 Weeks</option>
                  <option value="4">4 Weeks</option>
                  <option value="6">6 Weeks</option>
                  <option value="8">8 Weeks</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Reason Category
                </label>
                <select
                  value={resignationData.resignation.reasonCategory}
                  onChange={(e) => setResignationData({
                    ...resignationData,
                    resignation: { ...resignationData.resignation, reasonCategory: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select Reason</option>
                  {reasonCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Reason for Resignation *
              </label>
              <textarea
                value={resignationData.resignation.reason}
                onChange={(e) => setResignationData({
                  ...resignationData,
                  resignation: { ...resignationData.resignation, reason: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="I have accepted a new position that aligns with my career goals..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Keep it professional and positive. You don't need to provide detailed explanations.
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Handover Notes (Optional)
              </label>
              <textarea
                value={resignationData.resignation.handoverNotes}
                onChange={(e) => setResignationData({
                  ...resignationData,
                  resignation: { ...resignationData.resignation, handoverNotes: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="I am committed to ensuring a smooth transition of my responsibilities. I will complete all pending projects and provide detailed documentation for my replacement..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Feedback & Appreciation (Optional)
              </label>
              <textarea
                value={resignationData.resignation.feedback}
                onChange={(e) => setResignationData({
                  ...resignationData,
                  resignation: { ...resignationData.resignation, feedback: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="I want to express my gratitude for the opportunities for professional and personal growth during my time here. I have enjoyed working with the team..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">Resignation Letter Progress</span>
          <span className="text-sm text-gray-500">
            {getCompletionPercentage()}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <h3 className="text-lg mb-2">Ready to Download?</h3>
        <p className="text-orange-100 mb-4">
          Your resignation letter will be formatted professionally.
        </p>
        <button className="bg-white text-orange-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}