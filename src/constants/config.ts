// src/constants/config.ts
const DEV = {
    API_URL: 'http://localhost:5000/api', // For Android Emulator
    // API_URL: 'http://localhost:5000/api', // For iOS Simulator
  };
  
  const PROD = {
    API_URL: 'https://api.samudra-logistics.com/api',
  };
  
  // Set environment based on ENV variable or default to dev
  const ENV = process.env.NODE_ENV === 'production' ? PROD : DEV;
  
  export const CONFIG = {
    ...ENV,
    APP_NAME: 'Samudra ERP',
    APP_VERSION: '1.0.0',
    STORAGE_KEYS: {
      AUTH_TOKEN: '@samudra_auth_token',
      USER_DATA: '@samudra_user_data',
      SETTINGS: '@samudra_settings',
    },
    TIMEOUT: 15000, // API timeout in milliseconds
  };
  
  export const STT_STATUS = {
    PENDING: 'PENDING',
    PICKUP: 'PICKUP',
    MUAT: 'MUAT',
    TRANSIT: 'TRANSIT',
    LANSIR: 'LANSIR',
    TERKIRIM: 'TERKIRIM',
    RETURN: 'RETURN',
  };
  
  export const PAYMENT_TYPES = {
    CASH: 'CASH',
    COD: 'COD',
    CAD: 'CAD',
  };
  
  export const USER_ROLES = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    SALES: 'SALES',
    FINANCE: 'FINANCE',
    CHECKER: 'CHECKER',
    DRIVER: 'DRIVER',
    WAREHOUSE: 'WAREHOUSE',
    CUSTOMER: 'CUSTOMER',
  };
  
  export const FORWARDING_CODES = {
    NO_FORWARDING: '70',
    PAID_BY_SENDER: '71',
    PAID_BY_RECEIVER: '72',
    ADVANCED_BY_RECEIVER_BRANCH: '73',
  };