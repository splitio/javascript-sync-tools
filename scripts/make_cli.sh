#!/bin/bash
echo "$(echo '#!/usr/bin/env node' | cat - dist/index.js)" > dist/index.js
chmod u+x dist/index.js
