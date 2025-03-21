// src/utils/formatters/currencyFormatter.ts

/**
 * Format number to Indonesian Rupiah currency
 * @param value Number to format
 * @param options Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
    value: number,
    options: {
      useSymbol?: boolean;
      decimals?: number;
    } = {}
  ): string => {
    const { useSymbol = true, decimals = 0 } = options;
    
    try {
      // Format number with decimal points and thousand separators
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      
      let formatted = formatter.format(value);
      
      // Remove currency symbol if not needed
      if (!useSymbol) {
        formatted = formatted.replace(/[^\d,.]/g, '').trim();
      }
      
      return formatted;
    } catch (error) {
      console.error('Error formatting currency:', error);
      return value?.toString() || '0';
    }
  };
  
  /**
   * Format number to compact currency format (e.g., 1.5jt, 2rb)
   * @param value Number to format
   * @param useSymbol Whether to include Rp symbol
   * @returns Compact currency string
   */
  export const formatCompactCurrency = (
    value: number,
    useSymbol: boolean = true
  ): string => {
    try {
      const symbol = useSymbol ? 'Rp' : '';
      
      if (value >= 1_000_000_000) {
        return `${symbol}${(value / 1_000_000_000).toFixed(1)}M`;
      }
      
      if (value >= 1_000_000) {
        return `${symbol}${(value / 1_000_000).toFixed(1)}jt`;
      }
      
      if (value >= 1_000) {
        return `${symbol}${(value / 1_000).toFixed(0)}rb`;
      }
      
      return `${symbol}${value}`;
    } catch (error) {
      console.error('Error formatting compact currency:', error);
      return value?.toString() || '0';
    }
  };
  
  /**
   * Parse currency string to number
   * @param valueString Currency string
   * @returns Parsed number
   */
  export const parseCurrency = (valueString: string): number => {
    try {
      // Remove all non-numeric characters except decimal point
      const numericString = valueString.replace(/[^\d,.]/g, '').replace(',', '.');
      return parseFloat(numericString);
    } catch (error) {
      console.error('Error parsing currency:', error);
      return 0;
    }
  };