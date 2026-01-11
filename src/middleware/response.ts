import type { Context, Next } from 'koa';

export interface JsonResult<T = unknown> {
	code: number; // 业务状态码
	data: T | null; // 业务数据
	msg: string; // 提示信息
}

// 业务异常（自定义异常/错误）
export class BizError extends Error {
	readonly code: number;
	readonly status: number;

	constructor(message: string, code: number=1, status = 200) {
		super(message);
		this.code = code;
		this.status = status;
	}
}

export default async function response(
	ctx: Context,
	next: Next,
): Promise<void> {
	try {
		await next();

		// 404 兜底
		if (ctx.status === 404 || ctx.matched.length === 0) {
			ctx.body = { code: 404, data: null, msg: '请求的接口不存在' };
			return;
		}

		// 不需要再走统一格式的响应（swagger、文件下载等场景）
		// 需要 ctx.body = { ..., skipWrap: true };
		if (ctx.state.skipWrap || ctx.body instanceof Buffer) {
			return;
		}

		// 正常数据 → 包成 JsonResult
		const result: JsonResult = {
			code: 0,
			data: ctx.body ?? null,
			msg: 'ok',
		};
		ctx.body = result;
	} catch (err: unknown) {
		console.log(err);

		// 统一错误处理
		const isBiz = err instanceof BizError;
		const code = isBiz ? err.code : 500;
		const msg = isBiz ? err.message : '服务端错误';
		const status = isBiz ? err.status : 200; // 也可 500，按团队规范

		ctx.status = status;
		ctx.body = { code, data: null, msg } as JsonResult;
	}
}
