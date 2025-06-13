import { Badge, Box, Button, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { IconBuilding, IconCalendar, IconMail, IconPhone, IconUser } from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import { Dealer } from './types';

interface ViewDealerModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
}

export function ViewDealerModal({ opened, onClose, dealer }: ViewDealerModalProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<Stack spacing="md">
				<Title>Dealer Details: {dealer.name}</Title>
				<Box
					p="md"
					bg="gray.0"
					style={{ borderRadius: '8px' }}
				>
					<Text
						size="xl"
						weight={700}
					>
						{dealer.name}
					</Text>
					<Badge
						color={dealer.status === 'active' ? 'green' : 'red'}
						variant="filled"
						mt="xs"
					>
						{dealer.status}
					</Badge>
				</Box>

				<Divider
					label="Contact Information"
					labelPosition="center"
				/>

				<Stack spacing="sm">
					<Flex
						align="center"
						gap="md"
					>
						<IconUser size={18} />
						<Text weight={500}>{dealer.contactPerson}</Text>
					</Flex>

					<Flex
						align="center"
						gap="md"
					>
						<IconMail size={18} />
						<Text
							component="a"
							href={`mailto:${dealer.email}`}
							color="blue"
						>
							{dealer.email}
						</Text>
					</Flex>

					<Flex
						align="center"
						gap="md"
					>
						<IconPhone size={18} />
						<Text
							component="a"
							href={`tel:${dealer.phone}`}
							color="blue"
						>
							{dealer.phone}
						</Text>
					</Flex>
				</Stack>

				<Divider
					label="Business Details"
					labelPosition="center"
				/>

				<Stack spacing="sm">
					<Flex
						align="center"
						gap="md"
					>
						<IconBuilding size={18} />
						<Text weight={500}>Category: {dealer.category}</Text>
					</Flex>

					<Flex
						align="center"
						gap="md"
					>
						<IconCalendar size={18} />
						<Text>Created: {formatDate(dealer.createdAt)}</Text>
					</Flex>
				</Stack>

				<Group
					position="right"
					mt="md"
				>
					<Button
						variant="subtle"
						onClick={onClose}
					>
						Close
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
}
