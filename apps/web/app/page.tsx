import { compareDesc } from "date-fns";
import Link from "next/link";
import { getAllPostMeta } from "./(utils)/post";

export default async function Home() {
  const allPostMeta = (await getAllPostMeta()).sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );
  return (
    <main className="my-8 flex flex-col items-center">
      <ul className="w-full max-w-4xl px-8 flex flex-col gap-4">
        {allPostMeta.map(({ title, uriPath, date }) => {
          return (
            <Link key={`${title}@${date}`} href={uriPath}>
              <li>
                <article className="rounded-md border p-2">
                  <p className="text-3xl font-medium break-words">{title}</p>
                </article>
              </li>
            </Link>
          );
        })}
      </ul>
    </main>
  );
}
