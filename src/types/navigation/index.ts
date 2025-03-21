// src/types/navigation/index.ts

export type RootStackParamList = {
    // Auth stack
    Auth: undefined;
    Login: undefined;
    ForgotPassword: undefined;
    
    // Main tabs
    MainTabs: undefined;
    
    // Dashboard stack
    Dashboard: undefined;
    Profile: undefined;
    Settings: undefined;
    
    // Pickup stack
    PickupHome: undefined;
    PickupRequests: undefined;
    PickupRequestDetails: { id: string };
    CreatePickup: { requestId?: string };
    PickupDetails: { id: string };
    CompletePickup: { id: string };
    
    // STT stack
    STTHome: undefined;
    STTSearch: undefined;
    STTScanner: undefined;
    STTDetails: { id: string; barcode?: string };
    CreateSTT: undefined;
    
    // Warehouse stack
    WarehouseHome: undefined;
    TruckQueues: undefined;
    CreateTruckQueue: undefined;
    LoadingList: undefined;
    CreateLoading: { truckQueueId?: string };
    LoadingDetails: { id: string };
    
    // Delivery stack
    DeliveryHome: undefined;
    DeliveryList: undefined;
    VehicleQueues: undefined;
    CreateVehicleQueue: undefined;
    CreateDelivery: { vehicleQueueId?: string };
    DeliveryDetails: { id: string };
    CompleteDelivery: { id: string };
    
    // Checker stack
    CheckerHome: undefined;
    CheckerSTTScanner: undefined;
    CheckerPickupAssign: undefined;
    CheckerLoadingAssign: undefined;
    CheckerDeliveryAssign: undefined;
  };
  
  export type AuthStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
  };
  
  export type MainTabsParamList = {
    DashboardTab: undefined;
    PickupTab: undefined;
    STTTab: undefined;
    WarehouseTab: undefined;
    DeliveryTab: undefined;
  };
  
  export type DashboardStackParamList = {
    Dashboard: undefined;
    Profile: undefined;
    Settings: undefined;
  };
  
  export type PickupStackParamList = {
    PickupHome: undefined;
    PickupRequests: undefined;
    PickupRequestDetails: { id: string };
    CreatePickup: { requestId?: string };
    PickupDetails: { id: string };
    CompletePickup: { id: string };
  };
  
  export type STTStackParamList = {
    STTHome: undefined;
    STTSearch: undefined;
    STTScanner: undefined;
    STTDetails: { id: string; barcode?: string };
    CreateSTT: undefined;
  };
  
  export type WarehouseStackParamList = {
    WarehouseHome: undefined;
    TruckQueues: undefined;
    CreateTruckQueue: undefined;
    LoadingList: undefined;
    CreateLoading: { truckQueueId?: string };
    LoadingDetails: { id: string };
  };
  
  export type DeliveryStackParamList = {
    DeliveryHome: undefined;
    DeliveryList: undefined;
    VehicleQueues: undefined;
    CreateVehicleQueue: undefined;
    CreateDelivery: { vehicleQueueId?: string };
    DeliveryDetails: { id: string };
    CompleteDelivery: { id: string };
  };
  
  export type CheckerStackParamList = {
    CheckerHome: undefined;
    CheckerSTTScanner: undefined;
    CheckerPickupAssign: undefined;
    CheckerLoadingAssign: undefined;
    CheckerDeliveryAssign: undefined;
  };