#!/bin/bash
echo "$(echo '#!/usr/bin/env node' | cat - lib/cli/SplitSynchronizerCLI.js)" > lib/cli/SplitSynchronizerCLI.js
chmod u+x lib/cli/SplitSynchronizerCLI.js
