import { getParams, getPostBySlugs } from "@/app/(utils)/post";
import DOMPurify from "isomorphic-dompurify";

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
  return await getParams();
};

export const generateMetadata = async ({ params }: Props) => {
  return { title: params.slug.pop() };
};

const getPost = async (params: Props["params"]) => {
  return await getPostBySlugs(params.slug);
};

export default async function PostLayout({ params }: Props) {
  const { content: post } = await getPost(params);

  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post) }} />;
}
