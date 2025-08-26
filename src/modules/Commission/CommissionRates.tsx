import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Container,
	createStyles,
	Group,
	rem,
	Select,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconCurrencyDollar,
	IconEdit,
	IconFilter,
	IconPercentage,
	IconPlus,
	IconRefresh,
	IconSearch,
	IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { toTitle } from '../../utils/toTitle';
import { CommissionRate, UserType } from '../Dealer/types';
import { CommissionRateModal } from './CommissionRateModal';

const useStyles = createStyles((theme) => ({
	root: {
		padding: 0,
	},

	header: {
		marginBottom: theme.spacing.xl,
		marginTop: theme.spacing.xl,
	},

	headerContent: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		gap: theme.spacing.md,
		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
			alignItems: 'stretch',
		},
	},

	titleSection: {
		flex: 1,
		minWidth: rem(200),
	},

	actionsSection: {
		display: 'flex',
		gap: theme.spacing.sm,
		flexWrap: 'wrap',
		[theme.fn.smallerThan('md')]: {
			justifyContent: 'stretch',
			'& > *': {
				flex: 1,
			},
		},
	},

	filtersCard: {
		marginBottom: theme.spacing.xl,
		padding: theme.spacing.lg,
		borderRadius: theme.radius.lg,
	},

	filtersGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
		gap: theme.spacing.md,
		alignItems: 'end',
	},

	tableCard: {
		padding: 0,
		overflow: 'hidden',
		borderRadius: theme.radius.lg,
	},

	tableHeader: {
		padding: theme.spacing.lg,
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	badge: {
		fontWeight: 600,
	},

	actionButton: {
		'&:hover': {
			transform: 'scale(1.05)',
		},
	},

	typeIcon: {
		marginRight: theme.spacing.xs,
	},
}));

