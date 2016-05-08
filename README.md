# gulp-process-ref

> process css, js by html

## Usage

First, install `gulp-process-ref` as a development dependency:

```shell
npm install --save-dev gulp-process-ref
```

Then, add it to your `gulpfile.js`:

### Gulpfile
```javascript
var htmlref = require('gulp-process-ref');

var jsprocess = fuunction(stream, dist){
stream.pipe(concat(name))
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(load.uglify())
	.pipe(gulp.dest('./dist'+dist));
}
var cssprocess = function(stream, dist){
stream.pipe(load.concat(cname))
	.pipe(cleanCSS())
	.pipe(gulp.dest("./dist"+cdist));
}
 
gulp.task('templates', function(){
	gulp.src("/*.html")
		.pipe(htmlref(jsprocess, cssprocss));
});
```

### html
```html
	<span class="buildjs" name="main.js" dist="/scripts/" />
	<script type="text/javascript" class="concat" base="../.." src="../../script/main.js"></script>
	<script type="text/javascript" class="concat" base="../.." src="../../script/config.js"></script>
	
	<span class="buildcss" name="main.css" dist="/styles/" />
	<link type="text/css" class="concat" base="../.." href="../../styles/main.css"></link>
	<link type="text/css" class="concat" base="../.." href="../../styles/style1.css"></link>
```

### result
```html
	<script type="text/javascript" src="/scripts/main.js"/>
	<link type="text/css" href="/styles/main.css" />
```
