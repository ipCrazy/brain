import AppInput from "./components/ui/AppInput";

export default async function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 realtive">
      <h1 className="text-xl md:text-3xl font-semibold">
        Welcome to your brain
      </h1>
      <AppInput />
      <div>Chat help</div>
    </div>
  );
}
