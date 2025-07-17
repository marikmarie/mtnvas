import {
	Accordion,
	Group,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
	useMantineTheme,
} from '@mantine/core';
import {
	IconBrandSpeedtest,
	IconDatabase,
	IconPackage,
	IconRocket,
	IconWifi,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Package } from './components/Package';

interface PackageData {
	serviceCode: string;
	amount: string;
	speed?: string;
	type: '4G' | '5G' | 'bundle';
	volume?: string;
}

const PACKAGES: Record<string, PackageData[]> = {
	wakanetSpeed4G: [
		{ type: '4G', serviceCode: 'FWA_3MBPS', amount: '55000', speed: '3MBPS' },
		{ type: '4G', serviceCode: 'FWA_5MBPS', amount: '85000', speed: '5MBPS' },
		{ type: '4G', serviceCode: 'FWA_10MBPS', amount: '130000', speed: '10MBPS' },
		{ type: '4G', serviceCode: 'FWA_20MBPS', amount: '195000', speed: '20MBPS' },
	],
	wakanetVolume4G: [
		{ type: '4G', serviceCode: 'FWA_50GB_4G_HOME', amount: '55000', volume: '50GB' },
		{ type: '4G', serviceCode: 'FWA_100GB_4G_HOME', amount: '85000', volume: '100GB' },
		{ type: '4G', serviceCode: 'FWA_160GB_4G_HOME', amount: '130000', volume: '160GB' },
		{ type: '4G', serviceCode: 'FWA_300GB_4G_HOME', amount: '195000', volume: '300GB' },
		{ type: '4G', serviceCode: 'FWA_900GB_4G_HOME', amount: '295000', volume: '900GB' },
	],
	wakanet5G: [
		{ type: '5G', serviceCode: 'FWAA_10MBPS', amount: '130000', speed: '10MBPS' },
		{ type: '5G', serviceCode: 'FWAA_20MBPS', amount: '195000', speed: '20MBPS' },
		{ type: '5G', serviceCode: 'FWA_40MBPS', amount: '295000', speed: '40MBPS' },
		{ type: '5G', serviceCode: 'FWA_60MBPS', amount: '395000', speed: '60MBPS' },
		{ type: '5G', serviceCode: 'FWA_80MBPS', amount: '495000', speed: '80MBPS' },
		{ type: '5G', serviceCode: 'FWA_100MBPS', amount: '595000', speed: '100MBPS' },
		{ type: '5G', serviceCode: 'FWA_150MBPS', amount: '695000', speed: '150MBPS' },
	],
	boosterPacks4G: [
		{ type: '4G', serviceCode: 'FWA_BST_3MBPS', amount: '1400', speed: '3MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_5MBPS', amount: '2500', speed: '5MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_10MBPS', amount: '3900', speed: '10MBPS' },
		{ type: '4G', serviceCode: 'FWA_BST_20MBPS', amount: '6300', speed: '20MBPS' },
	],
	boosterPacks5G: [
		{ type: '5G', serviceCode: 'FWAA_BST_10MBPS', amount: '4300', speed: '10MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_20MBPS', amount: '6500', speed: '20MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_40MBPS', amount: '9800', speed: '40MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_60MBPS', amount: '13100', speed: '60MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_80MBPS', amount: '16500', speed: '80MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_100MBPS', amount: '19800', speed: '100MBPS' },
		{ type: '5G', serviceCode: 'FWAA_BST_150MBPS', amount: '23100', speed: '150MBPS' },
	],
	postPaidBundles: [
		{ type: 'bundle', serviceCode: 'Waka10PST', amount: '35000', volume: '14GB' },
		{ type: 'bundle', serviceCode: 'Waka20PST', amount: '55000', volume: '25GB' },
		{ type: 'bundle', serviceCode: 'Waka40PST', amount: '85000', volume: '45GB' },
		{ type: 'bundle', serviceCode: 'Waka85PST', amount: '170000', volume: '95GB' },
		{ type: 'bundle', serviceCode: 'Waka195PST', amount: '335000', volume: '195GB' },
	],
	volumeBundles: [
		{ type: 'bundle', serviceCode: '1778FHI5', amount: '35000', volume: '14GB' },
		{ type: 'bundle', serviceCode: '1778FHI4', amount: '55000', volume: '25GB' },
		{ type: 'bundle', serviceCode: '1778FHI1', amount: '85000', volume: '45GB + YoTv' },
		{ type: 'bundle', serviceCode: '1778FHI2', amount: '170000', volume: '95GB + YoTv' },
		{ type: 'bundle', serviceCode: '1778FHI3', amount: '335000', volume: '195GB + YoTv' },
	],
};

