export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:outline-none"
    >
      {children}
    </button>
  );
}
