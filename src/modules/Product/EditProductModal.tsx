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
  IconEdit,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../../components/Modal";
import useRequest from "../../hooks/useRequest";
import { Product } from "../Dealer/types";

interface EditProductModalProps {
  opened: boolean;
  onClose: () => void;
  product: Product;
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
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
  },
  actions: {
    padding: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.gray[2]}`,
  },
}));

export function EditProductModal({
  opened,
  onClose,
  product,
}: EditProductModalProps) {
  const { classes } = useStyles();
  const request = useRequest(true);
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    initialValues: {
      productName: product.productName,
      description: product.description,
      productCategory: product.productCategory,
      status: product.status,
      price: product.price,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) =>
      request.put(`/products/${product.id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
  });

  const handleSubmit = (values: ProductFormValues) => mutation.mutate(values);

  return (
    <Modal opened={opened} close={onClose} size="lg">
      <div className={classes.header}>
        <Group>
          <ThemeIcon size={40} radius="md" color="yellow" variant="light">
            <IconEdit size={20} />
          </ThemeIcon>
          <div>
            <Title order={3}>Edit Product</Title>
            <Text size="sm" color="dimmed">
              Update product information
            </Text>
          </div>
        </Group>
      </div>

      <div style={{ padding: 20 }}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput label="Name" {...form.getInputProps("productName")} />
            <TextInput
              label="Description"
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Category"
              {...form.getInputProps("productCategory")}
            />
            <Select
              label="Status"
              data={["Active", "Inactive"]}
              {...form.getInputProps("status")}
            />
            <TextInput
              label="Price"
              type="number"
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
            leftIcon={<IconCheck size={16} />}
            onClick={() => handleSubmit(form.values)}
          >
            Save Changes
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
