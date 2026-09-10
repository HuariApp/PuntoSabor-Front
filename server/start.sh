#!/usr/bin/env bash
npx json-server --watch server/db.json --routes server/routes.json --port 3001
