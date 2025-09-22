import {
  Button,
  Group,
  Select,
  Stack,
  TextInput,
  Title,
  Text,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconPlus, IconAlertCircle, IconPackage } from "@tabler/icons-react";
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

export function AddProduct({ opened, onClose }: AddProductModalProps) {
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
      productName: (v) => (!v ? "Product name is required" : null),
      productCategory: (v) => (!v ? "Category is required" : null),
      status: (v) => (!v ? "Status is required" : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) =>
      request.post("/products", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
      form.reset();
    },
  });

  const handleSubmit = () => mutation.mutate(form.values);

  return (
    <Modal opened={opened} close={onClose} size="lg">
      <Group mb="md">
        <ThemeIcon size={40} radius="md" color="blue" variant="light">
          <IconPackage size={20} />
        </ThemeIcon>
        <div>
          <Title order={3}>Add New Product</Title>
          <Text size="sm" color="dimmed">
            Create a new product
          </Text>
        </div>
      </Group>

      {Object.keys(form.errors).length > 0 && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Please fix errors"
          color="red"
          mb="md"
        >
          Correct the highlighted fields.
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <TextInput
            label="Product Name"
            placeholder="Enter product name"
            required
            {...form.getInputProps("productName")}
          />
          <TextInput
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
          />
          <TextInput
            label="Category"
            placeholder="Enter category"
            required
            {...form.getInputProps("productCategory")}
          />
          <Select
            label="Status"
            placeholder="Select status"
            data={["Active", "Inactive"]}
            {...form.getInputProps("status")}
          />
          <TextInput
            label="Price"
            placeholder="Enter price"
            type="number"
            {...form.getInputProps("price")}
          />
        </Stack>

        <Group position="right" mt="lg">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isLoading} leftIcon={<IconPlus size={16} />}>
            Add Product
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