export default () => {
	const [selectedSrvCode, setSelectedSrvCode] = useState('');
	const user = useSelector((state: RootState) => state.auth.user);
	const theme = useMantineTheme();

	const getAccordionIcon = (type: string) => {
		switch (type) {
			case '4G-speed':
				return (
					<IconBrandSpeedtest
						size={20}
						color="#FFD600"
					/>
				);
			case '4G-volume':
				return (
					<IconDatabase
						size={20}
						color="#FFD600"
					/>
				);
			case '5G':
				return (
					<IconRocket
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
			case 'bundle':
				return (
					<IconPackage
						size={20}
						color="#FFD600"
					/>
				);
			default:
				return (
					<IconWifi
						size={20}
						color="#FFD600"
					/>
				);
		}
	};

	return (
		<Stack spacing="xl">
			<Accordion
				multiple
				defaultValue={['wakanetSpeed4G']}
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
				<Accordion.Item value="wakanetSpeed4G">
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
								{getAccordionIcon('4G-speed')}
							</ThemeIcon>
							<Stack spacing={2}>
								<Title
									order={4}
									color="inherit"
								>
									WAKANET SPEED 4G BUNDLES
								</Title>
								<Text
									size="xs"
									color="dimmed"
								>
									High-speed internet plans
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
							{PACKAGES.wakanetSpeed4G.map((srv) => (
								<Package
									key={srv.serviceCode}
									{...srv}
									selectedSrvCode={selectedSrvCode}
									setSelectedSrvCode={setSelectedSrvCode}
								/>
							))}
						</SimpleGrid>
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value="wakanetVolume4G">
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
								{getAccordionIcon('4G-volume')}
							</ThemeIcon>
							<Stack spacing={2}>
								<Title
									order={4}
									color="inherit"
								>
									WAKANET VOLUME 4G BUNDLES
								</Title>
								<Text
									size="xs"
									color="dimmed"
								>
									Data volume-based plans
								</Text>
							</Stack>
						</Group>
					</Accordion.Control>
					<Accordion.Panel>
						<SimpleGrid
							cols={5}
							spacing="md"
							breakpoints={[
								{ maxWidth: 'md', cols: 2 },
								{ maxWidth: 'sm', cols: 1 },
							]}
						>
							{PACKAGES.wakanetVolume4G.map((srv) => (
								<Package
									key={srv.serviceCode}
									{...srv}
									selectedSrvCode={selectedSrvCode}
									setSelectedSrvCode={setSelectedSrvCode}
								/>
							))}
						</SimpleGrid>
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value="wakanet5G">
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
								{getAccordionIcon('5G')}
							</ThemeIcon>
							<Stack spacing={2}>
								<Title
									order={4}
									color="inherit"
								>
									WAKANET SPEED 5G BUNDLES
								</Title>
								<Text
									size="xs"
									color="dimmed"
								>
									Ultra-fast 5G network plans
								</Text>
							</Stack>
						</Group>
					</Accordion.Control>
					<Accordion.Panel>
						<SimpleGrid
							cols={5}
							spacing="md"
							breakpoints={[
								{ maxWidth: 'md', cols: 2 },
								{ maxWidth: 'sm', cols: 1 },
							]}
						>
							{PACKAGES.wakanet5G.map((srv) => (
								<Package
									key={srv.serviceCode}
									{...srv}
									selectedSrvCode={selectedSrvCode}
									setSelectedSrvCode={setSelectedSrvCode}
								/>
							))}
						</SimpleGrid>
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value="boosterPacks4G">
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
								{getAccordionIcon('booster')}
							</ThemeIcon>
							<Stack spacing={2}>
								<Title
									order={4}
									color="inherit"
								>
									4G BOOSTER PACKS
								</Title>
								<Text
									size="xs"
									color="dimmed"
								>
									Speed boost add-ons
								</Text>
							</Stack>
						</Group>
					</Accordion.Control>
					<Accordion.Panel>
						<SimpleGrid
							cols={5}
							spacing="md"
							breakpoints={[
								{ maxWidth: 'md', cols: 2 },
								{ maxWidth: 'sm', cols: 1 },
							]}
						>
							{PACKAGES.boosterPacks4G.map((srv) => (
								<Package
									key={srv.serviceCode}
									{...srv}
									selectedSrvCode={selectedSrvCode}
									setSelectedSrvCode={setSelectedSrvCode}
								/>
							))}
						</SimpleGrid>
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value="boosterPacks5G">
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
								{getAccordionIcon('booster')}
							</ThemeIcon>
							<Stack spacing={2}>
								<Title
									order={4}
									color="inherit"
								>
									5G BOOSTER PACKS
								</Title>
								<Text
									size="xs"
									color="dimmed"
								>
									5G speed boost add-ons
								</Text>
							</Stack>
						</Group>
					</Accordion.Control>
					<Accordion.Panel>
						<SimpleGrid
							cols={5}
							spacing="md"
							breakpoints={[
								{ maxWidth: 'md', cols: 2 },
								{ maxWidth: 'sm', cols: 1 },
							]}
						>
							{PACKAGES.boosterPacks5G.map((srv) => (
								<Package
									key={srv.serviceCode}
									{...srv}
									selectedSrvCode={selectedSrvCode}
									setSelectedSrvCode={setSelectedSrvCode}
								/>
							))}
						</SimpleGrid>
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value="postPaidBundles">
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
								{getAccordionIcon('bundle')}
							</ThemeIcon>
							<Stack spacing={2}>
								<Title
									order={4}
									color="inherit"
								>
									POST PAID BUNDLES
								</Title>
								<Text
									size="xs"
									color="dimmed"
								>
									Monthly subscription plans
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
							{PACKAGES.postPaidBundles.map((srv) => (
								<Package
									key={srv.serviceCode}
									{...srv}
									selectedSrvCode={selectedSrvCode}
									setSelectedSrvCode={setSelectedSrvCode}
								/>
							))}
						</SimpleGrid>
					</Accordion.Panel>
				</Accordion.Item>

				{user?.role !== 'WAKA_CORP' && (
					<Accordion.Item value="volumeBundles">
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
									{getAccordionIcon('bundle')}
								</ThemeIcon>
								<Stack spacing={2}>
									<Title
										order={4}
										color="inherit"
									>
										VOLUME BUNDLES
									</Title>
									<Text
										size="xs"
										color="dimmed"
									>
										Corporate volume plans
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
								{PACKAGES.volumeBundles.map((srv) => (
									<Package
										key={srv.serviceCode}
										{...srv}
										selectedSrvCode={selectedSrvCode}
										setSelectedSrvCode={setSelectedSrvCode}
									/>
								))}
							</SimpleGrid>
						</Accordion.Panel>
					</Accordion.Item>
				)}
			</Accordion>
		</Stack>
	);
};
