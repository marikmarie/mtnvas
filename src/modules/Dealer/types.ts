export interface Dealer {
	id: string;
	dealerName: string;
	email: string;
	createdAt: string;
	status: 'Active' | 'Inactive';
	department: string;
	msisdn: string;
	region?: string;
	location?: string;
}

export interface Shop {
	id: string;
	dealerName: string;
	dealerId: string;
	shopName: string;
	location: string;
	region: string;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
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
	status: 'Active' | 'Inactive';
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
	imei?: string;
	serialNumber?: string;
	productId: string;
	productName: string;
	deviceId: string;
	deviceName: string;
	dealerId: string;
	dealerName: string;
	category: 'wakanet' | 'enterprise';
	status: 'Available' | 'Sold' | 'Transferred';
	assignedAt: string;
	soldAt?: string;
	transferredAt?: string;
}

export interface StockThreshold {
	id: string;
	dealerId: string;
	productId: string;
	deviceId: string;
	category: string;
	threshold: number;
	currentStock: number;
	belowThreshold: boolean;
	emailNotifications: boolean;
	smsNotifications: boolean;
	lastNotifiedAt?: string;
}

export interface StockTransfer {
	id: string;
	fromDealerId: string;
	fromDealerName: string;
	toDealerId: string;
	toDealerName: string;
	imeiCount: number;
	transferredBy: string;
	reason?: string;
	createdAt: string;
	imeis: string[];
}

export interface StockTransferRequest {
	imeis: string[];
	fromDealerId: string;
	toDealerId: string;
	reason?: string;
}

export interface StockUploadResponse {
	totalProcessed: number;
	successCount: number;
	errorCount: number;
	errors: Array<{
		row: number;
		imei: string;
		error: string;
	}>;
}

export interface StockUploadRequest {
	dealerId: string;
	category: 'wakanet' | 'enterprise' | 'both';
	productId: string;
	deviceId: string;
	imeiFile: File;
}

export interface StockThresholdRequest {
	dealerId: string;
	category: 'wakanet' | 'enterprise' | 'both';
	productId: string;
	deviceId: string;
	threshold: number;
	emailNotifications: boolean;
	smsNotifications: boolean;
	notificationEmails?: string[];
	notificationMsisdns?: string[];
}

export interface StockThresholdUpdateRequest {
	threshold?: number;
	emailNotifications?: boolean;
	smsNotifications?: boolean;
	notificationEmails?: string[];
	notificationMsisdns?: string[];
}

export interface StockThresholdAlert {
	dealerId: string;
	dealerName: string;
	productName: string;
	deviceName: string;
	currentStock: number;
	threshold: number;
	shortfall: number;
}

export interface StockThresholdAlertsResponse {
	totalAlerts: number;
	alerts: StockThresholdAlert[];
}

export interface ImeiDetails {
	imei: string;
	status: 'Available' | 'Assigned' | 'Active' | 'Inactive' | 'Swapped';
	productId: string;
	productName: string;
	deviceId: string;
	deviceName: string;
	dealerId: string;
	dealerName: string;
	agentId?: string;
	agentName?: string;
	activatedAt?: string;
	lastSwapDate?: string;
	swapHistory: ImeiSwap[];
}

export interface ImeiAvailabilityCheck {
	available: boolean;
	active: boolean;
	canSwap: boolean;
	belongsToDealer: boolean;
	dealerId?: string;
	currentStatus: string;
}

export interface ImeiSwapRequest {
	oldImei: string;
	newImei: string;
	reason: string;
	agentId: string;
	customerId?: string;
}

export interface ImeiSwapRequestDetails {
	id: string;
	oldImei: string;
	newImei: string;
	reason: string;
	agentId: string;
	agentName: string;
	dealerId: string;
	status: 'pending' | 'approved' | 'rejected';
	requestedAt: string;
	processedAt?: string;
	processedBy?: string;
}

export interface ImeiSwapApproval {
	action: 'approve' | 'reject';
	reason?: string;
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
	agentId: string;
	agentName: string;
	customerId?: string;
	swappedAt: string;
	approvedBy: string;
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
	status: 'Active' | 'Inactive';
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
	status: 'Active' | 'Inactive' | 'Pending Approval';
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
	onDuplicateFound: (result: AgentDuplicateResponse) => void;
}

export interface AddAgentCategoryModalProps {
	opened: boolean;
	onClose: () => void;
	agent: Agent;
}

// IMEI Modal Props
export interface ImeiDetailsModalProps {
	opened: boolean;
	onClose: () => void;
	imei: string;
}

export interface ImeiSwapModalProps {
	opened: boolean;
	onClose: () => void;
	imei?: string;
}

