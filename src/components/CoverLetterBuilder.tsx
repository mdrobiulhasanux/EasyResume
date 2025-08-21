import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Eye, FileText, Calendar, MapPin, Building } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface CoverLetterBuilderProps {
  onBack: () => void;
}

export function CoverLetterBuilder({ onBack }: CoverLetterBuilderProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [coverLetterData, setCoverLetterData] = useState({
    basic: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      date: new Date().toISOString().split('T')[0]
    },
    employer: {
      companyName: '',
      hiringManagerName: '',
      companyAddress: '',
      jobTitle: ''
    },
    content: {
      subject: '',
      salutation: 'Dear Hiring Manager',
      introduction: '',
      body: '',
      conclusion: '',
      closing: 'Sincerely'
    }
  });

  const [saving, setSaving] = useState(false);

  const sections = [
    { id: 'basic', label: 'Personal Info', icon: '👤' },
    { id: 'employer', label: 'Employer Info', icon: '🏢' },
    { id: 'content', label: 'Letter Content', icon: '✍️' }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        alert('Please sign in to save your cover letter');
        return;
      }

      const documentData = {
        type: 'cover-letter',
        title: `Cover Letter - ${coverLetterData.employer.companyName || 'Untitled'}`,
        data: coverLetterData,
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
        throw new Error('Failed to save cover letter');
      }

      alert('Cover letter saved successfully!');
    } catch (error) {
      console.error('Error saving cover letter:', error);
      alert('Failed to save cover letter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    const requiredFields = [
      coverLetterData.basic.fullName,
      coverLetterData.basic.email,
      coverLetterData.employer.companyName,
      coverLetterData.content.introduction,
      coverLetterData.content.body
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
            title="Preview Cover Letter"
            onClick={() => alert('Cover letter preview coming soon!')}
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
        <h1 className="text-2xl text-gray-800 mb-2">Cover Letter Builder</h1>
        <p className="text-gray-600">Create a professional cover letter that gets you noticed</p>
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
                  value={coverLetterData.basic.fullName}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    basic: { ...coverLetterData.basic, fullName: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={coverLetterData.basic.email}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    basic: { ...coverLetterData.basic, email: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={coverLetterData.basic.phone}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    basic: { ...coverLetterData.basic, phone: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
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
                    value={coverLetterData.basic.date}
                    onChange={(e) => setCoverLetterData({
                      ...coverLetterData,
                      basic: { ...coverLetterData.basic, date: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Your Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={coverLetterData.basic.address}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    basic: { ...coverLetterData.basic, address: e.target.value }
                  })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="123 Main Street&#10;City, State 12345&#10;Country"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'employer' && (
          <div className="space-y-6">
            <h2 className="text-lg text-gray-800">Employer Information</h2>
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
                    value={coverLetterData.employer.companyName}
                    onChange={(e) => setCoverLetterData({
                      ...coverLetterData,
                      employer: { ...coverLetterData.employer, companyName: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Apple Inc."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={coverLetterData.employer.jobTitle}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    employer: { ...coverLetterData.employer, jobTitle: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Hiring Manager Name
                </label>
                <input
                  type="text"
                  value={coverLetterData.employer.hiringManagerName}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    employer: { ...coverLetterData.employer, hiringManagerName: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Jane Smith"
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
                  value={coverLetterData.employer.companyAddress}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    employer: { ...coverLetterData.employer, companyAddress: e.target.value }
                  })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Apple Park&#10;One Apple Park Way&#10;Cupertino, CA 95014"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'content' && (
          <div className="space-y-6">
            <h2 className="text-lg text-gray-800">Letter Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={coverLetterData.content.subject}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    content: { ...coverLetterData.content, subject: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Application for Software Engineer Position"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Salutation
                </label>
                <select
                  value={coverLetterData.content.salutation}
                  onChange={(e) => setCoverLetterData({
                    ...coverLetterData,
                    content: { ...coverLetterData.content, salutation: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="Dear Hiring Manager">Dear Hiring Manager</option>
                  <option value="Dear Sir/Madam">Dear Sir/Madam</option>
                  <option value="To Whom It May Concern">To Whom It May Concern</option>
                  <option value="Dear [Name]">Dear [Name]</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Introduction Paragraph *
              </label>
              <textarea
                value={coverLetterData.content.introduction}
                onChange={(e) => setCoverLetterData({
                  ...coverLetterData,
                  content: { ...coverLetterData.content, introduction: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="I am writing to express my strong interest in the [Job Title] position at [Company Name]. With my background in [relevant field/experience], I am excited about the opportunity to contribute to your team..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Main Body *
              </label>
              <textarea
                value={coverLetterData.content.body}
                onChange={(e) => setCoverLetterData({
                  ...coverLetterData,
                  content: { ...coverLetterData.content, body: e.target.value }
                })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="In my previous role at [Previous Company], I successfully [specific achievement]. My experience with [relevant skills] has prepared me well for this position...&#10;&#10;I am particularly drawn to [Company Name] because [reason specific to company]. I believe my skills in [relevant skills] would be valuable to your team..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Highlight your relevant experience, skills, and achievements that match the job requirements
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Conclusion Paragraph
              </label>
              <textarea
                value={coverLetterData.content.conclusion}
                onChange={(e) => setCoverLetterData({
                  ...coverLetterData,
                  content: { ...coverLetterData.content, conclusion: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to [Company Name]. Thank you for considering my application. I look forward to hearing from you soon."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Closing
              </label>
              <select
                value={coverLetterData.content.closing}
                onChange={(e) => setCoverLetterData({
                  ...coverLetterData,
                  content: { ...coverLetterData.content, closing: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="Sincerely">Sincerely</option>
                <option value="Best regards">Best regards</option>
                <option value="Kind regards">Kind regards</option>
                <option value="Yours faithfully">Yours faithfully</option>
                <option value="Respectfully">Respectfully</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">Cover Letter Progress</span>
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
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <h3 className="text-lg mb-2">Ready to Download?</h3>
        <p className="text-green-100 mb-4">
          Your cover letter will be formatted as a professional document.
        </p>
        <button className="bg-white text-green-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}