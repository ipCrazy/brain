import PersonList from "./components/PersonList";

export default function PersonsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ljudi koje poznajem</h1>
      <PersonList />
    </div>
  );
}