export interface ImeiSwapApprovalModalProps {
	opened: boolean;
	onClose: () => void;
	swapRequest: ImeiSwapRequestDetails;
}

export interface ImeiSwapRequestsModalProps {
	opened: boolean;
	onClose: () => void;
}

// =====================
// Sales and Transaction Management Types
// =====================

// Transaction Interface
export interface Transaction {
	id: string;
	type: 'activation' | 'cash_sale';
	agentId: string;
	agentName: string;
	dealerId: string;
	shopId?: string;
	customerId?: string;
	customerName?: string;
	productId: string;
	productName: string;
	imei: string;
	amount: number;
	paymentMethod: 'cash' | 'mobile_money';
	commission: number;
	status: 'Completed' | 'Pending' | 'Failed';
	receiptNumber?: string;
	createdAt: string;
}

// Customer Activation Request
export interface CustomerActivationRequest {
	agentId: string;
	receiptNumber: string;
	deviceMsisdn: string;
	imei: string;
	customerId?: string;
	customerName?: string;
	customerPhone?: string;
}

// Customer Activation Response
export interface CustomerActivationResponse {
	transactionId: string;
	activationId: string;
	status: 'Completed' | 'Failed';
	commissionEarned?: number;
}

// Cash Sale Request
export interface CashSaleRequest {
	agentId: string;
	customerId?: string;
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
	productId: string;
	deviceId: string;
	imei: string;
	paymentMethod: 'cash' | 'mobile_money';
	amount: number;
	sponsorMsisdn?: string; // For mobile money
}

// Cash Sale Response
export interface CashSaleResponse {
	transactionId: string;
	receiptNumber: string;
	activationId?: string;
}

// Transaction Summary
export interface TransactionSummary {
	totalAmount: number;
	totalCommission: number;
	totalTransactions: number;
}

// Sales Report Request
export interface SalesReportRequest {
	reportType: 'summary' | 'detailed';
	dateFrom: string;
	dateTo: string;
	dealerId?: string;
	agentId?: string;
	shopId?: string;
	productId?: string;
	groupBy?: 'dealer' | 'agent' | 'shop' | 'product' | 'date';
}

// Sales Report Response
export interface SalesReportResponse {
	summary: {
		totalSales: number;
		totalCommission: number;
		totalTransactions: number;
		activations: number;
		cashSales: number;
	};
	breakdown: Array<{
		groupKey: string;
		groupLabel: string;
		sales: number;
		commission: number;
		transactions: number;
	}>;
	chartData?: Array<{
		date: string;
		sales: number;
		transactions: number;
	}>;
}

// Modal Props for Sales Management
export interface CustomerActivationModalProps {
	opened: boolean;
	onClose: () => void;
}

export interface CashSaleModalProps {
	opened: boolean;
	onClose: () => void;
}

export interface SalesReportModalProps {
	opened: boolean;
	onClose: () => void;
}

// =====================
// Commission Management Types
// =====================

// Commission Rate Interface
export interface CommissionRate {
	id: string;
	dealerId?: string;
	userType: 'shop_agent' | 'dsa' | 'retailer';
	productId: string;
	productName: string;
	commissionType: 'fixed' | 'percentage';
	amount: number;
	currency: string;
	effectiveFrom: string;
	isActive: boolean;
}

// Commission Rate Request
export interface CommissionRateRequest {
	dealerId?: string;
	userType: 'shop_agent' | 'dsa' | 'retailer';
	productId: string;
	commissionType: 'fixed' | 'percentage';
	amount: number;
	currency?: string;
	effectiveFrom?: string;
}

// Commission Earning Interface
export interface CommissionEarning {
	id: string;
	agentId: string;
	agentName: string;
	transactionId: string;
	productName: string;
	commissionAmount: number;
	status: 'Pending' | 'Paid' | 'Cancelled';
	earnedAt: string;
	paidAt?: string;
}

// Commission Earnings Summary
export interface CommissionEarningsSummary {
	totalEarned: number;
	totalPaid: number;
	totalPending: number;
}

// Commission Earnings Response
export interface CommissionEarningsResponse {
	data: CommissionEarning[];
	summary: CommissionEarningsSummary;
}

// Commission Modal Props
export interface CommissionRateModalProps {
	opened: boolean;
	onClose: () => void;
	commissionRate?: CommissionRate | null;
}

export interface CommissionEarningsModalProps {
	opened: boolean;
	onClose: () => void;
	earning: CommissionEarning | null;
}

export interface BulkCommissionPaymentModalProps {
	opened: boolean;
	onClose: () => void;
	selectedEarnings: CommissionEarning[];
}
