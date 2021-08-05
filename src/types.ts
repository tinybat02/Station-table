import { DataFrame, Field, Vector } from '@grafana/data';

export interface PanelOptions {
  order: string[];
}

export const defaults: PanelOptions = {
  order: [],
};

export interface Buffer extends Vector {
  buffer: number[];
}

export interface FieldBuffer extends Field<any, Vector> {
  values: Buffer;
}

export interface Frame extends DataFrame {
  fields: FieldBuffer[];
}

export interface ColumnHeader {
  Header: string;
  accessor?: string;
  columns?: { Header: string; accessor: string }[];
}
