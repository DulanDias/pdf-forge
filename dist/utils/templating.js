"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileTemplate = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
/**
 * Compiles an HTML template using Handlebars with the given data.
 * @param templateContent The raw HTML template as a string.
 * @param data The dynamic data to be injected into the template.
 * @returns The compiled HTML with the data injected.
 */
const compileTemplate = (templateContent, data) => {
    const template = handlebars_1.default.compile(templateContent);
    return template(data);
};
exports.compileTemplate = compileTemplate;
