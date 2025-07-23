import clsx from 'clsx';

// Spinner component
export function Spinner({ size = 'md', color = 'indigo', className }) {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colors = {
    indigo: 'text-indigo-600',
    gray: 'text-gray-600',
    white: 'text-white',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600'
  };

  return (
    <svg
      className={clsx('animate-spin', sizes[size], colors[color], className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Dots loading animation
export function LoadingDots({ size = 'md', color = 'indigo', className }) {
  const sizes = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3'
  };

  const colors = {
    indigo: 'bg-indigo-600',
    gray: 'bg-gray-600',
    white: 'bg-white',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600'
  };

  return (
    <div className={clsx('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            'rounded-full animate-pulse',
            sizes[size],
            colors[color]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );
}

// Skeleton loader
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={clsx('animate-pulse bg-gray-200 rounded', className)}
      {...props}
    />
  );
}

// Full page loading
export function PageLoading({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Loading overlay
export function LoadingOverlay({ 
  show = false, 
  message = 'Loading...', 
  className,
  children 
}) {
  if (!show) return children;

  return (
    <div className={clsx('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoading({ size = 'sm', className }) {
  return (
    <Spinner 
      size={size} 
      color="white" 
      className={clsx('-ml-1 mr-2', className)} 
    />
  );
}

// Card skeleton
export function CardSkeleton({ className }) {
  return (
    <div className={clsx('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>
    </div>
  );
}

// List skeleton
export function ListSkeleton({ items = 5, className }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4, className }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Spinner;
