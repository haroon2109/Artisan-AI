
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col items-center">
      <div className="mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-brand-dark mb-2">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
