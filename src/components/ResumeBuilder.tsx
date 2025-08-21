import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Eye, FileText, Plus, Trash2, Calendar, MapPin, GraduationCap, Zap, Code, ExternalLink, Github } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentStudent: boolean;
  gpa: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  projectUrl: string;
  githubUrl: string;
  role: string;
}

interface ResumeBuilderProps {
  onBack: () => void;
  onPreview: (data: any) => void;
}

export function ResumeBuilder({ onBack, onPreview }: ResumeBuilderProps) {
  const [activeSection, setActiveSection] = useState('personal');
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [] as Experience[],
    education: [] as Education[],
    skills: [] as Skill[],
    projects: [] as Project[]
  });

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🚀' }
  ];

  const skillCategories = [
    'Programming Languages',
    'Frameworks & Libraries',
    'Databases',
    'Tools & Technologies',
    'Soft Skills',
    'Languages',
    'Other'
  ];

  const proficiencyLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: ''
    };
    
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience]
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentStudent: false,
      gpa: '',
      description: ''
    };
    
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: '',
      proficiency: '',
      description: ''
    };
    
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill]
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    });
  };

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id)
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      isOngoing: false,
      projectUrl: '',
      githubUrl: '',
      role: ''
    };
    
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, newProject]
    });
  };

  const updateProject = (id: string, field: keyof Project, value: string | boolean) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(project => project.id !== id)
    });
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        alert('Please sign in to save your resume');
        return;
      }

      const documentData = {
        type: 'resume',
        title: `Resume - ${resumeData.personal.fullName || 'Untitled'}`,
        data: resumeData,
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
        throw new Error('Failed to save resume');
      }

      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCompletionCount = () => {
    let completed = 0;
    const total = 5; // personal, experience, education, skills, projects
    
    if (resumeData.personal.fullName && resumeData.personal.email) completed++;
    if (resumeData.experience.length > 0) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.skills.length > 0) completed++;
    if (resumeData.projects.length > 0) completed++;
    
    return { completed, total };
  };

  const { completed, total } = getCompletionCount();

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
            onClick={() => onPreview(resumeData)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Preview Resume"
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Resume Builder</h1>
        <p className="text-gray-600">Create your professional resume step by step</p>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
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
        {activeSection === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={resumeData.personal.fullName}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, fullName: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={resumeData.personal.email}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, email: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={resumeData.personal.phone}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personal: { ...resumeData.personal, phone: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={resumeData.personal.location}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personal: { ...resumeData.personal, location: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="New York, NY"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={resumeData.personal.summary}
                onChange={(e) => setResumeData({
                  ...resumeData,
                  personal: { ...resumeData.personal, summary: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Write a brief summary of your professional background and key achievements..."
              />
            </div>
          </div>
        )}

        {activeSection === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Work Experience</h2>
              {resumeData.experience.length > 0 && (
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              )}
            </div>

            {resumeData.experience.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-gray-400 mb-4">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No work experience added</h3>
                <p className="text-gray-500 mb-4">Add your first job experience to get started</p>
                <button
                  onClick={addExperience}
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Add Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id}>
                    <div className="border border-gray-200 rounded-lg p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                          Job #{index + 1}
                        </h3>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Apple Inc."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title *
                          </label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Software Engineer"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="San Francisco, CA"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              disabled={exp.isCurrentJob}
                              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                exp.isCurrentJob ? 'bg-gray-100 text-gray-500' : ''
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-6">
                            <input
                              type="checkbox"
                              checked={exp.isCurrentJob}
                              onChange={(e) => {
                                updateExperience(exp.id, 'isCurrentJob', e.target.checked);
                                if (e.target.checked) {
                                  updateExperience(exp.id, 'endDate', '');
                                }
                              }}
                              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                            />
                            I currently work here
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Description & Achievements
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="• Developed and maintained web applications using React and Node.js&#10;• Led a team of 5 developers and improved code quality by 40%&#10;• Implemented new features that increased user engagement by 25%&#10;• Collaborated with product managers to define project requirements"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Tip: Use bullet points to highlight your key responsibilities and achievements
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      <button
                        onClick={addExperience}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Education</h2>
              {resumeData.education.length > 0 && (
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              )}
            </div>

            {resumeData.education.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-gray-400 mb-4">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No education added</h3>
                <p className="text-gray-500 mb-4">Add your educational background to get started</p>
                <button
                  onClick={addEducation}
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Add Your Education
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id}>
                    <div className="border border-gray-200 rounded-lg p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                          Education #{index + 1}
                        </h3>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            School/University *
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Harvard University"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Degree *
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Bachelor of Science"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field of Study *
                          </label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Computer Science"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="Cambridge, MA"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="month"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="month"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              disabled={edu.isCurrentStudent}
                              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                edu.isCurrentStudent ? 'bg-gray-100 text-gray-500' : ''
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GPA (Optional)
                          </label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="3.8/4.0"
                          />
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-6">
                            <input
                              type="checkbox"
                              checked={edu.isCurrentStudent}
                              onChange={(e) => {
                                updateEducation(edu.id, 'isCurrentStudent', e.target.checked);
                                if (e.target.checked) {
                                  updateEducation(edu.id, 'endDate', '');
                                }
                              }}
                              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                            />
                            I'm currently studying here
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Activities & Achievements (Optional)
                        </label>
                        <textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="• Dean's List for 3 consecutive semesters&#10;• President of Computer Science Club&#10;• Relevant coursework: Data Structures, Algorithms, Software Engineering&#10;• Senior thesis on Machine Learning applications"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Include relevant coursework, honors, activities, or projects
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      <button
                        onClick={addEducation}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Education
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
              {resumeData.skills.length > 0 && (
                <button
                  onClick={addSkill}
                  className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              )}
            </div>

            {resumeData.skills.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-gray-400 mb-4">
                  <Zap className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No skills added</h3>
                <p className="text-gray-500 mb-4">Add your skills to showcase your expertise</p>
                <button
                  onClick={addSkill}
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Add Your First Skill
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {resumeData.skills.map((skill, index) => (
                  <div key={skill.id}>
                    <div className="border border-gray-200 rounded-lg p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                          Skill #{index + 1}
                        </h3>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skill Name *
                          </label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="JavaScript"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            value={skill.category}
                            onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="">Select Category</option>
                            {skillCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proficiency Level *
                          </label>
                          <select
                            value={skill.proficiency}
                            onChange={(e) => updateSkill(skill.id, 'proficiency', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="">Select Level</option>
                            {proficiencyLevels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description & Experience (Optional)
                        </label>
                        <textarea
                          value={skill.description}
                          onChange={(e) => updateSkill(skill.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Describe your experience with this skill, projects where you used it, or specific expertise areas..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      <button
                        onClick={addSkill}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Skill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
              {resumeData.projects.length > 0 && (
                <button
                  onClick={addProject}
                  className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              )}
            </div>

            {resumeData.projects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-gray-400 mb-4">
                  <Code className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No projects added</h3>
                <p className="text-gray-500 mb-4">Showcase your projects and portfolio work</p>
                <button
                  onClick={addProject}
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Add Your First Project
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {resumeData.projects.map((project, index) => (
                  <div key={project.id}>
                    <div className="border border-gray-200 rounded-lg p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                          Project #{index + 1}
                        </h3>
                        <button
                          onClick={() => removeProject(project.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name *
                          </label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="E-commerce Website"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Role
                          </label>
                          <input
                            type="text"
                            value={project.role}
                            onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Full Stack Developer"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technologies Used *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Code className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={project.technologies}
                              onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="React, Node.js, MongoDB, AWS"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="month"
                              value={project.startDate}
                              onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="month"
                              value={project.endDate}
                              onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                              disabled={project.isOngoing}
                              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                project.isOngoing ? 'bg-gray-100 text-gray-500' : ''
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-6">
                            <input
                              type="checkbox"
                              checked={project.isOngoing}
                              onChange={(e) => {
                                updateProject(project.id, 'isOngoing', e.target.checked);
                                if (e.target.checked) {
                                  updateProject(project.id, 'endDate', '');
                                }
                              }}
                              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                            />
                            Ongoing project
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project URL
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ExternalLink className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="url"
                              value={project.projectUrl}
                              onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="https://myproject.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GitHub URL
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Github className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="url"
                              value={project.githubUrl}
                              onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="https://github.com/username/project"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Description & Key Features *
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="• Built a full-stack e-commerce platform with user authentication&#10;• Implemented real-time chat functionality using WebSockets&#10;• Optimized database queries resulting in 50% faster page load times&#10;• Deployed on AWS with CI/CD pipeline using GitHub Actions"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Describe the project, your contributions, and key achievements
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      <button
                        onClick={addProject}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Resume Progress</span>
          <span className="text-sm text-gray-500">
            {Math.round((completed / total) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completed / total) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Completed {completed} of {total} main sections
        </p>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Ready to Download?</h3>
        <p className="text-blue-100 mb-4">
          Your resume will be generated as a professional PDF document.
        </p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}