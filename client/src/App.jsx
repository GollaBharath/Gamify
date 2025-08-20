
import React from 'react';
import { 
  Crown, 
  Users, 
  Star, 
  Shield, 
  User, 
  Calendar, 
  CheckSquare, 
  Trophy, 
  ShoppingCart, 
  TrendingUp,
  Target,
  Gift,
  Award,
  ArrowRight,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { ScrollToTop } from './components/ScrollToTop';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const howItWorksAnimation = useScrollAnimation();
  const hierarchyAnimation = useScrollAnimation();

  const scrollToHierarchy = () => {
    const hierarchySection = document.getElementById('hierarchy-section');
    if (hierarchySection) {
      hierarchySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-500">
      <ScrollToTop />

      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Gamify</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-lg transition-all duration-300"
              type="button"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </button>
            <button
              onClick={() => window.location.href = '/get-started'}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              type="button"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
        <section className="py-20 px-6 relative overflow-hidden" >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 dark:bg-purple-400/20 rounded-full blur-3xl"></div>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
          Transform Your Community
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
          Gamify is a community engagement platform that motivates participation through 
          hierarchical roles, events, tasks, and a rewarding point system.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Start Engaging */}
          <button
            onClick={() => window.location.href = '/get-started'} // navigation to another page
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 flex items-center justify-center focus:outline-none"
            type="button"
          >
            Start Engaging
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>

          {/* Learn More */}
          <button
            onClick={scrollToHierarchy} // scroll to hierarchy section
            className="cursor-pointer border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-8 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transform transition duration-300 hover:-translate-y-2 hover:scale-105 focus:outline-none"
            type="button"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>

      {/* Hierarchy Section */}
      <section 
        id="hierarchy-section" 
        ref={hierarchyAnimation.ref} 
        className="py-16 px-6 bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-gray-700 relative"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 dark:bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-4">Role-Based Hierarchy</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A structured system inspired by Discord, designed to create clear responsibilities and progression paths.
            </p>
          </div>
          <div className="space-y-8">
            {/* Organization */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-700 transform ${
              hierarchyAnimation.isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/30 transition-all duration-300">
                    <Crown className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                    
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">Organisation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  The top-level entity that manages the entire points system and platform operations. Currently supports one organization with plans to expand to multiple organizations in the future.
                </p>
                <div className="flex items-center mt-3 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Highest Authority Level
                </div>
              </div>
            </div>
            {/* Admins */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-red-500/10 transition-all duration-700 delay-150 transform ${
              hierarchyAnimation.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                    <Shield className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                    
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">Admins</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Create and manage events, oversee platform operations, and maintain the virtual shop. They have full control over the community's engagement activities and reward systems.
                </p>
                <div className="flex items-center mt-3 text-sm text-red-600 dark:text-red-400 font-medium">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Event Creation & Shop Management
                </div>
              </div>
            </div>
            {/* Event Staff */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-700 delay-300 transform ${
              hierarchyAnimation.isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                    <Users className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                    
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Event Staff</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Design specific tasks within events and manage the balance of point distribution. They ensure that events are engaging and rewarding while maintaining fairness in the point economy.
                </p>
                <div className="flex items-center mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Task Design & Point Balance
                </div>
              </div>
            </div>
            {/* Moderators */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-green-500/10 transition-all duration-700 delay-450 transform ${
              hierarchyAnimation.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
                    <Star className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Moderators</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Validate and approve completed tasks submitted by members. They ensure quality control and fairness by reviewing submissions before awarding points to deserving participants.
                </p>
                <div className="flex items-center mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Task Validation & Quality Control
                </div>
              </div>
            </div>
            {/* Members */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-700 delay-600 transform ${
              hierarchyAnimation.isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                    <User className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Members</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  The heart of the community who participate in events, complete tasks, and earn points through active engagement. They drive the platform's success through their participation and enthusiasm.
                </p>
                <div className="flex items-center mt-3 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Active Participation & Engagement
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How Gamify Works Section */}
      <section ref={howItWorksAnimation.ref} className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 dark:from-purple-400/10 dark:to-blue-400/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200/30 dark:bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-4">How Gamify Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The fundamental systems that drive engagement and create meaningful participation.
            </p>
          </div>
          <div className="space-y-8">
            {/* Events */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-700 transform ${
              howItWorksAnimation.isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300">
                  <Calendar className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">Events</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Organised by admins as the main units of community engagement and participation. These are the foundation of all activities.
                </p>
              </div>
            </div>
            {/* Tasks */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-700 delay-150 transform ${
              howItWorksAnimation.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                  <CheckSquare className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Tasks</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Specific objectives within events that members complete to earn valuable points. Each task is designed to encourage participation.
                </p>
              </div>
            </div>
            {/* Points System */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-700 delay-300 transform ${
              howItWorksAnimation.isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/30 transition-all duration-300">
                  <Target className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">Points System</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Digital currency earned through task completion and admin rewards. Points create motivation and enable the reward economy.
                </p>
              </div>
            </div>
            {/* Virtual Shop */}
             <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-700 delay-150 transform ${
              howItWorksAnimation.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
                  <ShoppingCart className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Virtual Shop</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Virtual marketplace where members can spend their earned points on rewards, creating a complete engagement economy.
                </p>
              </div>
            </div>
             {/* Leaderboard System */}
            <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-700 transform ${
              howItWorksAnimation.isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                  <Trophy className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Leaderboard System</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Ranking system that encourages healthy competition and community motivation through transparent progress tracking.
                </p>
              </div>
            </div>
             {/* Validation System */}
             <div className={`flex items-center space-x-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-700 delay-150 transform ${
              howItWorksAnimation.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } hover:-translate-y-1 group`}>
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                  <Shield className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">Validation System</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Moderators ensure fairness and quality by reviewing submissions before awarding points to deserving participants.
                                  </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 relative">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Discover what makes Gamify the perfect choice for your community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Proven Results", desc: "Increase community engagement by up to 300%.", color: "text-blue-500", hoverColor: "hover:shadow-blue-500/20" },
              { icon: TrendingUp, title: "Easy Setup", desc: "Get started in minutes with our intuitive interface.", color: "text-green-500", hoverColor: "hover:shadow-green-500/20" },
              { icon: Gift, title: "Flexible Rewards", desc: "Customize rewards to match your community's needs.", color: "text-purple-500", hoverColor: "hover:shadow-purple-500/20" },
              { icon: Award, title: "24/7 Support", desc: "Dedicated support team ready to help you succeed.", color: "text-yellow-500", hoverColor: "hover:shadow-yellow-500/20" },
              { icon: Shield, title: "Secure Platform", desc: "Enterprise-grade security for your community data.", color: "text-red-500", hoverColor: "hover:shadow-red-500/20" },
              { icon: Zap, title: "Regular Updates", desc: "Continuous improvements and new features.", color: "text-indigo-500", hoverColor: "hover:shadow-indigo-500/20" }
            ].map((feature, index) => (
              <div key={index} className={`flex items-start space-x-4 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-xl ${feature.hoverColor} transition-all duration-300 transform hover:-translate-y-1 group`}>
                <feature.icon className={`h-6 w-6 ${feature.color} mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-700/50"></div>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-6">Our Vision</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Gamify aims to make communities more engaging and interactive by introducing a fun, 
            reward-driven participation model. It's not just about managing members but about 
            motivating them to take part in meaningful activities through gamification.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-xl p-8 backdrop-blur-sm">
            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
              "Transform passive communities into thriving, engaged ecosystems where every member 
              feels valued, motivated, and rewarded for their contributions."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-700 dark:via-purple-700 dark:to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Ready to Gamify Your Community?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of communities already using Gamify to boost engagement and create meaningful connections.
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105">
            Get Started Today
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Gamify</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">© 2025 Gamify. Empowering communities through engagement.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
export default App;
