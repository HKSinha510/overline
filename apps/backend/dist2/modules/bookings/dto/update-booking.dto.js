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
exports.UpdateBookingDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var UpdateBookingDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _adminNotes_decorators;
    var _adminNotes_initializers = [];
    var _adminNotes_extraInitializers = [];
    var _staffId_decorators;
    var _staffId_initializers = [];
    var _staffId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateBookingDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.adminNotes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _adminNotes_initializers, void 0));
                this.staffId = (__runInitializers(this, _adminNotes_extraInitializers), __runInitializers(this, _staffId_initializers, void 0));
                __runInitializers(this, _staffId_extraInitializers);
            }
            return UpdateBookingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: client_1.BookingStatus, description: 'New booking status' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.BookingStatus)];
            _adminNotes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Admin notes' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _staffId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assigned staff ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _adminNotes_decorators, { kind: "field", name: "adminNotes", static: false, private: false, access: { has: function (obj) { return "adminNotes" in obj; }, get: function (obj) { return obj.adminNotes; }, set: function (obj, value) { obj.adminNotes = value; } }, metadata: _metadata }, _adminNotes_initializers, _adminNotes_extraInitializers);
            __esDecorate(null, null, _staffId_decorators, { kind: "field", name: "staffId", static: false, private: false, access: { has: function (obj) { return "staffId" in obj; }, get: function (obj) { return obj.staffId; }, set: function (obj, value) { obj.staffId = value; } }, metadata: _metadata }, _staffId_initializers, _staffId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateBookingDto = UpdateBookingDto;
