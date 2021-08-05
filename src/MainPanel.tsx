import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame, ColumnHeader } from 'types';
import { processData } from './util/process';
import { Table } from './components/Table';
import './style/main.css';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: { [key: string]: any }[];
  columns: ColumnHeader[];
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    data: [],
    columns: [],
  };

  componentDidMount() {
    const series = this.props.data.series as Frame[];

    if (series.length == 0) return;
    const { data, columns } = processData(series, this.props.options.order);

    this.setState({ data, columns });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      const series = this.props.data.series as Frame[];

      if (series.length == 0) {
        this.setState({ data: [], columns: [] });
        return;
      }

      const { data, columns } = processData(series, this.props.options.order);
      this.setState({ data, columns });
    }
  }

  render() {
    const { width, height } = this.props;
    const { data, columns } = this.state;

    if (!data.length) return <div>No Data</div>;
    return (
      <div style={{ width, height, overflowY: 'auto', padding: 10 }}>
        <Table data={data} columns={columns} />
      </div>
    );
  }
}
