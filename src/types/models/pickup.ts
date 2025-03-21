// src/types/models/pickup.ts

export interface PickupRequest {
    _id: string;
    tanggal: string;
    pengirimId: string;
    pengirim?: {
      _id: string;
      nama: string;
      telepon?: string;
      alamat?: string;
    };
    alamatPengambilan: string;
    tujuan: string;
    jumlahColly: number;
    userId: string;
    user?: {
      _id: string;
      nama: string;
    };
    cabangId: string;
    cabang?: {
      _id: string;
      namaCabang: string;
    };
    status: string; // 'PENDING' | 'FINISH'
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Pickup {
    _id: string;
    tanggal: string;
    noPengambilan: string;
    pengirimId: string;
    pengirim?: {
      _id: string;
      nama: string;
      telepon?: string;
      alamat?: string;
    };
    sttIds: string[];
    stts?: Array<{
      _id: string;
      noSTT: string;
      namaBarang: string;
      jumlahColly: number;
      berat: number;
    }>;
    supirId: string;
    supir?: {
      _id: string;
      nama: string;
      telepon?: string;
    };
    kenekId?: string;
    kenek?: {
      _id: string;
      nama: string;
      telepon?: string;
    };
    kendaraanId: string;
    kendaraan?: {
      _id: string;
      noPolisi: string;
      namaKendaraan: string;
    };
    waktuBerangkat: string;
    waktuPulang?: string;
    estimasiPengambilan?: string;
    userId: string;
    user?: {
      _id: string;
      nama: string;
    };
    cabangId: string;
    cabang?: {
      _id: string;
      namaCabang: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PickupState {
    pickupRequests: PickupRequest[];
    pickups: Pickup[];
    currentPickup: Pickup | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface PickupRequestParams {
    status?: string;
    cabangId?: string;
    pengirimId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
  
  export interface CreatePickupRequestData {
    pengirimId: string;
    alamatPengambilan: string;
    tujuan: string;
    jumlahColly: number;
  }
  
  export interface CreatePickupData {
    pengirimId: string;
    sttIds: string[];
    supirId: string;
    kenekId?: string;
    kendaraanId: string;
    waktuBerangkat: Date;
    estimasiPengambilan?: string;
  }
  
  export interface UpdatePickupData {
    pengirimId?: string;
    sttIds?: string[];
    supirId?: string;
    kenekId?: string;
    kendaraanId?: string;
    waktuBerangkat?: Date;
    waktuPulang?: Date;
    estimasiPengambilan?: string;
  }