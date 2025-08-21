import React from 'react';
import { 
  X, 
  Home, 
  FileText, 
  Download, 
  MessageSquare, 
  PlayCircle, 
  Star, 
  User,
  Settings,
  HelpCircle
} from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

export function SideMenu({ isOpen, onClose, onNavigate, currentScreen }: SideMenuProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'resume-builder', label: 'Create Resume', icon: FileText },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'interview-questions', label: 'Interview Questions', icon: MessageSquare },
    { id: 'video-tutorial', label: 'Video Tutorial', icon: PlayCircle },
    { id: 'feedback', label: 'Feedback', icon: Star },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleNavigation = (screenId: string) => {
    onNavigate(screenId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Side Menu */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <p className="text-sm text-gray-600">Resume Builder</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4">
            <div className="space-y-2 px-4">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentScreen === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-600 border border-teal-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4 mx-4" />

            {/* Additional Items */}
            <div className="space-y-2 px-4">
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Help & Support</span>
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Resume Builder v1.0</p>
              <p className="text-xs text-gray-500">Build professional documents with ease</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}