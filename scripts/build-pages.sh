#!/usr/bin/env bash
# Build Next.js untuk Cloudflare Pages.
#   scripts/build-pages.sh dev    -> memakai .env.production  (worker dev)
#   scripts/build-pages.sh prod   -> memakai .env.prod        (worker prod, menimpa .env.production)
#
# Next.js memberi prioritas environment shell di atas file .env*, jadi untuk prod
# cukup meng-export isi .env.prod sebelum build.
set -euo pipefail

TARGET="${1:-}"
case "$TARGET" in
  dev) ;;
  prod)
    if [ ! -f .env.prod ]; then
      echo "ERROR: .env.prod tidak ada. Salin dari .env.prod.example lalu isi URL worker prod." >&2
      exit 1
    fi
    set -a
    # shellcheck disable=SC1091
    . ./.env.prod
    set +a
    ;;
  *)
    echo "Usage: $0 <dev|prod>" >&2
    exit 1
    ;;
esac

if [ -z "${NEXT_PUBLIC_API_URL:-}" ] && ! grep -q '^NEXT_PUBLIC_API_URL=.\+' .env.production; then
  echo "ERROR: NEXT_PUBLIC_API_URL tidak ditemukan." >&2
  exit 1
fi

npx @cloudflare/next-on-pages

# Workaround: modul Node bawaan harus memakai prefix node: di runtime Workers.
find .vercel/output/static/_worker.js -type f -name '*.js' -exec sed -i 's/"async_hooks"/"node:async_hooks"/g' {} +
find .vercel/output/static/_worker.js -type f -name '*.js' -exec sed -i "s/'async_hooks'/'node:async_hooks'/g" {} +
