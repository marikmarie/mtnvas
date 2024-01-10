import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';
import React from 'react';
import { Button } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { setSubscriptionId } from '../../app/slices/sub-id';
import useAxios from '../../hooks/use-axios';

type Data = {
    subscriptionId: string;
    msisdn: string;
    email: string;
};

const ActivationTable = () => {
    const dispatch = useDispatch()
    const axios = useAxios()

    const columns: any = React.useMemo<MRT_ColumnDef<Data>[]>(
        () => [
            {
                accessorKey: 'subscriptionId',
                header: 'SUBSCRIPTION ID',
            },
            {
                accessorKey: 'msisdn',
                header: 'MSISDN',
            },
            {
                accessorKey: 'email',
                header: 'EMAIL',
            },
            {
                accessorKey: 'action',
                header: 'ACTION',
                Cell: ( { row } ) => (
                    <Button onClick={() => dispatch( setSubscriptionId( row.original.subscriptionId ) )}>Select</Button>
                ),
            },
        ],
        [],
    );

    const [activations, setActivations] = React.useState<{ data: Data[] }>( { data: [] } )

    const getBundleActivations = React.useCallback( async () => {
        const response = await axios.get( "/bundle-activations" )
        setActivations( response.data as unknown as { data: Data[] } )
    }, [] )

    React.useEffect( () => {
        getBundleActivations()
    }, [] )

    const table = useMantineReactTable( {
        columns,
        data: activations.data || [],
        enableRowSelection: true,
        initialState: {
            pagination: { pageSize: 5, pageIndex: 0 },
            showGlobalFilter: false,
            density: 'xs'
        },
        paginationDisplayMode: 'pages',
    } );

    return <MantineReactTable table={table} />;
};

export default ActivationTable;
