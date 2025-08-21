import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, FileText, Download, LogOut, Edit2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProfileScreenProps {
  user: any;
  onSignOut: () => void;
}

interface UserData {
  fullName?: string;
  email?: string;
  createdAt?: string;
  resumeCount?: number;
  coverLetterCount?: number;
  downloadsCount?: number;
}

export function ProfileScreen({ user, onSignOut }: ProfileScreenProps) {
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e9c2316f/user/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user || {});
        setEditName(data.user?.fullName || user?.user_metadata?.full_name || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set fallback data from user object
      setUserData({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        createdAt: user?.created_at || '',
        resumeCount: 0,
        coverLetterCount: 0,
        downloadsCount: 0
      });
      setEditName(user?.user_metadata?.full_name || '');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70"
                  placeholder="Enter your name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // In a real app, you'd save the name here
                    }}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(userData.fullName || '');
                    }}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{userData.fullName || user?.user_metadata?.full_name || 'User'}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-teal-100 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {userData.email || user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Member since</span>
            </div>
            <span className="text-gray-800">{formatDate(userData.createdAt || user?.created_at)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Email</span>
            </div>
            <span className="text-gray-800">{userData.email || user?.email}</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Activity</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{userData.resumeCount || 0}</div>
            <div className="text-sm text-gray-600">Resumes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Mail className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{userData.coverLetterCount || 0}</div>
            <div className="text-sm text-gray-600">Cover Letters</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Download className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{userData.downloadsCount || 0}</div>
            <div className="text-sm text-gray-600">Downloads</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
        <div className="space-y-4">
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <div className="font-medium text-gray-800">Notification Preferences</div>
            <div className="text-sm text-gray-600">Manage your notification settings</div>
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <div className="font-medium text-gray-800">Privacy Settings</div>
            <div className="text-sm text-gray-600">Control your privacy preferences</div>
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <div className="font-medium text-gray-800">Export Data</div>
            <div className="text-sm text-gray-600">Download all your data</div>
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={onSignOut}
        className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}