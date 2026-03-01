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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var AnalyticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AnalyticsService = _classThis = /** @class */ (function () {
        function AnalyticsService_1(prisma) {
            this.prisma = prisma;
        }
        /**
         * Get shop analytics summary
         */
        AnalyticsService_1.prototype.getShopAnalytics = function (shopId, tenantId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var startDate, endDate, bookings, totalBookings, completedBookings, cancelledBookings, noShowBookings, completedWithPayment, totalRevenue, avgWaitMinutes, hourCounts, peakHour, dayCounts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            startDate = options.startDate, endDate = options.endDate;
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        shopId: shopId,
                                        startTime: { gte: startDate, lte: endDate },
                                    },
                                })];
                        case 2:
                            bookings = _a.sent();
                            totalBookings = bookings.length;
                            completedBookings = bookings.filter(function (b) { return b.status === client_1.BookingStatus.COMPLETED; }).length;
                            cancelledBookings = bookings.filter(function (b) { return b.status === client_1.BookingStatus.CANCELLED; }).length;
                            noShowBookings = bookings.filter(function (b) { return b.status === client_1.BookingStatus.NO_SHOW; }).length;
                            completedWithPayment = bookings.filter(function (b) { return b.status === client_1.BookingStatus.COMPLETED; });
                            totalRevenue = completedWithPayment.reduce(function (sum, b) { return sum + Number(b.totalAmount); }, 0);
                            avgWaitMinutes = completedBookings > 0
                                ? bookings
                                    .filter(function (b) { return b.status === client_1.BookingStatus.COMPLETED && b.startedAt; })
                                    .reduce(function (sum, b) {
                                    var wait = (b.startedAt.getTime() - b.createdAt.getTime()) / 60000;
                                    return sum + wait;
                                }, 0) / completedBookings
                                : 0;
                            hourCounts = {};
                            bookings.forEach(function (b) {
                                var hour = b.startTime.getHours();
                                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                            });
                            peakHour = Object.entries(hourCounts).sort(function (a, b) { return b[1] - a[1]; })[0];
                            dayCounts = {};
                            bookings.forEach(function (b) {
                                var day = b.startTime.getDay();
                                dayCounts[day] = (dayCounts[day] || 0) + 1;
                            });
                            return [2 /*return*/, {
                                    period: {
                                        startDate: startDate.toISOString(),
                                        endDate: endDate.toISOString(),
                                    },
                                    summary: {
                                        totalBookings: totalBookings,
                                        completedBookings: completedBookings,
                                        cancelledBookings: cancelledBookings,
                                        noShowBookings: noShowBookings,
                                        completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
                                        noShowRate: totalBookings > 0 ? (noShowBookings / totalBookings) * 100 : 0,
                                    },
                                    revenue: {
                                        total: totalRevenue,
                                        average: completedBookings > 0 ? totalRevenue / completedBookings : 0,
                                    },
                                    performance: {
                                        averageWaitMinutes: Math.round(avgWaitMinutes),
                                        peakHour: peakHour ? parseInt(peakHour[0]) : null,
                                        peakHourBookings: peakHour ? peakHour[1] : 0,
                                    },
                                    byDayOfWeek: Object.entries(dayCounts).map(function (_a) {
                                        var day = _a[0], count = _a[1];
                                        return ({
                                            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseInt(day)],
                                            count: count,
                                        });
                                    }),
                                }];
                    }
                });
            });
        };
        /**
         * Get daily analytics for a date range
         */
        AnalyticsService_1.prototype.getDailyAnalytics = function (shopId, tenantId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var preAggregated, bookings, byDate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.dailyAnalytics.findMany({
                                    where: {
                                        shopId: shopId,
                                        date: { gte: options.startDate, lte: options.endDate },
                                    },
                                    orderBy: { date: 'asc' },
                                })];
                        case 2:
                            preAggregated = _a.sent();
                            if (preAggregated.length > 0) {
                                return [2 /*return*/, preAggregated];
                            }
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        shopId: shopId,
                                        startTime: { gte: options.startDate, lte: options.endDate },
                                    },
                                })];
                        case 3:
                            bookings = _a.sent();
                            byDate = {};
                            bookings.forEach(function (b) {
                                var date = b.startTime.toISOString().split('T')[0];
                                if (!byDate[date])
                                    byDate[date] = [];
                                byDate[date].push(b);
                            });
                            return [2 /*return*/, Object.entries(byDate).map(function (_a) {
                                    var date = _a[0], dayBookings = _a[1];
                                    return ({
                                        date: date,
                                        totalBookings: dayBookings.length,
                                        completedBookings: dayBookings.filter(function (b) { return b.status === client_1.BookingStatus.COMPLETED; }).length,
                                        cancelledBookings: dayBookings.filter(function (b) { return b.status === client_1.BookingStatus.CANCELLED; }).length,
                                        noShowBookings: dayBookings.filter(function (b) { return b.status === client_1.BookingStatus.NO_SHOW; }).length,
                                        totalRevenue: dayBookings
                                            .filter(function (b) { return b.status === client_1.BookingStatus.COMPLETED; })
                                            .reduce(function (sum, b) { return sum + Number(b.totalAmount); }, 0),
                                    });
                                })];
                    }
                });
            });
        };
        /**
         * Get service popularity
         */
        AnalyticsService_1.prototype.getServiceAnalytics = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceStats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.bookingService.groupBy({
                                    by: ['serviceId', 'serviceName'],
                                    where: {
                                        booking: {
                                            shopId: shopId,
                                            status: client_1.BookingStatus.COMPLETED,
                                        },
                                    },
                                    _count: true,
                                    _sum: {
                                        price: true,
                                    },
                                })];
                        case 2:
                            serviceStats = _a.sent();
                            return [2 /*return*/, serviceStats
                                    .map(function (s) { return ({
                                    serviceId: s.serviceId,
                                    serviceName: s.serviceName,
                                    bookingCount: s._count,
                                    revenue: s._sum.price || 0,
                                }); })
                                    .sort(function (a, b) { return b.bookingCount - a.bookingCount; })];
                    }
                });
            });
        };
        /**
         * Aggregate daily analytics (run by background job)
         */
        AnalyticsService_1.prototype.aggregateDailyAnalytics = function (shopId, date) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStart, dateEnd, bookings, analytics, completedWithTimes, avgWait, hourCounts, peakHour;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStart = new Date(date);
                            dateStart.setHours(0, 0, 0, 0);
                            dateEnd = new Date(date);
                            dateEnd.setHours(23, 59, 59, 999);
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        shopId: shopId,
                                        startTime: { gte: dateStart, lte: dateEnd },
                                    },
                                })];
                        case 1:
                            bookings = _a.sent();
                            analytics = {
                                totalBookings: bookings.length,
                                completedBookings: bookings.filter(function (b) { return b.status === client_1.BookingStatus.COMPLETED; }).length,
                                cancelledBookings: bookings.filter(function (b) { return b.status === client_1.BookingStatus.CANCELLED; }).length,
                                noShowBookings: bookings.filter(function (b) { return b.status === client_1.BookingStatus.NO_SHOW; }).length,
                                walkInBookings: bookings.filter(function (b) { return b.source === 'WALK_IN'; }).length,
                                totalRevenue: bookings
                                    .filter(function (b) { return b.status === client_1.BookingStatus.COMPLETED; })
                                    .reduce(function (sum, b) { return sum + Number(b.totalAmount); }, 0),
                            };
                            completedWithTimes = bookings.filter(function (b) { return b.status === client_1.BookingStatus.COMPLETED && b.startedAt; });
                            avgWait = completedWithTimes.length > 0
                                ? completedWithTimes.reduce(function (sum, b) {
                                    return sum + (b.startedAt.getTime() - b.createdAt.getTime()) / 60000;
                                }, 0) / completedWithTimes.length
                                : 0;
                            hourCounts = {};
                            bookings.forEach(function (b) {
                                var hour = b.startTime.getHours();
                                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                            });
                            peakHour = Object.entries(hourCounts).sort(function (a, b) { return b[1] - a[1]; })[0];
                            return [4 /*yield*/, this.prisma.dailyAnalytics.upsert({
                                    where: {
                                        shopId_date: { shopId: shopId, date: dateStart },
                                    },
                                    update: __assign(__assign({}, analytics), { averageWaitMinutes: avgWait, peakHour: peakHour ? parseInt(peakHour[0]) : null }),
                                    create: __assign(__assign({ shopId: shopId, date: dateStart }, analytics), { averageWaitMinutes: avgWait, peakHour: peakHour ? parseInt(peakHour[0]) : null }),
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.verifyShopAccess = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                var shop;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.shop.findFirst({
                                where: { id: shopId, tenantId: tenantId },
                            })];
                        case 1:
                            shop = _a.sent();
                            if (!shop) {
                                throw new common_1.ForbiddenException('Not authorized to access this shop');
                            }
                            return [2 /*return*/, shop];
                    }
                });
            });
        };
        return AnalyticsService_1;
    }());
    __setFunctionName(_classThis, "AnalyticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsService = _classThis;
}();
exports.AnalyticsService = AnalyticsService;
