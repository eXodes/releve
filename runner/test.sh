#!/usr/bin/env bash

set -e

echo "Seed database"
npm run firebase:seed:e2e

echo "Install Playwright"
npx playwright install --with-deps

echo "Running e2e tests"
npx playwright test
