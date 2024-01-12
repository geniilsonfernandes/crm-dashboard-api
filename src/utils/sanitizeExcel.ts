import ExcelJS from 'exceljs';
import fs from 'fs';

import { DeleteFileError, InvalidColumnNamesError } from '../helpers/Errors';
import dayjs from 'dayjs';

type Subscription = {
  periodicity: string;
  billing_quantity: string;
  billing_every_x_days: string;
  start_date: string;
  status: string;
  status_date: string;
  cancellation_date: string;
  amount: string;
  next_cycle: string;
  subscriber_id: string;
};

const remmappedColumnNames = {
  periodicidade: 'periodicity',
  'quantidade cobranças': 'billing_quantity',
  'cobrada a cada X dias': 'billing_every_x_days',
  'data início': 'start_date',
  status: 'status',
  'data status': 'status_date',
  'data cancelamento': 'cancellation_date',
  valor: 'amount',
  'próximo ciclo': 'next_cycle',
  'ID assinante': 'subscriber_id',
};
const remmappedColumnNamesCSV = {
  periodicidade: 'periodicity',
  'quantidade cobran�as': 'billing_quantity',
  'cobrada a cada X dias': 'billing_every_x_days',
  'data in�cio': 'start_date',
  status: 'status',
  'data status': 'status_date',
  'data cancelamento': 'cancellation_date',
  valor: 'amount',
  'pr�ximo ciclo': 'next_cycle',
  'ID assinante': 'subscriber_id',
};

function validateColumnNames(columnNames: string[]): void {
  columnNames.forEach((columnName) => {
    const enumKey =
      remmappedColumnNames[columnName as keyof typeof remmappedColumnNames];
    if (enumKey === undefined) {
      throw new InvalidColumnNamesError(
        `Nome de coluna inválido: ${columnName}`,
        400
      );
    }
  });
}

async function deleteExcelFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    throw new DeleteFileError(`Erro ao excluir o arquivo Excel: ${error}`);
  }
}

// sanitize data
async function sanitizeExcel(filePath: string) {
  const workbook = new ExcelJS.Workbook();

  const isXlsx = filePath.endsWith('.xlsx');
  const isCsv = filePath.endsWith('.csv');

  try {
    if (isXlsx) {
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];
      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values as string[];
      const originalColumnNames = headers.filter((name) => name !== null);
      const data: Subscription[] = [];

      validateColumnNames(originalColumnNames);

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          const rowData = {
            periodicity: '',
            billing_quantity: '',
            billing_every_x_days: '',
            start_date: '',
            status: '',
            status_date: '',
            cancellation_date: '',
            amount: '',
            next_cycle: '',
            subscriber_id: '',
          } as Subscription;

          row.eachCell((cell, colNumber) => {
            const columnName = originalColumnNames[
              colNumber - 1
            ] as keyof typeof remmappedColumnNames;

            if (
              columnName === 'data início' ||
              columnName === 'data status' ||
              columnName === 'data cancelamento'
            ) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (rowData as any)[remmappedColumnNames[columnName]] = cell.value
                ? dayjs(cell.value as string).toISOString()
                : 'null';
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (rowData as any)[remmappedColumnNames[columnName]] =
                cell.value?.toString();
            }
          });
          data.push(rowData);
        }
      });
      return data;
    } else if (isCsv) {
      await workbook.csv.readFile(filePath);
      const worksheet = workbook.worksheets[0];
      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values as string[];
      const originalColumnNames = headers.filter((name) => name !== null);
      const data: Subscription[] = [];

      //   validateColumnNames(originalColumnNames);

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          const rowData = {
            periodicity: '',
            billing_quantity: '',
            billing_every_x_days: '',
            start_date: '',
            status: '',
            status_date: '',
            cancellation_date: '',
            amount: '',
            next_cycle: '',
            subscriber_id: '',
          } as Subscription;

          row.eachCell((cell, colNumber) => {
            const columnName = originalColumnNames[
              colNumber - 1
            ] as keyof typeof remmappedColumnNamesCSV;

            if (
              columnName === 'data in�cio' ||
              columnName === 'data status' ||
              columnName === 'data cancelamento'
            ) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (rowData as any)[remmappedColumnNamesCSV[columnName]] = cell.value
                ? dayjs(cell.value as string).toISOString()
                : 'null';
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (rowData as any)[remmappedColumnNamesCSV[columnName]] =
                cell.value?.toString();
            }
          });
          data.push(rowData);
        }
      });
      return data;
    } else {
      throw new Error('Formato de arquivo não suportado. Use .xlsx ou .csv');
    }

    // Restante do seu código aqui após a leitura do arquivo
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error);
  }

  await deleteExcelFile(filePath); // Exclui o arquivo Excel após a leitura
}

export default sanitizeExcel;
