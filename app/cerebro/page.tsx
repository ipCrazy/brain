import MemoryFeed from "./components/ux/MemoryFeed";

export default async function Hippocampus() {
  return (
    <div className="w-full overflow-hidden flex flex-col items-center">
      <MemoryFeed />
    </div>
  );
}
