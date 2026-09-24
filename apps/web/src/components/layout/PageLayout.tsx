import { type ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className={`page-content max-w-4xl mx-auto ${className}`}>
      {children}
    </div>
  );
}