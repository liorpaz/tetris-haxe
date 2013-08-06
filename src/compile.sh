#!/bin/bash -e

echo "Compiling..."
haxe compile.hxml
echo "Done"
echo "Copying resources..."

cp -a resources/* ../js/resources/

cp tetris.html ../js/tetris.html
cp tetris-mock.html ../js/tetris-mock.html
echo "Done copying resources"
if [[ $1 == "-ujs" ]]; then
	echo "Uploading js files..."
	scp ../js/tetris-mock.js  liorpaz@oam2.us.prezi.com:public_html/tetris/
	scp ../js/tetris.js  liorpaz@oam2.us.prezi.com:public_html/tetris/
	echo "Done uploading js files"
fi

if [[ $1 == "-uhtml" || $2 == "-uhtml" ]]; then
	echo "Uploading html files..."
	scp ../js/tetris-mock.html  liorpaz@oam2.us.prezi.com:public_html/tetris/
	scp ../js/tetris.html  liorpaz@oam2.us.prezi.com:public_html/tetris/
	echo "Done uploading html files"
fi

if [[ $1 == "-ucss" || $2 == "-ucss" || $3 == "-ucss" ]]; then
	echo "Uploading css files..."
	scp ../js/resources/style.css  liorpaz@oam2.us.prezi.com:public_html/tetris/resources/
	echo "Done uploading css files"
fi
