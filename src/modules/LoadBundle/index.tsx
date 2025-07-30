import {
	Accordion,
	Box,
	Button,
	Group,
	Paper,
	Select,
	SimpleGrid,
	Stack,
	Table,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandSpeedtest, IconDatabase, IconPackage, IconWifi } from '@tabler/icons-react';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Package } from './components/Package';

type SanitizedPackage = {
	type: '4G' | '5G' | 'bundle';
	serviceCode: string;
	amount: string;
	speed?: string;
	volume?: string;
	name: string;
	description: string;
	duration: number;
	offerType: string;
	discount: number;
	installationFee: number;
};

type SanitizedCategory = {
	name: string;
	displayName: string;
	type: '4G' | '5G' | 'bundle';
	packages: SanitizedPackage[];
};

type PreviousSubscription = {
	subscriptionDate: string;
	msisdn: string;
	accountNumber: string;
	serviceCode: string;
	amount: number;
};

const CATEGORY_MAP: Record<string, { displayName: string; type: '4G' | '5G' | 'bundle' }> = {
	WAKANET_ROUTER_SPEED: { displayName: 'WakaNet Router Speed Bundles', type: '4G' },
	WAKANET_ROUTER_SPEED_BOOSTER: {
		displayName: 'WakaNet Router Speed Booster Bundles',
		type: '4G',
	},
	WAKANET_ROUTER_FREEDOM: { displayName: 'WakaNet Router Freedom Bundles', type: '4G' },
	WAKANET_ROUTER_VOLUME: { displayName: 'WakaNet Router Volume Bundles', type: '4G' },
	WAKANET_5G_SPEED: { displayName: 'WakaNet 5G Speed Bundles', type: '5G' },
	WAKANET_5G_SPEED_BOOSTER: { displayName: 'WakaNet 5G Speed Booster Bundles', type: '5G' },
	WAKANET_5G_FREEDOM: { displayName: 'WakaNet 5G Freedom Bundles', type: '5G' },
	WAKANET_5G_VOLUME: { displayName: 'WakaNet 5G Volume Bundles', type: '5G' },
	BUSINESS_INTERNET_4G_SPEED: { displayName: 'Business Internet 4G Speed Bundles', type: '4G' },
	BUSINESS_INTERNET_4G_SPEED_BOOSTER: {
		displayName: 'Business Internet 4G Speed Booster Bundles',
		type: '4G',
	},
	BUSINESS_INTERNET_4G_FREEDOM: {
		displayName: 'Business Internet 4G Freedom Bundles',
		type: '4G',
	},
	BUSINESS_INTERNET_4G_VOLUME: { displayName: 'Business Internet 4G Volume Bundles', type: '4G' },
	BUSINESS_INTERNET_5G_SPEED: { displayName: 'Business Internet 5G Speed Bundles', type: '5G' },
	BUSINESS_INTERNET_5G_SPEED_BOOSTER: {
		displayName: 'Business Internet 5G Speed Booster Bundles',
		type: '5G',
	},
	BUSINESS_INTERNET_5G_FREEDOM: {
		displayName: 'Business Internet 5G Freedom Bundles',
		type: '5G',
	},
	BUSINESS_INTERNET_5G_VOLUME: { displayName: 'Business Internet 5G Volume Bundles', type: '5G' },
};

function extractSpeed(str: string): string | undefined {
	const match = str.match(/(\d+\s?Mbps)/i);
	return match ? match[1].replace(/\s+/g, '') : undefined;
}

function extractVolume(str: string): string | undefined {
	const match = str.match(/(\d+\s?GB)/i);
	return match ? match[1].replace(/\s+/g, '') : undefined;
}

function deduceType(category: string, name: string): '4G' | '5G' | 'bundle' {
	if (/5g/i.test(category) || /5g/i.test(name)) return '5G';
	if (/4g/i.test(category) || /4g/i.test(name)) return '4G';
	if (/bundle/i.test(name) || /bundle/i.test(category)) return 'bundle';
	return 'bundle';
}

// Sanitize server response
function sanitizePackages(raw: any): {
	categories: SanitizedCategory[];
	subscriptions: PreviousSubscription[];
} {
	const categories = (raw?.packageCategories || []).map((cat: any) => {
		const catInfo = CATEGORY_MAP[cat.name] || {
			displayName: cat.name,
			type: deduceType(cat.name, ''),
		};
		const packages: SanitizedPackage[] = (cat.packages || []).map((pkg: any) => {
			const speed = extractSpeed(pkg.name) || extractSpeed(pkg.description);
			const volume = extractVolume(pkg.name) || extractVolume(pkg.description);
			const type = catInfo.type || deduceType(cat.name, pkg.name);
			return {
				type,
				serviceCode: pkg.serviceCode,
				amount: String(pkg.amount),
				speed,
				volume,
				name: pkg.name,
				description: pkg.description,
				duration: pkg.duration || 0,
				offerType: pkg.offerType || '',
				discount: pkg.discount || 0,
				installationFee: pkg.installationFee || 0,
			};
		});
		return {
			name: cat.name,
			displayName: catInfo.displayName,
			type: catInfo.type,
			packages,
		};
	});

	const subscriptions = raw?.previousSubscriptions || [];

	return { categories, subscriptions };
}

