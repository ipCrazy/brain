import AppInput from "../ui/AppInput";

type AppContentWrapperProps = {
  children: React.ReactNode;
};

export default function AppContentWrapper({
  children,
}: AppContentWrapperProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 relative">
      {children}
      <AppInput />
    </div>
  );
}
