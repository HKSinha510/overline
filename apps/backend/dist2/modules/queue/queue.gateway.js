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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var QueueGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)({
            cors: {
                origin: '*',
            },
            namespace: '/queue',
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _server_decorators;
    var _server_initializers = [];
    var _server_extraInitializers = [];
    var _handleJoinShopQueue_decorators;
    var _handleLeaveShopQueue_decorators;
    var _handleTrackBooking_decorators;
    var _handleUpdateLocation_decorators;
    var _handleSendMessage_decorators;
    var QueueGateway = _classThis = /** @class */ (function () {
        function QueueGateway_1(queueService, queueTrackingService) {
            this.queueService = (__runInitializers(this, _instanceExtraInitializers), queueService);
            this.queueTrackingService = queueTrackingService;
            this.server = __runInitializers(this, _server_initializers, void 0);
            this.logger = (__runInitializers(this, _server_extraInitializers), new common_1.Logger(QueueGateway.name));
        }
        QueueGateway_1.prototype.handleConnection = function (client) {
            this.logger.log("Client connected: ".concat(client.id));
        };
        QueueGateway_1.prototype.handleDisconnect = function (client) {
            this.logger.log("Client disconnected: ".concat(client.id));
        };
        /**
         * Client subscribes to queue updates for a specific shop
         */
        QueueGateway_1.prototype.handleJoinShopQueue = function (client, data) {
            var room = "shop:".concat(data.shopId);
            client.join(room);
            this.logger.log("Client ".concat(client.id, " joined room ").concat(room));
            return { event: 'joined', room: room };
        };
        /**
         * Client unsubscribes from a shop queue
         */
        QueueGateway_1.prototype.handleLeaveShopQueue = function (client, data) {
            var room = "shop:".concat(data.shopId);
            client.leave(room);
            this.logger.log("Client ".concat(client.id, " left room ").concat(room));
            return { event: 'left', room: room };
        };
        /**
         * Client subscribes to updates for their specific booking
         */
        QueueGateway_1.prototype.handleTrackBooking = function (client, data) {
            var room = "booking:".concat(data.bookingId);
            client.join(room);
            this.logger.log("Client ".concat(client.id, " tracking booking ").concat(data.bookingId));
            return { event: 'tracking', room: room };
        };
        /**
         * User emits live location updates
         */
        QueueGateway_1.prototype.handleUpdateLocation = function (client, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!data.bookingId || !data.lat || !data.lng)
                                return [2 /*return*/];
                            // Save to Redis (TTL 30 mins)
                            return [4 /*yield*/, this.queueTrackingService.saveLocation(data.bookingId, { lat: data.lat, lng: data.lng })];
                        case 1:
                            // Save to Redis (TTL 30 mins)
                            _a.sent();
                            // Broadcast to everyone in the booking room (such as the admin)
                            this.server.to("booking:".concat(data.bookingId)).emit('locationUpdate', {
                                bookingId: data.bookingId,
                                lat: data.lat,
                                lng: data.lng,
                                timestamp: new Date().toISOString(),
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Chat messages between user and owner
         */
        QueueGateway_1.prototype.handleSendMessage = function (client, data) {
            return __awaiter(this, void 0, void 0, function () {
                var msg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!data.bookingId || !data.content)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.queueTrackingService.createMessage(data.bookingId, data.senderId, data.senderType, data.content)];
                        case 1:
                            msg = _a.sent();
                            this.server.to("booking:".concat(data.bookingId)).emit('chatMessage', msg);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Emit queue stats update to all clients watching a shop
         */
        QueueGateway_1.prototype.emitQueueUpdate = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, stats, todayQueue, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all([
                                    this.queueService.getQueueStats(shopId),
                                    this.queueService.getTodayQueue(shopId),
                                ])];
                        case 1:
                            _a = _b.sent(), stats = _a[0], todayQueue = _a[1];
                            this.server.to("shop:".concat(shopId)).emit('queueUpdate', {
                                shopId: shopId,
                                stats: stats,
                                queue: todayQueue,
                                timestamp: new Date().toISOString(),
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _b.sent();
                            this.logger.error("Failed to emit queue update for shop ".concat(shopId), error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Emit booking status change to clients tracking that booking
         */
        QueueGateway_1.prototype.emitBookingUpdate = function (bookingId, update) {
            this.server.to("booking:".concat(bookingId)).emit('bookingUpdate', __assign(__assign({ bookingId: bookingId }, update), { timestamp: new Date().toISOString() }));
        };
        /**
         * Emit queue position update for a specific booking
         */
        QueueGateway_1.prototype.emitPositionUpdate = function (bookingId, position) {
            this.server.to("booking:".concat(bookingId)).emit('positionUpdate', {
                bookingId: bookingId,
                position: position,
                timestamp: new Date().toISOString(),
            });
        };
        return QueueGateway_1;
    }());
    __setFunctionName(_classThis, "QueueGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        _handleJoinShopQueue_decorators = [(0, websockets_1.SubscribeMessage)('joinShopQueue')];
        _handleLeaveShopQueue_decorators = [(0, websockets_1.SubscribeMessage)('leaveShopQueue')];
        _handleTrackBooking_decorators = [(0, websockets_1.SubscribeMessage)('trackBooking')];
        _handleUpdateLocation_decorators = [(0, websockets_1.SubscribeMessage)('updateLocation')];
        _handleSendMessage_decorators = [(0, websockets_1.SubscribeMessage)('sendMessage')];
        __esDecorate(_classThis, null, _handleJoinShopQueue_decorators, { kind: "method", name: "handleJoinShopQueue", static: false, private: false, access: { has: function (obj) { return "handleJoinShopQueue" in obj; }, get: function (obj) { return obj.handleJoinShopQueue; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleLeaveShopQueue_decorators, { kind: "method", name: "handleLeaveShopQueue", static: false, private: false, access: { has: function (obj) { return "handleLeaveShopQueue" in obj; }, get: function (obj) { return obj.handleLeaveShopQueue; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleTrackBooking_decorators, { kind: "method", name: "handleTrackBooking", static: false, private: false, access: { has: function (obj) { return "handleTrackBooking" in obj; }, get: function (obj) { return obj.handleTrackBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleUpdateLocation_decorators, { kind: "method", name: "handleUpdateLocation", static: false, private: false, access: { has: function (obj) { return "handleUpdateLocation" in obj; }, get: function (obj) { return obj.handleUpdateLocation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleSendMessage_decorators, { kind: "method", name: "handleSendMessage", static: false, private: false, access: { has: function (obj) { return "handleSendMessage" in obj; }, get: function (obj) { return obj.handleSendMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QueueGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QueueGateway = _classThis;
}();
exports.QueueGateway = QueueGateway;
