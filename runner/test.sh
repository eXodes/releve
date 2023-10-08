#!/usr/bin/env bash

set -e

echo "Installing Playwright"
npx playwright install

echo "Seed database"
npm run firebase:seed

echo "Running tests"
npm run test
