'use strict';

import * as React from 'react';
import { TCommand } from '@code/commands/main';
// TODO: maybe have @code/commands/main re-export this
import {
  QuickOpenAction,
  ShowAllCommandsAction,
} from '@code/commands/workbenchCommands';
// TODO: pass via context - don't import as a singleton
// another idea is to separate data from operations
//   pass keybindingMap via context
//   and instantiate the service here using the keybindingMap
import { keybindingsService } from '@code/services/keybindingsService';
// import { isMacintosh } from '@code/services/environmentService';
import './Watermark.css';

// TEMPORARY - implement i18n module
const i18n = {
  localize(key: string, content: string): string {
    return content;
  },
};

interface TWatermarkEntry {
  commandId: TCommand['id'];
  // description belongs in this type not the command
  // because it's how Watermark wants to describe the commmands
  description: string;
}

const quickopen: TWatermarkEntry = {
  commandId: QuickOpenAction.id,
  description: i18n.localize('watermark.quickOpen', 'Go to File'),
};

const showCommands: TWatermarkEntry = {
  commandId: ShowAllCommandsAction.id,
  description: i18n.localize('watermark.showCommands', 'Show All Commands'),
};

// TODO: how to I guarantee that these commands & keybindings are registered
//   when this component claims that they are
//   currently there is no connection - they could be out of sync easily
// const noFolderEntries: Array<TWatermarkEntry> = [showCommands, quickopen];
const folderEntries: Array<TWatermarkEntry> = [showCommands, quickopen];

interface TEntryProps {
  commandId: TCommand['id'];
  description: string;
  shortcuts: string;
}

const Entry = ({ commandId, description, shortcuts }: TEntryProps) => (
  <dl className="watermark__entry">
    <dt>{description}</dt>
    <dd>
      <pre key={commandId} className="shortcuts">
        {shortcuts}
      </pre>
    </dd>
  </dl>
);

const entryToProps = (entry: TWatermarkEntry): TEntryProps => {
  const keybinding = keybindingsService.findByCommandId(entry.commandId);
  return {
    ...entry,
    shortcuts: keybinding
      ? keybinding.label
      : i18n.localize('watermark.unboundCommand', 'unbound'),
  };
};

export const Watermark = () => {
  const entriesProps: Array<TEntryProps> = folderEntries.map(entryToProps);
  return (
    <div className="watermark">
      <div className="watermark__content">
        {entriesProps.map(o => (
          <Entry key={o.commandId} {...o} />
        ))}
      </div>
    </div>
  );
};
