export interface Dealer {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    category: 'wakanet' | 'enterprise' | 'both';
    createdAt: string;
    status: 'active' | 'inactive';
}

export interface Shop {
    id: string;
    name: string;
    location: string;
    region: string;
    dealerId: string;
    dealerName: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface ShopUser {
    id: string;
    name: string;
    email: string;
    msisdn: string;
    shopId: string;
    shopName: string;
    userType: 'DSA' | 'Retailer' | 'ShopAgent';
    createdAt: string;
    status: 'active' | 'inactive';
}

export interface Product {
    id: string;
    name: string;
    category: 'wakanet' | 'enterprise' | 'both';
}

export interface Device {
    id: string;
    name: string;
    category: 'wakanet' | 'enterprise' | 'both';
}

export interface Stock {
    id: string;
    dealerId: string;
    dealerName: string;
    productId: string;
    productName: string;
    deviceId: string;
    deviceName: string;
    category: 'wakanet' | 'enterprise' | 'both';
    imeiFile: string;
    quantity: number;
    createdAt: string;
}

export interface StockThreshold {
    id: string;
    dealerId: string;
    dealerName: string;
    productId: string;
    productName: string;
    deviceId: string;
    deviceName: string;
    threshold: number;
    createdAt: string;
}

export interface DealerModalProps {
    opened: boolean;
    onClose: () => void;
    dealer?: Dealer;
}

export interface ShopModalProps {
    opened: boolean;
    onClose: () => void;
    shop?: Shop;
}

export interface ShopUserModalProps {
    opened: boolean;
    onClose: () => void;
    shop: Shop;
    userType: 'DSA' | 'Retailer' | 'ShopAgent';
}

export interface StockModalProps {
    opened: boolean;
    onClose: () => void;
}

export interface StockThresholdModalProps {
    opened: boolean;
    onClose: () => void;
}
