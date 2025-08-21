import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Eye, Calendar, MapPin, Building, FileText } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface OtherLetterBuilderProps {
  onBack: () => void;
}

export function OtherLetterBuilder({ onBack }: OtherLetterBuilderProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [letterData, setLetterData] = useState({
    basic: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      date: new Date().toISOString().split('T')[0]
    },
    recipient: {
      recipientName: '',
      recipientTitle: '',
      organizationName: '',
      address: ''
    },
    content: {
      letterType: '',
      subject: '',
      salutation: 'Dear Sir/Madam',
      body: '',
      closing: 'Sincerely'
    }
  });

  const [saving, setSaving] = useState(false);

  const sections = [
    { id: 'basic', label: 'Your Info', icon: '👤' },
    { id: 'recipient', label: 'Recipient Info', icon: '👥' },
    { id: 'content', label: 'Letter Content', icon: '✍️' }
  ];

  const letterTypes = [
    'Business Letter',
    'Recommendation Letter',
    'Complaint Letter',
    'Thank You Letter',
    'Application Letter',
    'Reference Letter',
    'Authorization Letter',
    'Invitation Letter',
    'Other'
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        alert('Please sign in to save your letter');
        return;
      }

      const documentData = {
        type: 'other-letter',
        title: `${letterData.content.letterType || 'Letter'} - ${letterData.recipient.organizationName || 'Untitled'}`,
        data: letterData,
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
        throw new Error('Failed to save letter');
      }

      alert('Letter saved successfully!');
    } catch (error) {
      console.error('Error saving letter:', error);
      alert('Failed to save letter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    const requiredFields = [
      letterData.basic.fullName,
      letterData.basic.email,
      letterData.recipient.recipientName,
      letterData.content.letterType,
      letterData.content.body
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
            title="Preview Letter"
            onClick={() => alert('Letter preview coming soon!')}
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
        <h1 className="text-2xl text-gray-800 mb-2">Letter Builder</h1>
        <p className="text-gray-600">Create professional letters for any purpose</p>
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
                  value={letterData.basic.fullName}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    basic: { ...letterData.basic, fullName: e.target.value }
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
                  value={letterData.basic.email}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    basic: { ...letterData.basic, email: e.target.value }
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
                  value={letterData.basic.phone}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    basic: { ...letterData.basic, phone: e.target.value }
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
                    value={letterData.basic.date}
                    onChange={(e) => setLetterData({
                      ...letterData,
                      basic: { ...letterData.basic, date: e.target.value }
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
                  value={letterData.basic.address}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    basic: { ...letterData.basic, address: e.target.value }
                  })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="123 Main Street&#10;City, State 12345&#10;Country"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'recipient' && (
          <div className="space-y-6">
            <h2 className="text-lg text-gray-800">Recipient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={letterData.recipient.recipientName}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    recipient: { ...letterData.recipient, recipientName: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Recipient Title
                </label>
                <input
                  type="text"
                  value={letterData.recipient.recipientTitle}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    recipient: { ...letterData.recipient, recipientTitle: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Manager"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Organization Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={letterData.recipient.organizationName}
                    onChange={(e) => setLetterData({
                      ...letterData,
                      recipient: { ...letterData.recipient, organizationName: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Apple Inc."
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Recipient Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={letterData.recipient.address}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    recipient: { ...letterData.recipient, address: e.target.value }
                  })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Organization Address&#10;City, State 12345&#10;Country"
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
                  Letter Type *
                </label>
                <select
                  value={letterData.content.letterType}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    content: { ...letterData.content, letterType: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select Letter Type</option>
                  {letterTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Salutation
                </label>
                <select
                  value={letterData.content.salutation}
                  onChange={(e) => setLetterData({
                    ...letterData,
                    content: { ...letterData.content, salutation: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="Dear Sir/Madam">Dear Sir/Madam</option>
                  <option value="Dear Mr./Ms. [Name]">Dear Mr./Ms. [Name]</option>
                  <option value="To Whom It May Concern">To Whom It May Concern</option>
                  <option value="Dear [Name]">Dear [Name]</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                value={letterData.content.subject}
                onChange={(e) => setLetterData({
                  ...letterData,
                  content: { ...letterData.content, subject: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Subject: [Brief description of the letter's purpose]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Letter Body *
              </label>
              <textarea
                value={letterData.content.body}
                onChange={(e) => setLetterData({
                  ...letterData,
                  content: { ...letterData.content, body: e.target.value }
                })}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Write the main content of your letter here...&#10;&#10;Paragraph 1: State the purpose of your letter&#10;Paragraph 2: Provide details and supporting information&#10;Paragraph 3: Close with what action you want taken or next steps"
              />
              <p className="text-sm text-gray-500 mt-2">
                Be clear, concise, and professional in your letter content
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Closing
              </label>
              <select
                value={letterData.content.closing}
                onChange={(e) => setLetterData({
                  ...letterData,
                  content: { ...letterData.content, closing: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="Sincerely">Sincerely</option>
                <option value="Best regards">Best regards</option>
                <option value="Kind regards">Kind regards</option>
                <option value="Yours faithfully">Yours faithfully</option>
                <option value="Respectfully">Respectfully</option>
                <option value="Thank you">Thank you</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">Letter Progress</span>
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
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <h3 className="text-lg mb-2">Ready to Download?</h3>
        <p className="text-purple-100 mb-4">
          Your letter will be formatted as a professional document.
        </p>
        <button className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}