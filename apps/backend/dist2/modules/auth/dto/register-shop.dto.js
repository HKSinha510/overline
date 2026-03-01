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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterShopDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var RegisterShopDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _ownerName_decorators;
    var _ownerName_initializers = [];
    var _ownerName_extraInitializers = [];
    var _shopName_decorators;
    var _shopName_initializers = [];
    var _shopName_extraInitializers = [];
    var _shopType_decorators;
    var _shopType_initializers = [];
    var _shopType_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _postalCode_decorators;
    var _postalCode_initializers = [];
    var _postalCode_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterShopDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.ownerName = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _ownerName_initializers, void 0));
                this.shopName = (__runInitializers(this, _ownerName_extraInitializers), __runInitializers(this, _shopName_initializers, void 0));
                this.shopType = (__runInitializers(this, _shopName_extraInitializers), __runInitializers(this, _shopType_initializers, void 0));
                this.address = (__runInitializers(this, _shopType_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.city = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.postalCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
                this.phone = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                // Optional coordinates if we want map integration upfront
                this.latitude = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                __runInitializers(this, _longitude_extraInitializers);
            }
            return RegisterShopDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, swagger_1.ApiProperty)({ example: 'john.owner@example.com' }), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            _password_decorators = [(0, swagger_1.ApiProperty)({ example: 'Password123' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(8), (0, class_validator_1.IsNotEmpty)()];
            _ownerName_decorators = [(0, swagger_1.ApiProperty)({ example: 'John Owner' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _shopName_decorators = [(0, swagger_1.ApiProperty)({ example: 'My Awesome Shop' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _shopType_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.TenantType, example: client_1.TenantType.SALON }), (0, class_validator_1.IsEnum)(client_1.TenantType), (0, class_validator_1.IsNotEmpty)()];
            _address_decorators = [(0, swagger_1.ApiProperty)({ example: '123 Business Road' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _city_decorators = [(0, swagger_1.ApiProperty)({ example: 'Mumbai' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _state_decorators = [(0, swagger_1.ApiProperty)({ example: 'MH' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _postalCode_decorators = [(0, swagger_1.ApiProperty)({ example: '400001' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _phone_decorators = [(0, swagger_1.ApiProperty)({ example: '+91 9876543210' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _latitude_decorators = [(0, swagger_1.ApiProperty)({ example: 19.0760 }), (0, class_validator_1.IsOptional)()];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({ example: 72.8777 }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _ownerName_decorators, { kind: "field", name: "ownerName", static: false, private: false, access: { has: function (obj) { return "ownerName" in obj; }, get: function (obj) { return obj.ownerName; }, set: function (obj, value) { obj.ownerName = value; } }, metadata: _metadata }, _ownerName_initializers, _ownerName_extraInitializers);
            __esDecorate(null, null, _shopName_decorators, { kind: "field", name: "shopName", static: false, private: false, access: { has: function (obj) { return "shopName" in obj; }, get: function (obj) { return obj.shopName; }, set: function (obj, value) { obj.shopName = value; } }, metadata: _metadata }, _shopName_initializers, _shopName_extraInitializers);
            __esDecorate(null, null, _shopType_decorators, { kind: "field", name: "shopType", static: false, private: false, access: { has: function (obj) { return "shopType" in obj; }, get: function (obj) { return obj.shopType; }, set: function (obj, value) { obj.shopType = value; } }, metadata: _metadata }, _shopType_initializers, _shopType_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: function (obj) { return "postalCode" in obj; }, get: function (obj) { return obj.postalCode; }, set: function (obj, value) { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterShopDto = RegisterShopDto;
