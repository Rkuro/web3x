/*
  This file is part of web3x.

  web3x is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  web3x is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with web3x.  If not, see <http://www.gnu.org/licenses/>.
*/

import { EventLog } from '../formatters';
import { LogResponse } from '../formatters/log-response-formatter';
import { ContractEntryDefinition } from './abi';
import { abiCoder } from './abi-coder';

/**
 * Decodes an event log response and its return values.
 *
 * @param event Abi definition of event.
 * @param log The log response to decode.
 * @returns The decoded event log.
 */
export function decodeEvent(event: ContractEntryDefinition, log: LogResponse): EventLog<any> {
  log.data = log.data || '';
  log.topics = log.topics || [];

  const argTopics = event.anonymous ? log.topics : log.topics.slice(1);
  const returnValues = abiCoder.decodeLog(event.inputs, log.data, argTopics);
  delete returnValues.__length__;

  const { data, topics, ...formattedLog } = log;

  return {
    ...formattedLog,
    event: event.name,
    returnValues,
    signature: event.anonymous || !log.topics[0] ? null : log.topics[0],
    raw: {
      data,
      topics,
    },
  };
}
