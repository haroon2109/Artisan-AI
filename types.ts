
import React from 'react';

export interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}
