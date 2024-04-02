import path from "node:path";

export const POST_PATH_FROM_APP_WORKSPACE = path.join(
  process.cwd(),
  "..",
  "..",
  "packages",
  "content",
  "src",
  "posts"
);
