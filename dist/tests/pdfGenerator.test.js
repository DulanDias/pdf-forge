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
const path_1 = __importDefault(require("path"));
describe('PDFGenerator', () => {
    let pdfGenerator;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const outputDir = path_1.default.resolve(__dirname, '../output');
        try {
            yield promises_1.default.mkdir(outputDir);
        }
        catch (err) { // Cast err to any
            if (err.code !== 'EEXIST')
                throw err;
        }
    }));
    beforeEach(() => {
        pdfGenerator = new pdfGenerator_1.PDFGenerator();
    });
    it('should generate a PDF with the correct content', () => __awaiter(void 0, void 0, void 0, function* () {
        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            h1 {
                color: #333;
            }
            p {
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <h1>Hello World!</h1>
        <p>This is a PDF generated with rich HTML content, including CSS styling.</p>
    </body>
    </html>
    `;
        const pdfBuffer = yield pdfGenerator.generatePDF(htmlContent, {}, {
            pageSize: 'A4'
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        yield promises_1.default.writeFile('output/richText.pdf', pdfBuffer);
    }));
    it('should apply a header only to the first page', () => __awaiter(void 0, void 0, void 0, function* () {
        const headerHtml = `
      <div style="font-size: 12px; text-align: center;">
        First Page Header
      </div>
    `;
        const footerHtml = `
      <div style="font-size: 10px; text-align: center;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>
    `;
        const htmlContent = `
    <html><body><p>This is content for multiple pages.</p></body></html>
    `;
        const pdfBuffer = yield pdfGenerator.generatePDF(htmlContent, {}, {
            headerTemplate: headerHtml,
            footerTemplate: footerHtml,
            displayHeaderFooter: true,
            firstPageHeaderOnly: true,
            pageSize: 'A4'
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        yield promises_1.default.writeFile('output/headerFooterFirstPageOnly.pdf', pdfBuffer);
    }));
    it('should apply top margin from second page onwards', () => __awaiter(void 0, void 0, void 0, function* () {
        const htmlContent = `
    <html><body><p>This content spans multiple pages.</p></body></html>
    `;
        const headerHtml = `<div style="font-size: 12px; text-align: center;">Header on First Page</div>`;
        const footerHtml = `<div style="font-size: 10px; text-align: center;">Footer</div>`;
        const pdfBuffer = yield pdfGenerator.generatePDF(htmlContent, {}, {
            headerTemplate: headerHtml,
            footerTemplate: footerHtml,
            displayHeaderFooter: true,
            firstPageHeaderOnly: true,
            topMarginSecondPage: '2in',
            pageSize: 'A4'
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        yield promises_1.default.writeFile('output/topMarginSecondPage.pdf', pdfBuffer);
    }));
    it('should generate a PDF with page breaks', () => __awaiter(void 0, void 0, void 0, function* () {
        const htmlWithPageBreaks = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .page-break {
                page-break-after: always;
            }
        </style>
    </head>
    <body>
        <h1>Page 1</h1>
        <p>Content for the first page.</p>

        <div class="page-break"></div>

        <h1>Page 2</h1>
        <p>Content for the second page.</p>
    </body>
    </html>
    `;
        const pdfBuffer = yield pdfGenerator.generatePDF(htmlWithPageBreaks, {}, {
            pageSize: 'A4'
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        yield promises_1.default.writeFile('output/pageBreaks.pdf', pdfBuffer);
    }));
    it('should generate a PDF with custom page size and margins', () => __awaiter(void 0, void 0, void 0, function* () {
        const htmlContent = `<html><body><p>This is a PDF with custom page setup.</p></body></html>`;
        const pdfBuffer = yield pdfGenerator.generatePDF(htmlContent, {}, {
            pageSize: 'Letter',
            margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' },
            landscape: true,
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        yield promises_1.default.writeFile('output/customPageSetup.pdf', pdfBuffer);
    }));
    it('should generate a PDF with fonts and tables', () => __awaiter(void 0, void 0, void 0, function* () {
        const htmlWithFontsAndTables = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Times New Roman', serif;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 8px;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <h1>Styled PDF with Fonts and Tables</h1>
        <table>
            <tr>
                <th>Header 1</th>
                <th>Header 2</th>
            </tr>
            <tr>
                <td>Row 1, Cell 1</td>
                <td>Row 1, Cell 2</td>
            </tr>
        </table>
    </body>
    </html>
    `;
        const pdfBuffer = yield pdfGenerator.generatePDF(htmlWithFontsAndTables, {}, {
            pageSize: 'A4'
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        yield promises_1.default.writeFile('output/fontsAndTables.pdf', pdfBuffer);
    }));
    it('should generate a PDF with a header containing an image and SVG', () => __awaiter(void 0, void 0, void 0, function* () {
        const headerWithImageAndSvg = `
      <div style="text-align: center;">
        <img src="https://example.com/logo.png" width="100" />
        <svg height="50" width="200">
          <rect width="200" height="50" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
        </svg>
      </div>
    `;
        const htmlContent = `<html><body><p>PDF with header image and SVG.</p></body></html>`;
        const pdfBuffer = yield pdfGenerator.generatePDF(htmlContent, {}, {
            headerTemplate: headerWithImageAndSvg,
            footerTemplate: `<div style="font-size: 10px;">Footer</div>`,
            displayHeaderFooter: true,
            pageSize: 'A4'
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        yield promises_1.default.writeFile('output/headerWithImageAndSvg.pdf', pdfBuffer);
    }));
    it('should apply a watermark correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const htmlContent = `<html><body><p>This PDF contains a watermark.</p></body></html>`;
        const pdfBuffer = yield pdfGenerator.generatePDF(htmlContent, {}, {
            watermark: {
                text: {
                    text: 'Confidential',
                    fontSize: 60,
                    color: 'rgba(255, 0, 0, 0.3)',
                    rotation: 45
                }
            },
            pageSize: 'A4'
        });
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
        yield promises_1.default.writeFile('output/watermark.pdf', pdfBuffer);
    }));
});
