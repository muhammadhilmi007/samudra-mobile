// src/types/models/auth.ts

export interface User {
    _id: string;
    nama: string;
    jabatan: string;
    roleId: string;
    role?: Role;
    email: string;
    telepon: string;
    alamat: string;
    fotoProfil?: string;
    dokumen?: {
      ktp?: string;
      npwp?: string;
      [key: string]: string | undefined;
    };
    username: string;
    cabangId: string;
    cabang?: {
      _id: string;
      namaCabang: string;
      alamat?: string;
    };
    aktif: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Role {
    _id: string;
    namaRole: string;
    permissions: string[];
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  export interface ResetPasswordData {
    email: string;
  }
  
  export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }