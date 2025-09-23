import {
  Alert,
  Button,
  createStyles,
  Group,
  Stack,
  TextInput,
  Title,
  ThemeIcon,
  Text,
} from "@mantine/core";
import { IconAlertCircle, IconDeviceMobile, IconCheck } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../../components/Modal";
import useRequest from "../../hooks/useRequest";

interface AddDeviceModalProps {
  opened: boolean;
  onClose: () => void;
}

interface DeviceFormValues {
  imei: string;
  serial: string;
  productId: string;
}

const useStyles = createStyles((theme) => ({
  header: {
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.gray[3]}`,
    backgroundColor: theme.colors.gray[0],
  },
  section: {
    padding: theme.spacing.lg,
  },
  actions: {
    padding: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.gray[3]}`,
  },
}));

export function AddDevice({ opened, onClose }: AddDeviceModalProps) {
  const { classes } = useStyles();
  const request = useRequest(true);
  const queryClient = useQueryClient();

  const form = useForm<DeviceFormValues>({
    initialValues: { imei: "", serial: "", productId: "" },
    validate: {
      imei: (value) => (!value ? "IMEI is required" : null),
      serial: (value) => (!value ? "Serial is required" : null),
      productId: (value) => (!value ? "Product is required" : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: DeviceFormValues) => request.post("/device", values),
    onSuccess: () => {
      queryClient.invalidateQueries(["devices"]);
      onClose();
    },
  });

  const handleSubmit = (values: DeviceFormValues) => mutation.mutate(values);

  return (
    <Modal opened={opened} close={onClose} size="lg">
      <div className={classes.header}>
        <Group>
          <ThemeIcon size={40} radius="md" variant="light" color="teal">
            <IconDeviceMobile size={20} />
          </ThemeIcon>
          <div>
            <Title order={3} size="h4">
              Add Device
            </Title>
            <Text color="dimmed" size="sm">
              Register a new device
            </Text>
          </div>
        </Group>
      </div>

      <div className={classes.section}>
        {Object.keys(form.errors).length > 0 && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            Fix the highlighted fields before submitting
          </Alert>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput label="IMEI" placeholder="Enter IMEI" {...form.getInputProps("imei")} />
            <TextInput label="Serial" placeholder="Enter Serial" {...form.getInputProps("serial")} />
            <TextInput
              label="Product ID"
              placeholder="Enter Product ID"
              {...form.getInputProps("productId")}
            />
          </Stack>
        </form>
      </div>

      <div className={classes.actions}>
        <Group position="right">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={mutation.isLoading}
            leftIcon={<IconCheck size={16} />}
            onClick={() => handleSubmit(form.values)}
          >
            Save
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
