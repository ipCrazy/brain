import { LuBrainCircuit } from "react-icons/lu";

export default function AppInput() {
  return (
    <div className="flex w-full flex-col items-center justify-center max-w-3xl mx-auto pt-3">
      <form className="bg-white/10 w-full rounded-3xl flex items-center px-1.5 flex-col py-2.5 w.full justify-between">
        <input
          type="text"
          placeholder="Enter Your Message"
          className="bg-transparent text-white placeholder:text-gray-400 p-2 px-3 py-3 outline-none w-full "
        />
        <div className="flex w-full flex-row items-center justify-between ">
          <div className="flex flex-row items-center justify-between">
            <p>icon1</p>
            <p>icon2</p>
            <p>icon3</p>
          </div>
          <div className="rounded-full bg-black/40 flex items-center justify-center h-11 w-11 mr-1">
            <LuBrainCircuit />
          </div>
        </div>
      </form>
    </div>
  );
}
