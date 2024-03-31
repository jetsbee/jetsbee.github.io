import { glob } from "glob";
import fs from "node:fs/promises";
import path from "node:path";

type FilePath = string;
type UriPath = string;
type Timestamp = number;
type Slug = string[];

interface Params {
  slug: Slug;
}

interface PostMeta {
  date: Timestamp;
  uriPath: UriPath;
}

interface Post extends PostMeta {
  content: string;
}

const getAllPostFilePaths = async (): Promise<FilePath[]> => {
  const postsPattern = path.join(process.cwd(), "posts", "**", "*.html");
  const allPostPaths = await glob(postsPattern);

  return allPostPaths;
};

const getSlugFromFilePath = (filePath: FilePath): Slug => {
  const slug = filePath
    .replace(path.join(process.cwd(), "posts"), "")
    .replace(/(\..*)?(\.html$)/, "")
    .split(path.sep)
    // Remove empty string elements
    .filter((s) => s);

  return slug;
};

export const getParams = async (): Promise<Params[]> => {
  const allPostFilePaths = await getAllPostFilePaths();
  const params = allPostFilePaths.map((fp) => ({
    slug: getSlugFromFilePath(fp),
  }));

  const uniqueStringParams = new Set(params.map((p) => JSON.stringify(p)));
  const uniqueParams: Params[] = Array.from(uniqueStringParams).map((s) =>
    JSON.parse(s)
  );

  return uniqueParams;
};

const getUriPathFromFilePath = (filePath: FilePath): UriPath => {
  const resources = ["posts", ...getSlugFromFilePath(filePath)];
  return resources.join("/");
};

const getDateFromFilePath = (filePath: FilePath): Timestamp => {
  const postDate = +filePath
    .substring(filePath.indexOf("."), filePath.lastIndexOf("."))
    .slice(1);

  return postDate;
};

export const getPostBySlugs = async (slug: Slug): Promise<Post> => {
  const [postNameWithoutDate] = slug.slice(-1);
  const postDirs = slug.slice(0, -1);
  const pagePattern = path.join(
    process.cwd(),
    "posts",
    ...postDirs,
    `${postNameWithoutDate}?(.*).html`
  );

  const [pageFilePath = ""] = await glob(pagePattern); // get first path if many

  const rawContent = await fs.readFile(pageFilePath);
  const htmlString = rawContent.toString("utf-8");
  const postDate = getDateFromFilePath(pageFilePath);
  const uriPath = getUriPathFromFilePath(pageFilePath);

  return { content: htmlString, date: postDate, uriPath };
};

export const getAllPostMeta = async (): Promise<PostMeta[]> => {
  const allPostFilePaths = await getAllPostFilePaths();

  const allPostMeta: PostMeta[] = allPostFilePaths.map((fp) => ({
    date: getDateFromFilePath(fp),
    uriPath: getUriPathFromFilePath(fp),
  }));

  return allPostMeta;
};
