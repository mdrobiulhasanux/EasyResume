import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';

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

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  onBack: () => void;
}

export function ResumePreview({ resumeData, onBack }: ResumePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const formatDateRange = (startDate: string, endDate: string, isCurrent: boolean) => {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const groupSkillsByCategory = (skills: Skill[]) => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  };

  const skillGroups = groupSkillsByCategory(resumeData.skills);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Editor
        </button>
        <button className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            {/* Header Section */}
            <div className="text-center border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {resumeData.personal.fullName || 'Your Name'}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-gray-600">
                {resumeData.personal.email && (
                  <span>{resumeData.personal.email}</span>
                )}
                {resumeData.personal.phone && (
                  <span>{resumeData.personal.phone}</span>
                )}
                {resumeData.personal.location && (
                  <span>{resumeData.personal.location}</span>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {resumeData.personal.summary && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-teal-500 pb-1">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {resumeData.personal.summary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {resumeData.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-teal-500 pb-1">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-teal-600 font-medium">
                            {exp.company}
                            {exp.location && (
                              <span className="text-gray-500 font-normal"> • {exp.location}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {formatDateRange(exp.startDate, exp.endDate, exp.isCurrentJob)}
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 leading-relaxed">
                          {exp.description.split('\n').map((line, index) => (
                            <p key={index} className="mb-1">
                              {line}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-teal-500 pb-1">
                  Education
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {edu.degree} in {edu.fieldOfStudy}
                          </h3>
                          <p className="text-teal-600 font-medium">
                            {edu.institution}
                            {edu.location && (
                              <span className="text-gray-500 font-normal"> • {edu.location}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {formatDateRange(edu.startDate, edu.endDate, edu.isCurrentStudent)}
                        </div>
                      </div>
                      {edu.gpa && (
                        <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                      )}
                      {edu.description && (
                        <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-teal-500 pb-1">
                  Skills
                </h2>
                <div className="space-y-4">
                  {Object.entries(skillGroups).map(([category, skills]) => (
                    <div key={category}>
                      {category && (
                        <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                          >
                            {skill.name}
                            {skill.proficiency && (
                              <span className="ml-1 text-xs text-teal-600">
                                ({skill.proficiency})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-teal-500 pb-1">
                  Projects
                </h2>
                <div className="space-y-6">
                  {resumeData.projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {project.name}
                            {project.role && (
                              <span className="text-gray-600 font-normal"> • {project.role}</span>
                            )}
                          </h3>
                          <p className="text-teal-600 text-sm">
                            Technologies: {project.technologies}
                          </p>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {formatDateRange(project.startDate, project.endDate, project.isOngoing)}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-gray-700 leading-relaxed mb-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-sm">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-700 underline"
                          >
                            View Project
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-700 underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!resumeData.personal.fullName && 
             resumeData.experience.length === 0 && 
             resumeData.education.length === 0 && 
             resumeData.skills.length === 0 && 
             resumeData.projects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Resume Preview</h3>
                <p className="text-gray-500">Add your information in the editor to see your resume preview here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}