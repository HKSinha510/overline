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
exports.CreateBookingDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var CreateBookingDto = function () {
    var _a;
    var _shopId_decorators;
    var _shopId_initializers = [];
    var _shopId_extraInitializers = [];
    var _serviceIds_decorators;
    var _serviceIds_initializers = [];
    var _serviceIds_extraInitializers = [];
    var _startTime_decorators;
    var _startTime_initializers = [];
    var _startTime_extraInitializers = [];
    var _staffId_decorators;
    var _staffId_initializers = [];
    var _staffId_extraInitializers = [];
    var _customerName_decorators;
    var _customerName_initializers = [];
    var _customerName_extraInitializers = [];
    var _customerPhone_decorators;
    var _customerPhone_initializers = [];
    var _customerPhone_extraInitializers = [];
    var _customerEmail_decorators;
    var _customerEmail_initializers = [];
    var _customerEmail_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _source_decorators;
    var _source_initializers = [];
    var _source_extraInitializers = [];
    var _offerCode_decorators;
    var _offerCode_initializers = [];
    var _offerCode_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateBookingDto() {
                this.shopId = __runInitializers(this, _shopId_initializers, void 0);
                this.serviceIds = (__runInitializers(this, _shopId_extraInitializers), __runInitializers(this, _serviceIds_initializers, void 0));
                this.startTime = (__runInitializers(this, _serviceIds_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
                this.staffId = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _staffId_initializers, void 0));
                this.customerName = (__runInitializers(this, _staffId_extraInitializers), __runInitializers(this, _customerName_initializers, void 0));
                this.customerPhone = (__runInitializers(this, _customerName_extraInitializers), __runInitializers(this, _customerPhone_initializers, void 0));
                this.customerEmail = (__runInitializers(this, _customerPhone_extraInitializers), __runInitializers(this, _customerEmail_initializers, void 0));
                this.notes = (__runInitializers(this, _customerEmail_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.source = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _source_initializers, void 0));
                this.offerCode = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _offerCode_initializers, void 0));
                __runInitializers(this, _offerCode_extraInitializers);
            }
            return CreateBookingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _shopId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shop ID' }), (0, class_validator_1.IsString)()];
            _serviceIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Array of service IDs to book', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMinSize)(1), (0, class_validator_1.IsString)({ each: true })];
            _startTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Booking start time (ISO string)' }), (0, class_validator_1.IsDateString)()];
            _staffId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Preferred staff member ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _customerName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer name (for guest bookings)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _customerPhone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer phone (for guest bookings)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^\+?[1-9]\d{9,14}$/, { message: 'Invalid phone number' })];
            _customerEmail_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer email (for guest bookings)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _source_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: client_1.BookingSource, description: 'Booking source' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.BookingSource)];
            _offerCode_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional discount code' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _shopId_decorators, { kind: "field", name: "shopId", static: false, private: false, access: { has: function (obj) { return "shopId" in obj; }, get: function (obj) { return obj.shopId; }, set: function (obj, value) { obj.shopId = value; } }, metadata: _metadata }, _shopId_initializers, _shopId_extraInitializers);
            __esDecorate(null, null, _serviceIds_decorators, { kind: "field", name: "serviceIds", static: false, private: false, access: { has: function (obj) { return "serviceIds" in obj; }, get: function (obj) { return obj.serviceIds; }, set: function (obj, value) { obj.serviceIds = value; } }, metadata: _metadata }, _serviceIds_initializers, _serviceIds_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: function (obj) { return "startTime" in obj; }, get: function (obj) { return obj.startTime; }, set: function (obj, value) { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _staffId_decorators, { kind: "field", name: "staffId", static: false, private: false, access: { has: function (obj) { return "staffId" in obj; }, get: function (obj) { return obj.staffId; }, set: function (obj, value) { obj.staffId = value; } }, metadata: _metadata }, _staffId_initializers, _staffId_extraInitializers);
            __esDecorate(null, null, _customerName_decorators, { kind: "field", name: "customerName", static: false, private: false, access: { has: function (obj) { return "customerName" in obj; }, get: function (obj) { return obj.customerName; }, set: function (obj, value) { obj.customerName = value; } }, metadata: _metadata }, _customerName_initializers, _customerName_extraInitializers);
            __esDecorate(null, null, _customerPhone_decorators, { kind: "field", name: "customerPhone", static: false, private: false, access: { has: function (obj) { return "customerPhone" in obj; }, get: function (obj) { return obj.customerPhone; }, set: function (obj, value) { obj.customerPhone = value; } }, metadata: _metadata }, _customerPhone_initializers, _customerPhone_extraInitializers);
            __esDecorate(null, null, _customerEmail_decorators, { kind: "field", name: "customerEmail", static: false, private: false, access: { has: function (obj) { return "customerEmail" in obj; }, get: function (obj) { return obj.customerEmail; }, set: function (obj, value) { obj.customerEmail = value; } }, metadata: _metadata }, _customerEmail_initializers, _customerEmail_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: function (obj) { return "source" in obj; }, get: function (obj) { return obj.source; }, set: function (obj, value) { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
            __esDecorate(null, null, _offerCode_decorators, { kind: "field", name: "offerCode", static: false, private: false, access: { has: function (obj) { return "offerCode" in obj; }, get: function (obj) { return obj.offerCode; }, set: function (obj, value) { obj.offerCode = value; } }, metadata: _metadata }, _offerCode_initializers, _offerCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateBookingDto = CreateBookingDto;
