"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.NotificationsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var sgMail = __importStar(require("@sendgrid/mail"));
var twilio_1 = require("twilio");
var NotificationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationsService = _classThis = /** @class */ (function () {
        function NotificationsService_1(prisma, configService) {
            this.prisma = prisma;
            this.configService = configService;
            this.logger = new common_1.Logger(NotificationsService.name);
            this.twilioClient = null;
            this.sendgridEnabled = false;
            // Initialize Twilio
            var twilioSid = this.configService.get('TWILIO_ACCOUNT_SID');
            var twilioToken = this.configService.get('TWILIO_AUTH_TOKEN');
            if (twilioSid && twilioToken) {
                this.twilioClient = new twilio_1.Twilio(twilioSid, twilioToken);
                this.logger.log('Twilio SMS enabled');
            }
            // Initialize SendGrid
            var sendgridKey = this.configService.get('SENDGRID_API_KEY');
            if (sendgridKey) {
                sgMail.setApiKey(sendgridKey);
                this.sendgridEnabled = true;
                this.logger.log('SendGrid email enabled');
            }
        }
        /**
         * Send notification to user
         */
        NotificationsService_1.prototype.send = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, bookingId, type, title, body, data, channels, email, phone, notifications, _i, notifications_1, notification;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userId = payload.userId, bookingId = payload.bookingId, type = payload.type, title = payload.title, body = payload.body, data = payload.data, channels = payload.channels, email = payload.email, phone = payload.phone;
                            if (!userId) return [3 /*break*/, 6];
                            return [4 /*yield*/, Promise.all(channels.map(function (channel) {
                                    return _this.prisma.notification.create({
                                        data: {
                                            userId: userId,
                                            bookingId: bookingId,
                                            channel: channel,
                                            type: type,
                                            title: title,
                                            body: body,
                                            data: data || {},
                                            status: client_1.NotificationStatus.PENDING,
                                        },
                                    });
                                }))];
                        case 1:
                            notifications = _a.sent();
                            _i = 0, notifications_1 = notifications;
                            _a.label = 2;
                        case 2:
                            if (!(_i < notifications_1.length)) return [3 /*break*/, 5];
                            notification = notifications_1[_i];
                            return [4 /*yield*/, this.sendThroughChannel(notification, email, phone)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 10];
                        case 6:
                            if (!(channels.includes(client_1.NotificationChannel.EMAIL) && email)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.sendEmail(email, title, body)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            if (!(channels.includes(client_1.NotificationChannel.SMS) && phone)) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.sendSms(phone, body)];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Send through specific channel
         */
        NotificationsService_1.prototype.sendThroughChannel = function (notification, email, phone) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, userEmail, _b, userPhone, _c, error_1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 14, , 16]);
                            _a = notification.channel;
                            switch (_a) {
                                case client_1.NotificationChannel.EMAIL: return [3 /*break*/, 1];
                                case client_1.NotificationChannel.SMS: return [3 /*break*/, 6];
                                case client_1.NotificationChannel.PUSH: return [3 /*break*/, 11];
                            }
                            return [3 /*break*/, 12];
                        case 1:
                            _b = email;
                            if (_b) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getUserEmail(notification.userId)];
                        case 2:
                            _b = (_d.sent());
                            _d.label = 3;
                        case 3:
                            userEmail = _b;
                            if (!userEmail) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.sendEmail(userEmail, notification.title, notification.body)];
                        case 4:
                            _d.sent();
                            _d.label = 5;
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            _c = phone;
                            if (_c) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.getUserPhone(notification.userId)];
                        case 7:
                            _c = (_d.sent());
                            _d.label = 8;
                        case 8:
                            userPhone = _c;
                            if (!userPhone) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.sendSms(userPhone, notification.body)];
                        case 9:
                            _d.sent();
                            _d.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            // TODO: Implement FCM push notifications
                            this.logger.log("Push notification: ".concat(notification.title));
                            return [3 /*break*/, 12];
                        case 12: 
                        // Mark as sent
                        return [4 /*yield*/, this.prisma.notification.update({
                                where: { id: notification.id },
                                data: {
                                    status: client_1.NotificationStatus.SENT,
                                    sentAt: new Date(),
                                },
                            })];
                        case 13:
                            // Mark as sent
                            _d.sent();
                            return [3 /*break*/, 16];
                        case 14:
                            error_1 = _d.sent();
                            this.logger.error("Failed to send ".concat(notification.channel, " notification:"), error_1);
                            return [4 /*yield*/, this.prisma.notification.update({
                                    where: { id: notification.id },
                                    data: { status: client_1.NotificationStatus.FAILED },
                                })];
                        case 15:
                            _d.sent();
                            return [3 /*break*/, 16];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Send email via SendGrid
         */
        NotificationsService_1.prototype.sendEmail = function (to, subject, text) {
            return __awaiter(this, void 0, void 0, function () {
                var fromEmail, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.sendgridEnabled) {
                                this.logger.log("[Email Mock] To: ".concat(to, ", Subject: ").concat(subject));
                                return [2 /*return*/];
                            }
                            fromEmail = this.configService.get('SENDGRID_FROM_EMAIL') || 'noreply@overline.app';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, sgMail.send({
                                    to: to,
                                    from: fromEmail,
                                    subject: subject,
                                    text: text,
                                    html: this.wrapInHtmlTemplate(subject, text),
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Email sent to ".concat(to));
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error('SendGrid error:', error_2);
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Send SMS via Twilio
         */
        NotificationsService_1.prototype.sendSms = function (to, body) {
            return __awaiter(this, void 0, void 0, function () {
                var fromPhone, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.twilioClient) {
                                this.logger.log("[SMS Mock] To: ".concat(to, ", Message: ").concat(body));
                                return [2 /*return*/];
                            }
                            fromPhone = this.configService.get('TWILIO_PHONE_NUMBER');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.twilioClient.messages.create({
                                    body: body,
                                    to: to,
                                    from: fromPhone,
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("SMS sent to ".concat(to));
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            this.logger.error('Twilio error:', error_3);
                            throw error_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Wrap text in HTML email template
         */
        NotificationsService_1.prototype.wrapInHtmlTemplate = function (title, body) {
            return "\n      <!DOCTYPE html>\n      <html>\n        <head>\n          <style>\n            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n            .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n            .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }\n            .content { padding: 20px; background: #f9f9f9; }\n            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }\n          </style>\n        </head>\n        <body>\n          <div class=\"container\">\n            <div class=\"header\">\n              <h1>Overline</h1>\n            </div>\n            <div class=\"content\">\n              <h2>".concat(title, "</h2>\n              <p>").concat(body, "</p>\n            </div>\n            <div class=\"footer\">\n              <p>\u00A9 ").concat(new Date().getFullYear(), " Overline. All rights reserved.</p>\n            </div>\n          </div>\n        </body>\n      </html>\n    ");
        };
        /**
         * Get user email
         */
        NotificationsService_1.prototype.getUserEmail = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId },
                                select: { email: true },
                            })];
                        case 1:
                            user = _a.sent();
                            return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.email) || null];
                    }
                });
            });
        };
        /**
         * Get user phone
         */
        NotificationsService_1.prototype.getUserPhone = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId },
                                select: { phone: true },
                            })];
                        case 1:
                            user = _a.sent();
                            return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.phone) || null];
                    }
                });
            });
        };
        /**
         * Send booking confirmation notification
         */
        NotificationsService_1.prototype.sendBookingConfirmation = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, startTime, dateStr, timeStr, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: {
                                    user: true,
                                    shop: true,
                                    services: true,
                                },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking)
                                return [2 /*return*/];
                            startTime = new Date(booking.startTime);
                            dateStr = startTime.toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                            timeStr = startTime.toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                            });
                            message = "Your booking at ".concat(booking.shop.name, " is confirmed!\n\n") +
                                "\uD83D\uDCC5 Date: ".concat(dateStr, "\n") +
                                "\u23F0 Time: ".concat(timeStr, "\n") +
                                "\uD83D\uDCCD Address: ".concat(booking.shop.address, "\n") +
                                "\uD83D\uDD22 Booking #: ".concat(booking.bookingNumber, "\n\n") +
                                "See you soon!";
                            return [4 /*yield*/, this.send({
                                    userId: booking.userId || undefined,
                                    bookingId: booking.id,
                                    type: client_1.NotificationType.BOOKING_CONFIRMED,
                                    title: 'Booking Confirmed! ✅',
                                    body: message,
                                    data: {
                                        bookingNumber: booking.bookingNumber,
                                        shopName: booking.shop.name,
                                        startTime: booking.startTime.toISOString(),
                                    },
                                    channels: [client_1.NotificationChannel.EMAIL, client_1.NotificationChannel.SMS],
                                    email: booking.customerEmail || undefined,
                                    phone: booking.customerPhone || undefined,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Send booking reminder
         */
        NotificationsService_1.prototype.sendBookingReminder = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, startTime, timeStr, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: {
                                    user: true,
                                    shop: true,
                                },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking)
                                return [2 /*return*/];
                            startTime = new Date(booking.startTime);
                            timeStr = startTime.toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                            });
                            message = "Reminder: Your appointment at ".concat(booking.shop.name, " is in 1 hour at ").concat(timeStr, ".\n") +
                                "\uD83D\uDCCD ".concat(booking.shop.address, "\n") +
                                "Booking #: ".concat(booking.bookingNumber);
                            return [4 /*yield*/, this.send({
                                    userId: booking.userId || undefined,
                                    bookingId: booking.id,
                                    type: client_1.NotificationType.BOOKING_REMINDER,
                                    title: 'Appointment Reminder ⏰',
                                    body: message,
                                    channels: [client_1.NotificationChannel.SMS, client_1.NotificationChannel.PUSH],
                                    email: booking.customerEmail || undefined,
                                    phone: booking.customerPhone || undefined,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Send queue update (your turn is coming)
         */
        NotificationsService_1.prototype.sendQueueUpdate = function (bookingId, position) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: {
                                    user: true,
                                    shop: true,
                                },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking)
                                return [2 /*return*/];
                            if (position === 1) {
                                message = "\uD83D\uDD14 It's almost your turn at ".concat(booking.shop.name, "! Please be ready.");
                            }
                            else if (position <= 3) {
                                message = "\uD83D\uDCE2 ".concat(position, " people ahead of you at ").concat(booking.shop.name, ". Please arrive soon.");
                            }
                            else {
                                return [2 /*return*/]; // Don't notify for positions > 3
                            }
                            return [4 /*yield*/, this.send({
                                    userId: booking.userId || undefined,
                                    bookingId: booking.id,
                                    type: client_1.NotificationType.QUEUE_UPDATE,
                                    title: 'Queue Update',
                                    body: message,
                                    channels: [client_1.NotificationChannel.SMS, client_1.NotificationChannel.PUSH],
                                    phone: booking.customerPhone || undefined,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return NotificationsService_1;
    }());
    __setFunctionName(_classThis, "NotificationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationsService = _classThis;
}();
exports.NotificationsService = NotificationsService;
