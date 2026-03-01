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
exports.AdminService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var AdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminService = _classThis = /** @class */ (function () {
        function AdminService_1(prisma, queueService, bookingsService) {
            this.prisma = prisma;
            this.queueService = queueService;
            this.bookingsService = bookingsService;
        }
        /**
         * Get dashboard data for a shop
         */
        AdminService_1.prototype.getDashboard = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                var today, startOfDay, endOfDay, todayQueue, startOfWeek, weeklyStats, todayRevenue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            today = new Date();
                            startOfDay = new Date(today);
                            startOfDay.setHours(0, 0, 0, 0);
                            endOfDay = new Date(today);
                            endOfDay.setHours(23, 59, 59, 999);
                            return [4 /*yield*/, this.queueService.getTodayQueue(shopId)];
                        case 2:
                            todayQueue = _a.sent();
                            startOfWeek = new Date(today);
                            startOfWeek.setDate(today.getDate() - today.getDay());
                            startOfWeek.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, this.prisma.booking.groupBy({
                                    by: ['status'],
                                    where: {
                                        shopId: shopId,
                                        startTime: { gte: startOfWeek },
                                    },
                                    _count: true,
                                })];
                        case 3:
                            weeklyStats = _a.sent();
                            return [4 /*yield*/, this.prisma.booking.aggregate({
                                    where: {
                                        shopId: shopId,
                                        status: client_1.BookingStatus.COMPLETED,
                                        completedAt: { gte: startOfDay, lte: endOfDay },
                                    },
                                    _sum: { totalAmount: true },
                                })];
                        case 4:
                            todayRevenue = _a.sent();
                            return [2 /*return*/, {
                                    queue: todayQueue,
                                    todayStats: {
                                        total: todayQueue.stats.total,
                                        completed: todayQueue.stats.completedCount,
                                        upcoming: todayQueue.stats.upcomingCount,
                                        inProgress: todayQueue.stats.inProgressCount,
                                        noShow: todayQueue.stats.noShowCount,
                                        revenue: todayRevenue._sum.totalAmount || 0,
                                    },
                                    weeklyStats: weeklyStats.reduce(function (acc, stat) {
                                        acc[stat.status] = stat._count;
                                        return acc;
                                    }, {}),
                                }];
                    }
                });
            });
        };
        /**
         * Get all bookings for a shop with filters
         */
        AdminService_1.prototype.getBookings = function (shopId, tenantId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var date, status, _a, page, _b, limit, skip, where, dateStart, dateEnd, _c, bookings, total;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _d.sent();
                            date = options.date, status = options.status, _a = options.page, page = _a === void 0 ? 1 : _a, _b = options.limit, limit = _b === void 0 ? 50 : _b;
                            skip = (page - 1) * limit;
                            where = { shopId: shopId };
                            if (date) {
                                dateStart = new Date("".concat(date, "T00:00:00"));
                                dateEnd = new Date("".concat(date, "T23:59:59"));
                                where.startTime = { gte: dateStart, lte: dateEnd };
                            }
                            if (status) {
                                where.status = status;
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.booking.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { startTime: 'asc' },
                                        include: {
                                            user: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    phone: true,
                                                    email: true,
                                                },
                                            },
                                            services: true,
                                            staff: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                },
                                            },
                                            payment: true,
                                        },
                                    }),
                                    this.prisma.booking.count({ where: where }),
                                ])];
                        case 2:
                            _c = _d.sent(), bookings = _c[0], total = _c[1];
                            return [2 /*return*/, {
                                    data: bookings,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Update booking status (admin)
         */
        AdminService_1.prototype.updateBookingStatus = function (bookingId, status, tenantId, adminNotes) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, updateData, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: { shop: true },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            if (booking.shop.tenantId !== tenantId) {
                                throw new common_1.ForbiddenException('Not authorized');
                            }
                            updateData = { status: status };
                            if (adminNotes) {
                                updateData.adminNotes = adminNotes;
                            }
                            switch (status) {
                                case client_1.BookingStatus.CONFIRMED:
                                    break;
                                case client_1.BookingStatus.IN_PROGRESS:
                                    updateData.arrivedAt = new Date();
                                    updateData.startedAt = new Date();
                                    break;
                                case client_1.BookingStatus.COMPLETED:
                                    updateData.completedAt = new Date();
                                    break;
                                case client_1.BookingStatus.NO_SHOW:
                                    break;
                                case client_1.BookingStatus.CANCELLED:
                                case client_1.BookingStatus.REJECTED:
                                    updateData.cancelledAt = new Date();
                                    break;
                            }
                            return [4 /*yield*/, this.prisma.booking.update({
                                    where: { id: bookingId },
                                    data: updateData,
                                    include: {
                                        services: true,
                                        user: {
                                            select: { name: true, phone: true },
                                        },
                                    },
                                })];
                        case 2:
                            updated = _a.sent();
                            // Update queue stats
                            this.queueService.updateQueueStats(booking.shopId).catch(console.error);
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        /**
         * Create a walk-in booking
         */
        AdminService_1.prototype.createWalkIn = function (shopId, dto, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.bookingsService.create({
                                    shopId: shopId,
                                    serviceIds: dto.serviceIds,
                                    startTime: dto.startTime || new Date().toISOString(),
                                    customerName: dto.customerName,
                                    customerPhone: dto.customerPhone,
                                    notes: dto.notes,
                                    source: client_1.BookingSource.WALK_IN,
                                }, undefined)];
                    }
                });
            });
        };
        /**
         * Get shop staff
         */
        AdminService_1.prototype.getStaff = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.prisma.staff.findMany({
                                    where: { shopId: shopId },
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                email: true,
                                            },
                                        },
                                        staffServices: {
                                            include: {
                                                service: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                })];
                    }
                });
            });
        };
        /**
         * Update working hours
         */
        AdminService_1.prototype.updateWorkingHours = function (shopId, dayOfWeek, dto, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.prisma.workingHours.upsert({
                                    where: {
                                        shopId_dayOfWeek: { shopId: shopId, dayOfWeek: dayOfWeek },
                                    },
                                    update: {
                                        openTime: dto.openTime,
                                        closeTime: dto.closeTime,
                                        isClosed: dto.isClosed,
                                        breakWindows: dto.breakWindows || [],
                                    },
                                    create: {
                                        shopId: shopId,
                                        dayOfWeek: dayOfWeek,
                                        openTime: dto.openTime || '09:00',
                                        closeTime: dto.closeTime || '18:00',
                                        isClosed: dto.isClosed || false,
                                        breakWindows: dto.breakWindows || [],
                                    },
                                })];
                    }
                });
            });
        };
        /**
         * Get working hours for a shop
         */
        AdminService_1.prototype.getWorkingHours = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.prisma.workingHours.findMany({
                                    where: { shopId: shopId },
                                    orderBy: { dayOfWeek: 'asc' },
                                })];
                    }
                });
            });
        };
        /**
         * Get shop settings
         */
        AdminService_1.prototype.getShopSettings = function (shopId, tenantId) {
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
                                throw new common_1.ForbiddenException('Not authorized');
                            }
                            return [2 /*return*/, {
                                    id: shop.id,
                                    name: shop.name,
                                    maxConcurrentBookings: shop.maxConcurrentBookings,
                                    autoAcceptBookings: shop.autoAcceptBookings,
                                    settings: shop.settings,
                                }];
                    }
                });
            });
        };
        /**
         * Update shop settings
         */
        AdminService_1.prototype.updateShopSettings = function (shopId, tenantId, settings) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyShopAccess(shopId, tenantId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.prisma.shop.update({
                                    where: { id: shopId },
                                    data: settings,
                                })];
                    }
                });
            });
        };
        /**
         * Get shops accessible by the current user
         */
        AdminService_1.prototype.getMyShops = function (userId, tenantId, role) {
            return __awaiter(this, void 0, void 0, function () {
                var staffRecords;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // SUPER_ADMIN can see all shops
                            if (role === 'SUPER_ADMIN') {
                                return [2 /*return*/, this.prisma.shop.findMany({
                                        where: { isActive: true },
                                        select: {
                                            id: true,
                                            name: true,
                                            slug: true,
                                            address: true,
                                            city: true,
                                            logoUrl: true,
                                            tenantId: true,
                                        },
                                        orderBy: { name: 'asc' },
                                    })];
                            }
                            if (!(role === 'STAFF')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.staff.findMany({
                                    where: { userId: userId, isActive: true },
                                    include: {
                                        shop: {
                                            select: {
                                                id: true,
                                                name: true,
                                                slug: true,
                                                address: true,
                                                city: true,
                                                logoUrl: true,
                                                tenantId: true,
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            staffRecords = _a.sent();
                            return [2 /*return*/, staffRecords.map(function (s) { return s.shop; })];
                        case 2:
                            // OWNER: find shops under their tenant
                            if (!tenantId)
                                return [2 /*return*/, []];
                            return [2 /*return*/, this.prisma.shop.findMany({
                                    where: { tenantId: tenantId, isActive: true },
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                        address: true,
                                        city: true,
                                        logoUrl: true,
                                        tenantId: true,
                                    },
                                    orderBy: { name: 'asc' },
                                })];
                    }
                });
            });
        };
        AdminService_1.prototype.verifyShopAccess = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                var shop_1, shop;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!tenantId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.shop.findFirst({
                                    where: { id: shopId },
                                })];
                        case 1:
                            shop_1 = _a.sent();
                            if (!shop_1) {
                                throw new common_1.ForbiddenException('Shop not found');
                            }
                            return [2 /*return*/, shop_1];
                        case 2: return [4 /*yield*/, this.prisma.shop.findFirst({
                                where: { id: shopId, tenantId: tenantId },
                            })];
                        case 3:
                            shop = _a.sent();
                            if (!shop) {
                                throw new common_1.ForbiddenException('Not authorized to access this shop');
                            }
                            return [2 /*return*/, shop];
                    }
                });
            });
        };
        return AdminService_1;
    }());
    __setFunctionName(_classThis, "AdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
}();
exports.AdminService = AdminService;
