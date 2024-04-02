import { POST_PATH_FROM_APP_WORKSPACE as POST_ROOT_PATH } from "@repo/content/post-path";
import DOMPurify from "isomorphic-dompurify";
import fs from "node:fs/promises";
import path from "node:path";
import * as z from "zod";

const postSchema = z.object({
  title: z.string().min(0).trim(),
  description: z.string().min(0).trim(),
});

const savePost = async (request: Request) => {
  const json = await request.json().catch((err) => console.log(err));
  if (!json) return;

  const safeRes = postSchema.safeParse(json);
  if (!safeRes.success) {
    console.log(safeRes.error);
    return;
  }

  const { title, description } = safeRes.data;

  const postDirsAndName = title.split("/");
  const postDirs = postDirsAndName.slice(0, -1);
  const [postNameWithoutDate] = postDirsAndName.slice(-1);
  const dirPath = path.join(POST_ROOT_PATH, ...postDirs);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(
    path.join(dirPath, `${postNameWithoutDate}.${Date.now()}.html`),
    DOMPurify.sanitize(description)
  );
};

export const POST = async (request: Request) => {
  savePost(request);
  return Response.json(null, { status: 202 });
};
