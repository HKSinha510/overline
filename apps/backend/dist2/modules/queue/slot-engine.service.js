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
exports.SlotEngineService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var SlotEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SlotEngineService = _classThis = /** @class */ (function () {
        function SlotEngineService_1(prisma, redis) {
            this.prisma = prisma;
            this.redis = redis;
            this.SLOT_INTERVAL_MINUTES = 15; // Slot granularity
        }
        /**
         * Calculate available time slots for given services on a date
         */
        SlotEngineService_1.prototype.getAvailableSlots = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var shopId, date, serviceIds, duration, staffId, cacheKey, cached, shop, totalDuration, services, dayOfWeek, workingHour, specialSchedule, openTime, closeTime, breakWindows, dateStart, dateEnd, existingBookings, slots;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            shopId = query.shopId, date = query.date, serviceIds = query.serviceIds, duration = query.duration, staffId = query.staffId;
                            cacheKey = "".concat(shopId, ":").concat(date, ":").concat(serviceIds.sort().join(','), ":").concat(staffId || 'any');
                            return [4 /*yield*/, this.redis.getCachedSlots(cacheKey, date)];
                        case 1:
                            cached = _a.sent();
                            if (cached) {
                                return [2 /*return*/, JSON.parse(cached)];
                            }
                            return [4 /*yield*/, this.prisma.shop.findUnique({
                                    where: { id: shopId },
                                    include: {
                                        workingHours: true,
                                        specialSchedules: {
                                            where: {
                                                date: new Date(date),
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            shop = _a.sent();
                            if (!shop) {
                                throw new common_1.NotFoundException('Shop not found');
                            }
                            totalDuration = duration || 30;
                            if (!(serviceIds.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.service.findMany({
                                    where: {
                                        id: { in: serviceIds },
                                        shopId: shopId,
                                        isActive: true,
                                    },
                                })];
                        case 3:
                            services = _a.sent();
                            if (services.length !== serviceIds.length) {
                                throw new common_1.NotFoundException('One or more services not found');
                            }
                            totalDuration = services.reduce(function (sum, s) { return sum + s.durationMinutes; }, 0);
                            _a.label = 4;
                        case 4:
                            dayOfWeek = this.getDayOfWeek(new Date(date));
                            workingHour = shop.workingHours.find(function (wh) { return wh.dayOfWeek === dayOfWeek; });
                            specialSchedule = shop.specialSchedules[0];
                            // Check if closed
                            if ((specialSchedule === null || specialSchedule === void 0 ? void 0 : specialSchedule.isClosed) || (workingHour === null || workingHour === void 0 ? void 0 : workingHour.isClosed) || !workingHour) {
                                return [2 /*return*/, []];
                            }
                            openTime = (specialSchedule === null || specialSchedule === void 0 ? void 0 : specialSchedule.openTime) || workingHour.openTime;
                            closeTime = (specialSchedule === null || specialSchedule === void 0 ? void 0 : specialSchedule.closeTime) || workingHour.closeTime;
                            breakWindows = workingHour.breakWindows || [];
                            dateStart = new Date("".concat(date, "T00:00:00"));
                            dateEnd = new Date("".concat(date, "T23:59:59"));
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: __assign({ shopId: shopId, startTime: { gte: dateStart, lte: dateEnd }, status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } }, (staffId ? { staffId: staffId } : {})),
                                    select: {
                                        startTime: true,
                                        endTime: true,
                                        staffId: true,
                                    },
                                })];
                        case 5:
                            existingBookings = _a.sent();
                            slots = this.generateSlots(date, openTime, closeTime, breakWindows, totalDuration, existingBookings, shop.maxConcurrentBookings);
                            // Cache the result for 5 minutes
                            return [4 /*yield*/, this.redis.cacheSlots(cacheKey, date, JSON.stringify(slots))];
                        case 6:
                            // Cache the result for 5 minutes
                            _a.sent();
                            return [2 /*return*/, slots];
                    }
                });
            });
        };
        /**
         * Generate time slots for a day
         */
        SlotEngineService_1.prototype.generateSlots = function (date, openTime, closeTime, breakWindows, serviceDuration, existingBookings, maxConcurrent) {
            var slots = [];
            var _a = openTime.split(':').map(Number), openHour = _a[0], openMin = _a[1];
            var _b = closeTime.split(':').map(Number), closeHour = _b[0], closeMin = _b[1];
            var startMinutes = openHour * 60 + openMin;
            var endMinutes = closeHour * 60 + closeMin;
            var now = new Date();
            var isToday = date === now.toISOString().split('T')[0];
            var currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;
            var _loop_1 = function (minutes) {
                // Skip past slots for today
                if (isToday && minutes < currentMinutes + 30) {
                    return "continue";
                }
                var slotStart = this_1.minutesToDateTime(date, minutes);
                var slotEnd = this_1.minutesToDateTime(date, minutes + serviceDuration);
                // Check if slot is during break
                var isDuringBreak = breakWindows.some(function (brk) {
                    var _a = brk.start.split(':').map(Number), brkStartH = _a[0], brkStartM = _a[1];
                    var _b = brk.end.split(':').map(Number), brkEndH = _b[0], brkEndM = _b[1];
                    var brkStart = brkStartH * 60 + brkStartM;
                    var brkEnd = brkEndH * 60 + brkEndM;
                    return minutes < brkEnd && minutes + serviceDuration > brkStart;
                });
                if (isDuringBreak) {
                    return "continue";
                }
                // Check availability (count concurrent bookings at this time)
                var concurrentBookings = existingBookings.filter(function (booking) {
                    var bookingStart = booking.startTime.getTime();
                    var bookingEnd = booking.endTime.getTime();
                    var slotStartTime = new Date(slotStart).getTime();
                    var slotEndTime = new Date(slotEnd).getTime();
                    // Check for overlap
                    return slotStartTime < bookingEnd && slotEndTime > bookingStart;
                });
                var available = concurrentBookings.length < maxConcurrent;
                slots.push({
                    startTime: slotStart,
                    endTime: slotEnd,
                    available: available,
                });
            };
            var this_1 = this;
            // Generate slots at regular intervals
            for (var minutes = startMinutes; minutes + serviceDuration <= endMinutes; minutes += this.SLOT_INTERVAL_MINUTES) {
                _loop_1(minutes);
            }
            return slots;
        };
        /**
         * Get next available slot for a shop
         */
        SlotEngineService_1.prototype.getNextAvailableSlot = function (shopId, serviceIds) {
            return __awaiter(this, void 0, void 0, function () {
                var today, i, date, dateStr, slots, availableSlot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            today = new Date();
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < 7)) return [3 /*break*/, 4];
                            date = new Date(today);
                            date.setDate(date.getDate() + i);
                            dateStr = date.toISOString().split('T')[0];
                            return [4 /*yield*/, this.getAvailableSlots({
                                    shopId: shopId,
                                    date: dateStr,
                                    serviceIds: serviceIds,
                                })];
                        case 2:
                            slots = _a.sent();
                            availableSlot = slots.find(function (s) { return s.available; });
                            if (availableSlot) {
                                return [2 /*return*/, availableSlot];
                            }
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, null];
                    }
                });
            });
        };
        /**
         * Check if a specific slot is available
         */
        SlotEngineService_1.prototype.isSlotAvailable = function (shopId, startTime, endTime, staffId, excludeBookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var shop, whereClause, conflictingBookings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.shop.findUnique({
                                where: { id: shopId },
                            })];
                        case 1:
                            shop = _a.sent();
                            if (!shop) {
                                return [2 /*return*/, false];
                            }
                            whereClause = {
                                shopId: shopId,
                                status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
                                OR: [
                                    {
                                        AND: [
                                            { startTime: { lte: startTime } },
                                            { endTime: { gt: startTime } },
                                        ],
                                    },
                                    {
                                        AND: [
                                            { startTime: { lt: endTime } },
                                            { endTime: { gte: endTime } },
                                        ],
                                    },
                                    {
                                        AND: [
                                            { startTime: { gte: startTime } },
                                            { endTime: { lte: endTime } },
                                        ],
                                    },
                                ],
                            };
                            if (excludeBookingId) {
                                whereClause.id = { not: excludeBookingId };
                            }
                            if (staffId) {
                                whereClause.staffId = staffId;
                            }
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: whereClause,
                                })];
                        case 2:
                            conflictingBookings = _a.sent();
                            // If staff-specific, only one booking allowed
                            if (staffId) {
                                return [2 /*return*/, conflictingBookings === 0];
                            }
                            // Otherwise, check against max concurrent
                            return [2 /*return*/, conflictingBookings < shop.maxConcurrentBookings];
                    }
                });
            });
        };
        /**
         * Calculate estimated wait time for a shop
         */
        SlotEngineService_1.prototype.calculateWaitTime = function (shopId) {
            return __awaiter(this, void 0, void 0, function () {
                var shop, now, activeBookings, totalMinutes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.shop.findUnique({
                                where: { id: shopId },
                            })];
                        case 1:
                            shop = _a.sent();
                            if (!shop) {
                                return [2 /*return*/, 0];
                            }
                            now = new Date();
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        shopId: shopId,
                                        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
                                        startTime: { lte: new Date(now.getTime() + 4 * 60 * 60 * 1000) }, // Next 4 hours
                                    },
                                    orderBy: { startTime: 'asc' },
                                })];
                        case 2:
                            activeBookings = _a.sent();
                            if (activeBookings.length === 0) {
                                return [2 /*return*/, 0];
                            }
                            totalMinutes = activeBookings.reduce(function (sum, b) { return sum + b.totalDurationMinutes; }, 0);
                            return [2 /*return*/, Math.ceil(totalMinutes / shop.maxConcurrentBookings)];
                    }
                });
            });
        };
        SlotEngineService_1.prototype.getDayOfWeek = function (date) {
            var days = [
                client_1.DayOfWeek.SUNDAY,
                client_1.DayOfWeek.MONDAY,
                client_1.DayOfWeek.TUESDAY,
                client_1.DayOfWeek.WEDNESDAY,
                client_1.DayOfWeek.THURSDAY,
                client_1.DayOfWeek.FRIDAY,
                client_1.DayOfWeek.SATURDAY,
            ];
            return days[date.getDay()];
        };
        SlotEngineService_1.prototype.minutesToDateTime = function (date, minutes) {
            var hours = Math.floor(minutes / 60);
            var mins = minutes % 60;
            return "".concat(date, "T").concat(hours.toString().padStart(2, '0'), ":").concat(mins.toString().padStart(2, '0'), ":00");
        };
        return SlotEngineService_1;
    }());
    __setFunctionName(_classThis, "SlotEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SlotEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SlotEngineService = _classThis;
}();
exports.SlotEngineService = SlotEngineService;
