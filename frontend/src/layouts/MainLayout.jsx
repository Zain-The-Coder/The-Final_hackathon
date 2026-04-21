import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <Navbar />
      <main className="container mx-auto px-6 max-w-6xl">
        {children}
      </main>
      
      {/* Background decoration to match the reference site */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] -z-10"></div>
    </div>
  );
};

export default MainLayout;
