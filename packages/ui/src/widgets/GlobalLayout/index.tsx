import { GlobalHeader } from "@ui/entities/GlobalHeader";

export const GlobalLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <GlobalHeader />
      {children}
    </div>
  );
};
