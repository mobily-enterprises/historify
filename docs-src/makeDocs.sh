rm -rf ../docs/*;
echo "historify.com" > ../docs/CNAME
#node --inspect-brk\
  ../node_modules/.bin/docco\
  -p ./plugin.js\
	-c tpe.css\
       	-t tpe.ejs\
       	-o ../docs\
       	index.md\
       	api.md\
        guides.md\
        guides/*\
        historify.js
cp -r ./images ../docs/
# cp --parents -pr guides/*/* ../docs
