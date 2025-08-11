export interface Dealer {
	id: string;
	name: string;
	contactPerson: string;
	email: string;
	phone: string;
	category: 'wakanet' | 'enterprise' | 'both';
	createdAt: string;
	status: 'active' | 'inactive';
	department: 'wakanet' | 'enterprise' | 'both';
	msisdn: string;
	companyName: string;
	region?: string;
	location?: string;
}

export interface Shop {
	id: string;
	shopName: string;
	dealerId: string;
	dealerName: string;
	location: string;
	region: string;
	status: 'active' | 'inactive' | 'pending_approval';
	adminId?: string;
	adminName?: string;
	agentCount: number;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface ShopUser {
	id: string;
	name: string;
	email: string;
	msisdn: string;
	shopId: string;
	shopName: string;
	userType: 'shop_agent' | 'dsa' | 'retailer';
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
	sold: number;
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

export interface Imei {
	id: string;
	imei: string;
	status: 'available' | 'assigned' | 'active' | 'inactive';
	soldBy: string;
	soldById: string;
	date: string;
}

export interface ImeiTransfer {
	id: string;
	imei: string;
	fromDealerId: string;
	fromDealerName: string;
	fromProductId: string;
	fromProductName: string;
	toDealerId: string;
	toDealerName: string;
	toProductId: string;
	toProductName: string;
	transferDate: string;
}

export interface ImeiSwap {
	id: string;
	oldImei: string;
	newImei: string;
	reason: string;
	swappedBy: string;
	swappedById: string;
	swapDate: string;
}

export interface DealerModalProps {
	opened: boolean;
	onClose: () => void;
	dealer?: Dealer;
}

export interface DealerAdmin {
	id: string;
	name: string;
	email: string;
	msisdn: string;
	role: 'dealer_super_admin' | 'dealer_admin';
	department: 'wakanet' | 'enterprise' | 'both';
	status: 'active' | 'inactive';
	createdAt: string;
}

export interface StockSummary {
	totalStock: number;
	availableStock: number;
	soldStock: number;
	byProduct: Array<{
		productId: string;
		productName: string;
		total: number;
		available: number;
		sold: number;
	}>;
	byDealer: Array<{
		dealerId: string;
		dealerName: string;
		total: number;
		available: number;
		sold: number;
	}>;
}

export interface DealerDetailsResponse {
	dealer: Dealer;
	admins: DealerAdmin[];
	shops: Shop[];
	stockSummary: StockSummary;
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
	userType: 'shop_agent' | 'dsa' | 'retailer';
}

export interface StockModalProps {
	opened: boolean;
	onClose: () => void;
}

export interface StockThresholdModalProps {
	opened: boolean;
	onClose: () => void;
}

export interface EditShopModalProps {
	opened: boolean;
	onClose: () => void;
	shop: Shop;
}

export interface AssignShopAdminModalProps {
	opened: boolean;
	onClose: () => void;
	shop: Shop;
}

export interface ShopApprovalModalProps {
	opened: boolean;
	onClose: () => void;
	shop: Shop;
	action: 'approve' | 'reject';
}

export interface Agent {
	id: string;
	name: string;
	email: string;
	msisdn: string;
	userType: 'shop_agent' | 'dsa' | 'retailer';
	dealerId: string;
	shopId?: string;
	merchantCode?: string;
	status: 'active' | 'inactive' | 'pending_approval';
	location: string;
	createdAt: string;
}

export interface AgentApprovalPayload {
	action: 'approve' | 'reject';
	reason?: string;
	name?: string;
	email?: string;
	msisdn?: string;
	location?: string;
}

export interface AgentDuplicateCheck {
	msisdn?: string;
	email?: string;
	merchantCode?: string;
}

export interface AgentDuplicateResponse {
	exists: boolean;
	existingAgent?: {
		id: string;
		name: string;
		userTypes: string[];
		dealerId: string;
	};
	canAddCategory: boolean;
}

export interface AddAgentCategoryPayload {
	userType: 'shop_agent' | 'dsa' | 'retailer';
	shopId?: string;
}

export interface AgentModalProps {
	opened: boolean;
	onClose: () => void;
	agent?: Agent;
}

export interface AgentApprovalModalProps {
	opened: boolean;
	onClose: () => void;
	agent: Agent;
	action: 'approve' | 'reject';
}

export interface AgentDuplicateCheckModalProps {
	opened: boolean;
	onClose: () => void;
	onDuplicateFound: ( result: AgentDuplicateResponse ) => void;
}

export interface AddAgentCategoryModalProps {
	opened: boolean;
	onClose: () => void;
	agent: Agent;
}
