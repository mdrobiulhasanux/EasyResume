import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';

// Capacitor imports for mobile features
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';

// Core Components
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';

// Screen Components
import { ProfileScreen } from './components/ProfileScreen';
import { CreateScreen } from './components/CreateScreen';
import { DownloadsScreen } from './components/DownloadsScreen';
import { InterviewQuestionsScreen } from './components/InterviewQuestionsScreen';
import { VideoTutorialScreen } from './components/VideoTutorialScreen';
import { FeedbackScreen } from './components/FeedbackScreen';

// Builder Components
import { ResumeBuilder } from './components/ResumeBuilder';
import { CoverLetterBuilder } from './components/CoverLetterBuilder';
import { ResignationLetterBuilder } from './components/ResignationLetterBuilder';
import { OtherLetterBuilder } from './components/OtherLetterBuilder';
import { ResumePreview } from './components/ResumePreview';

type Screen = 'dashboard' | 'profile' | 'create' | 'downloads' | 'interview-questions' | 
  'video-tutorial' | 'feedback' | 'resume-builder' | 'cover-letter' | 'resignation-letter' | 'other-letter' | 'resume-preview';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [language, setLanguage] = useState('en');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [resumePreviewData, setResumePreviewData] = useState<any>(null);

  useEffect(() => {
    initializeApp();
    setupCapacitorListeners();
    checkUser();

    return () => {
      // Cleanup listeners
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Hide splash screen after app is ready
      await SplashScreen.hide();
      
      // Set status bar style
      await StatusBar.setStyle({ style: 'light' });
      await StatusBar.setBackgroundColor({ color: '#14b8a6' });
    } catch (error) {
      console.log('Capacitor features not available in web environment');
    }
  };

  const setupCapacitorListeners = () => {
    try {
      // Handle Android back button
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (currentScreen !== 'dashboard') {
          setCurrentScreen('dashboard');
        } else if (!canGoBack) {
          CapacitorApp.exitApp();
        }
      });

      // Handle keyboard visibility
      Keyboard.addListener('keyboardWillShow', () => {
        setKeyboardVisible(true);
      });

      Keyboard.addListener('keyboardWillHide', () => {
        setKeyboardVisible(false);
      });
    } catch (error) {
      console.log('Capacitor listeners not available in web environment');
    }
  };

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Error checking auth session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (data.user) {
      setUser(data.user);
      setCurrentScreen('dashboard');
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e9c2316f/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, fullName })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Signup failed: ${errorData}`);
    }

    await handleSignIn(email, password);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentScreen('dashboard');
  };

  const navigateToScreen = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    if (screen === 'resume-preview' && data) {
      setResumePreviewData(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-teal-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading Resume Builder...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateToScreen} />;
      case 'profile':
        return <ProfileScreen user={user} onSignOut={handleSignOut} />;
      case 'create':
        return <CreateScreen onNavigate={navigateToScreen} />;
      case 'downloads':
        return <DownloadsScreen />;
      case 'interview-questions':
        return <InterviewQuestionsScreen />;
      case 'video-tutorial':
        return <VideoTutorialScreen />;
      case 'feedback':
        return <FeedbackScreen />;
      case 'resume-builder':
        return <ResumeBuilder onBack={() => navigateToScreen('create')} onPreview={(data) => navigateToScreen('resume-preview', data)} />;
      case 'cover-letter':
        return <CoverLetterBuilder onBack={() => navigateToScreen('create')} />;
      case 'resignation-letter':
        return <ResignationLetterBuilder onBack={() => navigateToScreen('create')} />;
      case 'other-letter':
        return <OtherLetterBuilder onBack={() => navigateToScreen('create')} />;
      case 'resume-preview':
        return <ResumePreview resumeData={resumePreviewData} onBack={() => navigateToScreen('resume-builder')} />;
      default:
        return <Dashboard onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${keyboardVisible ? 'pb-0' : ''}`}>
      <Header 
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className={`pt-16 ${keyboardVisible ? 'pb-4' : 'pb-20'}`}>
        {renderScreen()}
      </main>

      {!keyboardVisible && (
        <BottomNavigation 
          currentScreen={currentScreen}
          onNavigate={navigateToScreen}
        />
      )}
    </div>
  );
}