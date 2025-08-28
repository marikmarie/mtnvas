export interface Dealer {
	id: number;
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
	id: number;
	dealerName: string;
	dealerId: number;
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
	id: number;
	name: string;
	email: string;
	msisdn: string;
	shopId: number;
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
	id: number;
	dealerid: number;
	productId: number;
	deviceId: number;
	category: string;
	threshold: number;
	currentStock: number;
	belowThreshold: boolean;
	emailNotifications: boolean;
	smsNotifications: boolean;
	lastNotifiedAt?: string;
}

export interface StockTransfer {
	id: number;
	fromDealerId: number;
	toDealerId: number;
	imeiCount: number;
	reason: string;
	transferredBy: string;
	createdAt: string;
	status: string;
}

export interface StockTransferRequest {
	imeis: string[];
	fromDealerId: number;
	toDealerId: number;
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
	dealerid: number;
	category: 'wakanet' | 'enterprise' | 'both';
	productId: number;
	deviceId: number;
	imeiFile: File;
}

export interface StockThresholdRequest {
	dealerId: number;
	productId: number;
	deviceId: number;
	threshold: number;
	emailNotifications: boolean;
	smsNotifications: boolean;
	createdBy: string;
	notificationEmails: string[];
	notificationMsisdns: string[];
}

export interface StockThresholdUpdateRequest {
	threshold: number;
	emailNotifications: boolean;
	smsNotifications: boolean;
	notificationEmails: string[];
	notificationMsisdns: string[];
}

export interface StockThresholdResponse {
	id: number;
	dealerId: number;
	productId: number;
	deviceId: number;
	dealerName: string;
	productName: string;
	deviceName: string;
	threshold: number;
	currentStock: number;
	setBy: string | null;
	belowThreshold: boolean;
	emailNotifications: boolean;
	smsNotifications: boolean;
	lastNotifiedAt: string | null;
}

export interface StockThresholdListParams {
	dealerId?: number;
	category?: string;
	belowThreshold?: boolean;
}

export interface StockThresholdAlert {
	dealerId: number;
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

// IMEI Types
export interface ImeiDetails {
	imei: string;
	serialNumber: string | null;
	productId: number;
	deviceId: number;
	dealerId: number;
	dealerName: string;
	status: 'Available' | 'Sold' | 'Transferred' | 'Swapped';
	currentAgentId: number;
	assignedAt: string;
	activatedAt: string;
	updatedAt: string;
	productName: string;
	deviceName: string;
}

export interface ImeiSwap {
	id: number;
	oldImei: string;
	newImei: string;
	reason: string;
	agentId: number;
	agentName: string;
	customerId: number;
	swappedAt: string;
	approvedBy: string;
	dealerId: number;
	createdBy: string;
}

export interface ImeiAvailabilityCheck {
	statusCode: number;
	message: string;
}

export interface ImeiSwapRequest {
	id: number;
	oldImei: string;
	newImei: string;
	reason: string;
	dealerId: number;
	status: 'Pending' | 'Approved' | 'Rejected';
	requestedAt: string;
	processedAt?: string;
	processedBy?: string;
	rejectionReason?: string;
	requestedBy: string;
}

export interface ImeiSwapRequestDetails extends ImeiSwapRequest {
	agentName?: string;
	dealerName?: string;
}

export interface ImeiSwapApproval {
	action: 'Approve' | 'Reject';
	reason?: string;
}

export interface ImeiSwapRequestPayload {
	newImei: string;
	reason: string;
	requestedBy: string;
}

export interface ImeiTransfer {
	id: number;
	imei: string;
	fromDealerid: number;
	fromDealerName: string;
	fromProductid: number;
	fromProductName: string;
	toDealerid: number;
	toDealerName: string;
	toProductid: number;
	toProductName: string;
	transferDate: string;
}

export interface DealerModalProps {
	opened: boolean;
	onClose: () => void;
	dealer?: Dealer;
}

export interface DealerAdmin {
	id: number;
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
		productId: number;
		productName: string;
		total: number;
		available: number;
		sold: number;
	}>;
	byDealer: Array<{
		dealerid: number;
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
	id: number;
	agentName: string;
	email: string;
	msisdn: string;
	userType: UserType;
	dealerid: number;
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
		id: number;
		name: string;
		userTypes: string[];
		dealerId: number;
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
	close: () => void;
	imei: string;
}

export interface ImeiSwapModalProps {
	opened: boolean;
	close: () => void;
	selectedImei?: string;
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
	id: number;
	type: 'activation' | 'cash_sale';
	agentId: number;
	agentName: string;
	dealerid: number;
	shopId?: string;
	customerId?: string;
	customerName?: string;
	productId: number;
	productName: string;
	imei: string;
	amount: number;
	paymentMethod: 'cash' | 'mobile_money';
	commission: number;
	status: 'completed' | 'pending' | 'activated';
	receiptNumber?: string;
	createdAt: string;
	createdBy: string | null;
	dealerId: number;
	customerPhone: string;
	deviceId: number;
}

export interface TransactionListResponse {
	statusCode: number;
	status: string;
	message?: string;
	data: {
		data: Transaction[];
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	};
}

// Customer Activation Request
export interface CustomerActivationRequest {
	agentId: number;
	receiptNumber: string;
	imei: string;
	customerId: string;
	customerName: string;
	customerPhone: string;
}

// Customer Activation Response
export interface CustomerActivationResponse {
	transactionid: number;
	activationid: number;
	status: 'Completed' | 'Failed';
	commissionEarned?: number;
}

// Cash Sale Request
export interface CashSaleRequest {
	agentId: number;
	customerName: string;
	customerPhone: string;
	productId: number;
	deviceId: number;
	imei: string;
	paymentMethod: string;
	amount: number;
	sponsorMsisdn?: string;
}

// Cash Sale Response
export interface CashSaleResponse {
	transactionid: number;
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
	transaction?: Transaction;
}

export interface CashSaleModalProps {
	opened: boolean;
	onClose: () => void;
}

// =====================
// Commission Management Types
// =====================

// Commission Rate Interface
export interface CommissionRate {
	id: string;
	dealerId: number;
	dealerName: string;
	agentId: number;
	agentName: string;
	userType: UserType;
	productId: number;
	productName: string;
	commissionType: string;
	amount: number;
	currency: string;
	effectiveFrom: string;
	isActive: boolean;
}

export interface CommissionEarningsResponse {
	statusCode: number;
	status: string;
	message?: string;
	data: CommissionEarning[];
	summary: CommissionEarningsSummary;
}

// Commission Rate Request
export interface CommissionRateRequest {
	dealerId?: number;
	agentId?: number;
	userType: string;
	productId: number;
	commissionType: string;
	amount: number;
	currency: string;
	effectiveFrom: string;
	isActive?: boolean;
}

// Commission Earning Interface
export interface CommissionEarning {
	id: number;
	agentId: number;
	agentName: string;
	transactionId: number;
	productId: number;
	productName: string;
	deviceId: number;
	deviceName: string;
	dealerId: number;
	dealerName: string;
	shopId: number;
	commissionAmount: number;
	status: 'Pending' | 'Paid' | 'Cancelled';
	earnedAt: string;
	paidAt?: string;
	createdAt: string;
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
