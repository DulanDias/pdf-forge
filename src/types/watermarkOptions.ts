/**
 * Configuration for a text-based watermark.
 */
export interface TextWatermarkOptions {
    text: string;
    fontSize?: number;
    color?: string;
    opacity?: number;
    position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    rotation?: number;
  }
  
  /**
   * Configuration for an image-based watermark.
   */
  export interface ImageWatermarkOptions {
    imageUrl: string;
    width?: number;
    height?: number;
    opacity?: number;
    position?: 'center' | 'tiled' | 'top' | 'bottom' | 'left' | 'right';
  }
  
  /**
   * Configuration for a pattern-based watermark (e.g., grid, diagonal lines).
   */
  export interface PatternWatermarkOptions {
    type: 'grid' | 'diagonalLines';
    color?: string;
    thickness?: number;
    opacity?: number;
    spacing?: number;
  }
  
  /**
   * General watermark options.
   */
  export interface WatermarkOptions {
    text?: TextWatermarkOptions;
    image?: ImageWatermarkOptions;
    pattern?: PatternWatermarkOptions;
  }
  