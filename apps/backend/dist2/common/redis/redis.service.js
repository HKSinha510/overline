"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
var common_1 = require("@nestjs/common");
var ioredis_1 = __importDefault(require("ioredis"));
var RedisService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RedisService = _classThis = /** @class */ (function () {
        function RedisService_1(configService) {
            this.configService = configService;
            this.client = null;
            this.logger = new common_1.Logger(RedisService.name);
            this.isConnected = false;
        }
        RedisService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var redisUrl, redisOptions, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            redisUrl = this.configService.get('redis.url');
                            redisOptions = {
                                retryStrategy: function (times) {
                                    if (times > 3) {
                                        _this.logger.warn('Redis connection failed after 3 retries - continuing without Redis');
                                        return null;
                                    }
                                    return Math.min(times * 200, 1000);
                                },
                                maxRetriesPerRequest: 3,
                                lazyConnect: true,
                                enableOfflineQueue: false,
                            };
                            if (redisUrl) {
                                this.logger.log('Connecting to Redis via URL...');
                                this.client = new ioredis_1.default(redisUrl, redisOptions);
                            }
                            else {
                                this.logger.log('Connecting to Redis via host/port...');
                                this.client = new ioredis_1.default(__assign(__assign({}, redisOptions), { host: this.configService.get('redis.host'), port: this.configService.get('redis.port'), password: this.configService.get('redis.password') || undefined }));
                            }
                            this.client.on('connect', function () {
                                _this.isConnected = true;
                                _this.logger.log('✅ Redis connected');
                            });
                            this.client.on('error', function (error) {
                                _this.isConnected = false;
                                _this.logger.warn("Redis error: ".concat(error.message));
                            });
                            // Try to connect but don't block startup
                            return [4 /*yield*/, this.client.connect().catch(function (err) {
                                    _this.logger.warn("Redis initial connection failed: ".concat(err.message, " - app will continue without Redis"));
                                })];
                        case 1:
                            // Try to connect but don't block startup
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.warn("Redis setup failed: ".concat(error_1.message, " - app will continue without Redis"));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.client) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.client.quit().catch(function () { })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.getClient = function () {
            return this.client;
        };
        RedisService_1.prototype.isReady = function () {
            return this.isConnected && this.client !== null;
        };
        // ============================================================================
        // Basic Operations
        // ============================================================================
        RedisService_1.prototype.get = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, null];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.get(key)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.set = function (key, value, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            if (!ttlSeconds) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.client.setex(key, ttlSeconds, value)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.client.set(key, value)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            _a = _b.sent();
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.del = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.del(key)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.exists = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var result, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, false];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.exists(key)];
                        case 2:
                            result = _b.sent();
                            return [2 /*return*/, result === 1];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.expire = function (key, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.expire(key, ttlSeconds)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================================
        // JSON Operations (using string serialization)
        // ============================================================================
        RedisService_1.prototype.getJson = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var data, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, null];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.get(key)];
                        case 2:
                            data = _b.sent();
                            if (!data)
                                return [2 /*return*/, null];
                            return [2 /*return*/, JSON.parse(data)];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.setJson = function (key, value, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                var data, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            data = JSON.stringify(value);
                            if (!ttlSeconds) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.client.setex(key, ttlSeconds, data)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.client.set(key, data)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            _a = _b.sent();
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================================
        // Hash Operations
        // ============================================================================
        RedisService_1.prototype.hget = function (key, field) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, null];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.hget(key, field)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.hset = function (key, field, value) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.hset(key, field, value)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.hgetall = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, {}];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.hgetall(key)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, {}];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.hdel = function (key, field) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.hdel(key, field)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.hincrby = function (key, field, increment) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.hincrby(key, field, increment)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================================
        // List Operations (for queues)
        // ============================================================================
        RedisService_1.prototype.lpush = function (key) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (_b = this.client).lpush.apply(_b, __spreadArray([key], values, false))];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            _a = _c.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.rpush = function (key) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (_b = this.client).rpush.apply(_b, __spreadArray([key], values, false))];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            _a = _c.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.lpop = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, null];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.lpop(key)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.rpop = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, null];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.rpop(key)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.lrange = function (key, start, stop) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, []];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.lrange(key, start, stop)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.llen = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.llen(key)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================================
        // Set Operations
        // ============================================================================
        RedisService_1.prototype.sadd = function (key) {
            var members = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                members[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (_b = this.client).sadd.apply(_b, __spreadArray([key], members, false))];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            _a = _c.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.srem = function (key) {
            var members = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                members[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (_b = this.client).srem.apply(_b, __spreadArray([key], members, false))];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            _a = _c.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.smembers = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, []];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.smembers(key)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.sismember = function (key, member) {
            return __awaiter(this, void 0, void 0, function () {
                var result, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, false];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.sismember(key, member)];
                        case 2:
                            result = _b.sent();
                            return [2 /*return*/, result === 1];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================================
        // Sorted Set Operations (for priority queues, leaderboards)
        // ============================================================================
        RedisService_1.prototype.zadd = function (key, score, member) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.zadd(key, score, member)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.zrem = function (key, member) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.zrem(key, member)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.zrange = function (key, start, stop) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, []];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.zrange(key, start, stop)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.zrangebyscore = function (key, min, max) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, []];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.zrangebyscore(key, min, max)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.zrank = function (key, member) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, null];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.zrank(key, member)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.zcard = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.zcard(key)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================================
        // Pub/Sub (for real-time updates)
        // ============================================================================
        RedisService_1.prototype.publish = function (channel, message) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/, 0];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.client.publish(channel, message)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================================
        // Queue-specific helpers for Overline
        // ============================================================================
        // Get queue stats for a shop
        RedisService_1.prototype.getShopQueueStats = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                var key, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = "queue:shop:".concat(shopId);
                            return [4 /*yield*/, this.hgetall(key)];
                        case 1:
                            data = _a.sent();
                            if (!data || Object.keys(data).length === 0)
                                return [2 /*return*/, null];
                            return [2 /*return*/, {
                                    waitingCount: parseInt(data.waitingCount || '0'),
                                    estimatedWaitMinutes: parseInt(data.estimatedWaitMinutes || '0'),
                                    nextSlot: data.nextSlot || null,
                                }];
                    }
                });
            });
        };
        // Update queue stats for a shop
        RedisService_1.prototype.updateShopQueueStats = function (shopId, stats) {
            return __awaiter(this, void 0, void 0, function () {
                var key, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, , 8]);
                            key = "queue:shop:".concat(shopId);
                            return [4 /*yield*/, this.client.hset(key, 'waitingCount', stats.waitingCount.toString())];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, this.client.hset(key, 'estimatedWaitMinutes', stats.estimatedWaitMinutes.toString())];
                        case 3:
                            _b.sent();
                            if (!stats.nextSlot) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.client.hset(key, 'nextSlot', stats.nextSlot)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [4 /*yield*/, this.expire(key, 3600)];
                        case 6:
                            _b.sent(); // 1 hour TTL
                            return [3 /*break*/, 8];
                        case 7:
                            _a = _b.sent();
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        // Cache available slots for a shop+date
        RedisService_1.prototype.cacheSlots = function (shopId, date, slots) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = "slots:".concat(shopId, ":").concat(date);
                            return [4 /*yield*/, this.setJson(key, slots, 300)];
                        case 1:
                            _a.sent(); // 5 minutes TTL
                            return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.getCachedSlots = function (shopId, date) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    key = "slots:".concat(shopId, ":").concat(date);
                    return [2 /*return*/, this.getJson(key)];
                });
            });
        };
        RedisService_1.prototype.invalidateSlots = function (shopId, date) {
            return __awaiter(this, void 0, void 0, function () {
                var keys, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.client)
                                return [2 /*return*/];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 7, , 8]);
                            if (!date) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.del("slots:".concat(shopId, ":").concat(date))];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 6];
                        case 3: return [4 /*yield*/, this.client.keys("slots:".concat(shopId, ":*"))];
                        case 4:
                            keys = _c.sent();
                            if (!(keys.length > 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, (_b = this.client).del.apply(_b, keys)];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            _a = _c.sent();
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        return RedisService_1;
    }());
    __setFunctionName(_classThis, "RedisService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RedisService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RedisService = _classThis;
}();
exports.RedisService = RedisService;
