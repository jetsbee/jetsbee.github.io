import { GlobalHeader } from "../GlobalHeader/GlobalHeader";

export const GlobalLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <GlobalHeader />
      {children}
    </>
  );
};
