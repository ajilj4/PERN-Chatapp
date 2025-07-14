export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <input
        {...props}
        className="w-full p-2 border rounded focus:ring focus:outline-none"
      />
    </div>
  );
}
