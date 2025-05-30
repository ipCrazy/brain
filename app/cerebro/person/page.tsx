import ServerPersonList from "./components/ServerPersonList";

export default function PersonsPage() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ljudi koje poznajem</h1>
      <ServerPersonList />
    </div>
  );
}
