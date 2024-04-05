import Link from "next/link";

export const GlobalHeader = () => {
  return (
    <header className="bg-background w-full border-b px-8 flex h-16 items-center">
      <nav>
        <Link href="/" className="font-bold">
          jetsbee's blog
        </Link>
      </nav>
    </header>
  );
};
