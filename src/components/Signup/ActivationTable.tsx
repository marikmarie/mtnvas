import { useCallback, useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';
import React from 'react';
import useAxios from '../../hooks/use-axios';
import { Button } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { setSubscriptionId } from '../../app/slices/sub-id';

type Data = {
    subscriptionId: string;
    msisdn: string;
    email: string;
};

const ActivationTable = () => {
    const dispatch = useDispatch()

    const columns = useMemo<MRT_ColumnDef<Data>[]>(
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
                header: 'Action',
                Cell: ( { row } ) => (
                    <Button onClick={() => dispatch( setSubscriptionId( row.original.subscriptionId ) )}>Select</Button>
                ),
            },
        ],
        [],
    );

    const axios = useAxios()
    const [data, setData] = React.useState<any>( null )

    const getBundleActivations = useCallback( async () => {
        const result = await axios.get( "/bundle-activations" )
        setData( result.data )
    }, [] )

    React.useEffect( () => {
        getBundleActivations()
    }, [] )

    console.log( "===>", data?.data )

    const table = useMantineReactTable( {
        columns,
        data: data?.data || [],
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
