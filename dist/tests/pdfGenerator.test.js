"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfGenerator_1 = require("../src/pdfGenerator");
const promises_1 = __importDefault(require("fs/promises"));
describe('PDFGenerator', () => {
    let pdfGenerator;
    beforeAll(() => {
        pdfGenerator = new pdfGenerator_1.PDFGenerator();
    });
    it('should generate a PDF with the correct content', () => __awaiter(void 0, void 0, void 0, function* () {
        const templatePath = './src/templates/sampleTemplate.html';
        const templateData = { title: 'Test Title', content: 'This is a test content.' };
        const pdfBuffer = yield pdfGenerator.generatePDF(templatePath, templateData, {});
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        // Optional: save the PDF to a file to visually inspect the output
        yield promises_1.default.writeFile('output/test.pdf', pdfBuffer);
    }));
    it('should apply a watermark correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const templatePath = './src/templates/sampleTemplate.html';
        const templateData = { title: 'Watermark Test', content: 'This PDF contains a watermark.' };
        const pdfBuffer = yield pdfGenerator.generatePDF(templatePath, templateData, {
            watermark: { text: { text: 'Confidential', opacity: 0.2, rotation: 45 } }
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        // Optional: save the PDF with the watermark to inspect
        yield promises_1.default.writeFile('output/watermark_test.pdf', pdfBuffer);
    }));
});
