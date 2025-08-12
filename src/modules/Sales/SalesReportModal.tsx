import {
	Button,
	Card,
	Divider,
	Group,
	Modal,
	Paper,
	Select,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	createStyles,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import {
	IconCalendar,
	IconDownload,
	IconTrendingUp,
	IconDeviceMobile,
	IconUser,
	IconBuilding,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { SalesReportModalProps, SalesReportRequest, SalesReportResponse } from '../Dealer/types';

const useStyles = createStyles((theme) => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
		marginBottom: theme.spacing.xl,
	},

	formSection: {
		padding: `0 ${theme.spacing.xs}`,
	},

	inputIcon: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},

	actions: {
		padding: theme.spacing.md,
		paddingBottom: theme.spacing.lg,
		borderTop: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	reportCard: {
		padding: theme.spacing.lg,
		borderRadius: theme.radius.lg,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
	},

	statCard: {
		padding: theme.spacing.md,
		borderRadius: theme.radius.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
		textAlign: 'center',
	},

	statValue: {
		fontSize: '1.5rem',
		fontWeight: 700,
		color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[9],
		marginBottom: theme.spacing.xs,
	},

	statLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		fontWeight: 500,
	},

	breakdownCard: {
		padding: theme.spacing.md,
		borderRadius: theme.radius.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
		marginBottom: theme.spacing.sm,
	},

	breakdownRow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing.xs,
		'&:last-child': {
			marginBottom: 0,
		},
	},

	breakdownLabel: {
		fontWeight: 500,
		flex: 1,
	},

	breakdownValue: {
		fontWeight: 600,
		color: theme.colors.blue[6],
	},

	infoCard: {
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.blue[9] : theme.colors.blue[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[2]
		}`,
		marginBottom: theme.spacing.lg,
	},
}));

export function SalesReportModal({ opened, onClose }: SalesReportModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const form = useForm<SalesReportRequest>({
		initialValues: {
			reportType: 'summary',
			dateFrom: new Date(new Date().setDate(new Date().getDate() - 30))
				.toISOString()
				.split('T')[0],
			dateTo: new Date().toISOString().split('T')[0],
			dealerId: '',
			agentId: '',
			shopId: '',
			productId: '',
			groupBy: 'date',
		},
		validate: {
			dateFrom: (value) => (!value ? 'Start date is required' : null),
			dateTo: (value) => (!value ? 'End date is required' : null),
		},
	});

	// Parse dates for date pickers
	const dateFromValue = useMemo(() => {
		return form.values.dateFrom ? new Date(form.values.dateFrom) : null;
	}, [form.values.dateFrom]);

	const dateToValue = useMemo(() => {
		return form.values.dateTo ? new Date(form.values.dateTo) : null;
	}, [form.values.dateTo]);

	// Fetch lookup data
	const { data: dealersData } = useQuery({
		queryKey: ['dealers-lookup'],
		queryFn: () => request.get('/lookups/dealers'),
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents-lookup'],
		queryFn: () => request.get('/agents', { params: { status: 'active' } }),
	});

	const { data: shopsData } = useQuery({
		queryKey: ['shops-lookup'],
		queryFn: () => request.get('/lookups/shops'),
	});

	const { data: productsData } = useQuery({
		queryKey: ['products-lookup'],
		queryFn: () => request.get('/lookups/products'),
	});

	// Fetch report data
	const { data: reportData, isLoading: reportLoading } = useQuery({
		queryKey: ['sales-report', form.values],
		queryFn: async () => {
			const response = await request.get('/reports/sales', { params: form.values });
			return response.data as SalesReportResponse;
		},
		enabled: !!form.values.dateFrom && !!form.values.dateTo,
	});

	const handleDateFromChange = (date: Date | null) => {
		form.setFieldValue('dateFrom', date ? date.toISOString().split('T')[0] : '');
	};

	const handleDateToChange = (date: Date | null) => {
		form.setFieldValue('dateTo', date ? date.toISOString().split('T')[0] : '');
	};

	const handleExportReport = () => {
		// Implement export functionality
		console.log('Exporting report...', form.values);
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={null}
			size="xl"
			radius="lg"
			padding={0}
			styles={{
				body: { padding: 0 },
				header: { display: 'none' },
			}}
		>
			{/* Custom Header */}
			<div
				className={classes.header}
				style={{ padding: '24px 24px 0' }}
			>
				<ThemeIcon
					size="lg"
					radius="md"
					color="orange"
				>
					<IconTrendingUp size={24} />
				</ThemeIcon>
				<div>
					<Text
						size="lg"
						weight={600}
					>
						Sales Report
					</Text>
					<Text
						color="dimmed"
						size="sm"
					>
						Generate detailed sales analytics and performance reports
					</Text>
				</div>
			</div>

			<div className={classes.formSection}>
				{/* Info Card */}
				<div className={classes.infoCard}>
					<Text
						size="sm"
						weight={500}
						mb="xs"
					>
						📊 Report Configuration
					</Text>
					<Text
						size="xs"
						color="dimmed"
					>
						Configure your report parameters below. Use filters to narrow down the data
						and grouping options to organize the results by different dimensions.
					</Text>
				</div>

				<Stack spacing="lg">
					{/* Report Configuration */}
					<Card className={classes.reportCard}>
						<Text
							size="md"
							weight={600}
							mb="md"
						>
							Report Settings
						</Text>

						<SimpleGrid
							cols={2}
							spacing="md"
							breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
						>
							<Select
								label="Report Type"
								data={[
									{ value: 'summary', label: 'Summary Report' },
									{ value: 'detailed', label: 'Detailed Report' },
								]}
								{...form.getInputProps('reportType')}
								radius="md"
							/>

							<Select
								label="Group By"
								data={[
									{ value: 'date', label: 'By Date' },
									{ value: 'dealer', label: 'By Dealer' },
									{ value: 'agent', label: 'By Agent' },
									{ value: 'shop', label: 'By Shop' },
									{ value: 'product', label: 'By Product' },
								]}
								{...form.getInputProps('groupBy')}
								radius="md"
							/>
						</SimpleGrid>

						<Divider my="md" />

						<Text
							size="sm"
							weight={500}
							mb="md"
						>
							Date Range
						</Text>
						<Group grow>
							<DatePickerInput
								label="From Date"
								placeholder="Select start date"
								icon={
									<IconCalendar
										size={16}
										className={classes.inputIcon}
									/>
								}
								value={dateFromValue}
								onChange={handleDateFromChange}
								radius="md"
								required
							/>

							<DatePickerInput
								label="To Date"
								placeholder="Select end date"
								icon={
									<IconCalendar
										size={16}
										className={classes.inputIcon}
									/>
								}
								value={dateToValue}
								onChange={handleDateToChange}
								radius="md"
								required
							/>
						</Group>

						<Divider my="md" />

						<Text
							size="sm"
							weight={500}
							mb="md"
						>
							Filters (Optional)
						</Text>
						<SimpleGrid
							cols={2}
							spacing="md"
							breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
						>
							<Select
								label="Dealer"
								placeholder="All dealers"
								icon={
									<IconBuilding
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={[
									{ value: '', label: 'All Dealers' },
									...(dealersData?.data?.data?.map((dealer: any) => ({
										value: dealer.id,
										label: dealer.name,
									})) || []),
								]}
								{...form.getInputProps('dealerId')}
								radius="md"
								clearable
							/>

							<Select
								label="Agent"
								placeholder="All agents"
								icon={
									<IconUser
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={[
									{ value: '', label: 'All Agents' },
									...(agentsData?.data?.data?.map((agent: any) => ({
										value: agent.id,
										label: agent.name,
									})) || []),
								]}
								{...form.getInputProps('agentId')}
								radius="md"
								clearable
							/>

							<Select
								label="Shop"
								placeholder="All shops"
								icon={
									<IconBuilding
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={[
									{ value: '', label: 'All Shops' },
									...(shopsData?.data?.data?.map((shop: any) => ({
										value: shop.id,
										label: shop.name,
									})) || []),
								]}
								{...form.getInputProps('shopId')}
								radius="md"
								clearable
							/>

							<Select
								label="Product"
								placeholder="All products"
								icon={
									<IconDeviceMobile
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={[
									{ value: '', label: 'All Products' },
									...(productsData?.data?.data?.map((product: any) => ({
										value: product.id,
										label: product.name,
									})) || []),
								]}
								{...form.getInputProps('productId')}
								radius="md"
								clearable
							/>
						</SimpleGrid>
					</Card>

					{/* Report Results */}
					{reportData && !reportLoading && (
						<Card className={classes.reportCard}>
							<Group
								position="apart"
								mb="md"
							>
								<Text
									size="md"
									weight={600}
								>
									Report Summary
								</Text>
								<Button
									leftIcon={<IconDownload size={16} />}
									variant="light"
									size="xs"
									onClick={handleExportReport}
								>
									Export
								</Button>
							</Group>

							{/* Summary Statistics */}
							<SimpleGrid
								cols={4}
								spacing="md"
								breakpoints={[
									{ maxWidth: 'md', cols: 2 },
									{ maxWidth: 'sm', cols: 1 },
								]}
							>
								<div className={classes.statCard}>
									<Text className={classes.statValue}>
										{formatCurrency(reportData.summary.totalSales)}
									</Text>
									<Text className={classes.statLabel}>Total Sales</Text>
								</div>

								<div className={classes.statCard}>
									<Text className={classes.statValue}>
										{formatCurrency(reportData.summary.totalCommission)}
									</Text>
									<Text className={classes.statLabel}>Commission</Text>
								</div>

								<div className={classes.statCard}>
									<Text className={classes.statValue}>
										{reportData.summary.totalTransactions}
									</Text>
									<Text className={classes.statLabel}>Transactions</Text>
								</div>

								<div className={classes.statCard}>
									<Text className={classes.statValue}>
										{reportData.summary.activations}
									</Text>
									<Text className={classes.statLabel}>Activations</Text>
								</div>
							</SimpleGrid>

							{/* Breakdown */}
							{reportData.breakdown && reportData.breakdown.length > 0 && (
								<>
									<Divider my="lg" />
									<Text
										size="md"
										weight={600}
										mb="md"
									>
										Breakdown by {form.values.groupBy}
									</Text>
									<Stack spacing="xs">
										{reportData.breakdown.slice(0, 10).map((item, index) => (
											<div
												key={index}
												className={classes.breakdownCard}
											>
												<div className={classes.breakdownRow}>
													<Text className={classes.breakdownLabel}>
														{item.groupLabel}
													</Text>
													<Text className={classes.breakdownValue}>
														{formatCurrency(item.sales)}
													</Text>
												</div>
												<div className={classes.breakdownRow}>
													<Text
														size="sm"
														color="dimmed"
													>
														{item.transactions} transactions
													</Text>
													<Text
														size="sm"
														color="dimmed"
													>
														{formatCurrency(item.commission)} commission
													</Text>
												</div>
											</div>
										))}
									</Stack>
								</>
							)}
						</Card>
					)}

					{reportLoading && (
						<Paper
							p="xl"
							style={{ textAlign: 'center' }}
						>
							<Text color="dimmed">Loading report data...</Text>
						</Paper>
					)}
				</Stack>
			</div>

			{/* Actions */}
			<div className={classes.actions}>
				<Group
					position="right"
					spacing="md"
				>
					<Button
						variant="subtle"
						onClick={handleClose}
						radius="md"
					>
						Close
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
