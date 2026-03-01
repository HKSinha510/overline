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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
var common_1 = require("@nestjs/common");
var stripe_1 = __importDefault(require("stripe"));
var client_1 = require("@prisma/client");
var PaymentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PaymentsService = _classThis = /** @class */ (function () {
        function PaymentsService_1(prisma, configService) {
            this.prisma = prisma;
            this.configService = configService;
            this.logger = new common_1.Logger(PaymentsService.name);
            this.stripe = null;
            var stripeKey = this.configService.get('STRIPE_SECRET_KEY');
            if (stripeKey) {
                this.stripe = new stripe_1.default(stripeKey, {
                    apiVersion: '2026-01-28.clover',
                });
            }
        }
        /**
         * Create a Stripe PaymentIntent for a booking
         */
        PaymentsService_1.prototype.createPaymentIntent = function (dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, amount, currency, paymentIntent, payment, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.stripe) {
                                throw new common_1.BadRequestException('Payment processing is not configured. Add STRIPE_SECRET_KEY to enable payments.');
                            }
                            return [4 /*yield*/, this.prisma.booking.findUnique({
                                    where: { id: dto.bookingId },
                                    include: {
                                        payment: true,
                                        shop: true,
                                        services: true,
                                    },
                                })];
                        case 1:
                            booking = _b.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            if (booking.userId !== userId) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            // Check if payment already exists and is completed
                            if (((_a = booking.payment) === null || _a === void 0 ? void 0 : _a.status) === client_1.PaymentStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Payment already completed');
                            }
                            amount = Math.round(booking.totalAmount.toNumber() * 100);
                            currency = booking.currency.toLowerCase();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, this.stripe.paymentIntents.create({
                                    amount: amount,
                                    currency: currency,
                                    metadata: {
                                        bookingId: booking.id,
                                        bookingNumber: booking.bookingNumber,
                                        shopId: booking.shopId,
                                        userId: userId,
                                    },
                                    description: "Booking ".concat(booking.bookingNumber, " at ").concat(booking.shop.name),
                                    automatic_payment_methods: {
                                        enabled: true,
                                    },
                                })];
                        case 3:
                            paymentIntent = _b.sent();
                            return [4 /*yield*/, this.prisma.payment.upsert({
                                    where: { bookingId: booking.id },
                                    create: {
                                        bookingId: booking.id,
                                        provider: client_1.PaymentProvider.STRIPE,
                                        amount: booking.totalAmount,
                                        currency: booking.currency,
                                        status: client_1.PaymentStatus.PENDING,
                                        providerOrderId: paymentIntent.id,
                                    },
                                    update: {
                                        providerOrderId: paymentIntent.id,
                                        status: client_1.PaymentStatus.PENDING,
                                    },
                                })];
                        case 4:
                            payment = _b.sent();
                            return [2 /*return*/, {
                                    paymentId: payment.id,
                                    clientSecret: paymentIntent.client_secret,
                                    paymentIntentId: paymentIntent.id,
                                    amount: booking.totalAmount,
                                    currency: booking.currency,
                                }];
                        case 5:
                            error_1 = _b.sent();
                            this.logger.error('Failed to create PaymentIntent', error_1);
                            throw new common_1.BadRequestException('Failed to create payment');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get payment details
         */
        PaymentsService_1.prototype.getPayment = function (paymentId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var payment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findUnique({
                                where: { id: paymentId },
                                include: {
                                    booking: {
                                        select: {
                                            id: true,
                                            bookingNumber: true,
                                            userId: true,
                                            totalAmount: true,
                                            shop: {
                                                select: { name: true },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            payment = _a.sent();
                            if (!payment || payment.booking.userId !== userId) {
                                throw new common_1.NotFoundException('Payment not found');
                            }
                            return [2 /*return*/, payment];
                    }
                });
            });
        };
        /**
         * Handle Stripe webhook events
         */
        PaymentsService_1.prototype.handleStripeWebhook = function (payload, signature) {
            return __awaiter(this, void 0, void 0, function () {
                var webhookSecret, event, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.stripe) {
                                throw new common_1.BadRequestException('Stripe not configured');
                            }
                            webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
                            try {
                                event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
                            }
                            catch (err) {
                                this.logger.error('Webhook signature verification failed', err);
                                throw new common_1.BadRequestException('Invalid webhook signature');
                            }
                            this.logger.log("Processing Stripe event: ".concat(event.type));
                            _a = event.type;
                            switch (_a) {
                                case 'payment_intent.succeeded': return [3 /*break*/, 1];
                                case 'payment_intent.payment_failed': return [3 /*break*/, 3];
                                case 'charge.refunded': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [4 /*yield*/, this.handlePaymentSuccess(event.data.object)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 3: return [4 /*yield*/, this.handlePaymentFailed(event.data.object)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 5: return [4 /*yield*/, this.handleRefund(event.data.object)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            this.logger.log("Unhandled event type: ".concat(event.type));
                            _b.label = 8;
                        case 8: return [2 /*return*/, { received: true }];
                    }
                });
            });
        };
        /**
         * Handle successful payment
         */
        PaymentsService_1.prototype.handlePaymentSuccess = function (paymentIntent) {
            return __awaiter(this, void 0, void 0, function () {
                var bookingId;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            bookingId = paymentIntent.metadata.bookingId;
                            if (!bookingId) {
                                this.logger.warn('No bookingId in payment metadata');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            // Update payment status
                                            return [4 /*yield*/, tx.payment.update({
                                                    where: { bookingId: bookingId },
                                                    data: {
                                                        status: client_1.PaymentStatus.COMPLETED,
                                                        transactionRef: paymentIntent.id,
                                                        paidAt: new Date(),
                                                    },
                                                })];
                                            case 1:
                                                // Update payment status
                                                _a.sent();
                                                // Update booking status to confirmed (if pending)
                                                return [4 /*yield*/, tx.booking.update({
                                                        where: { id: bookingId },
                                                        data: {
                                                            status: client_1.BookingStatus.CONFIRMED,
                                                        },
                                                    })];
                                            case 2:
                                                // Update booking status to confirmed (if pending)
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            this.logger.log("Payment completed for booking: ".concat(bookingId));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Handle failed payment
         */
        PaymentsService_1.prototype.handlePaymentFailed = function (paymentIntent) {
            return __awaiter(this, void 0, void 0, function () {
                var bookingId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            bookingId = paymentIntent.metadata.bookingId;
                            if (!bookingId)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.prisma.payment.update({
                                    where: { bookingId: bookingId },
                                    data: {
                                        status: client_1.PaymentStatus.FAILED,
                                    },
                                })];
                        case 1:
                            _a.sent();
                            this.logger.log("Payment failed for booking: ".concat(bookingId));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Handle refund
         */
        PaymentsService_1.prototype.handleRefund = function (charge) {
            return __awaiter(this, void 0, void 0, function () {
                var paymentIntentId, payment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            paymentIntentId = charge.payment_intent;
                            return [4 /*yield*/, this.prisma.payment.findFirst({
                                    where: { providerOrderId: paymentIntentId },
                                })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.payment.update({
                                    where: { id: payment.id },
                                    data: { status: client_1.PaymentStatus.REFUNDED },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Refund a payment
         */
        PaymentsService_1.prototype.refundPayment = function (paymentId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var payment, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.stripe) {
                                throw new common_1.BadRequestException('Stripe not configured');
                            }
                            return [4 /*yield*/, this.prisma.payment.findUnique({
                                    where: { id: paymentId },
                                })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException('Payment not found');
                            }
                            if (payment.status !== client_1.PaymentStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Can only refund completed payments');
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, this.stripe.refunds.create({
                                    payment_intent: payment.providerOrderId,
                                    reason: 'requested_by_customer',
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.payment.update({
                                    where: { id: paymentId },
                                    data: { status: client_1.PaymentStatus.REFUNDED },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: 'Refund initiated' }];
                        case 5:
                            error_2 = _a.sent();
                            this.logger.error('Failed to process refund', error_2);
                            throw new common_1.BadRequestException('Failed to process refund');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        return PaymentsService_1;
    }());
    __setFunctionName(_classThis, "PaymentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentsService = _classThis;
}();
exports.PaymentsService = PaymentsService;
