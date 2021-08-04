import React /* , { useState }  */ from 'react';
//@ts-ignore
import { FormField, PanelOptionsGroup } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { PanelOptions } from './types';

export const MainEditor: React.FC<PanelEditorProps<PanelOptions>> = ({ options, onOptionsChange }) => {
  // const [input, setInput] = useState(options);

  // const onSubmit = () => {
  //   onOptionsChange(input);
  // };

  return (
    <PanelOptionsGroup>
      <div className="editor-row">
        <div className="section gf-form-group"></div>
      </div>
      {/* <button className="btn btn-primary" onClick={onSubmit}>
        Submit
      </button> */}
    </PanelOptionsGroup>
  );
};
