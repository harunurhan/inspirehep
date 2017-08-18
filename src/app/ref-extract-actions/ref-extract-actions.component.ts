/*
 * This file is part of record-editor.
 * Copyright (C) 2017 CERN.
 *
 * record-editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * record-editor is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with record-editor; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

import { Component, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { JsonStoreService } from 'ng2-json-editor';

import { RefExtractApiService } from '../shared/services';

@Component({
  selector: 're-ref-extract-actions',
  templateUrl: './ref-extract-actions.component.html',
  styleUrls: [
    './ref-extract-actions.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefExtractActionsComponent {

  textOrUrl: string;
  replaceExisting = true;

  private urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

  constructor(private refExtractApiService: RefExtractApiService,
    private jsonStoreService: JsonStoreService) { }

  onExtractClick() {
    this.refExtractApiService
      .refExtract(this.textOrUrl, this.sourceType)
      .then(references => {
        if (this.replaceExisting) {
          this.jsonStoreService.setIn(['references'], references);
        } else {
          references.forEach(reference => {
            this.jsonStoreService.addIn(['references', 0], reference);
          });
        }
      });
  }

  get sourceType(): 'text' | 'url' {
    return this.urlRegexp.test(this.textOrUrl) ? 'url' : 'text';
  }

}
