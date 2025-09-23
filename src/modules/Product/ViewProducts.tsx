import { useQuery } from "@tanstack/react-query";
import { Table, Button, Group, createStyles } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import useRequest from "../../hooks/useRequest";
import  { Product } from "../Dealer/types";

import { AddProduct } from "./AddProduct";
import { EditProductModal } from "./EditProductModal";


interface ViewProductsProps {
    opened: boolean;
    onClose: () => void;
    product: Product;
}

const useStyles = createStyles((theme) => ({
  root: {
    padding: 0,
  },

  header: {
    marginBottom: theme.spacing.lg,
  },

  searchSection: {
    marginBottom: theme.spacing.lg,
  },

  searchRow: {
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },

  card: {
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },

  cardHeader: {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },

  cardBody: {
    padding: theme.spacing.md,
  },

  cardFooter: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
  },

  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },

  statusBadge: {
    fontWeight: 600,
  },

  actionButton: {
    transition: 'all 0.2s ease',
  },

  userTypeBadge: {
    fontWeight: 600,
  },

  merchantCode: {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
  },
}));



export function ViewProducts({  opened, onClose, product  }: ViewProductsProps) {
  const {classes} = useStyles();
  const request = useRequest(true);

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => request.get("/products"),
  });

  const products = data?.data.data as Product[];

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Status</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products?.map((p) => (
          <tr key={p.id}>
            <td>{p.productName}</td>
            <td>{p.productCategory}</td>
            <td>{p.status}</td>
            <td>{p.price}</td>
            <td>
              <Group spacing="xs">
                <Button
                  size="xs"
                  variant="light"
                  leftIcon={<IconEdit size={14} />}
                  onClick={() => onEdit(p)}
                >
                  Edit
                </Button>
              </Group>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
