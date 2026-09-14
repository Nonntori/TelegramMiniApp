import { cn } from '@/utils/helpers';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl z-50 max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="sticky top-0 bg-surface border-b border-surface-light px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto safe-bottom pb-safe">
          {children}
        </div>
      </div>
    </>
  );
}
