import { compareDesc } from "date-fns";
import Link from "next/link";
import { getAllPostMeta } from "./(utils)/post";

export default async function Home() {
  const allPostMeta = (await getAllPostMeta()).sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );
  return (
    <main>
      <ul className="flex flex-col gap-4 px-8 py-6 my-4 mx-auto max-w-4xl">
        {allPostMeta.map((postMeta) => {
          const title = decodeURI(postMeta.uriPath.split("/").pop() ?? "");

          return (
            <Link key={title} href={postMeta.uriPath}>
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
