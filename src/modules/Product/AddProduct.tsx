import {
  Alert,
  Button,
  createStyles,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconCheck,
  IconPackage,
  IconPlus,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../../components/Modal";
import useRequest from "../../hooks/useRequest";

interface AddProductModalProps {
  opened: boolean;
  onClose: () => void;
}

interface ProductFormValues {
  productName: string;
  description: string;
  productCategory: string;
  status: string;
  price: number;
}

const useStyles = createStyles((theme) => ({
  header: {
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colorScheme === "dark"
      ? theme.colors.dark[4]
      : theme.colors.gray[2]}`,
  },
  actions: {
    padding: theme.spacing.lg,
    borderTop: `1px solid ${theme.colorScheme === "dark"
      ? theme.colors.dark[4]
      : theme.colors.gray[2]}`,
  },
  errorAlert: {
    marginBottom: theme.spacing.md,
  },
}));

export function AddProduct({ opened, onClose }: AddProductModalProps) {
  const { classes } = useStyles();
  const request = useRequest(true);
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    initialValues: {
      productName: "",
      description: "",
      productCategory: "",
      status: "Active",
      price: 0,
    },
    validate: {
      productName: (v) => (!v ? "Product name required" : null),
      productCategory: (v) => (!v ? "Category required" : null),
      status: (v) => (!v ? "Status required" : null),
      price: (v) => (v <= 0 ? "Price must be greater than 0" : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) => request.post("/products", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
      form.reset();
    },
  });

  const handleSubmit = (values: ProductFormValues) => mutation.mutate(values);
  const hasErrors = Object.keys(form.errors).length > 0;

  return (
    <Modal opened={opened} close={onClose} size="lg">
      <div className={classes.header}>
        <Group>
          <ThemeIcon size={40} radius="md" color="blue" variant="light">
            <IconPackage size={20} />
          </ThemeIcon>
          <div>
            <Title order={3} size="h4">
              Add Product
            </Title>
            <Text size="sm" color="dimmed">
              Create a new product
            </Text>
          </div>
        </Group>
      </div>

      <div style={{ padding: 20 }}>
        {hasErrors && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Please fix errors"
            color="red"
            className={classes.errorAlert}
          >
            Correct the highlighted fields.
          </Alert>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="Product Name"
              required
              {...form.getInputProps("productName")}
            />
            <TextInput
              label="Description"
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Category"
              required
              {...form.getInputProps("productCategory")}
            />
            <Select
              label="Status"
              data={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
              {...form.getInputProps("status")}
            />
            <TextInput
              label="Price"
              type="number"
              required
              {...form.getInputProps("price")}
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
            leftIcon={<IconPlus size={16} />}
            onClick={() => handleSubmit(form.values)}
          >
            Save Product
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
