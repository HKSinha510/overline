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
exports.AdminController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var client_1 = require("@prisma/client");
var AdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('admin'), (0, common_1.Controller)('admin'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMyShops_decorators;
    var _getDashboard_decorators;
    var _getBookings_decorators;
    var _updateBookingStatus_decorators;
    var _createWalkIn_decorators;
    var _getStaff_decorators;
    var _getWorkingHours_decorators;
    var _updateWorkingHours_decorators;
    var _getSettings_decorators;
    var _updateSettings_decorators;
    var AdminController = _classThis = /** @class */ (function () {
        function AdminController_1(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        AdminController_1.prototype.getMyShops = function (userId, tenantId, role) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.getMyShops(userId, tenantId, role)];
                });
            });
        };
        AdminController_1.prototype.getDashboard = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.getDashboard(shopId, tenantId)];
                });
            });
        };
        AdminController_1.prototype.getBookings = function (shopId, tenantId, date, status, page, limit) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.getBookings(shopId, tenantId, { date: date, status: status, page: page, limit: limit })];
                });
            });
        };
        AdminController_1.prototype.updateBookingStatus = function (bookingId, dto, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.updateBookingStatus(bookingId, dto.status, tenantId, dto.adminNotes)];
                });
            });
        };
        AdminController_1.prototype.createWalkIn = function (shopId, dto, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.createWalkIn(shopId, dto, tenantId)];
                });
            });
        };
        AdminController_1.prototype.getStaff = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.getStaff(shopId, tenantId)];
                });
            });
        };
        AdminController_1.prototype.getWorkingHours = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.getWorkingHours(shopId, tenantId)];
                });
            });
        };
        AdminController_1.prototype.updateWorkingHours = function (shopId, dayOfWeek, dto, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.updateWorkingHours(shopId, dayOfWeek, dto, tenantId)];
                });
            });
        };
        AdminController_1.prototype.getSettings = function (shopId, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.getShopSettings(shopId, tenantId)];
                });
            });
        };
        AdminController_1.prototype.updateSettings = function (shopId, settings, tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.updateShopSettings(shopId, tenantId, settings)];
                });
            });
        };
        return AdminController_1;
    }());
    __setFunctionName(_classThis, "AdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMyShops_decorators = [(0, common_1.Get)('my-shops'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.STAFF, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get shops accessible by the current user' })];
        _getDashboard_decorators = [(0, common_1.Get)('shops/:shopId/dashboard'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.STAFF, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get shop dashboard data' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' })];
        _getBookings_decorators = [(0, common_1.Get)('shops/:shopId/bookings'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.STAFF, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get shop bookings' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' }), (0, swagger_1.ApiQuery)({ name: 'date', required: false, description: 'Filter by date (YYYY-MM-DD)' }), (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.BookingStatus, required: false }), (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }), (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false })];
        _updateBookingStatus_decorators = [(0, common_1.Patch)('bookings/:bookingId/status'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.STAFF, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update booking status' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking ID' })];
        _createWalkIn_decorators = [(0, common_1.Post)('shops/:shopId/walk-in'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.STAFF, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Create a walk-in booking' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' })];
        _getStaff_decorators = [(0, common_1.Get)('shops/:shopId/staff'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get shop staff' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' })];
        _getWorkingHours_decorators = [(0, common_1.Get)('shops/:shopId/working-hours'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.STAFF, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get shop working hours' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' })];
        _updateWorkingHours_decorators = [(0, common_1.Patch)('shops/:shopId/working-hours/:dayOfWeek'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update working hours for a day' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' }), (0, swagger_1.ApiParam)({ name: 'dayOfWeek', enum: client_1.DayOfWeek })];
        _getSettings_decorators = [(0, common_1.Get)('shops/:shopId/settings'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get shop settings' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' })];
        _updateSettings_decorators = [(0, common_1.Patch)('shops/:shopId/settings'), (0, roles_decorator_1.Roles)(client_1.UserRole.OWNER, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update shop settings' }), (0, swagger_1.ApiParam)({ name: 'shopId', description: 'Shop ID' })];
        __esDecorate(_classThis, null, _getMyShops_decorators, { kind: "method", name: "getMyShops", static: false, private: false, access: { has: function (obj) { return "getMyShops" in obj; }, get: function (obj) { return obj.getMyShops; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: function (obj) { return "getDashboard" in obj; }, get: function (obj) { return obj.getDashboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBookings_decorators, { kind: "method", name: "getBookings", static: false, private: false, access: { has: function (obj) { return "getBookings" in obj; }, get: function (obj) { return obj.getBookings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateBookingStatus_decorators, { kind: "method", name: "updateBookingStatus", static: false, private: false, access: { has: function (obj) { return "updateBookingStatus" in obj; }, get: function (obj) { return obj.updateBookingStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createWalkIn_decorators, { kind: "method", name: "createWalkIn", static: false, private: false, access: { has: function (obj) { return "createWalkIn" in obj; }, get: function (obj) { return obj.createWalkIn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStaff_decorators, { kind: "method", name: "getStaff", static: false, private: false, access: { has: function (obj) { return "getStaff" in obj; }, get: function (obj) { return obj.getStaff; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWorkingHours_decorators, { kind: "method", name: "getWorkingHours", static: false, private: false, access: { has: function (obj) { return "getWorkingHours" in obj; }, get: function (obj) { return obj.getWorkingHours; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateWorkingHours_decorators, { kind: "method", name: "updateWorkingHours", static: false, private: false, access: { has: function (obj) { return "updateWorkingHours" in obj; }, get: function (obj) { return obj.updateWorkingHours; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSettings_decorators, { kind: "method", name: "getSettings", static: false, private: false, access: { has: function (obj) { return "getSettings" in obj; }, get: function (obj) { return obj.getSettings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSettings_decorators, { kind: "method", name: "updateSettings", static: false, private: false, access: { has: function (obj) { return "updateSettings" in obj; }, get: function (obj) { return obj.updateSettings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
}();
exports.AdminController = AdminController;
