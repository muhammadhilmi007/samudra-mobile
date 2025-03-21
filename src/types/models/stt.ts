// src/types/models/stt.ts

export interface STT {
    _id: string;
    noSTT: string;
    cabangAsalId: string;
    cabangAsal?: {
      _id: string;
      namaCabang: string;
      alamat?: string;
    };
    cabangTujuanId: string;
    cabangTujuan?: {
      _id: string;
      namaCabang: string;
      alamat?: string;
    };
    pengirimId: string;
    pengirim?: {
      _id: string;
      nama: string;
      telepon?: string;
      alamat?: string;
    };
    penerimaId: string;
    penerima?: {
      _id: string;
      nama: string;
      telepon?: string;
      alamat?: string;
    };
    namaBarang: string;
    komoditi: string;
    packing: string;
    jumlahColly: number;
    berat: number;
    hargaPerKilo: number;
    harga: number;
    keterangan?: string;
    kodePenerus?: string;
    penerusId?: string;
    penerus?: {
      _id: string;
      namaPenerus: string;
    };
    paymentType: string; // 'CASH' | 'COD' | 'CAD'
    status: string; // 'PENDING' | 'MUAT' | 'TRANSIT' | 'LANSIR' | 'TERKIRIM' | 'RETURN'
    userId: string;
    cabangId: string;
    barcode: string;
    createdAt: string;
    updatedAt: string;
    // Track the journey through the system
    tracking?: {
      waktuPending?: string;
      waktuMuat?: string;
      waktuTransit?: string;
      waktuLansir?: string;
      waktuTerkirim?: string;
      waktuReturn?: string;
    };
  }
  
  export interface STTState {
    currentSTT: STT | null;
    sttList: STT[];
    scannedSTT: STT | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface SearchSTTParams {
    status?: string;
    cabangId?: string;
    pengirimId?: string;
    penerimaId?: string;
    noSTT?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
  
  export interface UpdateSTTStatusParams {
    id: string;
    status: string;
    namaPenerima?: string;
    keterangan?: string;
  }
  
  export interface CreateSTTData {
    cabangAsalId: string;
    cabangTujuanId: string;
    pengirimId: string;
    penerimaId: string;
    namaBarang: string;
    komoditi: string;
    packing: string;
    jumlahColly: number;
    berat: number;
    hargaPerKilo: number;
    keterangan?: string;
    kodePenerus?: string;
    penerusId?: string;
    paymentType: string;
  }