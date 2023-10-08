#!/usr/bin/env bash

set -e

echo "Installing Playwright"
npx playwright install --with-deps

echo "Seed database"
npm run firebase:seed

echo "Running tests"
npm run test --exit
