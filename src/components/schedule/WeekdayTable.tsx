import React from 'react';
import styled from '@emotion/styled';

const Table = styled.table`
  width: 80%;
  border-collapse: collapse;
`;

const TableCell = styled.td<{ highlighted?: boolean }>`
  padding: 5px;
  border: 1px solid #ccc;
  text-align: center;
  font-weight: bold;
  color: ${({ highlighted }) => (highlighted ? 'white' : 'black')};
  background-color: ${({ highlighted }) => (highlighted ? '#1E387A' : 'transparent')};
`;

const WeekdayTable = ({ days }: { days: [string] }) => {
  const weekdays = ['M', 'T', 'W', 'R', 'F'];

  return (
    <Table>
      <tbody>
        <tr>
          {weekdays.map((weekday) => (
            <TableCell
              key={weekday}
              highlighted={days.includes(weekday)}
            >
              {weekday}
            </TableCell>
          ))}
        </tr>
      </tbody>
    </Table>
  );
};

export default WeekdayTable;
