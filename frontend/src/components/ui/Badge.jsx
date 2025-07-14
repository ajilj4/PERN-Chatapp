export default function Badge({ count, className = '' }) {
  return (
    <span className={`flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-500 rounded-full ${className}`}>
      {count > 9 ? '9+' : count}
    </span>
  );
}