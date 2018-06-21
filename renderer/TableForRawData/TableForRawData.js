import React from 'react';
import TableMUI from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const TableForRawData = ({ children }) => {
  const row = children;
  return (
    <TableMUI key={`row${row.date.toString()}`}>
      <TableHead>
        <TableRow>
          <TableCell><h3>Time stamp</h3></TableCell>
          <TableCell><h3>State</h3></TableCell>
          <TableCell numeric><h3>%</h3></TableCell>
          <TableCell numeric><h3>Time to full (ms)</h3></TableCell>
          <TableCell numeric><h3>Time to empty (ms)</h3></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {row.data.map((rowData) => {
          const normalizedTimeStamp = typeof rowData.timeStamp === 'tring' ? rowData.timeStamp : rowData.timeStamp.toString();
          return (
            <TableRow key={rowData.timeStamp}>
              <TableCell>
                {normalizedTimeStamp}
              </TableCell>
              <TableCell>
                {rowData.state}
              </TableCell>
              <TableCell numeric>
                {rowData.percentage.value}
              </TableCell>
              <TableCell numeric>
                {rowData.timetofull ? rowData.timetofull.value : '-'}
              </TableCell>
              <TableCell numeric>
                {rowData.timetoempty ? rowData.timetoempty.value : '-'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </TableMUI>
  );
};

export default TableForRawData;
