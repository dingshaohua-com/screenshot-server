import type { Next, ParameterizedContext } from 'koa';
import type { ZodType } from 'zod';
import { getFirstErrMsg } from '../utils/zod-helper';
import { BizError } from './response';

// 给 state 扩展字段
type ValidateState<T> = { params: T };

// 参数校验：验证get或post等请求体或请求行参数
// Koa 的中间件有两种“用法”，全局级和路由级，这个是路由级用的
export  function validate<T>(schema: ZodType<T>) {
	return async (ctx: ParameterizedContext<ValidateState<T>>, next: Next) => {
		const data = ['POST', 'PUT', 'PATCH'].includes(ctx.method)
			? ctx.request.body
			: ctx.request.query;
        
		const parsed = schema.safeParse(data);
		if (!parsed.success) {
			throw new BizError(getFirstErrMsg(parsed.error));
		}
		ctx.state.params = parsed.data;
		await next();
	};
}


//  参数校验：验证restfull类型的参数
export function validateRestfull<T>(schema: ZodType<T>) {
  return async (ctx: ParameterizedContext<ValidateState<T>>, next: Next) => {
    const parsed = schema.safeParse(ctx.params);
    if (!parsed.success) throw new BizError(getFirstErrMsg(parsed.error));
    ctx.state.params = parsed.data;   // 类型已收窄
    await next();
  };
}