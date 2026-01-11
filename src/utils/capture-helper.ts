import fs from "node:fs";
import { join } from "node:path";
import type { CaptureDto } from "../dto/capture";
import { getCtxAndPage } from "./browser-helper";

// 读取一些静态资源，下边会用到
const ROOT_PATH = process.cwd(); // 项目根目录
const tailwindJS = fs.readFileSync(
  join(ROOT_PATH, "public", "capture-tpl", "tailwindcss.js"),
  "utf-8"
);
const templateHtml = fs.readFileSync(
  join(ROOT_PATH, "public", "capture-tpl", "template.html"),
  "utf-8"
);

// 把 Tailwind 运行时内嵌，又不想再踩 escape 的坑(引号冲突、换行丢失)，用 CDATA 包装 + base64 插入
const tailwindJsBase64 = Buffer.from(tailwindJS, 'utf8').toString('base64');

// 截图url
async function doCaptureByUrl(params: CaptureDto) {
  const { context, page } = await getCtxAndPage(params.width, params.height);
  await page.goto(params.url!);
  const buffer = await page.screenshot({ fullPage: true });
  await context.close();
  return buffer;
}

// 截图htmlStr
async function doCaptureHtmlstr(params: CaptureDto) {
  const { context, page } = await getCtxAndPage(params.width, params.height);
  
  // --- ✨ 准备 HTML ---
  const fullHtml = templateHtml
    .replace("{{html_content}}", params.htmlStr!)
    .replace("{{tailwind_script}}", `<script>const s = atob('${tailwindJsBase64}'); eval(s);</script>`);

  // 开始截图
  await page.setContent(fullHtml);
  const buffer = await page.screenshot({ fullPage: true });
  await context.close();
  return buffer;
}

export async function doCapture(params: CaptureDto) {
  if (params.url) {
    return await doCaptureByUrl(params);
  } else {
    return await doCaptureHtmlstr(params);
  }
}
