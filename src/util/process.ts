import { Frame, ColumnHeader } from '../types';

export const processData = (series: Frame[], order: string[]) => {
  series.reverse();
  const obj: { [key: string]: { [key: string]: any } } = {};
  const stationObj: { [key: string]: number } = {};

  series.map(serie => {
    const sum = serie.fields[0].values.buffer.reduce((i, total) => i + total, 0);
    const raw_name = serie.name || '';

    let combine_name = raw_name.startsWith('_') ? raw_name.substring(1) : raw_name;

    const [line, station] = combine_name.split(' ');

    if (!obj[line]) obj[line] = { lineNr: line };
    if (!stationObj[station]) stationObj[station] = 1;

    if (raw_name.startsWith('_')) {
      obj[line][`${station}_out`] = sum;
    } else {
      obj[line][`${station}_in`] = sum;
    }
  });

  const columns: ColumnHeader[] = [{ Header: 'Line Number', accessor: 'lineNr' }];

  if (!order.length) {
    Object.keys(stationObj).map(item => {
      columns.push({
        Header: item,
        columns: [
          {
            Header: 'In',
            accessor: `${item}_in`,
          },
          {
            Header: 'Out',
            accessor: `${item}_out`,
          },
        ],
      });
    });
    return {
      data: Object.values(obj),
      columns,
    };
  }

  order.map(item => {
    columns.push({
      Header: item,
      columns: [
        {
          Header: 'In',
          accessor: `${item}_in`,
        },
        {
          Header: 'Out',
          accessor: `${item}_out`,
        },
      ],
    });
  });

  return {
    data: Object.values(obj),
    columns,
  };
};
