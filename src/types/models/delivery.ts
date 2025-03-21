// src/types/models/delivery.ts

export interface Delivery {
    _id: string;
    idLansir: string;
    sttIds: string[];
    stts?: Array<{
      _id: string;
      noSTT: string;
      namaBarang: string;
      penerimaId: string;
      penerima?: {
        nama: string;
        alamat?: string;
        telepon?: string;
      };
      jumlahColly: number;
      berat: number;
      paymentType: string;
    }>;
    antrianKendaraanId: string;
    antrianKendaraan?: {
      _id: string;
      kendaraanId: string;
      kendaraan?: {
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
      kenekId?: string;
      kenek?: {
        _id: string;
        nama: string;
        telepon?: string;
      };
    };
    checkerId: string;
    checker?: {
      _id: string;
      nama: string;
    };
    adminId: string;
    admin?: {
      _id: string;
      nama: string;
    };
    berangkat: string;
    sampai?: string;
    estimasiLansir?: string;
    kilometerBerangkat?: number;
    kilometerPulang?: number;
    namaPenerima?: string;
    keterangan?: string;
    status: string; // 'LANSIR' | 'TERKIRIM' | 'BELUM SELESAI'
    cabangId: string;
    cabang?: {
      _id: string;
      namaCabang: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface VehicleQueue {
    _id: string;
    kendaraanId: string;
    kendaraan?: {
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
    kenekId?: string;
    kenek?: {
      _id: string;
      nama: string;
      telepon?: string;
    };
    urutan: number;
    status: string; // 'MENUNGGU' | 'LANSIR' | 'KEMBALI'
    cabangId: string;
    cabang?: {
      _id: string;
      namaCabang: string;
    };
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface DeliveryState {
    deliveries: Delivery[];
    currentDelivery: Delivery | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface SearchDeliveryParams {
    status?: string;
    cabangId?: string;
    sttId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
  
  export interface CreateDeliveryData {
    sttIds: string[];
    antrianKendaraanId: string;
    checkerId: string;
    adminId: string;
    berangkat: Date;
    estimasiLansir?: string;
    kilometerBerangkat?: number;
  }
  
  export interface UpdateDeliveryData {
    sttIds?: string[];
    antrianKendaraanId?: string;
    checkerId?: string;
    adminId?: string;
    berangkat?: Date;
    sampai?: Date;
    estimasiLansir?: string;
    kilometerBerangkat?: number;
    kilometerPulang?: number;
    namaPenerima?: string;
    keterangan?: string;
  }
  
  export interface DeliveryStatusUpdate {
    id: string;
    status: string;
    namaPenerima?: string | null;
    keterangan?: string | null;
    sampai?: Date | null;
    kilometerPulang?: number | null;
  }
  
  export interface CreateVehicleQueueData {
    kendaraanId: string;
    supirId: string;
    kenekId?: string;
    urutan?: number;
  }