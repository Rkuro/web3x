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

import { isArray } from 'util';
import { Eth, SentTransaction } from '../eth';
import { TransactionReceipt } from '../formatters';
import { TransactionHash } from '../types';
import { ContractAbi } from './abi';

export class SentContractTx extends SentTransaction {
  constructor(eth: Eth, protected contractAbi: ContractAbi, promise: Promise<TransactionHash>) {
    super(eth, promise);
  }

  protected async handleReceipt(receipt: TransactionReceipt) {
    receipt = await super.handleReceipt(receipt);

    if (!isArray(receipt.logs)) {
      return receipt;
    }

    const decodedEvents = receipt.logs.map(log => this.contractAbi.decodeAnyEvent(log));

    receipt.events = {};
    receipt.unnamedEvents = [];
    for (const ev of decodedEvents) {
      if (ev.event) {
        const events = receipt.events[ev.event] || [];
        receipt.events[ev.event] = [...events, ev];
      } else {
        receipt.unnamedEvents = [...receipt.unnamedEvents, ev];
      }
    }
    delete receipt.logs;

    return receipt;
  }
}
