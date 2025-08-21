import React, { useState } from 'react';
import { MessageSquare, Lightbulb, RefreshCw, User, Briefcase } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Question {
  id: number;
  category: string;
  question: string;
  tips: string;
}

export function InterviewQuestionsScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const generateQuestions = async () => {
    if (!position.trim()) {
      alert('Please enter a position title');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e9c2316f/interview-questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            position: position.trim(),
            experience: experience.trim(),
            skills: skills.trim()
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        console.error('Failed to generate questions');
        alert('Failed to generate questions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Error generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'general':
        return 'bg-blue-100 text-blue-700';
      case 'technical':
        return 'bg-green-100 text-green-700';
      case 'behavioral':
        return 'bg-purple-100 text-purple-700';
      case 'industry-specific':
        return 'bg-orange-100 text-orange-700';
      case 'company fit':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Interview Questions</h1>
        <p className="text-gray-600">Get personalized interview questions based on your role</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tell us about your target role</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position Title *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g., Software Engineer, Marketing Manager"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select experience level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (2-5 years)</option>
              <option value="senior">Senior Level (5-10 years)</option>
              <option value="lead">Lead/Manager (10+ years)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Skills
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., JavaScript, React, Project Management, Communication"
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={generateQuestions}
            disabled={loading || !position.trim()}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Questions...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Generate Interview Questions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Interview Questions for {position}
            </h2>
            <span className="text-sm text-gray-600">{questions.length} questions</span>
          </div>

          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setExpandedQuestion(
                  expandedQuestion === question.id ? null : question.id
                )}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                        {question.category}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800">{question.question}</p>
                  </div>
                  <MessageSquare className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedQuestion === question.id ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>

              {expandedQuestion === question.id && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Answer Tip:</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{question.tips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={generateQuestions}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Questions
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Interview Tips</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p>• Research the company and role thoroughly before the interview</p>
          <p>• Practice your answers out loud, but don't memorize them word-for-word</p>
          <p>• Prepare specific examples using the STAR method (Situation, Task, Action, Result)</p>
          <p>• Have thoughtful questions ready to ask the interviewer</p>
          <p>• Practice good body language and maintain eye contact</p>
        </div>
      </div>
    </div>
  );
}