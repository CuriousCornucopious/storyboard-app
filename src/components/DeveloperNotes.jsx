export default function DeveloperNotes({ notes, onChange }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-bold text-white mb-3">📝 Developer Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-900 text-gray-200 p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none h-32 font-mono text-sm"
        placeholder="Add development notes here..."
      />
    </div>
  );
}
