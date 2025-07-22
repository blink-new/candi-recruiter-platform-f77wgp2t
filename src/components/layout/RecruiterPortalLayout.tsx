import React from 'react';
import Navigation from '@/components/Navigation';

interface RecruiterPortalLayoutProps {
  children: React.ReactNode;
}

const RecruiterPortalLayout: React.FC<RecruiterPortalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main>{children}</main>
    </div>
  );
};

export default RecruiterPortalLayout;
