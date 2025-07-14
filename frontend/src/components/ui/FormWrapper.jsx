export default function FormWrapper({ title, error, message, children }) {
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {error   && <div className="text-red-500 mb-3">{error}</div>}
      {message && <div className="text-green-600 mb-3">{message}</div>}
      {children}
    </div>
  );
}
