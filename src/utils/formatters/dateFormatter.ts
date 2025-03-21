// src/utils/formatters/dateFormatter.ts
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format date string to Indonesian format
 * @param dateString ISO date string
 * @param formatString Optional custom format
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  formatString: string = 'dd MMM yyyy'
): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString, { locale: id });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '';
  }
};

/**
 * Format date and time string to Indonesian format
 * @param dateString ISO date string
 * @param formatString Optional custom format
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  dateString: string,
  formatString: string = 'dd MMM yyyy, HH:mm'
): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString, { locale: id });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString || '';
  }
};

/**
 * Format date object to Indonesian format
 * @param date Date object
 * @param formatString Optional custom format
 * @returns Formatted date string
 */
export const formatDateObject = (
  date: Date,
  formatString: string = 'dd MMM yyyy'
): string => {
  try {
    return format(date, formatString, { locale: id });
  } catch (error) {
    console.error('Error formatting date object:', error);
    return date.toString();
  }
};

/**
 * Format date object to ISO string
 * @param date Date object
 * @returns ISO date string
 */
export const formatToISOString = (date: Date): string => {
  try {
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting to ISO string:', error);
    return '';
  }
};

/**
 * Format date with time to Indonesian format (e.g., "12 Jan 2023, 15:30")
 * @param dateString ISO date string
 * @returns Formatted date and time string
 */
export const formatDateWithTime = (dateString: string): string => {
  return formatDateTime(dateString, 'dd MMM yyyy, HH:mm');
};

/**
 * Format time only from a date string (e.g., "15:30")
 * @param dateString ISO date string
 * @returns Formatted time string
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'HH:mm', { locale: id });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};