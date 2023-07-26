import React, { useState, useEffect} from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import Link from 'next/link';
import { IUser } from '../../hooks/api/useUserApi';

interface IProfessorTableProps {
    professors: IUser[]
}

const ProfessorTable = (props: IProfessorTableProps) => {
    const columns: GridColDef[] = [
        { field: 'instructor', headerName: 'Instructor', flex: 1, renderCell: (params) => {
            return (
                <Link href={`/professors/${params.row.id}`}>{params.value}</Link>
            )
        } },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'preferencesSubmitted', headerName: 'Preferences Submitted', type: 'date', flex: 1 },
    ];

    const professorList = props.professors.map((professor: IUser) => ({
        id: professor.id,
        instructor: professor.name,
        email: professor.email,
        preferencesSubmitted: professor.submittedPreferences ? new Date() : null,
    }))

    return (
        <Paper sx={{ p: 2 }}>
            <DataGrid
                rows={professorList}
                columns={columns}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'status', sort: 'asc' }],
                    },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                sx={{ border: 0 }}
                disableRowSelectionOnClick
            />
        </Paper>
    )
};


export default ProfessorTable;