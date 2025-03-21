// src/types/models/warehouse.ts

export interface TruckQueue {
    _id: string;
    truckId: string;
    truck?: {
      _id: string;
      noPolisi: string;
      namaKendaraan: string;
    };
    supirId: string;
    supir?: {
      _id: string;
      nama: string;
      telepon?: string;
    };
    noTelp?: string;
    kenekId?: string;
    kenek?: {
      _id: string;
      nama: string;
      telepon?: string;
    };
    noTelpKenek?: string;
    urutan: number;
    status: string; // 'MENUNGGU' | 'MUAT' | 'BERANGKAT'
    cabangId: string;
    cabang?: {
      _id: string;
      namaCabang: string;
    };
    createdBy: string;
    creator?: {
      _id: string;
      nama: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Loading {
    _id: string;
    idMuat: string;
    sttIds: string[];
    stts?: Array<{
      _id: string;
      noSTT: string;
      namaBarang: string;
      cabangTujuanId: string;
      cabangTujuan?: {
        _id: string;
        namaCabang: string;
      };
      jumlahColly: number;
      berat: number;
    }>;
    antrianTruckId: string;
    antrianTruck?: TruckQueue;
    checkerId: string;
    checker?: {
      _id: string;
      nama: string;
    };
    waktuBerangkat?: string;
    waktuSampai?: string;
    keterangan?: string;
    status: string; // 'MUAT' | 'BERANGKAT' | 'SAMPAI'
    cabangMuatId: string;
    cabangMuat?: {
      _id: string;
      namaCabang: string;
    };
    cabangBongkarId: string;
    cabangBongkar?: {
      _id: string;
      namaCabang: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface WarehouseState {
    truckQueues: TruckQueue[];
    loadings: Loading[];
    currentTruckQueue: TruckQueue | null;
    currentLoading: Loading | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface SearchTruckQueueParams {
    status?: string;
    cabangId?: string;
    page?: number;
    limit?: number;
  }
  
  export interface SearchLoadingParams {
    status?: string;
    cabangMuatId?: string;
    cabangBongkarId?: string;
    antrianTruckId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
  
  export interface CreateTruckQueueData {
    truckId: string;
    supirId: string;
    noTelp?: string;
    kenekId?: string;
    noTelpKenek?: string;
    urutan?: number;
  }
  
  export interface CreateLoadingData {
    sttIds: string[];
    antrianTruckId: string;
    checkerId: string;
    cabangMuatId: string;
    cabangBongkarId: string;
    keterangan?: string;
  }
  
  export interface UpdateLoadingStatusData {
    id: string;
    status: string;
    waktuBerangkat?: Date | null;
    waktuSampai?: Date | null;
    keterangan?: string;
  }
  
  export interface UpdateTruckQueueStatusData {
    id: string;
    status: string;
  }