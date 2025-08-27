# Complete Dealer Management API Specification

## Base Response Format

All API responses follow this standardized format:

```typescript
interface ApiResponse<T> {
	status: number;
	message: string;
	data?: T;
	errors?: string[];
	meta?: {
		total?: number;
		page?: number;
		limit?: number;
	};
}
```

## Authentication Headers

All requests require authentication:

```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 1. Dealer Management Endpoints

### 1.1 Get Dealers

```typescript
GET /dealer
Query Params: {
  page?: number;
  limit?: number;
  search?: string;
  department?: 'wakanet' | 'enterprise' | 'both';
  status?: 'active' | 'inactive';
}
Response: ApiResponse<{
  data: Dealer[];
  meta: { total: number; page: number; limit: number; }
}>

interface Dealer {
  id: string;
  companyName: string;
  dealerCode: string;
  contactPerson: string;
  email: string;
  msisdn: string;
  department: 'wakanet' | 'enterprise' | 'both';
  status: 'active' | 'inactive';
  location?: string;
  region?: string;
  createdAt: string;
  updatedAt: string;
  adminCount: number;
  shopCount: number;
  agentCount: number;
}
```

### 1.2 Get Single Dealer

```typescript
GET / dealer - groups / { dealerId };
Response: ApiResponse<{
	dealer: Dealer;
	admins: DealerAdmin[];
	shops: Shop[];
	stockSummary: StockSummary;
}>;

interface DealerAdmin {
	id: string;
	name: string;
	email: string;
	msisdn: string;
	role: 'dealer_super_admin' | 'dealer_admin';
	department: 'wakanet' | 'enterprise' | 'both';
	status: 'active' | 'inactive';
	createdAt: string;
}
```

### 1.3 Create Dealer

```typescript
POST /dealer
Payload: {
  companyName: string;
  contactPerson: string;
  email: string;
  msisdn: string;
  department: 'wakanet' | 'enterprise' | 'both';
  location?: string;
  region?: string;
  // Initial admin details
  adminName: string;
  adminEmail: string;
  adminMsisdn: string;
}
Response: ApiResponse<Dealer>
```

### 1.4 Update Dealer

```typescript
PUT /dealer/{dealerId}
Payload: {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  msisdn?: string;
  department?: 'wakanet' | 'enterprise' | 'both';
  location?: string;
  region?: string;
}
Response: ApiResponse<Dealer>
```

### 1.5 Update Dealer Status

```typescript
POST /dealer/{dealerId}/status
Payload: {
  status: 'active' | 'inactive';
  reason?: string;
}
Response: ApiResponse<null>
```

### 1.6 Get Dealer Hierarchy

```typescript
GET / dealer - groups / { dealerId } / hierarchy;
Response: ApiResponse<{
	dealer: Dealer;
	shops: Array<{
		id: string;
		name: string;
		location: string;
		status: string;
		agents: Array<{
			id: string;
			name: string;
			userType: string;
			status: string;
		}>;
	}>;
}>;
```

---

## 2. Dealer Admin Management

### 2.1 Create Dealer Admin

```typescript
POST /dealer/{dealerId}/admins
Payload: {
  name: string;
  email: string;
  msisdn: string;
  role: 'dealer_super_admin' | 'dealer_admin';
  department: 'wakanet' | 'enterprise' | 'both';
  location?: string;
}
Response: ApiResponse<DealerAdmin>
```

### 2.2 Get Dealer Admins

```typescript
GET / dealer - groups / { dealerId } / admins;
Response: ApiResponse<DealerAdmin[]>;
```

### 2.3 Update Dealer Admin

```typescript
PUT /dealer/{dealerId}/admins/{adminId}
Payload: {
  name?: string;
  email?: string;
  msisdn?: string;
  department?: 'wakanet' | 'enterprise' | 'both';
  location?: string;
}
Response: ApiResponse<DealerAdmin>
```

### 2.4 Deactivate Dealer Admin

```typescript
POST /dealer/{dealerId}/admins/{adminId}/deactivate
Payload: {
  reason?: string;
}
Response: ApiResponse<null>
```

---

## 3. Shop Management Endpoints

### 3.1 Get Shops

```typescript
GET /shops
Query Params: {
  page?: number;
  limit?: number;
  search?: string;
  dealerId?: string;
  status?: 'Active' | 'Inactive' | 'PendingApproval';
  region?: string;
}
Response: ApiResponse<{
  data: Shop[];
  meta: { total: number; page: number; limit: number; }
}>

