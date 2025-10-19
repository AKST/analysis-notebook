#!/bin/bash

echo "File|doc._figure|doc.figcaption|Difference" | column -t -s'|'
echo "------------------------------------------------------------"

for file in lib/app/sec-2206/sec-{02,03,04,05,07,08,09,10}-{1,2}/mathml.js lib/app/sec-2206/sec-{02,03,04,05,07,08,09,10}-{1,2}/tables.js; do
  if [ -f "$file" ]; then
    figure_count=$(grep -c "doc._figure" "$file" || echo 0)
    figcaption_count=$(grep -c "doc.figcaption" "$file" || echo 0)
    diff=$((figure_count - figcaption_count))
    abs_diff=${diff#-}
    echo "$file|$figure_count|$figcaption_count|$diff|$abs_diff"
  fi
done | sort -t'|' -k5 -nr | while IFS='|' read file figure figcaption diff abs_diff; do
  echo "$file|$figure|$figcaption|$diff" | column -t -s'|'
done
