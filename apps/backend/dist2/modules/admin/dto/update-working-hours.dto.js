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
exports.UpdateWorkingHoursDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var UpdateWorkingHoursDto = function () {
    var _a;
    var _openTime_decorators;
    var _openTime_initializers = [];
    var _openTime_extraInitializers = [];
    var _closeTime_decorators;
    var _closeTime_initializers = [];
    var _closeTime_extraInitializers = [];
    var _isClosed_decorators;
    var _isClosed_initializers = [];
    var _isClosed_extraInitializers = [];
    var _breakWindows_decorators;
    var _breakWindows_initializers = [];
    var _breakWindows_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateWorkingHoursDto() {
                this.openTime = __runInitializers(this, _openTime_initializers, void 0);
                this.closeTime = (__runInitializers(this, _openTime_extraInitializers), __runInitializers(this, _closeTime_initializers, void 0));
                this.isClosed = (__runInitializers(this, _closeTime_extraInitializers), __runInitializers(this, _isClosed_initializers, void 0));
                this.breakWindows = (__runInitializers(this, _isClosed_extraInitializers), __runInitializers(this, _breakWindows_initializers, void 0));
                __runInitializers(this, _breakWindows_extraInitializers);
            }
            return UpdateWorkingHoursDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _openTime_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Opening time (HH:mm)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Invalid time format' })];
            _closeTime_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Closing time (HH:mm)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Invalid time format' })];
            _isClosed_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Is closed for this day' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _breakWindows_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Break windows', type: 'array' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            __esDecorate(null, null, _openTime_decorators, { kind: "field", name: "openTime", static: false, private: false, access: { has: function (obj) { return "openTime" in obj; }, get: function (obj) { return obj.openTime; }, set: function (obj, value) { obj.openTime = value; } }, metadata: _metadata }, _openTime_initializers, _openTime_extraInitializers);
            __esDecorate(null, null, _closeTime_decorators, { kind: "field", name: "closeTime", static: false, private: false, access: { has: function (obj) { return "closeTime" in obj; }, get: function (obj) { return obj.closeTime; }, set: function (obj, value) { obj.closeTime = value; } }, metadata: _metadata }, _closeTime_initializers, _closeTime_extraInitializers);
            __esDecorate(null, null, _isClosed_decorators, { kind: "field", name: "isClosed", static: false, private: false, access: { has: function (obj) { return "isClosed" in obj; }, get: function (obj) { return obj.isClosed; }, set: function (obj, value) { obj.isClosed = value; } }, metadata: _metadata }, _isClosed_initializers, _isClosed_extraInitializers);
            __esDecorate(null, null, _breakWindows_decorators, { kind: "field", name: "breakWindows", static: false, private: false, access: { has: function (obj) { return "breakWindows" in obj; }, get: function (obj) { return obj.breakWindows; }, set: function (obj, value) { obj.breakWindows = value; } }, metadata: _metadata }, _breakWindows_initializers, _breakWindows_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateWorkingHoursDto = UpdateWorkingHoursDto;
