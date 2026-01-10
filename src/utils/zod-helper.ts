
import type { ZodError } from 'zod';
import { z } from "zod";

z.config(z.locales.zhCN());


/** 返回第一条易读的校验错误信息 */
export function getFirstErrMsg(error: ZodError): string {
  const first = error.issues[0];
  const field = first.path.join('.') || 'field';
  return `参数${field}错误，${first.message}`;
}