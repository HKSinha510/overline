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
exports.ShopsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var public_decorator_1 = require("../auth/decorators/public.decorator");
var ShopsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('shops'), (0, common_1.Controller)('shops')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _search_decorators;
    var _getCities_decorators;
    var _getNearby_decorators;
    var _findBySlug_decorators;
    var _getServices_decorators;
    var _getQueueStats_decorators;
    var ShopsController = _classThis = /** @class */ (function () {
        function ShopsController_1(shopsService) {
            this.shopsService = (__runInitializers(this, _instanceExtraInitializers), shopsService);
        }
        ShopsController_1.prototype.search = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.shopsService.search(dto)];
                });
            });
        };
        ShopsController_1.prototype.getCities = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.shopsService.getCities()];
                });
            });
        };
        ShopsController_1.prototype.getNearby = function (latitude, longitude, radiusKm) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.shopsService.getNearbyShops(latitude, longitude, radiusKm)];
                });
            });
        };
        ShopsController_1.prototype.findBySlug = function (slug) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.shopsService.findBySlug(slug)];
                });
            });
        };
        ShopsController_1.prototype.getServices = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.shopsService.getServices(id)];
                });
            });
        };
        ShopsController_1.prototype.getQueueStats = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.shopsService.getQueueStats(id)];
                });
            });
        };
        return ShopsController_1;
    }());
    __setFunctionName(_classThis, "ShopsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _search_decorators = [(0, common_1.Get)(), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Search and list shops' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of shops matching criteria' })];
        _getCities_decorators = [(0, common_1.Get)('cities'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get list of cities with shops' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of city names' })];
        _getNearby_decorators = [(0, common_1.Get)('nearby'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get nearby shops based on coordinates' }), (0, swagger_1.ApiQuery)({ name: 'latitude', type: Number, required: true }), (0, swagger_1.ApiQuery)({ name: 'longitude', type: Number, required: true }), (0, swagger_1.ApiQuery)({ name: 'radiusKm', type: Number, required: false })];
        _findBySlug_decorators = [(0, common_1.Get)(':slug'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get shop details by slug' }), (0, swagger_1.ApiParam)({ name: 'slug', description: 'Shop URL slug' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Shop details with services and queue stats' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Shop not found' })];
        _getServices_decorators = [(0, common_1.Get)(':id/services'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get services for a shop' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Shop ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of services' })];
        _getQueueStats_decorators = [(0, common_1.Get)(':id/queue'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get current queue status for a shop' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Shop ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Queue statistics' })];
        __esDecorate(_classThis, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCities_decorators, { kind: "method", name: "getCities", static: false, private: false, access: { has: function (obj) { return "getCities" in obj; }, get: function (obj) { return obj.getCities; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNearby_decorators, { kind: "method", name: "getNearby", static: false, private: false, access: { has: function (obj) { return "getNearby" in obj; }, get: function (obj) { return obj.getNearby; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findBySlug_decorators, { kind: "method", name: "findBySlug", static: false, private: false, access: { has: function (obj) { return "findBySlug" in obj; }, get: function (obj) { return obj.findBySlug; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getServices_decorators, { kind: "method", name: "getServices", static: false, private: false, access: { has: function (obj) { return "getServices" in obj; }, get: function (obj) { return obj.getServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getQueueStats_decorators, { kind: "method", name: "getQueueStats", static: false, private: false, access: { has: function (obj) { return "getQueueStats" in obj; }, get: function (obj) { return obj.getQueueStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ShopsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ShopsController = _classThis;
}();
exports.ShopsController = ShopsController;