export default () => {
	const [selectedSrvCode, setSelectedSrvCode] = useState('');
	const [sanitizedCategories, setSanitizedCategories] = useState<SanitizedCategory[]>([]);
	const [previousSubscriptions, setPreviousSubscriptions] = useState<PreviousSubscription[]>([]);
	const [loading, setLoading] = useState(false);
	const theme = useMantineTheme();
	const request = useRequest(true);

	const form = useForm({
		initialValues: {
			bnumber: '',
			packageCategory: '',
		},
		validate: {
			bnumber: (val: string) => (val.length > 9 ? null : 'Should be a valid account number'),
		},
	});

	const handleEligibilityCheck = async () => {
		setLoading(true);
		try {
			const res = await request.post(
				'/fwa/fetch-packages',
				{
					packageCategory: form.values.packageCategory,
					accountNumber: form.values.bnumber,
				},
				{
					headers: { 'Content-Type': 'application/json' },
				}
			);
			const data = res.data?.data;
			const parsed = typeof data === 'string' ? JSON.parse(data) : data;
			const { categories, subscriptions } = sanitizePackages(parsed);
			setSanitizedCategories(categories);
			setPreviousSubscriptions(subscriptions);
		} catch (e) {
			setSanitizedCategories([]);
			setPreviousSubscriptions([]);
		} finally {
			setLoading(false);
		}
	};

	const getAccordionIcon = (offerType: string) => {
		switch (offerType?.toLowerCase()) {
			case 'speed':
				return (
					<IconBrandSpeedtest
						size={20}
						color="#FFD600"
					/>
				);
			case 'volume':
				return (
					<IconDatabase
						size={20}
						color="#FFD600"
					/>
				);
			case 'booster':
				return (
					<IconWifi
						size={20}
						color="#FFD600"
					/>
				);
			default:
				return (
					<IconPackage
						size={20}
						color="#FFD600"
					/>
				);
		}
	};

	return (
		<Stack spacing="xl">
			<Box
				mb="md"
				p="md"
				style={{ background: theme.colors.yellow[0], borderRadius: 8 }}
			>
				<form
					onSubmit={form.onSubmit(handleEligibilityCheck)}
					style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}
				>
					<TextInput
						label="Account Number (bnumber)"
						placeholder="e.g. 256393011001"
						{...form.getInputProps('bnumber')}
						required
					/>
					<Select
						label="Package Category (optional)"
						placeholder="Select category"
						data={Object.keys(CATEGORY_MAP).map((key) => ({
							value: key,
							label: CATEGORY_MAP[key].displayName,
						}))}
						{...form.getInputProps('packageCategory')}
						width={'100%'}
						defaultValue={''}
					/>
					<Button
						type="submit"
						loading={loading}
						color="yellow"
					>
						Load packages
					</Button>
				</form>
			</Box>

			{previousSubscriptions.length > 0 && (
				<Paper
					p="lg"
					shadow="sm"
					radius="lg"
					mb="xl"
				>
					<Title
						order={3}
						mb="md"
						color="dark"
					>
						Previous Subscriptions
					</Title>
					<Table
						striped
						highlightOnHover
						fontSize="sm"
					>
						<thead>
							<tr>
								<th>Date</th>
								<th>MSISDN</th>
								<th>Service Code</th>
								<th>Amount (UGX)</th>
							</tr>
						</thead>
						<tbody>
							{previousSubscriptions.map((sub, index) => (
								<tr key={index}>
									<td>{new Date(sub.subscriptionDate).toLocaleDateString()}</td>
									<td>{sub.msisdn}</td>
									<td>{sub.serviceCode}</td>
									<td>{sub.amount.toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Paper>
			)}

			<Accordion
				multiple
				radius="lg"
				chevronPosition="right"
				styles={{
					item: {
						marginBottom: '1rem',
						overflow: 'hidden',
						borderColor: '0 2px 8px rgba(0, 0, 0, 0.1)',
					},
					control: {
						'&:hover': {
							background: theme.colors.yellow[1],
						},
						'&[data-active]': {
							background: '#FFCC08',
							color: '#795548',
						},
					},
					content: {
						padding: '1.5rem',
					},
					chevron: {
						'&[data-rotate]': {
							transform: 'rotate(180deg)',
						},
					},
				}}
			>
				{sanitizedCategories.map((cat) => (
					<Accordion.Item
						value={cat.name}
						key={cat.name}
					>
						<Accordion.Control>
							<Group
								spacing="md"
								noWrap
							>
								<ThemeIcon
									variant="light"
									color="yellow"
									size="md"
									radius="md"
								>
									{getAccordionIcon(cat.packages[0]?.offerType || 'bundle')}
								</ThemeIcon>
								<Stack spacing={2}>
									<Title
										order={4}
										color="inherit"
									>
										{cat.displayName}
									</Title>
									<Text
										size="xs"
										color="dimmed"
									>
										{cat.packages[0]?.offerType === 'SPEED'
											? 'Speed bundles'
											: cat.packages[0]?.offerType === 'VOLUME'
												? 'Volume bundles'
												: cat.type === '4G'
													? '4G plans'
													: cat.type === '5G'
														? '5G plans'
														: 'Bundle plans'}
									</Text>
								</Stack>
							</Group>
						</Accordion.Control>
						<Accordion.Panel>
							<SimpleGrid
								cols={5}
								spacing="md"
								breakpoints={[
									{ maxWidth: 'md', cols: 3 },
									{ maxWidth: 'sm', cols: 1 },
								]}
							>
								{cat.packages.map((srv) => (
									<Package
										key={srv.serviceCode}
										{...srv}
										bnumber={form.values.bnumber}
										selectedSrvCode={selectedSrvCode}
										setSelectedSrvCode={setSelectedSrvCode}
										categoryName={cat.name}
									/>
								))}
							</SimpleGrid>
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		</Stack>
	);
};
