import React, { useState } from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { professorListData } from '../common/sampleData/professorList';
import { Professor } from '../../types/professor';
import { Button, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IUser } from '../../hooks/api/useUserApi';

const initialRows: GridRowsProp = professorListData.map((professor: Professor) => ({
    id: professor.id,
    instructor: professor.Name,
    email: professor.Email,
    preferencesSubmitted: professor.IsMissingPreferenceSubmission ? null : new Date(),
}));

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

    return (
        <Paper sx={{ p: 2 }}>
            <DataGrid
                rows={initialRows}
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
            />
        </Paper>
    )
};


export default ProfessorTable;