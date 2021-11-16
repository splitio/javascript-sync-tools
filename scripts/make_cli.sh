#!/bin/bash
echo "$(echo '#!/usr/bin/env node' | cat - bin/splitio-synchronizer.js)" > bin/splitio-synchronizer.js
chmod u+x bin/splitio-synchronizer.js
