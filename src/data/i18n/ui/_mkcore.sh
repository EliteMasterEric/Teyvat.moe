#!/bin/bash

# https://github.com/microsoft/TypeScript/issues/32063

echo -E "export default $(cat _core.json) as const" > _core.json.d.ts