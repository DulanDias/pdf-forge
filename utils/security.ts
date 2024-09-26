import HummusRecipe from 'hummus-recipe';
import fs from 'fs';

/**
 * Adds password protection to a generated PDF buffer.
 * @param pdfBuffer The generated PDF buffer.
 * @param password The password for encryption.
 * @returns The password-protected PDF buffer.
 */
export const addPasswordProtection = async (pdfBuffer: Buffer, password: string): Promise<Buffer> => {
  const inputFilePath = 'temp/input.pdf';
  const outputFilePath = 'temp/output.pdf';

  // Write the input buffer to a temporary file
  fs.writeFileSync(inputFilePath, pdfBuffer);

  // Create the PDF with password protection
  const pdfDoc = new HummusRecipe(inputFilePath, outputFilePath);
  pdfDoc.encrypt({
    userPassword: password,
    ownerPassword: password,
    userProtectionFlag: 4, // Low-resolution printing allowed, no copying
  });
  pdfDoc.endPDF();

  // Read the password-protected PDF back into a buffer
  const encryptedPdfBuffer = fs.readFileSync(outputFilePath);

  // Clean up temporary files
  fs.unlinkSync(inputFilePath);
  fs.unlinkSync(outputFilePath);

  return encryptedPdfBuffer;
};
