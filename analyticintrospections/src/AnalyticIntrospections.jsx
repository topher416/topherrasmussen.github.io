import React from 'react';

const AnalyticIntrospections = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100 flex items-center justify-center p-8">
      <div className="max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            🚧 UNDER CONSTRUCTION 🚧
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300">
            Oops! This page is getting a makeover
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <img 
              src="https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif" 
              alt="Construction worker"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <img 
              src="https://media.giphy.com/media/l0HlO3BJ8LALPW4sE/giphy.gif" 
              alt="Under construction"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xl text-gray-400">
            The previous content was... let's just say it needed some work.
          </p>
          <p className="text-lg text-gray-500">
            Check back soon for something actually worth reading! 🎭
          </p>
        </div>

        <div className="pt-8">
          <a 
            href="/" 
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnalyticIntrospections;
