export default function Avatar({ src, name, size = 'md', status }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500'
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate background color based on name
  const getBackgroundColor = (name) => {
    if (!name) return 'bg-gray-400';
    const colors = [
      'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
      'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-teal-400'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative">
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} ${getBackgroundColor(name)} rounded-full flex items-center justify-center text-white font-medium`}>
          {getInitials(name)}
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