#!/usr/bin/env bash

set -e

echo "Seed database"
npm run firebase:seed

echo "Install Playwright"
npx playwright install

echo "Running e2e tests"
npx playwright test
