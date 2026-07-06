import { AlertTriangle } from 'lucide-react';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="error-banner" role="alert">
      <AlertTriangle size={18} strokeWidth={1.75} />
      <span>{message}</span>
    </div>
  );
}