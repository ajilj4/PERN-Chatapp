export default function Avatar({ src, size = 'md', status }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500'
  };
  
  return (
    <div className="relative">
      {src ? (
        <img 
          src={src} 
          alt="Avatar" 
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-full flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
      
      {status && (
        <span className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${statusClasses[status]}`}
          style={{ width: '10px', height: '10px' }}
        />
      )}
    </div>
  );
}