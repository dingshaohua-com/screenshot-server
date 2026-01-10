import { z } from 'zod';

export const CaptureDto = z.object({
	url: z.string().url().optional(),
	htmlStr: z.string().optional(),
	excludeElements: z.array(z.string()).optional(),
    height: z.number().optional(),
    width: z.number().optional()
});

// 一键生成 TS 类型:完全等同于手写 interface
export type CaptureDto = z.infer<typeof CaptureDto>; 
