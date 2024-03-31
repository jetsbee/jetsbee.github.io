import { compareDesc } from "date-fns";
import Link from "next/link";
import { getAllPostMeta } from "./(utils)/post";

export default async function Home() {
  const allPostMeta = (await getAllPostMeta()).sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );
  return (
    <main>
      <ul>
        {allPostMeta.map((postMeta) => {
          const title = postMeta.uriPath.split("/").pop();

          return (
            <Link key={title} href={postMeta.uriPath}>
              <li>{title}</li>
            </Link>
          );
        })}
      </ul>
    </main>
  );
}
