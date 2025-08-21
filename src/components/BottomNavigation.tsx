import React from 'react';
import { Home, Plus, User } from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home
    },
    {
      id: 'create',
      label: 'Create',
      icon: Plus,
      isMain: true
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                item.isMain
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : isActive
                  ? 'text-teal-600 bg-teal-50'
                  : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
              }`}
            >
              <IconComponent className={`w-6 h-6 ${item.isMain ? '' : 'mb-1'}`} />
              {!item.isMain && (
                <span className="text-xs font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}