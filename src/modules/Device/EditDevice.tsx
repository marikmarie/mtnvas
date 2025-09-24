// src/features/Device/EditDeviceModal.tsx
import React, { useEffect } from 'react';
import {
  Alert,
  Badge,
  Button,
  createStyles,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconEdit } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Device } from '../Dealer/types';

interface EditDeviceModalProps {
  opened: boolean;
  onClose: () => void;
  device: Device | null;
}

interface DeviceFormValues {
  deviceName: string;
  description?: string;
  deviceCategory: string;
  status: string;
  price: number | '';
}

const useStyles = createStyles((theme) => ({
  header: {
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },
  actions: {
    padding: theme.spacing.lg,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },
  errorAlert: {
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    fontWeight: 600,
  },
}));

export function EditDeviceModal({ opened, onClose, device }: EditDeviceModalProps) {
  const { classes } = useStyles();
  const request = useRequest(true);
  const queryClient = useQueryClient();

  const form = useForm<DeviceFormValues>({
    initialValues: {
      deviceName: device?.deviceName ?? '',
      description: device?.description ?? '',
      deviceCategory: device?.deviceCategory ?? '',
      status: device?.status ?? 'Active',
      price: device?.price ?? '',
    },
    validate: {
      deviceName: (v) => (!v ? 'Device name is required' : null),
      deviceCategory: (v) => (!v ? 'Category is required' : null),
      price: (v) => (v === '' || Number(v) <= 0 ? 'Price must be greater than 0' : null),
    },
  });

  // When device prop changes (open with selected device), update form values
  useEffect(() => {
    if (device) {
      form.setValues({
        deviceName: device.deviceName,
        description: device.description,
        deviceCategory: device.deviceCategory,
        status: device.status,
        price: device.price,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  const mutation = useMutation({
    mutationFn: (values: DeviceFormValues) => {
      if (!device) throw new Error('No device selected');
      const payload = {
        deviceName: values.deviceName,
        description: values.description,
        deviceCategory: values.deviceCategory,
        status: values.status,
        price: Number(values.price),
      };
      return request.put(`/devices/${device.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', device?.id] });
      onClose();
    },
  });

  const handleSubmit = (values: DeviceFormValues) => mutation.mutate(values);
  const hasErrors = Object.keys(form.errors).length > 0;

  return (
    <Modal opened={opened} close={onClose} size="lg">
      <div className={classes.header}>
        <Group>
          <ThemeIcon size={40} radius="md" color="yellow" variant="light">
            <IconEdit size={20} />
          </ThemeIcon>
          <div>
            <Title order={3}>Edit Device</Title>
            <Text size="sm" color="dimmed">Update device information</Text>
            {device && (
              <Group mt="xs" spacing="xs" align="center">
                <Badge color={device.status === 'Active' ? 'green' : 'red'} variant="light" className={classes.statusBadge}>
                  {device.status?.charAt(0)?.toUpperCase() + device.status?.slice(1)}
                </Badge>
                <Badge color="gray" variant="light">{device.deviceCategory}</Badge>
              </Group>
            )}
          </div>
        </Group>
      </div>

      <div style={{ padding: 20 }}>
        {hasErrors && (
          <Alert icon={<IconAlertCircle size={16} />} title="Please fix errors" color="red" className={classes.errorAlert}>
            Correct the highlighted fields.
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput label="Device Name" required {...form.getInputProps('deviceName')} radius="md" />
            <TextInput label="Description" {...form.getInputProps('description')} radius="md" />
            <TextInput label="Category" required {...form.getInputProps('deviceCategory')} radius="md" />
            <Select label="Status" data={['Active', 'Inactive']} {...form.getInputProps('status')} radius="md" />
            <TextInput label="Price" type="number" required {...form.getInputProps('price')} radius="md" />
          </Stack>
        </form>
      </div>

      <div className={classes.actions}>
        <Group position="right">
          <Button variant="subtle" onClick={onClose} radius="md">Cancel</Button>
          <Button type="submit" loading={mutation.isLoading} leftIcon={<IconCheck size={16} />} radius="md" onClick={() => form.onSubmit(handleSubmit)()}>
            Save Changes
          </Button>
        </Group>
      </div>
    </Modal>
  );
}

export default EditDeviceModal;
