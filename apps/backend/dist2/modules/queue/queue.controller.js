"use strict";
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
exports.QueueController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var public_decorator_1 = require("../auth/decorators/public.decorator");
var QueueController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('queue'), (0, common_1.Controller)('queue')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getSlots_decorators;
    var _getNextSlot_decorators;
    var _getPosition_decorators;
    var _getTrackableBookings_decorators;
    var _getMessages_decorators;
    var _postMessage_decorators;
    var QueueController = _classThis = /** @class */ (function () {
        function QueueController_1(queueService, slotEngine, queueTrackingService) {
            this.queueService = (__runInitializers(this, _instanceExtraInitializers), queueService);
            this.slotEngine = slotEngine;
            this.queueTrackingService = queueTrackingService;
        }
        QueueController_1.prototype.getSlots = function (shopId, date, serviceIds, duration, staffId) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceIdArray;
                return __generator(this, function (_a) {
                    serviceIdArray = serviceIds ? serviceIds.split(',').filter(Boolean) : [];
                    return [2 /*return*/, this.slotEngine.getAvailableSlots({
                            shopId: shopId,
                            date: date,
                            serviceIds: serviceIdArray,
                            duration: duration || 30,
                            staffId: staffId,
                        })];
                });
            });
        };
        QueueController_1.prototype.getNextSlot = function (shopId, serviceIds) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceIdArray, slot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            serviceIdArray = serviceIds.split(',').filter(Boolean);
                            return [4 /*yield*/, this.slotEngine.getNextAvailableSlot(shopId, serviceIdArray)];
                        case 1:
                            slot = _a.sent();
                            return [2 /*return*/, { slot: slot }];
                    }
                });
            });
        };
        QueueController_1.prototype.getPosition = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var position;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.queueService.getQueuePosition(bookingId)];
                        case 1:
                            position = _a.sent();
                            return [2 /*return*/, { position: position }];
                    }
                });
            });
        };
        // --- Tracking & Chat Endpoints ---
        QueueController_1.prototype.getTrackableBookings = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.queueTrackingService.getTrackableBookings(shopId)];
                });
            });
        };
        QueueController_1.prototype.getMessages = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.queueTrackingService.getMessages(bookingId)];
                });
            });
        };
        QueueController_1.prototype.postMessage = function (bookingId, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.queueTrackingService.createMessage(bookingId, data.senderId, data.senderType, data.content)];
                });
            });
        };
        return QueueController_1;
    }());
    __setFunctionName(_classThis, "QueueController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getSlots_decorators = [(0, common_1.Get)('slots/:shopId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get available time slots for booking' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' }), (0, swagger_1.ApiQuery)({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' }), (0, swagger_1.ApiQuery)({ name: 'serviceIds', required: false, description: 'Comma-separated service IDs' }), (0, swagger_1.ApiQuery)({ name: 'duration', required: false, description: 'Duration in minutes (used if no serviceIds)' }), (0, swagger_1.ApiQuery)({ name: 'staffId', required: false, description: 'Optional specific staff member' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of available time slots' })];
        _getNextSlot_decorators = [(0, common_1.Get)('next-slot/:shopId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get next available slot for booking' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' }), (0, swagger_1.ApiQuery)({ name: 'serviceIds', required: true, description: 'Comma-separated service IDs' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Next available time slot' })];
        _getPosition_decorators = [(0, common_1.Get)('position/:bookingId'), (0, swagger_1.ApiOperation)({ summary: 'Get queue position for a booking' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Queue position number' })];
        _getTrackableBookings_decorators = [(0, common_1.Get)('tracking/:shopId'), (0, swagger_1.ApiOperation)({ summary: 'Get trackable current/next bookings for shop' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' })];
        _getMessages_decorators = [(0, common_1.Get)('tracking/:bookingId/messages'), (0, swagger_1.ApiOperation)({ summary: 'Get chat history for a booking' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' })];
        _postMessage_decorators = [(0, common_1.Post)('tracking/:bookingId/messages'), (0, swagger_1.ApiOperation)({ summary: 'Post a chat message to a booking' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' })];
        __esDecorate(_classThis, null, _getSlots_decorators, { kind: "method", name: "getSlots", static: false, private: false, access: { has: function (obj) { return "getSlots" in obj; }, get: function (obj) { return obj.getSlots; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNextSlot_decorators, { kind: "method", name: "getNextSlot", static: false, private: false, access: { has: function (obj) { return "getNextSlot" in obj; }, get: function (obj) { return obj.getNextSlot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPosition_decorators, { kind: "method", name: "getPosition", static: false, private: false, access: { has: function (obj) { return "getPosition" in obj; }, get: function (obj) { return obj.getPosition; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTrackableBookings_decorators, { kind: "method", name: "getTrackableBookings", static: false, private: false, access: { has: function (obj) { return "getTrackableBookings" in obj; }, get: function (obj) { return obj.getTrackableBookings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMessages_decorators, { kind: "method", name: "getMessages", static: false, private: false, access: { has: function (obj) { return "getMessages" in obj; }, get: function (obj) { return obj.getMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _postMessage_decorators, { kind: "method", name: "postMessage", static: false, private: false, access: { has: function (obj) { return "postMessage" in obj; }, get: function (obj) { return obj.postMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QueueController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QueueController = _classThis;
}();
exports.QueueController = QueueController;
