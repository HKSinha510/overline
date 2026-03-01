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
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('auth'), (0, common_1.Controller)('auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _signup_decorators;
    var _registerShop_decorators;
    var _login_decorators;
    var _googleLogin_decorators;
    var _googleRedirect_decorators;
    var _googleCallback_decorators;
    var _refresh_decorators;
    var _logout_decorators;
    var _changePassword_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService, configService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
            this.configService = configService;
        }
        AuthController_1.prototype.signup = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.signup(dto)];
                });
            });
        };
        AuthController_1.prototype.registerShop = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.registerShop(dto)];
                });
            });
        };
        AuthController_1.prototype.login = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.login(dto)];
                });
            });
        };
        AuthController_1.prototype.googleLogin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.googleLogin(dto)];
                });
            });
        };
        AuthController_1.prototype.googleRedirect = function (res, from) {
            return __awaiter(this, void 0, void 0, function () {
                var clientId, backendUrl, redirectUri, state, params, googleAuthUrl;
                return __generator(this, function (_a) {
                    clientId = this.configService.get('google.clientId');
                    backendUrl = this.configService.get('backendUrl') || 'http://localhost:3001';
                    redirectUri = "".concat(backendUrl, "/api/v1/auth/google/callback");
                    state = from || 'user';
                    params = new URLSearchParams({
                        client_id: clientId,
                        redirect_uri: redirectUri,
                        response_type: 'code',
                        scope: 'openid email profile',
                        access_type: 'offline',
                        state: state,
                        prompt: 'consent',
                    });
                    googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?".concat(params.toString());
                    return [2 /*return*/, res.redirect(googleAuthUrl)];
                });
            });
        };
        AuthController_1.prototype.googleCallback = function (req, res, code, state, error) {
            return __awaiter(this, void 0, void 0, function () {
                var isAdmin, frontendUrl, loginPath, clientId, clientSecret, backendUrl, redirectUri, tokenResponse, tokenData, userInfoResponse, userInfo, tokens, params, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isAdmin = state === 'admin';
                            frontendUrl = isAdmin
                                ? (this.configService.get('frontendUrls.admin') || 'http://localhost:3002')
                                : (this.configService.get('frontendUrls.user') || 'http://localhost:3000');
                            loginPath = isAdmin ? '/login' : '/auth/login';
                            if (error || !code) {
                                return [2 /*return*/, res.redirect("".concat(frontendUrl).concat(loginPath, "?error=google_auth_failed"))];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            clientId = this.configService.get('google.clientId');
                            clientSecret = this.configService.get('google.clientSecret');
                            backendUrl = this.configService.get('backendUrl') || 'http://localhost:3001';
                            redirectUri = "".concat(backendUrl, "/api/v1/auth/google/callback");
                            return [4 /*yield*/, fetch('https://oauth2.googleapis.com/token', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: new URLSearchParams({
                                        code: code,
                                        client_id: clientId,
                                        client_secret: clientSecret,
                                        redirect_uri: redirectUri,
                                        grant_type: 'authorization_code',
                                    }).toString(),
                                })];
                        case 2:
                            tokenResponse = _a.sent();
                            return [4 /*yield*/, tokenResponse.json()];
                        case 3:
                            tokenData = (_a.sent());
                            if (!tokenResponse.ok) {
                                console.error('[GoogleCallback] Token exchange failed:', JSON.stringify(tokenData));
                                return [2 /*return*/, res.redirect("".concat(frontendUrl).concat(loginPath, "?error=google_auth_failed"))];
                            }
                            return [4 /*yield*/, fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                                    headers: { Authorization: "Bearer ".concat(tokenData.access_token) },
                                })];
                        case 4:
                            userInfoResponse = _a.sent();
                            return [4 /*yield*/, userInfoResponse.json()];
                        case 5:
                            userInfo = (_a.sent());
                            return [4 /*yield*/, this.authService.handleGoogleUser(userInfo.id, userInfo.email, userInfo.name, userInfo.picture, userInfo.verified_email)];
                        case 6:
                            tokens = _a.sent();
                            params = new URLSearchParams({
                                accessToken: tokens.accessToken,
                                refreshToken: tokens.refreshToken,
                                expiresIn: String(tokens.expiresIn),
                                user: JSON.stringify(tokens.user),
                            });
                            return [2 /*return*/, res.redirect("".concat(frontendUrl, "/auth/google/callback?").concat(params.toString()))];
                        case 7:
                            err_1 = _a.sent();
                            console.error('[GoogleCallback] Error:', err_1.message);
                            return [2 /*return*/, res.redirect("".concat(frontendUrl).concat(loginPath, "?error=google_auth_failed"))];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.refresh = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.refreshToken(dto)];
                });
            });
        };
        AuthController_1.prototype.logout = function (req, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.logout(req.user.id, body.refreshToken)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Logged out successfully' }];
                    }
                });
            });
        };
        AuthController_1.prototype.changePassword = function (req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.changePassword(req.user.id, dto.currentPassword, dto.newPassword)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Password changed successfully' }];
                    }
                });
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _signup_decorators = [(0, common_1.Post)('signup'), (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already registered' })];
        _registerShop_decorators = [(0, common_1.Post)('register-shop'), (0, swagger_1.ApiOperation)({ summary: 'Register a new shop owner and provision their shop' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Shop and owner registered successfully' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already registered' })];
        _login_decorators = [(0, common_1.Post)('login'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' })];
        _googleLogin_decorators = [(0, common_1.Post)('google'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Login or signup with Google (ID token)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Google login successful' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid Google token' })];
        _googleRedirect_decorators = [(0, common_1.Get)('google/redirect'), (0, swagger_1.ApiOperation)({ summary: 'Redirect to Google for OAuth login' })];
        _googleCallback_decorators = [(0, common_1.Get)('google/callback'), (0, swagger_1.ApiOperation)({ summary: 'Google OAuth callback' })];
        _refresh_decorators = [(0, common_1.Post)('refresh'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired refresh token' })];
        _logout_decorators = [(0, common_1.Post)('logout'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({ summary: 'Logout and invalidate refresh tokens' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Logged out successfully' })];
        _changePassword_decorators = [(0, common_1.Post)('change-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({ summary: 'Change user password' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Current password is incorrect' })];
        __esDecorate(_classThis, null, _signup_decorators, { kind: "method", name: "signup", static: false, private: false, access: { has: function (obj) { return "signup" in obj; }, get: function (obj) { return obj.signup; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerShop_decorators, { kind: "method", name: "registerShop", static: false, private: false, access: { has: function (obj) { return "registerShop" in obj; }, get: function (obj) { return obj.registerShop; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _googleLogin_decorators, { kind: "method", name: "googleLogin", static: false, private: false, access: { has: function (obj) { return "googleLogin" in obj; }, get: function (obj) { return obj.googleLogin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _googleRedirect_decorators, { kind: "method", name: "googleRedirect", static: false, private: false, access: { has: function (obj) { return "googleRedirect" in obj; }, get: function (obj) { return obj.googleRedirect; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _googleCallback_decorators, { kind: "method", name: "googleCallback", static: false, private: false, access: { has: function (obj) { return "googleCallback" in obj; }, get: function (obj) { return obj.googleCallback; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refresh_decorators, { kind: "method", name: "refresh", static: false, private: false, access: { has: function (obj) { return "refresh" in obj; }, get: function (obj) { return obj.refresh; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: function (obj) { return "logout" in obj; }, get: function (obj) { return obj.logout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changePassword_decorators, { kind: "method", name: "changePassword", static: false, private: false, access: { has: function (obj) { return "changePassword" in obj; }, get: function (obj) { return obj.changePassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
