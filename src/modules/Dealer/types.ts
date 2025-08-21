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
	status: 'PendingApproval' | 'Active' | 'Inactive';
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
	userType: UserType;
	createdAt: string;
	status: 'Active' | 'Inactive';
}

export interface Product {
	id: number;
	productName: string;
	description: string;
	productCategory: string;
	status: string;
	price: number;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
}

export interface Device {
	id: number;
	deviceName: string;
	description: string;
	deviceCategory: string;
	status: string;
	price: number;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
}

export interface Stock {
	imei: string;
	serialNumber: string | null;
	productId: number;
	deviceId: number;
	dealerId: number;
	status: number;
	soldAt: null;
	transferedOn: string | null;
	createdAt: string;
	updatedAt: string;
	dealerName: string;
	productName: string;
	deviceName: string;
	assignedAt: string;
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
	transferredByName?: string;
	reason?: string;
	status: 'Pending' | 'Approved' | 'Rejected';
	createdAt: string;
	updatedAt?: string;
	approvedBy?: string;
	approvedByName?: string;
	approvedAt?: string;
	rejectionReason?: string;
	imeis: string[];
}

export interface StockTransferRequest {
	imeis: string[];
	fromDealerId: string;
	toDealerId: string;
	reason?: string;
}

export interface StockTransferApprovalRequest {
	action: 'approve' | 'reject';
	reason?: string;
}

export interface StockTransferListParams {
	page?: number;
	pageSize?: number;
	from?: string;
	to?: string;
	fromDealerId?: number;
	toDealerId?: number;
	status?: string;
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
	userType: UserType;
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

export type UserType = 'ShopAgent' | 'DSA' | 'Retailer';
export type AgentStatus = 'Active' | 'Inactive' | 'PendingApproval';

export interface Agent {
	id: string;
	agentName: string;
	email: string;
	msisdn: string;
	userType: UserType;
	dealerId: string;
	shopId?: string;
	merchantCode?: string;
	status: AgentStatus;
	location: string;
	region: string;
	createdAt: string;
}

export interface AgentApprovalPayload {
	action: 'Approve' | 'Reject';
	reason?: string;
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
	userType: UserType;
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
	action: 'Approve' | 'Reject';
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
	userType: UserType;
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
	userType: UserType;
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
