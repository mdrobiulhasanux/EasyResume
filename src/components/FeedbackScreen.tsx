import React, { useState } from 'react';
import { Star, Send, MessageSquare, ThumbsUp, Lightbulb } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'general', label: 'General Feedback', icon: MessageSquare },
    { id: 'feature-request', label: 'Feature Request', icon: Lightbulb },
    { id: 'bug-report', label: 'Bug Report', icon: ThumbsUp },
    { id: 'improvement', label: 'Improvement Suggestion', icon: Star }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !category || !feedback.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e9c2316f/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            rating,
            category,
            feedback: feedback.trim(),
            email: email.trim(),
            timestamp: new Date().toISOString()
          })
        }
      );

      if (response.ok) {
        setSubmitted(true);
        // Reset form
        setRating(0);
        setCategory('');
        setFeedback('');
        setEmail('');
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Feedback</h1>
        <p className="text-gray-600">Help us improve Resume Builder with your feedback</p>
      </div>

      {/* Feedback Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How would you rate your experience? *
          </h3>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            {rating === 0 && 'Select a rating'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            What type of feedback is this? *
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    category === cat.id
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Text */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tell us more about your experience *
          </h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts, suggestions, or report any issues you encountered..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            required
          />
          <div className="text-right text-sm text-gray-500 mt-2">
            {feedback.length}/1000 characters
          </div>
        </div>

        {/* Email (Optional) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Email (Optional)
          </h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email if you'd like a response"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            We'll only use your email to respond to your feedback
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !rating || !category || !feedback.trim()}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 px-6 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Feedback
            </>
          )}
        </button>
      </form>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="text-left p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-200">
            <div className="font-medium text-blue-800">Report a Bug</div>
            <div className="text-sm text-blue-600">Something not working?</div>
          </button>
          <button className="text-left p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-200">
            <div className="font-medium text-blue-800">Suggest a Feature</div>
            <div className="text-sm text-blue-600">Have an idea for improvement?</div>
          </button>
        </div>
      </div>
    </div>
  );
}