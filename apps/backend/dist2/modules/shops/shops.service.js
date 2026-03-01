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
exports.ShopsService = void 0;
var common_1 = require("@nestjs/common");
var ShopsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ShopsService = _classThis = /** @class */ (function () {
        function ShopsService_1(prisma, redis) {
            this.prisma = prisma;
            this.redis = redis;
        }
        ShopsService_1.prototype.search = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var query, city, type, latitude, longitude, _a, radiusKm, _b, page, _c, limit, skip, where, latDelta, lngDelta, orderBy, _d, shops, total, shopsWithQueue, sortedShops;
                var _this = this;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            query = dto.query, city = dto.city, type = dto.type, latitude = dto.latitude, longitude = dto.longitude, _a = dto.radiusKm, radiusKm = _a === void 0 ? 10 : _a, _b = dto.page, page = _b === void 0 ? 1 : _b, _c = dto.limit, limit = _c === void 0 ? 20 : _c;
                            skip = (page - 1) * limit;
                            where = {
                                isActive: true,
                            };
                            // Text search
                            if (query) {
                                where.OR = [
                                    { name: { contains: query, mode: 'insensitive' } },
                                    { description: { contains: query, mode: 'insensitive' } },
                                    { address: { contains: query, mode: 'insensitive' } },
                                ];
                            }
                            // City filter
                            if (city) {
                                where.city = { equals: city, mode: 'insensitive' };
                            }
                            // Type filter (tenant type)
                            if (type) {
                                where.tenant = { type: type };
                            }
                            // If we have coordinates, apply bounding box filter for performance
                            if (latitude && longitude) {
                                latDelta = radiusKm / 111.32;
                                lngDelta = radiusKm / (111.32 * Math.cos(latitude * Math.PI / 180));
                                where.latitude = {
                                    gte: latitude - latDelta,
                                    lte: latitude + latDelta,
                                };
                                where.longitude = {
                                    gte: longitude - lngDelta,
                                    lte: longitude + lngDelta,
                                };
                            }
                            orderBy = { name: 'asc' };
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.shop.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: orderBy,
                                        include: {
                                            tenant: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    type: true,
                                                },
                                            },
                                            services: {
                                                where: { isActive: true },
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    durationMinutes: true,
                                                    price: true,
                                                },
                                                orderBy: { sortOrder: 'asc' },
                                                take: 5,
                                            },
                                            _count: {
                                                select: {
                                                    services: { where: { isActive: true } },
                                                    staff: { where: { isActive: true } },
                                                },
                                            },
                                        },
                                    }),
                                    this.prisma.shop.count({ where: where }),
                                ])];
                        case 1:
                            _d = _e.sent(), shops = _d[0], total = _d[1];
                            return [4 /*yield*/, Promise.all(shops.map(function (shop) { return __awaiter(_this, void 0, void 0, function () {
                                    var queueStats, distance;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.redis.getShopQueueStats(shop.id)];
                                            case 1:
                                                queueStats = _a.sent();
                                                distance = (latitude && longitude && shop.latitude && shop.longitude)
                                                    ? this.calculateDistance(latitude, longitude, Number(shop.latitude), Number(shop.longitude))
                                                    : undefined;
                                                return [2 /*return*/, __assign(__assign({}, shop), { distance: distance !== undefined ? Math.round(distance * 100) / 100 : undefined, queueStats: queueStats || {
                                                            waitingCount: 0,
                                                            estimatedWaitMinutes: 0,
                                                            nextSlot: null,
                                                        } })];
                                        }
                                    });
                                }); }))];
                        case 2:
                            shopsWithQueue = _e.sent();
                            sortedShops = shopsWithQueue;
                            if (latitude && longitude) {
                                sortedShops = shopsWithQueue
                                    .filter(function (shop) { return shop.distance === undefined || shop.distance <= radiusKm; })
                                    .sort(function (a, b) { var _a, _b; return ((_a = a.distance) !== null && _a !== void 0 ? _a : Infinity) - ((_b = b.distance) !== null && _b !== void 0 ? _b : Infinity); });
                            }
                            return [2 /*return*/, {
                                    data: sortedShops,
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
        ShopsService_1.prototype.findBySlug = function (slug) {
            return __awaiter(this, void 0, void 0, function () {
                var shop, queueStats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.shop.findUnique({
                                where: { slug: slug },
                                include: {
                                    tenant: {
                                        select: {
                                            id: true,
                                            name: true,
                                            type: true,
                                        },
                                    },
                                    services: {
                                        where: { isActive: true },
                                        orderBy: { sortOrder: 'asc' },
                                    },
                                    staff: {
                                        where: { isActive: true },
                                        select: {
                                            id: true,
                                            name: true,
                                            avatarUrl: true,
                                            role: true,
                                        },
                                    },
                                    workingHours: {
                                        orderBy: { dayOfWeek: 'asc' },
                                    },
                                },
                            })];
                        case 1:
                            shop = _a.sent();
                            if (!shop) {
                                throw new common_1.NotFoundException('Shop not found');
                            }
                            return [4 /*yield*/, this.redis.getShopQueueStats(shop.id)];
                        case 2:
                            queueStats = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, shop), { queueStats: queueStats || {
                                        waitingCount: 0,
                                        estimatedWaitMinutes: 0,
                                        nextSlot: null,
                                    } })];
                    }
                });
            });
        };
        ShopsService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var shop;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.shop.findUnique({
                                where: { id: id },
                                include: {
                                    tenant: true,
                                    services: {
                                        where: { isActive: true },
                                        orderBy: { sortOrder: 'asc' },
                                    },
                                    staff: {
                                        where: { isActive: true },
                                    },
                                    workingHours: true,
                                },
                            })];
                        case 1:
                            shop = _a.sent();
                            if (!shop) {
                                throw new common_1.NotFoundException('Shop not found');
                            }
                            return [2 /*return*/, shop];
                    }
                });
            });
        };
        ShopsService_1.prototype.getServices = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                var shop;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.shop.findUnique({
                                where: { id: shopId },
                            })];
                        case 1:
                            shop = _a.sent();
                            if (!shop) {
                                throw new common_1.NotFoundException('Shop not found');
                            }
                            return [2 /*return*/, this.prisma.service.findMany({
                                    where: {
                                        shopId: shopId,
                                        isActive: true,
                                    },
                                    orderBy: { sortOrder: 'asc' },
                                })];
                    }
                });
            });
        };
        ShopsService_1.prototype.getQueueStats = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, shop, now, todayStart, todayEnd, waitingBookings, nextBooking, avgDuration, estimatedWaitMinutes, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redis.getShopQueueStats(shopId)];
                        case 1:
                            cached = _a.sent();
                            if (cached) {
                                return [2 /*return*/, cached];
                            }
                            return [4 /*yield*/, this.prisma.shop.findUnique({
                                    where: { id: shopId },
                                })];
                        case 2:
                            shop = _a.sent();
                            if (!shop) {
                                throw new common_1.NotFoundException('Shop not found');
                            }
                            now = new Date();
                            todayStart = new Date(now);
                            todayStart.setHours(0, 0, 0, 0);
                            todayEnd = new Date(now);
                            todayEnd.setHours(23, 59, 59, 999);
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: {
                                        shopId: shopId,
                                        startTime: { gte: now },
                                        status: { in: ['PENDING', 'CONFIRMED'] },
                                    },
                                })];
                        case 3:
                            waitingBookings = _a.sent();
                            return [4 /*yield*/, this.prisma.booking.findFirst({
                                    where: {
                                        shopId: shopId,
                                        startTime: { gte: now },
                                        status: { in: ['PENDING', 'CONFIRMED'] },
                                    },
                                    orderBy: { startTime: 'asc' },
                                })];
                        case 4:
                            nextBooking = _a.sent();
                            return [4 /*yield*/, this.prisma.service.aggregate({
                                    where: { shopId: shopId, isActive: true },
                                    _avg: { durationMinutes: true },
                                })];
                        case 5:
                            avgDuration = _a.sent();
                            estimatedWaitMinutes = Math.round(waitingBookings * (avgDuration._avg.durationMinutes || 15) / shop.maxConcurrentBookings);
                            stats = {
                                waitingCount: waitingBookings,
                                estimatedWaitMinutes: estimatedWaitMinutes,
                                nextSlot: nextBooking === null || nextBooking === void 0 ? void 0 : nextBooking.startTime.toISOString(),
                            };
                            // Cache in Redis
                            return [4 /*yield*/, this.redis.updateShopQueueStats(shopId, stats)];
                        case 6:
                            // Cache in Redis
                            _a.sent();
                            return [2 /*return*/, stats];
                    }
                });
            });
        };
        ShopsService_1.prototype.getCities = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.shop.findMany({
                                where: { isActive: true },
                                select: { city: true },
                                distinct: ['city'],
                                orderBy: { city: 'asc' },
                            })];
                        case 1:
                            cities = _a.sent();
                            return [2 /*return*/, cities.map(function (c) { return c.city; })];
                    }
                });
            });
        };
        ShopsService_1.prototype.getNearbyShops = function (latitude_1, longitude_1) {
            return __awaiter(this, arguments, void 0, function (latitude, longitude, radiusKm) {
                var latDelta, lngDelta, shops, shopsWithDistance;
                var _this = this;
                if (radiusKm === void 0) { radiusKm = 10; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            latDelta = radiusKm / 111.32;
                            lngDelta = radiusKm / (111.32 * Math.cos(latitude * Math.PI / 180));
                            return [4 /*yield*/, this.prisma.shop.findMany({
                                    where: {
                                        isActive: true,
                                        latitude: {
                                            gte: latitude - latDelta,
                                            lte: latitude + latDelta,
                                        },
                                        longitude: {
                                            gte: longitude - lngDelta,
                                            lte: longitude + lngDelta,
                                        },
                                    },
                                    include: {
                                        tenant: {
                                            select: { type: true },
                                        },
                                        _count: {
                                            select: { services: { where: { isActive: true } } },
                                        },
                                    },
                                    take: 50,
                                })];
                        case 1:
                            shops = _a.sent();
                            shopsWithDistance = shops.map(function (shop) { return (__assign(__assign({}, shop), { distance: _this.calculateDistance(latitude, longitude, Number(shop.latitude), Number(shop.longitude)) })); });
                            return [2 /*return*/, shopsWithDistance
                                    .filter(function (shop) { return shop.distance <= radiusKm; })
                                    .sort(function (a, b) { return a.distance - b.distance; })];
                    }
                });
            });
        };
        ShopsService_1.prototype.calculateDistance = function (lat1, lng1, lat2, lng2) {
            var R = 6371; // Earth's radius in km
            var dLat = this.toRad(lat2 - lat1);
            var dLng = this.toRad(lng2 - lng1);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        ShopsService_1.prototype.toRad = function (deg) {
            return deg * (Math.PI / 180);
        };
        return ShopsService_1;
    }());
    __setFunctionName(_classThis, "ShopsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ShopsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ShopsService = _classThis;
}();
exports.ShopsService = ShopsService;
