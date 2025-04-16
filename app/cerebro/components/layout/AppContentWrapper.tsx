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
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="max-w-3xl mx-auto w-full px-4 py-6">{children}</div>
      </div>

      {/* Input fiksiran dole */}
      <div className="border-t border-white/10 w-full backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <AppInput />
        </div>
      </div>
    </div>
  );
}
