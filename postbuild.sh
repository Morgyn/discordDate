#!/usr/bin/env bash
mkdir -p site
while read -r l; do
	if [[ "${l}" =~ '/* index.css */' ]]; then
		cat src/index.css
	elif [[ "${l}" =~ '<!-- main.js -->' ]]; then
		cat dist/main.js
	else
		echo "${l}"
	fi
done < src/index.html >site/index.html
