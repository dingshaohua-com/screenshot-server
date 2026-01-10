import type { CaptureDto } from '../dto/capture';
import { getCtxAndPage } from './browser-helper';

// 截图url
async function doCaptureByUrl(params: CaptureDto) {
	const { context, page } = await getCtxAndPage(params.width, params.height);
	await page.goto(params.url!);
	const buffer = await page.screenshot({ fullPage: true });
	await context.close();
	return buffer;
}

// 截图htmlStr
async function doCaptureHtmlstr(params: CaptureDto) {}

export async function doCapture(params: CaptureDto) {
	if (params.url) {
		return await doCaptureByUrl(params);
	} else {
		return await doCaptureHtmlstr(params);
	}
}
