import type { Server } from 'node:http';
import type{ AddressInfo } from 'node:net';
import { ip } from 'address';
import chalk from 'chalk';

class LogHelper {
	private static instance: LogHelper;
	private constructor() {}
	public static getInstance(): LogHelper {
		return LogHelper.instance ||= new LogHelper();
	}
	startServer(server: Server) {
		const { port } = server.address() as AddressInfo;;
		const { green, bold, blue } = chalk;
		const localServerUrl = `http://localhost:${port}`;
		const ipServerUrl = `http://${ip()}:${port}`;
		console.log(`${green('➜')} ${bold('服务已启动:')}`);
		console.log(`  ${blue(localServerUrl)}`);
		console.log(`  ${blue(ipServerUrl)}`);
	}
}

export default LogHelper.getInstance();