export function CommissionRates() {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const [searchTerm, setSearchTerm] = useState('');
	const [dealerFilter, setDealerFilter] = useState<string>('');
	const [userTypeFilter, setUserTypeFilter] = useState<string>('');
	const [productFilter, setProductFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [selectedRate, setSelectedRate] = useState<CommissionRate | null>(null);

	const [rateModalOpened, { open: openRateModal, close: closeRateModal }] = useDisclosure(false);

	const fetchCommissionRates = useCallback(async () => {
		const params = {
			dealerId: dealerFilter || undefined,
			userType: userTypeFilter || undefined,
			productId: productFilter || undefined,
			isActive:
				statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
		};

		const response = await request.get('/commissions/rates', { params });
		return response.data;
	}, [request, dealerFilter, userTypeFilter, productFilter, statusFilter]);

	const {
		data: ratesData,
		isLoading: ratesLoading,
		refetch,
	} = useQuery({
		queryKey: ['commission-rates', dealerFilter, userTypeFilter, productFilter, statusFilter],
		queryFn: fetchCommissionRates,
	});

	const { data: dealersData } = useQuery({
		queryKey: ['dealers-lookup'],
		queryFn: () => request.get('/dealer'),
	});

	const { data: productsData } = useQuery({
		queryKey: ['products-lookup'],
		queryFn: () => request.get('/shops'),
	});

	const deleteRateMutation = useMutation({
		mutationFn: async (rateId: number) => {
			await request.delete(`/commissions/rates/${rateId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['commission-rates']);
		},
	});

	const commissionRates: CommissionRate[] = ratesData?.data || [];

	const filteredRates = commissionRates.filter(
		(rate) =>
			searchTerm === '' ||
			rate.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			rate.userType.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleRefresh = () => {
		refetch();
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setDealerFilter('');
		setUserTypeFilter('');
		setProductFilter('');
		setStatusFilter('');
	};

	const handleAddRate = () => {
		setSelectedRate(null);
		openRateModal();
	};

	const handleEditRate = (rate: CommissionRate) => {
		setSelectedRate(rate);
		openRateModal();
	};

	const handleDeleteRate = (rateId: number) => {
		if (confirm('Are you sure you want to delete this commission rate?')) {
			deleteRateMutation.mutate(rateId);
		}
	};

	const handleCloseRateModal = () => {
		setSelectedRate(null);
		closeRateModal();
	};

	const getCommissionTypeColor = (type: string) => {
		switch (type) {
			case 'fixed':
				return 'blue';
			case 'percentage':
				return 'green';
			default:
				return 'gray';
		}
	};

	const getUserTypeColor = (userType: UserType) => {
		switch (userType) {
			case 'ShopAgent':
				return 'blue';
			case 'DSA':
				return 'teal';
			case 'Retailer':
				return 'orange';
			default:
				return 'gray';
		}
	};

	const getStatusColor = (isActive: boolean) => {
		return isActive ? 'green' : 'red';
	};

	const columns = [
		{
			name: 'productName',
			header: 'Product',
			defaultFlex: 1,
			minWidth: 150,
		},
		{
			name: 'userType',
			header: 'User Type',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionRate }) => (
				<Badge
					color={getUserTypeColor(data.userType)}
					variant="light"
					className={classes.badge}
				>
					{toTitle(data.userType)}
				</Badge>
			),
		},
		{
			name: 'commissionType',
			header: 'Type',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: CommissionRate }) => (
				<Group spacing="xs">
					{data.commissionType === 'fixed' ? (
						<IconCurrencyDollar
							size={14}
							className={classes.typeIcon}
						/>
					) : (
						<IconPercentage
							size={14}
							className={classes.typeIcon}
						/>
					)}
					<Badge
						color={getCommissionTypeColor(data.commissionType)}
						variant="light"
						className={classes.badge}
					>
						{toTitle(data.commissionType)}
					</Badge>
				</Group>
			),
		},
		{
			name: 'amount',
			header: 'Amount',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionRate }) => (
				<Text weight={600}>
					{data.commissionType === 'fixed'
						? formatCurrency(data.amount)
						: `${data.amount}%`}
				</Text>
			),
		},
		{
			name: 'dealerId',
			header: 'Dealer',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: CommissionRate }) => (
				<Text size="sm">{data.dealerId ? `Dealer Specific` : 'System Wide'}</Text>
			),
		},
		{
			name: 'effectiveFrom',
			header: 'Effective From',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionRate }) =>
				new Date(data.effectiveFrom).toLocaleDateString(),
		},
		{
			name: 'isActive',
			header: 'Status',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: CommissionRate }) => (
				<Badge
					color={getStatusColor(data.isActive)}
					variant="light"
					className={classes.badge}
				>
					{data.isActive ? 'Active' : 'Inactive'}
				</Badge>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: CommissionRate }) => (
				<Group spacing="xs">
					<ActionIcon
						color="blue"
						variant="light"
						size="sm"
						className={classes.actionButton}
						onClick={() => handleEditRate(data)}
					>
						<IconEdit size={16} />
					</ActionIcon>
					<ActionIcon
						color="red"
						variant="light"
						size="sm"
						className={classes.actionButton}
						onClick={() => handleDeleteRate(data.id)}
					>
						<IconTrash size={16} />
					</ActionIcon>
				</Group>
			),
		},
	];

	const ratesTable = useDataGridTable<CommissionRate>({
		columns,
		data: filteredRates,
		loading: ratesLoading,
		mih: '50vh',
	});

	return (
		<Container
			fluid
			className={classes.root}
		>
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<div className={classes.titleSection}>
						<Title
							order={3}
							mb="xs"
						>
							Commission Rates
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Manage commission rates for different user types and products
						</Text>
					</div>

					<div className={classes.actionsSection}>
						<Button
							leftIcon={<IconPlus size={16} />}
							onClick={handleAddRate}
							radius="md"
						>
							Add Rate
						</Button>

						<ActionIcon
							color="blue"
							variant="light"
							size="lg"
							onClick={handleRefresh}
							radius="md"
						>
							<IconRefresh size={18} />
						</ActionIcon>
					</div>
				</div>
			</div>

			<Card className={classes.filtersCard}>
				<Group
					position="apart"
					mb="md"
				>
					<Group>
						<IconFilter size={20} />
						<Text weight={600}>Filters</Text>
					</Group>

					<Button
						variant="subtle"
						size="xs"
						onClick={handleClearFilters}
					>
						Clear All
					</Button>
				</Group>

				<div className={classes.filtersGrid}>
					<TextInput
						placeholder="Search rates..."
						icon={<IconSearch size={16} />}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.currentTarget.value)}
						radius="md"
					/>

					<Select
						placeholder="All Dealers"
						data={[
							{ value: '', label: 'All Dealers' },
							{ value: 'system', label: 'System Wide' },
							...(dealersData?.data?.data || []).map((dealer: any) => ({
								value: dealer.id,
								label: dealer.name,
							})),
						]}
						value={dealerFilter}
						onChange={(value) => setDealerFilter(value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="User Type"
						data={[
							{ value: '', label: 'All User Types' },
							{ value: 'ShopAgent', label: 'Shop Agent' },
							{ value: 'DSA', label: 'DSA' },
							{ value: 'Retailer', label: 'Retailer' },
						]}
						value={userTypeFilter}
						onChange={(value) => setUserTypeFilter(value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Product"
						data={[
							{ value: '', label: 'All Products' },
							...(productsData?.data?.data || []).map((product: any) => ({
								value: product.id,
								label: product.name,
							})),
						]}
						value={productFilter}
						onChange={(value) => setProductFilter(value || '')}
						radius="md"
						clearable
					/>

					<Select
						placeholder="Status"
						data={[
							{ value: '', label: 'All Statuses' },
							{ value: 'active', label: 'Active' },
							{ value: 'inactive', label: 'Inactive' },
						]}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value || '')}
						radius="md"
						clearable
					/>
				</div>
			</Card>

			<Card className={classes.tableCard}>
				<div className={classes.tableHeader}>
					<Group position="apart">
						<Text
							weight={600}
							size="lg"
						>
							Commission Rates
						</Text>
						<Text
							color="dimmed"
							size="sm"
						>
							{filteredRates.length} rates
						</Text>
					</Group>
				</div>

				{ratesTable}
			</Card>

			<CommissionRateModal
				opened={rateModalOpened}
				onClose={handleCloseRateModal}
				commissionRate={selectedRate}
			/>
		</Container>
	);
}
