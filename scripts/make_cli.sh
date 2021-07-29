#!/bin/bash
echo "$(echo '#!/usr/bin/env node' | cat - bin/splitio-node-synchronizer.js)" > bin/splitio-node-synchronizer.js
chmod u+x bin/splitio-node-synchronizer.js
