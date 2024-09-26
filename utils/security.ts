import { PDFDocument } from 'pdf-lib';

/**
 * Adds password protection to a generated PDF buffer.
 * @param pdfBuffer The generated PDF buffer.
 * @param password The password for encryption.
 * @returns The password-protected PDF buffer.
 */
export const addPasswordProtection = async (pdfBuffer: Buffer, password: string): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  pdfDoc.encrypt({
    password,
    ownerPassword: password,
    permissions: { printing: 'lowResolution', copying: false },
  });
  return await pdfDoc.save();
};
