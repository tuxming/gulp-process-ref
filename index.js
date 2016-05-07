var vfs = require('vinyl-fs');
var cheerio = require('cheerio');
var through2 = require('through2');
var path = require('path');

module.exports = function(jsFunc, cssFunc){
	
	return through2.obj(function (file, enc, done) {
		
		// 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
		if (file.isNull()) {
			this.push(file);
			return done();
		}
		
		// 插件不支持对 Stream 对直接操作，跑出异常
		if (file.isStream()) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return cb();
		}
		
		var content = file.contents.toString();
		
		var $ = cheerio.load(content, jsFunc, cssFunc);
		processHtmlForDOM($);
		content = $.html();
		
		file.contents = new Buffer(content);
		this.push(file);
		done();
	});
}

//<span class="buildjs" name="main.js" dist="/scripts/" />
//<script type="text/script" class="concat" base="../.." src="../../script/main.js"></script>
//<span class="buildcss" name="main.css" dist="/styles/" />
//<link type="text/css" class="concat" base="../.." href="../../style/main.css"></link>
/**
 * 将html里面标有class='concat'的js文件进行合并
 * 替换掉html已经合并的js引用，替换依据来自于html中，class='buildjs'的元素中
 * 将html里面标有class='concat'的css文件进行合并
 * 替换掉html已经合并的js引用，替换依据来自于html中，class='buildcss'的元素中
 **/
 
/**
 * $ : cheerio
 * 
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
 
 gulp.src("/*.html")
	.pipe(htmlref(jsprocess, cssprocss));
 
 html: 
	<span class="buildjs" name="main.js" dist="/scripts/" />
	<script type="text/script" class="concat" base="../.." src="../../script/main.js"></script>
	<script type="text/script" class="concat" base="../.." src="../../script/config.js"></script>
	
	<span class="buildcss" name="main.css" dist="/styles/" />
	<link type="text/css" class="concat" base="../.." href="../../styles/main.css"></link>
	<link type="text/css" class="concat" base="../.." href="../../styles/style1.css"></link>
 
 result: 
	<script type="text/javascript" src="/scripts/main.js"/>
	
	<link type="text/css" href="/styles/main.css" />
	
 
 */
function processHtmlForDOM($, jsFunc, cssFunc){
	
	var files = function(){
		return $('script.concat').map(function(i,elem){
			var el = $(elem);
			return el.attr('src').replace(el.attr("base"),"");
		}).toArray().map(function(item){
			return path.join(config.app,item);
		});
	}();
	
	if(files && files.length>0){
		var dist = $(".buildjs").attr("dist");
		var name = $(".buildjs").attr("name");

		var stream = vfs.src(files);
		if(jsFunc)
			callback(stream, dist);
		
		//stream.pipe(load.concat(name))
		//	.pipe(load.jshint('.jshintrc'))
		//	.pipe(load.jshint.reporter('jshint-stylish'))
		//	.pipe(load.uglify())
		//	.pipe(gulp.dest(config.dist+dist));
		
		$('script.concat').remove();
		$('.buildjs').remove();
		$('body').append('<script type="text/javascript" src="'+dist+name+'"></script>');

	}
	
	var cfiles = function(){
		return $('lnik.concat').map(function(i,elem){
			
			var base = $(elem).attr("base");
			if(base){
				return $(elem).attr('href').replace($(elem).attr("base"),"");
			}else
				return $(elem).attr('href');
		}).toArray().map(function(item){
			return path.join(config.app,item);
		});
	}();
	
	if(files && cfiles.length>0){
		
		//process css
		var cdist = $(".buildcss").attr("dist");
		var cname = $(".buildcss").attr("name");
		
		var stream = vfs.src(cfiles);
		if(cssFunc)
			cssFunc(stream, dist);		
	
		$('link.concat').remove();
		$('.buildcss').remove();
		$('head').append('<link type="text/css" href="'+cdist+cname+'"></link>');
	}
}
