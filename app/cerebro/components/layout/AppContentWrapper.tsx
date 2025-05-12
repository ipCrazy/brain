import AppInput from "../ui/AppInput";

type AppContentWrapperProps = {
  children: React.ReactNode;
};

export default function AppContentWrapper({
  children,
}: AppContentWrapperProps) {
  return (
    <div className="flex flex-col h-screen w-full relative">
      {/* Scrollable zona */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pt-16 xl-min:pt-0 pb-32">
        <div className="max-w-3xl mx-auto w-full px-4 py-6">{children}</div>
      </div>

      {/* Input fiksiran dole - iznad svega */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/10  z-50 ">
        <div className="max-w-full sm:max-w-3xl mx-auto w-full px-4 py-4">
          <AppInput />
        </div>
      </div>
    </div>
  );
}
