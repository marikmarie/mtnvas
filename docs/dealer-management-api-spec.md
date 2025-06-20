## 1. Dealer Management Endpoints

### 1.1 Get Dealers

```typescript
GET /dealer-groups
Response: {
  data: {
    data: Dealer[]
  }
}
```

### 1.2 Create Dealer

```typescript
POST / dealer - groups;
Payload: {
	companyName: string;
	contactPerson: string;
	email: string;
	msisdn: string;
	department: 'wakanet' | 'office';
}
Response: {
	status: number;
	message: string;
	data: Dealer;
}
```

### 1.3 Update Dealer

```typescript
PUT / dealer - groups / { dealerId };
Payload: {
	name: string;
	contactPerson: string;
	email: string;
	phone: string;
	category: 'wakanet' | 'enterprise' | 'both';
}
Response: {
	status: number;
	message: string;
	data: Dealer;
}
```

### 1.4 Dealer Status Management

```typescript
POST / dealer - groups / { dealerId } / status;
Payload: {
	status: 'active' | 'inactive';
}
Response: {
	status: number;
	message: string;
}
```

## 2. Shop Management Endpoints

### 2.1 Get Shops

```typescript
GET /shops
Response: {
  data: {
    data: Shop[]
  }
}
```

### 2.2 Create Shop

```typescript
POST / shops;
Payload: {
	shopName: string;
	location: string;
	region: string;
	dealerName: string;
	status: 'active';
	createdBy: string;
	createdAt: string;
}
Response: {
	status: number;
	message: string;
	data: Shop;
}
```

### 2.3 Shop Approval

```typescript
POST /shops/{shopId}/approval
Query Params: status: 'approved' | 'rejected'
Response: {
  status: number;
  message: string;
}
```

## 3. Stock Management Endpoints

### 3.1 Get Stock List

```typescript
GET /stocks
Query Params: {
  dealerId?: string;
  category?: 'wakanet' | 'enterprise' | 'both';
}
Response: {
  data: {
    data: Stock[]
  }
}
```

### 3.2 Add Stock

```typescript
POST / stocks;
Payload: {
	dealerId: string;
	category: 'wakanet' | 'enterprise' | 'both';
	productId: string;
	deviceId: string;
	imeiFile: File;
}
Response: {
	status: number;
	message: string;
	data: Stock;
}
```

### 3.3 Set Stock Threshold

```typescript
POST / stock - thresholds;
Payload: {
	dealerId: string;
	category: 'wakanet' | 'enterprise' | 'both';
	productId: string;
	deviceId: string;
	threshold: number;
}
Response: {
	status: number;
	message: string;
	data: StockThreshold;
}
```

## 4. IMEI Management Endpoints

### 4.1 Get IMEI List

```typescript
GET /imeis
Query Params: {
  status?: 'available' | 'assigned' | 'active' | 'inactive';
  dealerId?: string;
}
Response: {
  data: {
    data: Imei[]
  }
}
```

### 4.2 IMEI Transfer

```typescript
POST / imeis / transfer;
Payload: {
	imei: string;
	fromDealer: string;
	fromProduct: string;
	toDealer: string;
	toProduct: string;
}
Response: {
	status: number;
	message: string;
	data: ImeiTransfer;
}
```

### 4.3 IMEI Swap

```typescript
POST / imeis / swap;
Payload: {
	oldImei: string;
	newImei: string;
	reason: string;
}
Response: {
	status: number;
	message: string;
	data: ImeiSwap;
}
```

### 4.4 Check IMEI Availability

```typescript
GET / imeis / { imei } / check;
Response: {
	status: number;
	message: string;
	data: {
		available: boolean;
		active: boolean;
	}
}
```

## 5. User Management Endpoints

### 5.1 Create Dealer User

```typescript
POST / users;
Payload: {
	name: string;
	email: string;
	msisdn: string;
	username: string;
	department: string;
	category: string;
	role: 'dsa' | 'retailer';
	location: string;
	dealerGroup: string;
}
Response: {
	status: number;
	message: string;
	data: ShopUser;
}
```

### 5.2 Create Shop User

```typescript
POST / shops / { shopId } / users;
Payload: {
	name: string;
	email: string;
	msisdn: string;
	userType: 'DSA' | 'Retailer' | 'ShopAgent';
}
Response: {
	status: number;
	message: string;
	data: ShopUser;
}
```

## 6. Lookup Data Endpoints

### 6.1 Get Dealers List (for dropdowns)

```typescript
GET / dealers / list;
Response: {
	data: {
		data: Array<{
			value: string;
			label: string;
		}>;
	}
}
```

### 6.2 Get Products List

```typescript
GET /products
Query Params: {
  category?: 'wakanet' | 'enterprise' | 'both';
}
Response: {
  data: {
    data: Product[]
  }
}
```

### 6.3 Get Devices List

```typescript
GET /devices
Query Params: {
  category?: 'wakanet' | 'enterprise' | 'both';
}
Response: {
  data: {
    data: Device[]
  }
}
```