interface Shop {
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
```

### 3.2 Create Shop

```typescript
POST /shops
Payload: {
  shopName: string;
  dealerId: string;
  location: string;
  region: string;
  adminName?: string;
  adminEmail?: string;
  adminMsisdn?: string;
  operatingHours?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
Response: ApiResponse<Shop>
```

### 3.3 Shop Approval Management

```typescript
POST /shops/{shopId}/approval
Payload: {
  action: 'approve' | 'reject';
  reason?: string; // Required for rejection
  assignToAdminId?: string; // Optional admin assignment
}
Response: ApiResponse<null>
```

### 3.4 Get Pending Shop Approvals

```typescript
GET /shops/pending-approvals
Query Params: {
  dealerId?: string;
}
Response: ApiResponse<Shop[]>
```

### 3.5 Update Shop

```typescript
PUT /shops/{shopId}
Payload: {
  shopName?: string;
  location?: string;
  region?: string;
  adminId?: string;
  operatingHours?: string;
}
Response: ApiResponse<Shop>
```

### 3.6 Assign Shop Admin

```typescript
POST / shops / { shopId } / assign - admin;
Payload: {
	adminId: string;
}
Response: ApiResponse<null>;
```

---

## 4. Agent Management Endpoints

### 4.1 Create Agent

```typescript
POST /agents
Payload: {
  name: string;
  email: string;
  msisdn: string;
  userType: 'shop_agent' | 'dsa' | 'retailer';
  dealerId: string;
  shopId?: string; // Required for shop_agent
  location: string;
  merchantCode?: string;
  idNumber?: string;
}
Response: ApiResponse<Agent>

interface Agent {
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
```

### 4.2 Get Agents

```typescript
GET /agents
Query Params: {
  page?: number;
  limit?: number;
  search?: string;
  dealerId?: string;
  shopId?: string;
  userType?: 'shop_agent' | 'dsa' | 'retailer';
  status?: 'active' | 'inactive' | 'pending_approval';
}
Response: ApiResponse<{
  data: Agent[];
  meta: { total: number; page: number; limit: number; }
}>
```

### 4.3 Agent Approval

```typescript
POST /agents/{agentId}/approval
Payload: {
  action: 'approve' | 'reject';
  reason?: string;
  // Allow editing before approval
  name?: string;
  email?: string;
  msisdn?: string;
  location?: string;
}
Response: ApiResponse<null>
```

### 4.4 Check Agent Duplication

```typescript
POST /agents/check-duplicate
Payload: {
  msisdn?: string;
  email?: string;
  merchantCode?: string;
}
Response: ApiResponse<{
  exists: boolean;
  existingAgent?: {
    id: string;
    name: string;
    userTypes: string[];
    dealerId: string;
  };
  canAddCategory: boolean;
}>
```

### 4.5 Add Agent Category

```typescript
POST /agents/{agentId}/add-category
Payload: {
  userType: 'shop_agent' | 'dsa' | 'retailer';
  shopId?: string; // Required for shop_agent
}
Response: ApiResponse<null>
```

### 4.6 Deactivate Agent

```typescript
POST /agents/{agentId}/deactivate
Payload: {
  reason?: string;
}
Response: ApiResponse<null>
```

---

## 5. Stock Management Endpoints

### 5.1 Get Stock Summary

```typescript
GET /stocks/summary
Query Params: {
  dealerId?: string;
  category?: 'wakanet' | 'enterprise' | 'both';
}
Response: ApiResponse<{
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
}>
```

### 5.2 Get Stock List

```typescript
GET /stocks
Query Params: {
  page?: number;
  limit?: number;
  dealerId?: string;
  productId?: string;
  deviceId?: string;
  category?: 'wakanet' | 'enterprise' | 'both';
  status?: 'available' | 'sold' | 'transferred';
}
Response: ApiResponse<{
  data: StockItem[];
  meta: { total: number; page: number; limit: number; }
}>

interface StockItem {
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
  status: 'available' | 'sold' | 'transferred';
  assignedAt: string;
  soldAt?: string;
  transferredAt?: string;
}
```

### 5.3 Add Stock (CSV Upload)

```typescript
POST /stocks/upload
Content-Type: multipart/form-data
Payload: {
  dealerId: string;
  category: 'wakanet' | 'enterprise' | 'both';
  productId: string;
  deviceId: string;
  imeiFile: File; // CSV file with IMEIs/Serial Numbers
}
Response: ApiResponse<{
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    imei: string;
    error: string;
  }>;
}>
```

### 5.4 Get Stock Template

```typescript
GET /stocks/template
Query Params: {
  format: 'csv' | 'xlsx';
}
Response: File download with sample format
```

### 5.5 Transfer Stock

```typescript
POST /stocks/transfer
Payload: {
  imeis: string[]; // Array of IMEIs to transfer
  fromDealerId: string;
  toDealerId: string;
  reason?: string;
}
Response: ApiResponse<{
  transferId: string;
  transferredCount: number;
  failedTransfers: Array<{
    imei: string;
    reason: string;
  }>;
}>
```

### 5.6 Get Stock Transfer History

```typescript
GET /stocks/transfers
Query Params: {
  page?: number;
  limit?: number;
  fromDealerId?: string;
  toDealerId?: string;
  dateFrom?: string;
  dateTo?: string;
}
Response: ApiResponse<{
  data: StockTransfer[];
  meta: { total: number; page: number; limit: number; }
}>

interface StockTransfer {
  id: string;
  fromDealerId: string;
  fromDealerName: string;
  toDealerId: string;
  toDealerName: string;
  imeiCount: number;
  transferredBy: string;
  reason?: string;
  createdAt: string;
  imeis: string[]; // Detailed IMEI list
}
```

---

## 6. Stock Threshold Management

### 6.1 Set Stock Thresholds

```typescript
POST /stock-thresholds
Payload: {
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
Response: ApiResponse<StockThreshold>

interface StockThreshold {
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
```

### 6.2 Get Stock Thresholds

```typescript
GET /stock-thresholds
Query Params: {
  dealerId?: string;
  category?: 'wakanet' | 'enterprise' | 'both';
  belowThreshold?: boolean;
}
Response: ApiResponse<StockThreshold[]>
```

### 6.3 Update Stock Threshold

```typescript
PUT /stock-thresholds/{thresholdId}
Payload: {
  threshold?: number;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  notificationEmails?: string[];
  notificationMsisdns?: string[];
}
Response: ApiResponse<StockThreshold>
```

### 6.4 Get Threshold Alerts

```typescript
GET / stock - thresholds / alerts;
Response: ApiResponse<{
	totalAlerts: number;
	alerts: Array<{
		dealerId: string;
		dealerName: string;
		productName: string;
		deviceName: string;
		currentStock: number;
		threshold: number;
		shortfall: number;
	}>;
}>;
```

---

## 7. IMEI Management Endpoints

### 7.1 Get IMEI Details

```typescript
GET / imeis / { imei };
Response: ApiResponse<{
	imei: string;
	status: 'available' | 'assigned' | 'active' | 'inactive' | 'swapped';
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
}>;
```

### 7.2 Check IMEI Availability

```typescript
GET / imeis / { imei } / check;
Response: ApiResponse<{
	available: boolean;
	active: boolean;
	canSwap: boolean;
	belongsToDealer: boolean;
	dealerId?: string;
	currentStatus: string;
}>;
```

### 7.3 IMEI Swap Request

```typescript
POST /imeis/swap-request
Payload: {
  oldImei: string;
  newImei: string;
  reason: string;
  agentId: string;
  customerId?: string;
}
Response: ApiResponse<{
  swapRequestId: string;
  status: 'pending_approval';
}>
```

### 7.4 IMEI Swap Approval

```typescript
POST /imeis/swap-requests/{requestId}/approval
Payload: {
  action: 'approve' | 'reject';
  reason?: string;
}
Response: ApiResponse<null>
```

### 7.5 Get Swap Requests

```typescript
GET /imeis/swap-requests
Query Params: {
  status?: 'pending' | 'approved' | 'rejected';
  agentId?: string;
  dealerId?: string;
  dateFrom?: string;
  dateTo?: string;
}
Response: ApiResponse<ImeiSwapRequest[]>

interface ImeiSwapRequest {
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
```

### 7.6 Get IMEI Swap History

```typescript
GET / imeis / { imei } / swap - history;
Response: ApiResponse<ImeiSwap[]>;

interface ImeiSwap {
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
```

---

## 8. Sales and Transaction Management

### 8.1 Record Customer Activation

```typescript
POST /transactions/activation
Payload: {
  agentId: string;
  receiptNumber: string;
  deviceMsisdn: string;
  imei: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
}
Response: ApiResponse<{
  transactionId: string;
  activationId: string;
  status: 'completed' | 'failed';
  commissionEarned?: number;
}>
```

### 8.2 Record Sale

```typescript
POST /transactions/cash-sale
Payload: {
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
Response: ApiResponse<{
  transactionId: string;
  receiptNumber: string;
  activationId?: string;
}>
```

### 8.3 Get Transaction History

```typescript
GET /transactions
Query Params: {
  page?: number;
  limit?: number;
  agentId?: string;
  dealerId?: string;
  shopId?: string;
  transactionType?: 'activation' | 'cash_sale';
  status?: 'completed' | 'pending' | 'failed';
  dateFrom?: string;
  dateTo?: string;
  productId?: string;
  paymentMethod?: 'cash' | 'mobile_money';
}
Response: ApiResponse<{
  data: Transaction[];
  meta: { total: number; page: number; limit: number; }
  summary: {
    totalAmount: number;
    totalCommission: number;
    totalTransactions: number;
  };
}>

interface Transaction {
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
  status: 'completed' | 'pending' | 'failed';
  receiptNumber?: string;
  createdAt: string;
}
```

### 8.4 Get Sales Reports

```typescript
GET /reports/sales
Query Params: {
  reportType: 'summary' | 'detailed';
  dateFrom: string;
  dateTo: string;
  dealerId?: string;
  agentId?: string;
  shopId?: string;
  productId?: string;
  groupBy?: 'dealer' | 'agent' | 'shop' | 'product' | 'date';
}
Response: ApiResponse<{
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
}>
```

---

## 9. Commission Management

### 9.1 Set Commission Rates

```typescript
POST /commissions/rates
Payload: {
  dealerId?: string; // If null, applies system-wide
  userType: 'shop_agent' | 'dsa' | 'retailer';
  productId: string;
  commissionType: 'fixed' | 'percentage';
  amount: number;
  currency?: string;
  effectiveFrom?: string;
}
Response: ApiResponse<CommissionRate>

interface CommissionRate {
  id: string;
  dealerId?: string;
  userType: string;
  productId: string;
  productName: string;
  commissionType: 'fixed' | 'percentage';
  amount: number;
  currency: string;
  effectiveFrom: string;
  isActive: boolean;
}
```

### 9.2 Get Commission Rates

```typescript
GET /commissions/rates
Query Params: {
  dealerId?: string;
  userType?: 'shop_agent' | 'dsa' | 'retailer';
  productId?: string;
  isActive?: boolean;
}
Response: ApiResponse<CommissionRate[]>
```

### 9.3 Get Commission Earnings

```typescript
GET /commissions/earnings
Query Params: {
  agentId?: string;
  dealerId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'pending' | 'paid' | 'cancelled';
}
Response: ApiResponse<{
  data: CommissionEarning[];
  summary: {
    totalEarned: number;
    totalPaid: number;
    totalPending: number;
  };
}>

interface CommissionEarning {
  id: string;
  agentId: string;
  agentName: string;
  transactionId: string;
  productName: string;
  commissionAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  earnedAt: string;
  paidAt?: string;
}
```

---

## 10. Reconciliation Management

### 10.1 Get Failed Reconciliations

```typescript
GET /reconciliation/failed
Query Params: {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  dealerId?: string;
  agentId?: string;
}
Response: ApiResponse<{
  data: FailedReconciliation[];
  meta: { total: number; page: number; limit: number; }
}>

interface FailedReconciliation {
  id: string;
  transactionId: string;
  agentId: string;
  agentName: string;
  amount: number;
  reason: string;
  attemptCount: number;
  lastAttemptAt: string;
  canRetry: boolean;
  requiresManualReview: boolean;
}
```

### 10.2 Manual Reconciliation

```typescript
POST /reconciliation/{reconciliationId}/manual
Payload: {
  action: 'retry' | 'approve' | 'reject';
  notes?: string;
  adjustedAmount?: number;
}
Response: ApiResponse<null>
```

### 10.3 Get Reconciliation Summary

```typescript
GET /reconciliation/summary
Query Params: {
  dateFrom?: string;
  dateTo?: string;
}
Response: ApiResponse<{
  totalTransactions: number;
  successfulReconciliations: number;
  failedReconciliations: number;
  pendingReconciliations: number;
  successRate: number;
}>
```

---

## 11. Lookup and Reference Data

### 11.1 Get Dealers List (Dropdown)

```typescript
GET /dealer
Query Params: {
  department?: 'wakanet' | 'enterprise' | 'both';
  status?: 'active' | 'inactive';
}
Response: ApiResponse<Array<{
  value: string;
  label: string;
  department: string;
}>>
```

### 11.2 Get Products List

```typescript
GET /shops
Query Params: {
  category?: 'wakanet' | 'enterprise' | 'both';
}
Response: ApiResponse<Product[]>

interface Product {
  id: string;
  name: string;
  category: 'wakanet' | 'enterprise';
  description?: string;
  price?: number;
  isActive: boolean;
}
```

### 11.3 Get Devices List

```typescript
GET /devices
Query Params: {
  category?: 'wakanet' | 'enterprise' | 'both';
  productId?: string;
}
Response: ApiResponse<Device[]>

interface Device {
  id: string;
  name: string;
  productId: string;
  category: 'wakanet' | 'enterprise';
  model?: string;
  manufacturer?: string;
  hasImei: boolean;
  isActive: boolean;
}
```

### 11.4 Get Shops List (Dropdown)

```typescript
GET /shops
Query Params: {
  dealerId?: string;
  status?: 'active' | 'inactive';
}
Response: ApiResponse<Array<{
  value: string;
  label: string;
  dealerId: string;
  location: string;
}>>
```

### 11.5 Get Regions List

```typescript
GET / lookups / regions;
Response: ApiResponse<
	Array<{
		value: string;
		label: string;
	}>
>;
```

---

## 12. Dashboard and Analytics

### 12.1 Admin Dashboard Data

```typescript
GET / dashboard / admin;
Response: ApiResponse<{
	summary: {
		totalDealers: number;
		activeDealers: number;
		totalAgents: number;
		activeAgents: number;
		totalStock: number;
		lowStockAlerts: number;
		pendingApprovals: number;
	};
	recentActivities: Activity[];
	stockAlerts: StockAlert[];
	topPerformers: Array<{
		agentId: string;
		agentName: string;
		sales: number;
		activations: number;
	}>;
}>;
```

### 12.2 Dealer Dashboard Data

```typescript
GET / dashboard / dealer / { dealerId };
Response: ApiResponse<{
	summary: {
		totalShops: number;
		totalAgents: number;
		totalStock: number;
		todaysSales: number;
		monthlyTarget?: number;
	};
	shopPerformance: Array<{
		shopId: string;
		shopName: string;
		sales: number;
		agentCount: number;
		activations: number;
	}>;
	agentPerformance: Array<{
		agentId: string;
		agentName: string;
		sales: number;
		activations: number;
		rank: number;
	}>;
	salesTrend: Array<{
		date: string;
		sales: number;
		activations: number;
	}>;
}>;
```

### 12.3 Shop Dashboard Data

```typescript
GET / dashboard / shop / { shopId };
Response: ApiResponse<{
	summary: {
		totalAgents: number;
		todaysSales: number;
		todaysActivations: number;
		monthlyPerformance: number;
	};
	agentPerformance: Array<{
		agentId: string;
		agentName: string;
		todaysSales: number;
		todaysActivations: number;
		monthlyTotal: number;
	}>;
	recentTransactions: Transaction[];
}>;
```

### 12.4 Agent Dashboard Data

```typescript
GET / dashboard / agent / { agentId };
Response: ApiResponse<{
	summary: {
		todaysSales: number;
		todaysActivations: number;
		weeklyTotal: number;
		monthlyTotal: number;
		totalCommissions: number;
		pendingCommissions: number;
	};
	recentTransactions: Transaction[];
	performanceTrend: Array<{
		date: string;
		sales: number;
		activations: number;
		commission: number;
	}>;
}>;
```

---

## Error Codes and Messages

### Standard HTTP Status Codes

- `200`: Success
- `201`: Created successfully
- `400`: Bad request / Validation errors
- `401`: Unauthorized
- `403`: Forbidden / Insufficient permissions
- `404`: Resource not found
- `409`: Conflict (duplicate data)
- `422`: Unprocessable entity
- `500`: Internal server error

### Custom Error Codes

```typescript
interface ErrorResponse {
	status: number;
	message: string;
	errorCode?: string;
	errors?: Array<{
		field: string;
		message: string;
		code: string;
	}>;
}

// Custom error codes
('DEALER_NOT_FOUND');
('SHOP_ALREADY_EXISTS');
('AGENT_DUPLICATE_MSISDN');
('IMEI_NOT_AVAILABLE');
('IMEI_BELONGS_TO_DIFFERENT_DEALER');
('STOCK_THRESHOLD_NOT_SET');
('INSUFFICIENT_PERMISSIONS');
('APPROVAL_REQUIRED');
('INVALID_RECEIPT_NUMBER');
('DEVICE_ALREADY_ACTIVATED');
```

## Rate Limiting

- Standard endpoints: 1000 requests per hour per user
- File upload endpoints: 100 requests per hour per user
- Bulk operations: 50 requests per hour per user
- Dashboard endpoints: 500 requests per hour per user

Headers included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## 13. Notification Management

### 13.1 Get Notifications

```typescript
GET /notifications
Query Params: {
  page?: number;
  limit?: number;
  type?: 'stock_alert' | 'approval_request' | 'system_alert';
  status?: 'unread' | 'read';
  userId?: string;
}
Response: ApiResponse<{
  data: Notification[];
  meta: { total: number; unreadCount: number; }
}>

interface Notification {
  id: string;
  type: 'stock_alert' | 'approval_request' | 'system_alert' | 'commission_update';
  title: string;
  message: string;
  data?: any; // Additional notification data
  userId: string;
  status: 'unread' | 'read';
  createdAt: string;
  expiresAt?: string;
}
```

### 13.2 Mark Notifications as Read

```typescript
POST /notifications/mark-read
Payload: {
  notificationIds: string[]; // Empty array marks all as read
}
Response: ApiResponse<null>
```

### 13.3 Get Notification Settings

```typescript
GET / notifications / settings;
Response: ApiResponse<{
	emailNotifications: boolean;
	smsNotifications: boolean;
	pushNotifications: boolean;
	stockAlerts: boolean;
	approvalRequests: boolean;
	commissionUpdates: boolean;
	systemAlerts: boolean;
}>;
```

### 13.4 Update Notification Settings

```typescript
PUT /notifications/settings
Payload: {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  stockAlerts?: boolean;
  approvalRequests?: boolean;
  commissionUpdates?: boolean;
  systemAlerts?: boolean;
}
Response: ApiResponse<null>
```

---

## 14. File Management

### 14.1 Upload File

```typescript
POST /files/upload
Content-Type: multipart/form-data
Payload: {
  file: File;
  type: 'stock_csv' | 'document' | 'image';
  description?: string;
}
Response: ApiResponse<{
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}>
```

### 14.2 Download File

```typescript
GET /files/{fileId}/download
Response: File stream with appropriate headers
```

### 14.3 Get File Info

```typescript
GET / files / { fileId };
Response: ApiResponse<{
	fileId: string;
	fileName: string;
	fileUrl: string;
	fileSize: number;
	mimeType: string;
	uploadedBy: string;
	uploadedAt: string;
	downloadCount: number;
}>;
```

---

## 15. Audit Trail

### 15.1 Get Audit Logs

```typescript
GET /audit/logs
Query Params: {
  page?: number;
  limit?: number;
  entityType?: 'dealer' | 'shop' | 'agent' | 'stock' | 'transaction';
  entityId?: string;
  action?: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}
Response: ApiResponse<{
  data: AuditLog[];
  meta: { total: number; page: number; limit: number; }
}>

interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  userName: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}
```

### 15.2 Export Audit Logs

```typescript
GET /audit/logs/export
Query Params: {
  format: 'csv' | 'xlsx' | 'pdf';
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
}
Response: File download
```

---

## 16. System Health and Monitoring

### 16.1 Health Check

```typescript
GET / health;
Response: {
	status: 'healthy' | 'unhealthy';
	timestamp: string;
	services: {
		database: 'up' | 'down';
		cache: 'up' | 'down';
		externalApis: 'up' | 'down';
	}
	version: string;
}
```

### 16.2 System Statistics

```typescript
GET / system / stats;
Response: ApiResponse<{
	totalUsers: number;
	activeUsers: number;
	totalTransactions: number;
	totalRevenue: number;
	systemUptime: string;
	cacheHitRate: number;
	averageResponseTime: number;
}>;
```

---

## 17. Bulk Operations

### 17.1 Bulk Agent Creation

```typescript
POST /agents/bulk-create
Content-Type: multipart/form-data
Payload: {
  csvFile: File; // CSV with agent details
  dealerId: string;
  defaultUserType: 'shop_agent' | 'dsa' | 'retailer';
}
Response: ApiResponse<{
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    data: any;
    error: string;
  }>;
}>
```

### 17.2 Bulk Stock Update

```typescript
POST / stocks / bulk - update;
Payload: {
	updates: Array<{
		imei: string;
		newStatus?: 'available' | 'sold';
		newDealerId?: string;
	}>;
}
Response: ApiResponse<{
	successCount: number;
	failedCount: number;
	failures: Array<{
		imei: string;
		error: string;
	}>;
}>;
```

### 17.3 Bulk Approval

```typescript
POST /approvals/bulk
Payload: {
  entityType: 'shop' | 'agent' | 'swap_request';
  entityIds: string[];
  action: 'approve' | 'reject';
  reason?: string;
}
Response: ApiResponse<{
  successCount: number;
  failedCount: number;
  failures: Array<{
    entityId: string;
    error: string;
  }>;
}>
```

---

## 18. Advanced Search

### 18.1 Global Search

```typescript
GET /search
Query Params: {
  q: string; // Search query
  type?: 'dealer' | 'shop' | 'agent' | 'transaction' | 'imei';
  limit?: number;
}
Response: ApiResponse<{
  results: Array<{
    type: string;
    id: string;
    title: string;
    subtitle?: string;
    url: string;
    relevanceScore: number;
  }>;
  totalResults: number;
  searchTime: number;
}>
```

### 18.2 Advanced Filter Search

```typescript
POST /search/advanced
Payload: {
  entityType: 'dealer' | 'shop' | 'agent' | 'transaction';
  filters: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
    value: any;
  }>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
Response: ApiResponse<{
  data: any[];
  meta: { total: number; page: number; limit: number; }
}>
```

---

## 19. Integration Endpoints

### 19.1 ECW Integration

```typescript
POST / integrations / ecw / debit;
Payload: {
	sponsorMsisdn: string;
	amount: number;
	transactionId: string;
	description: string;
}
Response: ApiResponse<{
	ecwTransactionId: string;
	status: 'success' | 'failed' | 'pending';
	balance?: number;
	errorCode?: string;
}>;
```

### 19.2 PCRF Integration

```typescript
POST /integrations/pcrf/subscriber
Payload: {
  action: 'add' | 'update' | 'remove';
  imei: string;
  msisdn?: string;
  serviceProfile?: string;
}
Response: ApiResponse<{
  pcrfTransactionId: string;
  status: 'success' | 'failed';
  errorCode?: string;
}>
```

### 19.3 SMS Gateway Integration

```typescript
POST /integrations/sms/send
Payload: {
  msisdn: string;
  message: string;
  type: 'alert' | 'notification' | 'otp';
  priority?: 'high' | 'normal' | 'low';
}
Response: ApiResponse<{
  messageId: string;
  status: 'sent' | 'failed' | 'queued';
  cost?: number;
}>
```

---

## 20. Webhook Management

### 20.1 Register Webhook

```typescript
POST /webhooks
Payload: {
  url: string;
  events: string[]; // Events to subscribe to
  secret?: string;
  isActive: boolean;
}
Response: ApiResponse<{
  webhookId: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
}>
```

### 20.2 Webhook Events

Available webhook events:

- `dealer.created`
- `dealer.updated`
- `dealer.deactivated`
- `shop.created`
- `shop.approved`
- `shop.rejected`
- `agent.created`
- `agent.approved`
- `agent.deactivated`
- `stock.low_threshold`
- `stock.transferred`
- `transaction.completed`
- `imei.swap_requested`
- `imei.swap_approved`
- `commission.calculated`

### 20.3 Webhook Payload Format

```typescript
interface WebhookPayload {
	event: string;
	timestamp: string;
	data: any;
	webhookId: string;
	signature: string; // HMAC signature for verification
}
```

---

## Implementation Notes

### Security Requirements

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Role-based access control for all operations
3. **Input Validation**: Strict validation on all input parameters
4. **Rate Limiting**: Implement rate limiting per user/endpoint
5. **Audit Logging**: Log all create/update/delete operations
6. **Data Encryption**: Sensitive data encrypted at rest and in transit

### Performance Requirements

1. **Response Times**:
    - GET requests: < 200ms
    - POST/PUT requests: < 500ms
    - File uploads: < 2 seconds
    - Bulk operations: < 10 seconds
2. **Caching**: Implement Redis caching for frequently accessed data
3. **Pagination**: All list endpoints must support pagination
4. **Database Optimization**: Proper indexing on search/filter fields

### Data Validation Rules

1. **Phone Numbers**: Must be valid international format
2. **Emailes**: Standard email validation
3. **IMEIs**: 15-digit validation with check digit
4. **File Uploads**:
    - CSV files: Max 10MB, UTF-8 encoding
    - Images: Max 5MB, JPG/PNG only
    - Documents: Max 20MB, PDF/DOC/DOCX only

### Business Logic Requirements

1. **Stock Management**:
    - Cannot transfer sold/inactive stock
    - Commission rates change only affects future transactions
    - Stock thresholds must be positive integers
2. **User Management**:
    - Cannot delete users with active transactions
    - Agent approval required for all new registrations
    - Duplicate checking based on MSISDN + merchant code
3. **Transaction Processing**:
    - Receipt numbers are one-time use only
    - IMEI validation against dealer ownership
    - Automatic commission calculation on completion

### Error Handling Standards

1. **Validation Errors**: Return detailed field-level errors
2. **Business Logic Errors**: Clear, actionable error messages
3. **System Errors**: Generic message with error ID for tracking
4. **Async Operations**: Provide status endpoints for long-running tasks

This comprehensive API specification covers all the requirements from the dealer management solution document and provides a solid foundation for backend implementation.
