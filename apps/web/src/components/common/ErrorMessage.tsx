import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="text-red-600 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.5a2 2 0 001.999-1.999L22 12c0-1.105-.905-2-2-2H4.999A2.001 2.001 0 002 12v8a2 2 0 002 2h12a2 2 0 002-2V7.414c0-.895.393-1.748 1.06-1.96l4.5-3.98c.797-.797 2.047-.797 2.828 0l5.657 5.657c.797.797.797 2.074 0 2.828L12 21" />
        </svg>
      </div>
      <p className="text-lg font-medium text-gray-900 mb-2">Oops! Algo deu errado</p>
      <p className="text-gray-600 mb-6 max-w-md text-center">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}