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
exports.BookingsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var uuid_1 = require("uuid");
var BookingsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BookingsService = _classThis = /** @class */ (function () {
        function BookingsService_1(prisma, redis, queueService, queueGateway, slotEngine, notificationsService) {
            this.prisma = prisma;
            this.redis = redis;
            this.queueService = queueService;
            this.queueGateway = queueGateway;
            this.slotEngine = slotEngine;
            this.notificationsService = notificationsService;
        }
        /**
         * Create a new booking
         */
        BookingsService_1.prototype.create = function (dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var shopId, serviceIds, startTime, staffId, customerName, customerPhone, customerEmail, notes, _a, source, offerCode, shop, services, totalDuration, totalAmount, currency, bookingStartTime, bookingEndTime, booking;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            shopId = dto.shopId, serviceIds = dto.serviceIds, startTime = dto.startTime, staffId = dto.staffId, customerName = dto.customerName, customerPhone = dto.customerPhone, customerEmail = dto.customerEmail, notes = dto.notes, _a = dto.source, source = _a === void 0 ? client_1.BookingSource.WEB : _a, offerCode = dto.offerCode;
                            return [4 /*yield*/, this.prisma.shop.findUnique({
                                    where: { id: shopId },
                                })];
                        case 1:
                            shop = _c.sent();
                            if (!shop) {
                                throw new common_1.NotFoundException('Shop not found');
                            }
                            return [4 /*yield*/, this.prisma.service.findMany({
                                    where: {
                                        id: { in: serviceIds },
                                        shopId: shopId,
                                        isActive: true,
                                    },
                                })];
                        case 2:
                            services = _c.sent();
                            if (services.length !== serviceIds.length) {
                                throw new common_1.NotFoundException('One or more services not found or inactive');
                            }
                            totalDuration = services.reduce(function (sum, s) { return sum + s.durationMinutes; }, 0);
                            totalAmount = services.reduce(function (sum, s) { return sum + Number(s.price); }, 0);
                            currency = ((_b = services[0]) === null || _b === void 0 ? void 0 : _b.currency) || 'INR';
                            // Apply offer code discount
                            if (offerCode) {
                                if (offerCode.toUpperCase() === 'OVERLINE10') {
                                    totalAmount = totalAmount * 0.9;
                                }
                                else if (offerCode.toUpperCase() === 'OVERLINE20') {
                                    totalAmount = totalAmount * 0.8;
                                }
                                else if (offerCode.toUpperCase() === 'WELCOME50') {
                                    totalAmount = Math.max(0, totalAmount - 50);
                                }
                            }
                            bookingStartTime = new Date(startTime);
                            bookingEndTime = new Date(bookingStartTime.getTime() + totalDuration * 60 * 1000);
                            // Validate slot is in the future
                            if (bookingStartTime <= new Date()) {
                                throw new common_1.BadRequestException('Cannot book a slot in the past');
                            }
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var isAvailable, bookingNumber, status, queuePosition, newBooking;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.slotEngine.isSlotAvailable(shopId, bookingStartTime, bookingEndTime, staffId)];
                                            case 1:
                                                isAvailable = _a.sent();
                                                if (!isAvailable) {
                                                    throw new common_1.ConflictException('Selected time slot is no longer available');
                                                }
                                                bookingNumber = this.generateBookingNumber();
                                                status = shop.autoAcceptBookings ? client_1.BookingStatus.CONFIRMED : client_1.BookingStatus.PENDING;
                                                return [4 /*yield*/, this.queueService.getQueuePosition(shopId)];
                                            case 2:
                                                queuePosition = _a.sent();
                                                return [4 /*yield*/, tx.booking.create({
                                                        data: {
                                                            bookingNumber: bookingNumber,
                                                            userId: userId,
                                                            shopId: shopId,
                                                            staffId: staffId,
                                                            startTime: bookingStartTime,
                                                            endTime: bookingEndTime,
                                                            totalDurationMinutes: totalDuration,
                                                            totalAmount: totalAmount,
                                                            currency: currency,
                                                            status: status,
                                                            source: source,
                                                            customerName: userId ? undefined : customerName,
                                                            customerPhone: userId ? undefined : customerPhone,
                                                            customerEmail: userId ? undefined : customerEmail,
                                                            notes: notes,
                                                            queuePosition: queuePosition + 1,
                                                            services: {
                                                                create: services.map(function (service) { return ({
                                                                    serviceId: service.id,
                                                                    serviceName: service.name,
                                                                    durationMinutes: service.durationMinutes,
                                                                    price: service.price,
                                                                }); }),
                                                            },
                                                        },
                                                        include: {
                                                            services: true,
                                                            shop: {
                                                                select: {
                                                                    name: true,
                                                                    address: true,
                                                                    phone: true,
                                                                },
                                                            },
                                                            user: {
                                                                select: {
                                                                    name: true,
                                                                    email: true,
                                                                    phone: true,
                                                                },
                                                            },
                                                        },
                                                    })];
                                            case 3:
                                                newBooking = _a.sent();
                                                return [2 /*return*/, newBooking];
                                        }
                                    });
                                }); })];
                        case 3:
                            booking = _c.sent();
                            // Update queue stats asynchronously
                            this.queueService.updateQueueStats(shopId).catch(console.error);
                            // Invalidate slot cache
                            this.queueService.invalidateSlotCache(shopId, bookingStartTime).catch(console.error);
                            // Emit real-time queue update
                            this.queueGateway.emitQueueUpdate(shopId).catch(console.error);
                            // Send booking confirmation notification to customer
                            this.notificationsService.sendBookingConfirmation(booking.id).catch(console.error);
                            // Send in-app notification to shop owner/admin
                            this.sendAdminBookingNotification(booking, shop).catch(console.error);
                            return [2 /*return*/, booking];
                    }
                });
            });
        };
        /**
         * Send notification to shop admin about new booking
         */
        BookingsService_1.prototype.sendAdminBookingNotification = function (booking, shop) {
            return __awaiter(this, void 0, void 0, function () {
                var adminUsers, customerName, serviceNames, startTime, timeStr, _i, adminUsers_1, admin;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findMany({
                                where: {
                                    tenantId: shop.tenantId,
                                    role: { in: ['ADMIN', 'OWNER', 'SUPER_ADMIN'] },
                                    isActive: true,
                                },
                                select: { id: true },
                            })];
                        case 1:
                            adminUsers = _c.sent();
                            customerName = ((_a = booking.user) === null || _a === void 0 ? void 0 : _a.name) || booking.customerName || 'Guest';
                            serviceNames = ((_b = booking.services) === null || _b === void 0 ? void 0 : _b.map(function (s) { return s.serviceName; }).join(', ')) || 'Service';
                            startTime = new Date(booking.startTime);
                            timeStr = startTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                            _i = 0, adminUsers_1 = adminUsers;
                            _c.label = 2;
                        case 2:
                            if (!(_i < adminUsers_1.length)) return [3 /*break*/, 5];
                            admin = adminUsers_1[_i];
                            return [4 /*yield*/, this.notificationsService.send({
                                    userId: admin.id,
                                    bookingId: booking.id,
                                    type: client_1.NotificationType.BOOKING_CONFIRMED,
                                    title: "New Booking from ".concat(customerName),
                                    body: "".concat(customerName, " booked ").concat(serviceNames, " at ").concat(timeStr, ". Booking #").concat(booking.bookingNumber),
                                    data: {
                                        bookingNumber: booking.bookingNumber,
                                        customerName: customerName,
                                        services: serviceNames,
                                        time: timeStr,
                                    },
                                    channels: [client_1.NotificationChannel.EMAIL],
                                })];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get booking by ID
         */
        BookingsService_1.prototype.findById = function (bookingId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, queuePosition;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: {
                                    services: {
                                        include: {
                                            service: true,
                                        },
                                    },
                                    shop: {
                                        select: {
                                            id: true,
                                            name: true,
                                            address: true,
                                            phone: true,
                                            email: true,
                                        },
                                    },
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                            phone: true,
                                        },
                                    },
                                    staff: {
                                        select: {
                                            id: true,
                                            name: true,
                                        },
                                    },
                                    payment: true,
                                },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            // If userId provided, verify ownership (unless admin)
                            if (userId && booking.userId !== userId) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            return [4 /*yield*/, this.queueService.getQueuePosition(bookingId)];
                        case 2:
                            queuePosition = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, booking), { currentQueuePosition: queuePosition })];
                    }
                });
            });
        };
        /**
         * Get booking by booking number
         */
        BookingsService_1.prototype.findByBookingNumber = function (bookingNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var booking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { bookingNumber: bookingNumber },
                                include: {
                                    services: true,
                                    shop: {
                                        select: {
                                            name: true,
                                            address: true,
                                            phone: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            return [2 /*return*/, booking];
                    }
                });
            });
        };
        /**
         * Get user's bookings
         */
        BookingsService_1.prototype.findByUser = function (userId_1, status_1) {
            return __awaiter(this, arguments, void 0, function (userId, status, page, limit) {
                var skip, where, now, _a, bookings, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // Ensure page and limit are numbers
                            page = Number(page) || 1;
                            limit = Number(limit) || 20;
                            skip = (page - 1) * limit;
                            where = { userId: userId };
                            if (status) {
                                now = new Date();
                                if (status === 'upcoming') {
                                    // Upcoming = future bookings that are not completed/cancelled
                                    where.startTime = { gte: now };
                                    where.status = { in: [client_1.BookingStatus.PENDING, client_1.BookingStatus.CONFIRMED] };
                                }
                                else if (status === 'past') {
                                    // Past = completed, cancelled, no-show, or past start time
                                    where.OR = [
                                        { status: { in: [client_1.BookingStatus.COMPLETED, client_1.BookingStatus.CANCELLED, client_1.BookingStatus.NO_SHOW] } },
                                        { startTime: { lt: now } },
                                    ];
                                }
                                else if (Object.values(client_1.BookingStatus).includes(status)) {
                                    where.status = status;
                                }
                                // If status is invalid and not a virtual filter, ignore it
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.booking.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { startTime: 'desc' },
                                        include: {
                                            services: true,
                                            shop: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    slug: true,
                                                    address: true,
                                                },
                                            },
                                        },
                                    }),
                                    this.prisma.booking.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), bookings = _a[0], total = _a[1];
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
         * Update booking status
         */
        BookingsService_1.prototype.updateStatus = function (bookingId, status, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, now, oneHourBefore, updateData, updatedBooking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            // Validate status transition
                            this.validateStatusTransition(booking.status, status);
                            // User can only cancel their own bookings
                            if (userId && status === client_1.BookingStatus.CANCELLED) {
                                if (booking.userId !== userId) {
                                    throw new common_1.NotFoundException('Booking not found');
                                }
                                now = new Date();
                                oneHourBefore = new Date(booking.startTime.getTime() - 60 * 60 * 1000);
                                if (now > oneHourBefore) {
                                    throw new common_1.BadRequestException('Cannot cancel booking less than 1 hour before start time');
                                }
                            }
                            updateData = { status: status };
                            // Set timestamps based on status
                            switch (status) {
                                case client_1.BookingStatus.IN_PROGRESS:
                                    updateData.arrivedAt = new Date();
                                    updateData.startedAt = new Date();
                                    break;
                                case client_1.BookingStatus.COMPLETED:
                                    updateData.completedAt = new Date();
                                    break;
                                case client_1.BookingStatus.CANCELLED:
                                    updateData.cancelledAt = new Date();
                                    break;
                            }
                            return [4 /*yield*/, this.prisma.booking.update({
                                    where: { id: bookingId },
                                    data: updateData,
                                    include: {
                                        services: true,
                                        shop: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            updatedBooking = _a.sent();
                            // Update queue stats
                            this.queueService.updateQueueStats(booking.shopId).catch(console.error);
                            // Invalidate slot cache if cancelled or completed
                            if (status === client_1.BookingStatus.CANCELLED || status === client_1.BookingStatus.COMPLETED) {
                                this.queueService.invalidateSlotCache(booking.shopId, booking.startTime).catch(console.error);
                            }
                            // Emit real-time updates
                            this.queueGateway.emitQueueUpdate(booking.shopId).catch(console.error);
                            this.queueGateway.emitBookingUpdate(bookingId, {
                                status: status,
                                updatedAt: new Date().toISOString(),
                            });
                            return [2 /*return*/, updatedBooking];
                    }
                });
            });
        };
        /**
         * Cancel booking
         */
        BookingsService_1.prototype.cancel = function (bookingId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateStatus(bookingId, client_1.BookingStatus.CANCELLED, userId)];
                });
            });
        };
        /**
         * Reschedule booking
         */
        BookingsService_1.prototype.reschedule = function (bookingId, newStartTime, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, newEndTime, isAvailable, updatedBooking;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: { services: true },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            if (userId && booking.userId !== userId) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
                                throw new common_1.BadRequestException('Only pending or confirmed bookings can be rescheduled');
                            }
                            newEndTime = new Date(newStartTime.getTime() + booking.totalDurationMinutes * 60 * 1000);
                            return [4 /*yield*/, this.slotEngine.isSlotAvailable(booking.shopId, newStartTime, newEndTime, booking.staffId || undefined, bookingId)];
                        case 2:
                            isAvailable = _a.sent();
                            if (!isAvailable) {
                                throw new common_1.ConflictException('Selected time slot is not available');
                            }
                            return [4 /*yield*/, this.prisma.booking.update({
                                    where: { id: bookingId },
                                    data: {
                                        startTime: newStartTime,
                                        endTime: newEndTime,
                                    },
                                    include: {
                                        services: true,
                                        shop: {
                                            select: { name: true },
                                        },
                                    },
                                })];
                        case 3:
                            updatedBooking = _a.sent();
                            // Invalidate caches for both old and new dates
                            this.queueService.invalidateSlotCache(booking.shopId, booking.startTime).catch(console.error);
                            this.queueService.invalidateSlotCache(booking.shopId, newStartTime).catch(console.error);
                            this.queueService.updateQueueStats(booking.shopId).catch(console.error);
                            // Emit real-time updates
                            this.queueGateway.emitQueueUpdate(booking.shopId).catch(console.error);
                            this.queueGateway.emitBookingUpdate(bookingId, {
                                status: 'RESCHEDULED',
                                newStartTime: newStartTime.toISOString(),
                            });
                            return [2 /*return*/, updatedBooking];
                    }
                });
            });
        };
        BookingsService_1.prototype.validateStatusTransition = function (currentStatus, newStatus) {
            var _a;
            var allowedTransitions = (_a = {},
                _a[client_1.BookingStatus.PENDING] = [client_1.BookingStatus.CONFIRMED, client_1.BookingStatus.REJECTED, client_1.BookingStatus.CANCELLED],
                _a[client_1.BookingStatus.CONFIRMED] = [client_1.BookingStatus.IN_PROGRESS, client_1.BookingStatus.CANCELLED, client_1.BookingStatus.NO_SHOW],
                _a[client_1.BookingStatus.IN_PROGRESS] = [client_1.BookingStatus.COMPLETED],
                _a[client_1.BookingStatus.COMPLETED] = [],
                _a[client_1.BookingStatus.CANCELLED] = [],
                _a[client_1.BookingStatus.NO_SHOW] = [],
                _a[client_1.BookingStatus.REJECTED] = [],
                _a);
            if (!allowedTransitions[currentStatus].includes(newStatus)) {
                throw new common_1.BadRequestException("Cannot transition from ".concat(currentStatus, " to ").concat(newStatus));
            }
        };
        BookingsService_1.prototype.generateBookingNumber = function () {
            var timestamp = Date.now().toString(36).toUpperCase();
            var random = (0, uuid_1.v4)().slice(0, 4).toUpperCase();
            return "OL-".concat(timestamp, "-").concat(random);
        };
        return BookingsService_1;
    }());
    __setFunctionName(_classThis, "BookingsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BookingsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BookingsService = _classThis;
}();
exports.BookingsService = BookingsService;
