#!/bin/bash
echo "$(echo '#!/usr/bin/env node' | cat - bin/splitio-sync-tools.js)" > bin/splitio-sync-tools.js
chmod u+x bin/splitio-sync-tools.js
