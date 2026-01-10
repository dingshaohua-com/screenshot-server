import path from 'node:path';
import { bodyParser } from '@koa/bodyparser';
import cors from "@koa/cors";
import Koa from 'koa';
import staticServer from 'koa-static';
import response from './middleware/response.ts';
import router from './router/index.ts';
import {launchBrowser} from "./utils/browser-helper.ts"
import logHelper from './utils/log-helper.ts';


const app = new Koa();

// 注册全局中间件
app.use(cors());
app.use(bodyParser());
app.use(staticServer(path.join(__dirname,'..', 'public')));
app.use(response);
app.use(router.routes()).use(router.allowedMethods());

// 项目启动就创建浏览器实例并打开，避免截图延迟
launchBrowser();


const PORT = Number(process.env.PORT || 3000);
const server = app.listen(PORT, '0.0.0.0', () => {
	logHelper.startServer(server);
});
