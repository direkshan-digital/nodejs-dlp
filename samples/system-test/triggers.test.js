/**
 * Copyright 2018, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const {assert} = require('chai');
const {execSync} = require('child_process');
const uuid = require('uuid');

describe('triggers', () => {
  const projectId = process.env.GCLOUD_PROJECT;
  const cmd = 'node triggers.js';
  const triggerName = `my-trigger-${uuid.v4()}`;
  const fullTriggerName = `projects/${projectId}/jobTriggers/${triggerName}`;
  const triggerDisplayName = `My Trigger Display Name: ${uuid.v4()}`;
  const triggerDescription = `My Trigger Description: ${uuid.v4()}`;
  const infoType = 'US_CENSUS_NAME';
  const minLikelihood = 'VERY_LIKELY';
  const maxFindings = 5;
  const bucketName = process.env.BUCKET_NAME;

  it('should create a trigger', async () => {
    const output = execSync(
      `${cmd} create ${bucketName} 1 -n ${triggerName} --autoPopulateTimespan \
      -m ${minLikelihood} -t ${infoType} -f ${maxFindings} -d "${triggerDisplayName}" -s "${triggerDescription}"`
    );
    assert.match(
      output,
      new RegExp(`Successfully created trigger ${fullTriggerName}`)
    );
  });

  it('should list triggers', async () => {
    const output = execSync(`${cmd} list`);
    assert.match(output, new RegExp(`Trigger ${fullTriggerName}`), true);
    assert.match(output, new RegExp(`Display Name: ${triggerDisplayName}`));
    assert.match(output, new RegExp(`Description: ${triggerDescription}`));
    assert.match(output, /Created: \d{1,2}\/\d{1,2}\/\d{4}/);
    assert.match(output, /Updated: \d{1,2}\/\d{1,2}\/\d{4}/);
    assert.match(output, /Status: HEALTHY/);
    assert.match(output, /Error count: 0/);
  });

  it('should delete a trigger', async () => {
    const output = execSync(`${cmd} delete ${fullTriggerName}`);
    assert.match(
      output,
      new RegExp(`Successfully deleted trigger ${fullTriggerName}.`)
    );
  });

  it('should handle trigger creation errors', async () => {
    const output = execSync(
      `${cmd} create ${bucketName} 1 -n "@@@@@" -m ${minLikelihood} -t ${infoType} -f ${maxFindings}`
    );
    assert.match(output, /Error in createTrigger/);
  });

  it('should handle trigger deletion errors', async () => {
    const output = execSync(`${cmd} delete bad-trigger-path`);
    assert.match(output, /Error in deleteTrigger/);
  });
});
