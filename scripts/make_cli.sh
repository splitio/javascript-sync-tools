#!/bin/bash
echo "$(echo '#!/usr/bin/env node' | cat - dist/cli.js)" > dist/cli.js
chmod u+x dist/cli.js
