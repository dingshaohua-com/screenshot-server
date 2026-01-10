import Router from '@koa/router';
import { CaptureDto } from '../dto/capture';
import { BizError } from '../middleware/response';
import { validate } from '../middleware/validate';
import { doCapture } from '../utils/capture-helper';

const router = new Router({ prefix: '/capture' });

router.get('/', () => {
	throw new BizError('我是截图工具，因参数较多，请使用Post');
});

router.post('/', validate(CaptureDto), async (ctx) => {
	const params = ctx.state.params;
	const result = await doCapture(params);
	ctx.type = 'image/png';
	ctx.body = result;
	return result;
});

export default router;
