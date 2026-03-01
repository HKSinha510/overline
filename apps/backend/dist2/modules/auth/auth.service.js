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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = __importStar(require("bcrypt"));
var uuid_1 = require("uuid");
var google_auth_library_1 = require("google-auth-library");
var client_1 = require("@prisma/client");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService, configService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.configService = configService;
            this.googleClient = new google_auth_library_1.OAuth2Client(this.configService.get('google.clientId'));
        }
        AuthService_1.prototype.signup = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, existingPhone, saltRounds, hashedPassword, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email },
                            })];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                throw new common_1.ConflictException('Email already registered');
                            }
                            if (!dto.phone) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { phone: dto.phone },
                                })];
                        case 2:
                            existingPhone = _a.sent();
                            if (existingPhone) {
                                throw new common_1.ConflictException('Phone number already registered');
                            }
                            _a.label = 3;
                        case 3:
                            saltRounds = this.configService.get('bcrypt.saltRounds') || 12;
                            return [4 /*yield*/, bcrypt.hash(dto.password, saltRounds)];
                        case 4:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: dto.email,
                                        name: dto.name,
                                        phone: dto.phone,
                                        hashedPassword: hashedPassword,
                                        role: client_1.UserRole.USER,
                                    },
                                })];
                        case 5:
                            user = _a.sent();
                            // Generate tokens
                            return [2 /*return*/, this.generateTokens(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.registerShop = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, saltRounds, hashedPassword, slug, user;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email },
                            })];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                throw new common_1.ConflictException('Email already registered');
                            }
                            saltRounds = this.configService.get('bcrypt.saltRounds') || 12;
                            return [4 /*yield*/, bcrypt.hash(dto.password, saltRounds)];
                        case 2:
                            hashedPassword = _a.sent();
                            slug = dto.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var tenant, owner, shop, weekdays, _i, weekdays_1, day;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.tenant.create({
                                                    data: {
                                                        name: dto.shopName + ' Tenant',
                                                        type: dto.shopType,
                                                    },
                                                })];
                                            case 1:
                                                tenant = _a.sent();
                                                return [4 /*yield*/, tx.user.create({
                                                        data: {
                                                            email: dto.email,
                                                            name: dto.ownerName,
                                                            phone: dto.phone,
                                                            hashedPassword: hashedPassword,
                                                            role: client_1.UserRole.OWNER,
                                                            tenantId: tenant.id,
                                                        },
                                                    })];
                                            case 2:
                                                owner = _a.sent();
                                                return [4 /*yield*/, tx.shop.create({
                                                        data: {
                                                            tenantId: tenant.id,
                                                            name: dto.shopName,
                                                            slug: slug,
                                                            address: dto.address,
                                                            city: dto.city,
                                                            state: dto.state,
                                                            postalCode: dto.postalCode,
                                                            phone: dto.phone,
                                                            email: dto.email,
                                                            latitude: dto.latitude,
                                                            longitude: dto.longitude,
                                                            autoAcceptBookings: true,
                                                            maxConcurrentBookings: 1,
                                                        },
                                                    })];
                                            case 3:
                                                shop = _a.sent();
                                                // 4. Create Queue Stats
                                                return [4 /*yield*/, tx.queueStats.create({
                                                        data: {
                                                            shopId: shop.id,
                                                            currentWaitingCount: 0,
                                                            estimatedWaitMinutes: 0,
                                                        },
                                                    })];
                                            case 4:
                                                // 4. Create Queue Stats
                                                _a.sent();
                                                weekdays = [
                                                    client_1.DayOfWeek.MONDAY,
                                                    client_1.DayOfWeek.TUESDAY,
                                                    client_1.DayOfWeek.WEDNESDAY,
                                                    client_1.DayOfWeek.THURSDAY,
                                                    client_1.DayOfWeek.FRIDAY,
                                                ];
                                                _i = 0, weekdays_1 = weekdays;
                                                _a.label = 5;
                                            case 5:
                                                if (!(_i < weekdays_1.length)) return [3 /*break*/, 8];
                                                day = weekdays_1[_i];
                                                return [4 /*yield*/, tx.workingHours.create({
                                                        data: {
                                                            shopId: shop.id,
                                                            dayOfWeek: day,
                                                            openTime: '09:00',
                                                            closeTime: '18:00',
                                                            breakWindows: [],
                                                        },
                                                    })];
                                            case 6:
                                                _a.sent();
                                                _a.label = 7;
                                            case 7:
                                                _i++;
                                                return [3 /*break*/, 5];
                                            case 8: return [4 /*yield*/, tx.workingHours.create({
                                                    data: {
                                                        shopId: shop.id,
                                                        dayOfWeek: client_1.DayOfWeek.SATURDAY,
                                                        openTime: '10:00',
                                                        closeTime: '15:00',
                                                        breakWindows: [],
                                                    },
                                                })];
                                            case 9:
                                                _a.sent();
                                                return [4 /*yield*/, tx.workingHours.create({
                                                        data: {
                                                            shopId: shop.id,
                                                            dayOfWeek: client_1.DayOfWeek.SUNDAY,
                                                            openTime: '09:00',
                                                            closeTime: '18:00',
                                                            isClosed: true,
                                                            breakWindows: [],
                                                        },
                                                    })];
                                            case 10:
                                                _a.sent();
                                                return [2 /*return*/, owner];
                                        }
                                    });
                                }); })];
                        case 3:
                            user = _a.sent();
                            // Generate tokens for the new owner
                            return [2 /*return*/, this.generateTokens(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.login = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPasswordValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            if (!user.isActive) {
                                throw new common_1.UnauthorizedException('Account is deactivated');
                            }
                            // If user signed up via Google and has no password
                            if (!user.hashedPassword) {
                                throw new common_1.UnauthorizedException('This account uses Google Sign-In. Please login with Google.');
                            }
                            return [4 /*yield*/, bcrypt.compare(dto.password, user.hashedPassword)];
                        case 2:
                            isPasswordValid = _a.sent();
                            if (!isPasswordValid) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            // Update last login
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { lastLoginAt: new Date() },
                                })];
                        case 3:
                            // Update last login
                            _a.sent();
                            // Generate tokens
                            return [2 /*return*/, this.generateTokens(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.googleLogin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var googleClientId, ticket, _a, payload, googleId, email, name, picture, email_verified;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            googleClientId = this.configService.get('google.clientId');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.googleClient.verifyIdToken({
                                    idToken: dto.idToken,
                                    audience: googleClientId,
                                })];
                        case 2:
                            ticket = _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            throw new common_1.UnauthorizedException('Invalid Google token');
                        case 4:
                            payload = ticket.getPayload();
                            if (!payload || !payload.email) {
                                throw new common_1.UnauthorizedException('Invalid Google token payload');
                            }
                            googleId = payload.sub, email = payload.email, name = payload.name, picture = payload.picture, email_verified = payload.email_verified;
                            return [2 /*return*/, this.handleGoogleUser(googleId, email, name, picture, email_verified)];
                    }
                });
            });
        };
        AuthService_1.prototype.handleGoogleUser = function (googleId, email, name, picture, emailVerified) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    OR: [
                                        { googleId: googleId },
                                        { email: email },
                                    ],
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 5];
                            if (!!user.googleId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        googleId: googleId,
                                        authProvider: user.hashedPassword ? 'local' : 'google',
                                        isEmailVerified: emailVerified || user.isEmailVerified,
                                        avatarUrl: user.avatarUrl || picture,
                                    },
                                })];
                        case 2:
                            user = _a.sent();
                            _a.label = 3;
                        case 3:
                            if (!user.isActive) {
                                throw new common_1.UnauthorizedException('Account is deactivated');
                            }
                            // Update last login
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { lastLoginAt: new Date() },
                                })];
                        case 4:
                            // Update last login
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.prisma.user.create({
                                data: {
                                    email: email,
                                    name: name || email.split('@')[0],
                                    googleId: googleId,
                                    authProvider: 'google',
                                    avatarUrl: picture,
                                    isEmailVerified: emailVerified || false,
                                    role: client_1.UserRole.USER,
                                },
                            })];
                        case 6:
                            // New user — create account via Google
                            user = _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/, this.generateTokens(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.refreshToken = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenRecord;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.refreshToken.findUnique({
                                where: { token: dto.refreshToken },
                                include: { user: true },
                            })];
                        case 1:
                            tokenRecord = _a.sent();
                            if (!tokenRecord) {
                                throw new common_1.UnauthorizedException('Invalid refresh token');
                            }
                            if (!(tokenRecord.expiresAt < new Date())) return [3 /*break*/, 3];
                            // Delete expired token
                            return [4 /*yield*/, this.prisma.refreshToken.delete({
                                    where: { id: tokenRecord.id },
                                })];
                        case 2:
                            // Delete expired token
                            _a.sent();
                            throw new common_1.UnauthorizedException('Refresh token expired');
                        case 3:
                            if (!tokenRecord.user.isActive) {
                                throw new common_1.UnauthorizedException('Account is deactivated');
                            }
                            // Delete old refresh token
                            return [4 /*yield*/, this.prisma.refreshToken.delete({
                                    where: { id: tokenRecord.id },
                                })];
                        case 4:
                            // Delete old refresh token
                            _a.sent();
                            // Generate new tokens
                            return [2 /*return*/, this.generateTokens(tokenRecord.user)];
                    }
                });
            });
        };
        AuthService_1.prototype.logout = function (userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!refreshToken) return [3 /*break*/, 2];
                            // Delete specific refresh token
                            return [4 /*yield*/, this.prisma.refreshToken.deleteMany({
                                    where: {
                                        userId: userId,
                                        token: refreshToken,
                                    },
                                })];
                        case 1:
                            // Delete specific refresh token
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: 
                        // Delete all refresh tokens for user
                        return [4 /*yield*/, this.prisma.refreshToken.deleteMany({
                                where: { userId: userId },
                            })];
                        case 3:
                            // Delete all refresh tokens for user
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.validateUser = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: payload.sub },
                                select: {
                                    id: true,
                                    email: true,
                                    name: true,
                                    role: true,
                                    tenantId: true,
                                    isActive: true,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user || !user.isActive) {
                                throw new common_1.UnauthorizedException();
                            }
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        AuthService_1.prototype.changePassword = function (userId, currentPassword, newPassword) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPasswordValid, saltRounds, hashedPassword;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('User not found');
                            }
                            // If user doesn't have a password (Google-only account), they can't use change-password
                            if (!user.hashedPassword) {
                                throw new common_1.BadRequestException('Cannot change password for Google-only accounts. Set a password first.');
                            }
                            return [4 /*yield*/, bcrypt.compare(currentPassword, user.hashedPassword)];
                        case 2:
                            isPasswordValid = _a.sent();
                            if (!isPasswordValid) {
                                throw new common_1.BadRequestException('Current password is incorrect');
                            }
                            saltRounds = this.configService.get('bcrypt.saltRounds') || 12;
                            return [4 /*yield*/, bcrypt.hash(newPassword, saltRounds)];
                        case 3:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: { hashedPassword: hashedPassword },
                                })];
                        case 4:
                            _a.sent();
                            // Invalidate all refresh tokens
                            return [4 /*yield*/, this.prisma.refreshToken.deleteMany({
                                    where: { userId: userId },
                                })];
                        case 5:
                            // Invalidate all refresh tokens
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.generateTokens = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, accessToken, refreshToken, refreshExpiration, expiresAt, accessExpiration, expiresIn;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            payload = {
                                sub: user.id,
                                email: user.email,
                                role: user.role,
                                tenantId: user.tenantId || undefined,
                            };
                            accessToken = this.jwtService.sign(payload);
                            refreshToken = (0, uuid_1.v4)();
                            refreshExpiration = this.configService.get('jwt.refreshExpiration') || '7d';
                            expiresAt = this.calculateExpiration(refreshExpiration);
                            // Store refresh token
                            return [4 /*yield*/, this.prisma.refreshToken.create({
                                    data: {
                                        token: refreshToken,
                                        userId: user.id,
                                        expiresAt: expiresAt,
                                    },
                                })];
                        case 1:
                            // Store refresh token
                            _c.sent();
                            accessExpiration = this.configService.get('jwt.accessExpiration') || '15m';
                            expiresIn = this.parseExpirationToSeconds(accessExpiration);
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    expiresIn: expiresIn,
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        name: user.name,
                                        phone: user.phone || null,
                                        role: user.role,
                                        tenantId: user.tenantId,
                                        isEmailVerified: (_a = user.isEmailVerified) !== null && _a !== void 0 ? _a : false,
                                        isPhoneVerified: (_b = user.isPhoneVerified) !== null && _b !== void 0 ? _b : false,
                                        createdAt: user.createdAt,
                                    },
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.calculateExpiration = function (duration) {
            var seconds = this.parseExpirationToSeconds(duration);
            return new Date(Date.now() + seconds * 1000);
        };
        AuthService_1.prototype.parseExpirationToSeconds = function (duration) {
            var match = duration.match(/^(\d+)([smhd])$/);
            if (!match)
                return 900; // Default 15 minutes
            var value = parseInt(match[1]);
            var unit = match[2];
            switch (unit) {
                case 's':
                    return value;
                case 'm':
                    return value * 60;
                case 'h':
                    return value * 3600;
                case 'd':
                    return value * 86400;
                default:
                    return 900;
            }
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
