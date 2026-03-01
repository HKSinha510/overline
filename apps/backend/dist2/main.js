"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var platform_socket_io_1 = require("@nestjs/platform-socket.io");
var app_module_1 = require("./app.module");
var express = __importStar(require("express"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, config, document, port;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule, {
                        // Preserve raw body for Stripe webhook signature verification
                        rawBody: true,
                    })];
                case 1:
                    app = _b.sent();
                    // Enable CORS
                    app.enableCors({
                        origin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:3000', 'http://localhost:3002'],
                        credentials: true,
                    });
                    // WebSocket adapter (Socket.IO)
                    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
                    // Raw body middleware for Stripe webhooks
                    app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
                    // Global prefix
                    app.setGlobalPrefix('api');
                    // API Versioning
                    app.enableVersioning({
                        type: common_1.VersioningType.URI,
                        defaultVersion: '1',
                    });
                    // Global validation pipe
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        forbidNonWhitelisted: true,
                        transform: true,
                        transformOptions: {
                            enableImplicitConversion: true,
                        },
                    }));
                    config = new swagger_1.DocumentBuilder()
                        .setTitle('Overline API')
                        .setDescription('Multi-tenant Appointment & Queue Management System API')
                        .setVersion('1.0')
                        .addBearerAuth({
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        name: 'JWT',
                        description: 'Enter JWT token',
                        in: 'header',
                    }, 'JWT-auth')
                        .addTag('auth', 'Authentication endpoints')
                        .addTag('users', 'User management endpoints')
                        .addTag('shops', 'Shop discovery and details')
                        .addTag('services', 'Service management')
                        .addTag('bookings', 'Booking management')
                        .addTag('queue', 'Queue and slot management')
                        .addTag('admin', 'Admin management endpoints')
                        .addTag('payments', 'Payment processing')
                        .build();
                    document = swagger_1.SwaggerModule.createDocument(app, config);
                    swagger_1.SwaggerModule.setup('docs', app, document);
                    port = process.env.PORT || 3001;
                    return [4 /*yield*/, app.listen(port, '0.0.0.0')];
                case 2:
                    _b.sent();
                    console.log("\uD83D\uDE80 Overline API is running on port ".concat(port));
                    console.log("\uD83D\uDCDA API Documentation: /docs");
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap().catch(function (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
});
