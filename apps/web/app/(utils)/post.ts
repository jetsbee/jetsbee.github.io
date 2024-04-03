import { POST_PATH_FROM_APP_WORKSPACE as POST_ROOT_PATH } from "@repo/content/post-path";
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
  readonly title: string;
}

interface Post extends PostMeta {
  content: string;
}

// eslint-disable-next-line turbo/no-undeclared-env-vars
const IS_PROD = process.env.NODE_ENV === "production";
const NO_DATE = "n.d.";

const nthLastIndex = (
  targetString: string,
  searchString?: string,
  n?: number // nth last index
): number => {
  if (!searchString) {
    return -1;
  }
  if (!n || isNaN(n) || n <= 1) {
    return targetString.lastIndexOf(searchString);
  }
  n--;
  return targetString.lastIndexOf(
    searchString,
    nthLastIndex(targetString, searchString, n) - 1
  );
}; // ref. https://stackoverflow.com/a/55679985

const getAllPostFilePaths = async (): Promise<FilePath[]> => {
  const postsPattern = path.join(POST_ROOT_PATH, "**", "*.html");
  const allPostPaths = await glob(postsPattern);

  return allPostPaths;
};

const getDateFromFilePath = (filePath: FilePath): Timestamp => {
  const dString = filePath.substring(
    nthLastIndex(filePath, ".", 2),
    filePath.lastIndexOf(".")
  );

  let postDate = undefined;
  if (dString === ".") {
    postDate = NaN; // *..html
  } else if (dString === "") {
    postDate = NaN; // *.html
  } else if (isNaN(+dString)) {
    postDate = NaN; // *.[NotANumber].html
  } else {
    postDate = +dString.slice(1); // *.[number].html
  }

  return postDate;
};

const getSlugFromFilePath = (filePath: FilePath): Slug => {
  const postDate = getDateFromFilePath(filePath);
  const postDateString = !isNaN(postDate) ? postDate + "" : NO_DATE;

  const slugWithoutDate = filePath
    .replace(POST_ROOT_PATH, "")
    .replace(/\.html$/, "")
    .replace(/\.[0-9]+$/, "")
    .split(path.sep)
    .filter((s) => s); // Remove empty string elements

  /**
   * Automatically url encoded when production mode only.
   * ref. https://github.com/vercel/next.js/issues/11016
   */
  const slug = IS_PROD
    ? [...slugWithoutDate, postDateString]
    : [...slugWithoutDate.map((s) => encodeURI(s)), postDateString];

  return slug;
};

const getUriPathFromFilePath = (filePath: FilePath): UriPath => {
  const resources = ["posts", ...getSlugFromFilePath(filePath)];
  return resources.join("/");
};

export const getParams = async (): Promise<Params[]> => {
  const allPostFilePaths = await getAllPostFilePaths();
  const params = allPostFilePaths.map((fp) => ({
    slug: getSlugFromFilePath(fp),
  }));

  return params;
};

export const getPostBySlugs = async (slugUris: Slug): Promise<Post> => {
  const slug = slugUris.map((s) => decodeURI(s));

  const [postNameWithoutDate, postDateFromSlug = ""] = slug.slice(-2);
  const postDateStringForPath =
    postDateFromSlug !== NO_DATE ? `.${postDateFromSlug}` : "";
  const postDate = postDateFromSlug ? +postDateFromSlug : NaN;

  const postDirs = slug.slice(0, -2);
  const pageFilePath = path.join(
    POST_ROOT_PATH,
    ...postDirs,
    `${postNameWithoutDate}${postDateStringForPath}.html`
  );

  const rawContent = await fs.readFile(pageFilePath);
  const htmlString = rawContent.toString("utf-8");
  const uriPath = getUriPathFromFilePath(pageFilePath);
  const title = uriPath.split("/").pop() ?? "";

  return { content: htmlString, date: postDate, uriPath, title };
};

export const getAllPostMeta = async (): Promise<PostMeta[]> => {
  const allPostFilePaths = await getAllPostFilePaths();
  const allPostMeta: PostMeta[] = allPostFilePaths.map((fp) => {
    return {
      uriPath: getUriPathFromFilePath(fp),
      get title() {
        return decodeURI(this.uriPath.split("/").at(-2) ?? "");
      },
      get date() {
        return +(this.uriPath.split("/").pop() ?? "");
      },
    };
  });

  return allPostMeta;
};
