"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const app_1 = __importDefault(require("./app"));
const getNetworkHost = () => {
    const nets = (0, os_1.networkInterfaces)();
    for (const name of Object.keys(nets)) {
        const netInterface = nets[name];
        if (!netInterface)
            continue;
        for (const net of netInterface) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '0.0.0.0';
};
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || getNetworkHost();
app_1.default.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    if (HOST !== 'localhost' && HOST !== '127.0.0.1') {
        console.log(`🚀 Server also accessible on http://localhost:${PORT}`);
    }
});
if (HOST !== 'localhost' && HOST !== '127.0.0.1' && HOST !== '0.0.0.0') {
    app_1.default.listen(PORT, 'localhost', () => {
        console.log(`🚀 Server also running on http://localhost:${PORT}`);
    });
}
if (HOST !== '0.0.0.0') {
    app_1.default.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server also running on http://0.0.0.0:${PORT}`);
    });
}
//# sourceMappingURL=server.js.map