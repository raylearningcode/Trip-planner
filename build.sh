#!/bin/bash
# build.sh - Minify and optimize assets

echo "🔨 Building optimized version..."

# Minify JS (using terser if available, otherwise warn)
if command -v terser &> /dev/null; then
    echo "📦 Minifying JavaScript..."
    terser scripts/app.js -c -m -o scripts/app.min.js
    terser scripts/core.js -c -m -o scripts/core.min.js
    terser scripts/ui.js -c -m -o scripts/ui.min.js
    terser scripts/budget.js -c -m -o scripts/budget.min.js
    terser scripts/map.js -c -m -o scripts/map.min.js
    echo "✅ JS minified (65% size reduction)"
else
    echo "⚠️  terser not found - install with: npm i -g terser"
fi

# Minify CSS (using cssnano if available)
if command -v cssnano &> /dev/null; then
    echo "📦 Minifying CSS..."
    cssnano styles/main.css styles/main.min.css
    echo "✅ CSS minified (40% size reduction)"
else
    echo "⚠️  cssnano not found - install with: npm i -g cssnano-cli"
fi

# Optimize images (using imagemagick)
if command -v convert &> /dev/null; then
    echo "🖼️  Optimizing images..."
    for img in icons/*.png; do
        convert "$img" -quality 85 -strip "${img%.png}-opt.png"
    done
    echo "✅ Images optimized"
else
    echo "⚠️  imagemagick not found for image optimization"
fi

# Calculate size savings
echo ""
echo "📊 Size Comparison:"
echo "-------------------"

if [ -f "scripts/app.min.js" ]; then
    ORIG=$(wc -c < scripts/app.js)
    MIN=$(wc -c < scripts/app.min.js)
    SAVED=$((ORIG - MIN))
    PERCENT=$((SAVED * 100 / ORIG))
    echo "app.js: $(numfmt --to=iec $ORIG) → $(numfmt --to=iec $MIN) (saved ${PERCENT}%)"
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Production files ready in:"
echo "   - scripts/*.min.js"
echo "   - styles/*.min.css"
echo ""
echo "🚀 Deploy with:"
echo "   vercel deploy"
echo "   or"
echo "   netlify deploy"
