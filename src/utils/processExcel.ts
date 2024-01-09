import ExcelJS from 'exceljs';
import fs from 'fs';

import { DeleteFileError, InvalidColumnNamesError } from '../helpers/Errors';

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

enum ExcelColumnHeaders {
  'periodicidade' = 'periodicity',
  'quantidade cobranças' = 'billing_quantity',
  'cobrada a cada X dias' = 'billing_every_x_days',
  'data início' = 'start_date',
  'status' = 'status',
  'data status' = 'status_date',
  'data cancelamento' = 'cancellation_date',
  'valor' = 'amount',
  'próximo ciclo' = 'next_cycle',
  'ID assinante' = 'subscriber_id',
}

function validateColumnNames(columnNames: string[]): void {
  columnNames.forEach((columnName) => {
    const enumKey =
      ExcelColumnHeaders[columnName as keyof typeof ExcelColumnHeaders];
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

async function processExcel(filePath: string) {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  const headerRow = worksheet.getRow(1);
  const headers = headerRow.values as string[];
  const originColumnNames = headers.filter((name) => name !== null);
  const data: Subscription[] = [];

  validateColumnNames(originColumnNames);

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      const rowData = {
        periodicity: '',
        amount: '',
        billing_every_x_days: '',
        cancellation_date: '',
        billing_quantity: '',
        next_cycle: '',
        start_date: '',
        status: '',
        status_date: '',
        subscriber_id: '',
      } as Subscription;
      row.eachCell((cell, colNumber) => {
        const originColumnName = originColumnNames[colNumber - 1];

        const enumKey =
          ExcelColumnHeaders[
            originColumnName as keyof typeof ExcelColumnHeaders
          ];

        rowData[enumKey] = cell?.value?.toString() || '';
      });
      data.push(rowData);
    }
  });
  await deleteExcelFile(filePath); // Exclui o arquivo Excel após a leitura
  return data;
}

export default processExcel;
