# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""This script is used to synthesize generated parts of this library."""

import synthtool as s
import synthtool.gcp as gcp
import subprocess

# Run the gapic generator
gapic = gcp.GAPICGenerator()
version = 'v2'
library = gapic.node_library(
    'dlp', version, config_path='/google/privacy/dlp/artman_dlp_v2.yaml')
s.copy(library, excludes=['src/index.js', 'README.md', 'package.json'])

# Copy common templates
common_templates = gcp.CommonTemplates()
templates = common_templates.node_library()
s.copy(templates)

# [START fix-dead-link]
s.replace('**/doc/google/protobuf/doc_timestamp.js',
        'https:\/\/cloud\.google\.com[\s\*]*http:\/\/(.*)[\s\*]*\)',
        r"https://\1)")

s.replace('**/doc/google/protobuf/doc_timestamp.js',
        'toISOString\]',
        'toISOString)')
# [END fix-dead-link]

# Node.js specific cleanup
subprocess.run(['npm', 'install'])
subprocess.run(['npm', 'run', 'fix'])
