#!/usr/bin/env bash

set -e

echo "Seed database"
npm run firebase:seed

echo "Running tests"
npm run test
