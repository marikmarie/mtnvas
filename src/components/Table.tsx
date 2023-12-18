// ResponsiveTable.js
import React from "react";
import "./ResponsiveTable.css";

const ResponsiveTable: React.FC<{ data: [], columns: string[] }> = ( { data, columns } ) => {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map( ( column ) => (
                            <th key={column}>{column}</th>
                        ) )}
                    </tr>
                </thead>
                <tbody>
                    {data.map( ( row, index ) => (
                        <tr key={index}>
                            {columns.map( ( column ) => (
                                <td key={column}>{row[column]}</td>
                            ) )}
                        </tr>
                    ) )}
                </tbody>
            </table>
        </div>
    );
};

export default ResponsiveTable;
