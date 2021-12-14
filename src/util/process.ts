import { Frame, ColumnHeader } from '../types';

export const processData = (series: Frame[], order: string[]) => {
  series.reverse();
  const obj: { [key: string]: { [key: string]: any } } = {};

  series.map(serie => {
    const sum = serie.fields[0].values.buffer.reduce((i, total) => i + total, 0);
    const raw_name = serie.name || '';

    let combine_name = raw_name.startsWith('_') ? raw_name.substring(1) : raw_name;

    const [time, line, station] = combine_name.split(' ');
    let time_formatted;

    if (time.match(/^[012]\d:\d*/)) time_formatted = time;
    else time_formatted = '0' + time;

    const id = `${time_formatted},${line}`;

    if (!obj[id]) obj[id] = { time: time_formatted, lineNr: line, [`${station}_time`]: time_formatted };

    if (raw_name.startsWith('_')) obj[id][`${station}_out`] = sum;
    else obj[id][`${station}_in`] = sum;

    obj[id].station = station;
  });

  const inprocess_result = Object.values(obj).sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });

  const data: { [key: string]: any }[] = [];
  const trackStation: { [key: string]: string[] } = {};
  const tmp: { [key: string]: { [key: string]: any } } = {};
  const stationList: string[] = [];
  const stationHeader: string[] = [];
  let firstLine = inprocess_result[0] ? inprocess_result[0].lineNr : '';

  inprocess_result.map(item => {
    if (item.lineNr == firstLine && !stationHeader.includes(item.station)) stationHeader.push(item.station);
    if (!stationList.includes(item.station)) stationList.push(item.station);

    if (!trackStation[item.lineNr]) {
      trackStation[item.lineNr] = [item.station];

      const { station, ...rest } = item;
      tmp[item.lineNr] = rest;
    } else {
      if (trackStation[item.lineNr].includes(item.station)) {
        data.push(tmp[item.lineNr]);
        const { station, ...rest } = item;
        trackStation[item.lineNr] = [item.station];
        tmp[item.lineNr] = rest;
      } else {
        trackStation[item.lineNr].push(item.station);
        const { time, lineNr, station, ...rest } = item;
        tmp[item.lineNr] = { ...tmp[item.lineNr], ...rest };
      }
    }
  });

  stationList.map(station => {
    if (!stationHeader.includes(station)) stationHeader.push(station);
  });

  Object.keys(tmp).map(item => {
    data.push(tmp[item]);
  });

  data.sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });

  const columns: ColumnHeader[] = [{ Header: 'Line Number', accessor: 'lineNr' }];

  if (!order.length) {
    stationHeader.map(item => {
      columns.push({
        Header: item,
        columns: [
          {
            Header: 'Time',
            accessor: `${item}_time`,
          },
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
      data,
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
