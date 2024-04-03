import { getParams, getPostBySlugs } from "@/app/(utils)/post";
import DOMPurify from "isomorphic-dompurify";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string[];
  };
}

/**
 * - Return a list of `params`
 *
 * - Notes
 * 1. 404 routes is not working with dev mode, even with dynamicParams false exporting. (Similar issues below)
 * It is fine with building and serving.
 * Ref. https://github.com/vercel/next.js/issues/56253#issuecomment-1818932009
 *
 * 2. Element of slug should be string.
 */
export const generateStaticParams = async (): Promise<Props["params"][]> => {
  const params = await getParams();
  return params.length > 0 ? params : Promise.resolve([{ slug: ["index"] }]);
};

export const generateMetadata = async ({ params }: Props) => {
  return { title: decodeURI(params.slug.at(-2) ?? "") };
};

const getPost = async (params: Props["params"]) => {
  return await getPostBySlugs(params.slug);
};

export default async function PostLayout({ params }: Props) {
  params.slug.length === 1 && params.slug[0] === "index" && notFound();

  const { content: post } = await getPost(params);
  return (
    <main className="my-8 flex flex-col items-center">
      <div
        className="w-full max-w-4xl px-8"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post) }}
      />
    </main>
  );
}
