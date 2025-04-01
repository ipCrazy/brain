export default function AppInput() {
  return (
    <div className="flex w-full flex-col items-center justify-center max-w-3xl mx-auto pt-3">
      <form className="bg-white/10 w-full rounded-2xl p-2 flex items-center px-4 py-2.5 w.full justify-between">
        <input
          type="text"
          placeholder="Enter Your Message"
          className="bg-transparent text-white placeholder:text-gray-400 px-3 outline-none w-full"
        />
        <div></div>
      </form>
    </div>
  );
}
