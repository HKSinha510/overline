"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
var common_1 = require("@nestjs/common");
var QueueService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var QueueService = _classThis = /** @class */ (function () {
        function QueueService_1(prisma, redis, slotEngine) {
            this.prisma = prisma;
            this.redis = redis;
            this.slotEngine = slotEngine;
        }
        /**
         * Update queue statistics for a shop
         */
        QueueService_1.prototype.updateQueueStats = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, waitingCount, estimatedWaitMinutes, avgService, nextSlot, next;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: {
                                        shopId: shopId,
                                        status: { in: ['PENDING', 'CONFIRMED'] },
                                        startTime: { gte: now },
                                    },
                                })];
                        case 1:
                            waitingCount = _a.sent();
                            return [4 /*yield*/, this.slotEngine.calculateWaitTime(shopId)];
                        case 2:
                            estimatedWaitMinutes = _a.sent();
                            return [4 /*yield*/, this.prisma.service.findFirst({
                                    where: { shopId: shopId, isActive: true },
                                    orderBy: { durationMinutes: 'asc' },
                                })];
                        case 3:
                            avgService = _a.sent();
                            if (!avgService) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.slotEngine.getNextAvailableSlot(shopId, [avgService.id])];
                        case 4:
                            next = _a.sent();
                            nextSlot = next === null || next === void 0 ? void 0 : next.startTime;
                            _a.label = 5;
                        case 5: 
                        // Update Redis cache
                        return [4 /*yield*/, this.redis.updateShopQueueStats(shopId, {
                                waitingCount: waitingCount,
                                estimatedWaitMinutes: estimatedWaitMinutes,
                                nextSlot: nextSlot,
                            })];
                        case 6:
                            // Update Redis cache
                            _a.sent();
                            // Also update database for persistence
                            return [4 /*yield*/, this.prisma.queueStats.upsert({
                                    where: { shopId: shopId },
                                    update: {
                                        currentWaitingCount: waitingCount,
                                        estimatedWaitMinutes: estimatedWaitMinutes,
                                        nextAvailableSlot: nextSlot ? new Date(nextSlot) : null,
                                        lastUpdatedAt: now,
                                    },
                                    create: {
                                        shopId: shopId,
                                        currentWaitingCount: waitingCount,
                                        estimatedWaitMinutes: estimatedWaitMinutes,
                                        nextAvailableSlot: nextSlot ? new Date(nextSlot) : null,
                                    },
                                })];
                        case 7:
                            // Also update database for persistence
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get queue position for a booking
         */
        QueueService_1.prototype.getQueuePosition = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, startOfDay, position;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                return [2 /*return*/, -1];
                            }
                            startOfDay = new Date(booking.startTime);
                            startOfDay.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: {
                                        shopId: booking.shopId,
                                        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
                                        startTime: { lt: booking.startTime, gte: startOfDay },
                                    },
                                })];
                        case 2:
                            position = _a.sent();
                            return [2 /*return*/, position + 1];
                    }
                });
            });
        };
        /**
         * Get today's queue for a shop
         */
        QueueService_1.prototype.getTodayQueue = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, startOfDay, endOfDay, bookings, upcoming, inProgress, completed, noShow;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            startOfDay = new Date(now);
                            startOfDay.setHours(0, 0, 0, 0);
                            endOfDay = new Date(now);
                            endOfDay.setHours(23, 59, 59, 999);
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        shopId: shopId,
                                        startTime: { gte: startOfDay, lte: endOfDay },
                                        status: { notIn: ['CANCELLED', 'REJECTED'] },
                                    },
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                phone: true,
                                            },
                                        },
                                        services: {
                                            include: {
                                                service: {
                                                    select: {
                                                        name: true,
                                                    },
                                                },
                                            },
                                        },
                                        staff: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                    orderBy: { startTime: 'asc' },
                                })];
                        case 1:
                            bookings = _a.sent();
                            upcoming = bookings.filter(function (b) {
                                return ['PENDING', 'CONFIRMED'].includes(b.status) && b.startTime > now;
                            });
                            inProgress = bookings.filter(function (b) { return b.status === 'IN_PROGRESS'; });
                            completed = bookings.filter(function (b) { return b.status === 'COMPLETED'; });
                            noShow = bookings.filter(function (b) { return b.status === 'NO_SHOW'; });
                            return [2 /*return*/, {
                                    upcoming: upcoming,
                                    inProgress: inProgress,
                                    completed: completed,
                                    noShow: noShow,
                                    stats: {
                                        total: bookings.length,
                                        upcomingCount: upcoming.length,
                                        inProgressCount: inProgress.length,
                                        completedCount: completed.length,
                                        noShowCount: noShow.length,
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Get queue stats for a shop (from Redis or DB)
         */
        QueueService_1.prototype.getQueueStats = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, dbStats;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.redis.getShopQueueStats(shopId)];
                        case 1:
                            cached = _b.sent();
                            if (cached)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, this.prisma.queueStats.findUnique({
                                    where: { shopId: shopId },
                                })];
                        case 2:
                            dbStats = _b.sent();
                            if (dbStats) {
                                return [2 /*return*/, {
                                        waitingCount: dbStats.currentWaitingCount,
                                        estimatedWaitMinutes: dbStats.estimatedWaitMinutes,
                                        nextSlot: ((_a = dbStats.nextAvailableSlot) === null || _a === void 0 ? void 0 : _a.toISOString()) || null,
                                    }];
                            }
                            return [2 /*return*/, { waitingCount: 0, estimatedWaitMinutes: 0, nextSlot: null }];
                    }
                });
            });
        };
        /**
         * Invalidate slot cache when bookings change
         */
        QueueService_1.prototype.invalidateSlotCache = function (shopId, date) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = date ? date.toISOString().split('T')[0] : undefined;
                            return [4 /*yield*/, this.redis.invalidateSlots(shopId, dateStr)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return QueueService_1;
    }());
    __setFunctionName(_classThis, "QueueService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QueueService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QueueService = _classThis;
}();
exports.QueueService = QueueService;
