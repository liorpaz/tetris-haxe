var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = $hxClasses["Lambda"] = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var Tetris = $hxClasses["Tetris"] = function() { }
Tetris.__name__ = ["Tetris"];
Tetris.splashScreen = null;
Tetris.splashTimer = null;
Tetris.connectionController = null;
Tetris.main = function() {
}
Tetris.init = function() {
	Tetris.setDebugConsole();
	var layouter = new view.ScreenLayouter(0.5,10,20);
	var gameController = new controller.GameController(layouter);
	gameController.createGameView();
	gameController.setGameVisible(false);
	Tetris.connectionController = new connection.ConnectionController(gameController);
	gameController.showClouds();
	gameController.setConnectionController(Tetris.connectionController);
	Tetris.connectionController.init();
	Tetris.splashTimer = new haxe.Timer(1000);
	Tetris.splashTimer.run = Tetris.startApp;
}
Tetris.setDebugConsole = function() {
	var query = window.location.search.substring(1);
	var params = query.split("&");
	var i = 0;
	while(i < params.length) {
		var param = params[i];
		if(param == "debug") util.DebugConsole.enabled = true;
		if(param == "single") Tetris.doNotWaitForOpponent = true;
		i++;
	}
}
Tetris.startApp = function() {
	var query = window.location.search.substring(1);
	Tetris.connectionController.startGame();
	Tetris.splashTimer.stop();
	Tetris.splashTimer = null;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var connection = connection || {}
connection.ConnectionController = $hxClasses["connection.ConnectionController"] = function(gameController) {
	this._otherConnected = false;
	this._gameController = gameController;
	this._participents = [];
	this.messageQueue = [];
	this.collabService = connection.MockWasabi.getInstance();
};
connection.ConnectionController.__name__ = ["connection","ConnectionController"];
connection.ConnectionController.prototype = {
	isOpponentConnected: function() {
		if(this._participents.length > 0) this._otherConnected = true;
		return this._otherConnected;
	}
	,getHeightMessage: function(heightRatio) {
		return "{ \"" + "heightRatio" + "\": " + heightRatio + " }";
	}
	,getAnnounceWonMessage: function() {
		var points = this._gameController.getGameState().getPoints();
		return "{ \"" + "playerWon" + "\": " + points + " }";
	}
	,announceWinningStats: function() {
		this.sendMessage(this.getAnnounceWonMessage());
	}
	,getAnnounceLoseMessage: function() {
		var points = this._gameController.getGameState().getPoints();
		return "{ \"" + "playerLost" + "\": \"" + points + "\" }";
	}
	,announceLose: function() {
		this.sendMessage(this.getAnnounceLoseMessage());
	}
	,sendResume: function() {
		this.sendMessage("{ \"" + "resumeGame" + "\": \"true\"}");
	}
	,sendPause: function() {
		this.sendMessage("{ \"" + "pauseGame" + "\": \"true\"}");
	}
	,getSendLinesMessage: function(numLines) {
		return "{ \"" + "linesReceived" + "\": " + numLines + " }";
	}
	,linesShouldBeSent: function(numLines) {
		this.sendMessage(this.getSendLinesMessage(numLines));
	}
	,getSendStartGameMessage: function(level) {
		return "{ \"" + "startGame" + "\": \"" + level + "\" }";
	}
	,getStartingGameMessage: function() {
		return "{ \"" + "forceStartGame" + "\": \"true\" }";
	}
	,getPointsMessage: function(points) {
		return "{ \"" + "points" + "\": \"" + points + "\" }";
	}
	,sendStartingGame: function() {
		this.sendMessage(this.getStartingGameMessage());
	}
	,sendStartGame: function(level) {
		if(level == null) level = 1;
		this.sendMessage(this.getSendStartGameMessage(level));
	}
	,sendMessage: function(message) {
		if(this.isOpponentConnected()) this.collabService.sendMessage(message); else this.messageQueue.push(message);
	}
	,sendPoints: function(points) {
		this.sendMessage(this.getPointsMessage(points));
	}
	,sendHeightChanged: function(heightRatio) {
		this.sendMessage(this.getHeightMessage(heightRatio));
	}
	,getParticipantsInfo: function(callBack) {
		this.collabService.getParticipants(function(users) {
			if(js.Boot.__instanceof(users,Array)) callBack(users); else {
				var usersArray = [];
				usersArray.push(users);
				callBack(usersArray);
			}
		});
	}
	,getUserData: function(key,callBack,defaultValue) {
		this.collabService.getUserApplicationData(key,callBack,defaultValue);
	}
	,setUserData: function(key,value) {
		this.collabService.setUserApplicationData(key,value);
	}
	,handleMessageReceived: function(eventID,objType,data) {
		this._otherConnected = true;
		var messageObject = haxe.Json.parse(data.message);
		if(Reflect.hasField(messageObject,"heightRatio")) this._gameController.setPlayerMeter(0,messageObject.heightRatio); else if(Reflect.hasField(messageObject,"linesReceived")) this._gameController.getLines(messageObject.linesReceived); else if(Reflect.hasField(messageObject,"playerLost")) this._gameController.otherPlayerLost(messageObject.playerLost); else if(Reflect.hasField(messageObject,"playerWon")) this._gameController.gotWinnerPoints(messageObject.playerWon); else if(Reflect.hasField(messageObject,"startGame")) this._gameController.opponentStartedGame(); else if(Reflect.hasField(messageObject,"forceStartGame")) this._gameController.opponentForceStartedGame(); else if(Reflect.hasField(messageObject,"pauseGame")) this._gameController.pauseGame(true); else if(Reflect.hasField(messageObject,"resumeGame")) this._gameController.pauseGame(true); else if(Reflect.hasField(messageObject,"points")) this._gameController.setOpponentPoints(Std.parseInt(messageObject.points));
	}
	,getParticipents: function() {
		return this._participents;
	}
	,handleReceivedParticipantsInfo: function(users) {
		this._participents = users;
	}
	,handleReceivedHighScore: function(key,value) {
		if(value == "999999") value = "0";
		var highScore = Std.parseInt(value);
		this._gameController.getGameState().setHighScore(highScore);
		this._gameController.showMainMenu();
		this._gameController.sendLinesToOpponentCallback = $bind(this,this.linesShouldBeSent);
	}
	,dispatchQueuedMessages: function() {
		while(this.messageQueue.length > 0) {
			var message = this.messageQueue.shift();
			this.collabService.sendMessage(message);
		}
	}
	,handleParticipentConnected: function(eventID,objType,user) {
		this._participents.push(user);
		this.dispatchQueuedMessages();
	}
	,startGame: function() {
		this.getUserData("highScore",$bind(this,this.handleReceivedHighScore),0);
	}
	,init: function() {
		var _g = this;
		this.collabService.addEventListener("PARTICIPANT_CONNECTED",$bind(this,this.handleParticipentConnected));
		this.collabService.connect();
		this.collabService.addEventListener("MESSAGE_RECEIVED",$bind(this,this.handleMessageReceived));
		this.getParticipantsInfo($bind(this,this.handleReceivedParticipantsInfo));
		this.collabService.getCurrentUser(function(user) {
			_g._currentUser = user;
		});
	}
	,_otherConnected: null
	,messageQueue: null
	,_currentUser: null
	,_participents: null
	,collabService: null
	,_gameController: null
	,__class__: connection.ConnectionController
}
connection.OpponentInfo = $hxClasses["connection.OpponentInfo"] = function() { }
connection.OpponentInfo.__name__ = ["connection","OpponentInfo"];
connection.OpponentInfo.prototype = {
	points: null
	,name: null
	,__class__: connection.OpponentInfo
}
connection.ICollabService = $hxClasses["connection.ICollabService"] = function() { }
connection.ICollabService.__name__ = ["connection","ICollabService"];
connection.ICollabService.prototype = {
	getParticipants: null
	,getUserInfo: null
	,setUserApplicationData: null
	,getUserApplicationData: null
	,getCurrentUser: null
	,addEventListener: null
	,sendMessage: null
	,disconnect: null
	,connect: null
	,__class__: connection.ICollabService
}
connection.MockWasabi = $hxClasses["connection.MockWasabi"] = function() {
	this.eventCallbacks = new Hash();
	this.userData = new Hash();
	this.userData.set("highScore","999999");
};
connection.MockWasabi.__name__ = ["connection","MockWasabi"];
connection.MockWasabi.__interfaces__ = [connection.ICollabService];
connection.MockWasabi.instance = null;
connection.MockWasabi.userName = null;
connection.MockWasabi.getInstance = function() {
	if(connection.MockWasabi.instance == null) connection.MockWasabi.instance = new connection.MockWasabi();
	return connection.MockWasabi.instance;
}
connection.MockWasabi.prototype = {
	setUserApplicationData: function(key,value) {
		this.userData.set(key,value);
	}
	,getUserApplicationData: function(key,callBack,defaultValue) {
		if(this.userData.exists(key)) callBack(key,this.userData.get(key)); else callBack(key,defaultValue);
	}
	,getParticipants: function(callBack) {
		var user = { id : "111", displayName : "Mr. shmister man"};
		callBack([user]);
	}
	,getUserInfo: function(userID,attributes,callBack) {
		var user = { id : "111", displayName : "Mr. shmister man"};
		callBack(user);
	}
	,addEventListener: function(eventID,callBack) {
		this.eventCallbacks.set(eventID,callBack);
	}
	,sendMessage: function(message,target) {
		if(target == null) target = "ALLUSERS";
		var messageObject = haxe.Json.parse(message);
		var key;
		var value;
		var time = 1;
		if(Reflect.hasField(messageObject,"heightRatio")) {
			key = "heightRatio";
			value = messageObject.heightRatio;
		} else if(Reflect.hasField(messageObject,"resumeGame")) {
			key = "resumeGame";
			value = messageObject.resumeGame;
			time = 3000;
		} else return;
		var jsonMessage = haxe.Json.parse("{\"message\": \"xxx\"}");
		var msg = "{ {\"" + key + "\": " + Std.string(value) + "}, {\"from\": \"999\"} }";
		jsonMessage.message = msg;
		this.runAfter("MESSAGE_RECEIVED",jsonMessage,time);
	}
	,getCurrentUser: function(callBack) {
		callBack({ id : "999"});
	}
	,disconnect: function() {
	}
	,runAfter: function(event,data,time) {
		if(time == null) time = 5000;
		var _g = this;
		var timer = new haxe.Timer(time);
		timer.run = function() {
			timer.stop();
			(_g.eventCallbacks.get(event))("CONNECTED","dataType",data);
		};
	}
	,connect: function() {
	}
	,userData: null
	,eventCallbacks: null
	,__class__: connection.MockWasabi
}
connection.RoundsConsts = $hxClasses["connection.RoundsConsts"] = function() {
};
connection.RoundsConsts.__name__ = ["connection","RoundsConsts"];
connection.RoundsConsts.prototype = {
	__class__: connection.RoundsConsts
}
if(!connection.wasabi) connection.wasabi = {}
connection.wasabi.WasabiWrapper = $hxClasses["connection.wasabi.WasabiWrapper"] = function() {
};
connection.wasabi.WasabiWrapper.__name__ = ["connection","wasabi","WasabiWrapper"];
connection.wasabi.WasabiWrapper.__interfaces__ = [connection.ICollabService];
connection.wasabi.WasabiWrapper.wasabi = null;
connection.wasabi.WasabiWrapper.instance = null;
connection.wasabi.WasabiWrapper.userName = null;
connection.wasabi.WasabiWrapper.getInstance = function() {
	if(connection.wasabi.WasabiWrapper.instance == null) {
		connection.wasabi.WasabiWrapper.wasabi = rounds.wasabi.create("4");
		connection.wasabi.WasabiWrapper.instance = new connection.wasabi.WasabiWrapper();
	}
	return connection.wasabi.WasabiWrapper.instance;
}
connection.wasabi.WasabiWrapper.prototype = {
	setUserApplicationData: function(key,value) {
		connection.wasabi.WasabiWrapper.wasabi.setUserApplicationData(key,value);
	}
	,getParticipants: function(callBack) {
		connection.wasabi.WasabiWrapper.wasabi.getParticipants(callBack);
	}
	,getUserInfo: function(userID,attributes,callBack) {
		connection.wasabi.WasabiWrapper.wasabi.getUserInfo(userID,attributes,callBack);
	}
	,getCurrentUser: function(callBack) {
		connection.wasabi.WasabiWrapper.wasabi.getCurrentUser(callBack);
	}
	,getUserApplicationData: function(key,callBack,defaultValue) {
		connection.wasabi.WasabiWrapper.wasabi.getUserApplicationData(key,callBack);
	}
	,addEventListener: function(eventID,callBack) {
		connection.wasabi.WasabiWrapper.wasabi.addEventListener(eventID,callBack);
	}
	,sendMessage: function(message,target) {
		if(target == null) target = "ALLSESSIONUSERS";
		connection.wasabi.WasabiWrapper.wasabi.sendMessage(target,message);
	}
	,disconnect: function() {
		connection.wasabi.WasabiWrapper.wasabi.endApplication();
	}
	,connect: function() {
		connection.wasabi.WasabiWrapper.wasabi.start();
	}
	,__class__: connection.wasabi.WasabiWrapper
}
var controller = controller || {}
controller.BackgroundController = $hxClasses["controller.BackgroundController"] = function(layout) {
	this.doc = js.Lib.document;
	this._layout = layout;
	this.background = view.DocElements.getNewElement("div","boardBackground","boardBackground");
	layout.applyToElement(this.background);
	js.Lib.document.getElementById("mainContainer").appendChild(this.background);
	this.darkLayer = view.DocElements.getNewElement("div","darkLayer");
	layout.applyToElement(this.darkLayer);
	this.darkLayer.style.backgroundColor = "black";
	this.darkLayer.style.opacity = 0;
	js.Lib.document.getElementById("mainContainer").appendChild(this.darkLayer);
};
controller.BackgroundController.__name__ = ["controller","BackgroundController"];
controller.BackgroundController.prototype = {
	update: function(value) {
	}
	,darkLayer: null
	,doc: null
	,background: null
	,_layout: null
	,__class__: controller.BackgroundController
}
controller.GameController = $hxClasses["controller.GameController"] = function(screenLayouter) {
	this._waitingForOpponent = false;
	this._opponentWaiting = false;
	this.tetrisBoard = new model.TetrisBoard(10,20);
	this.gameState = new controller.GameState(5);
	this.shapeController = new controller.ShapeController(this.tetrisBoard);
	this.screenLayouter = screenLayouter;
	this.menuController = new controller.MenuController(screenLayouter.backgroundLayout,this);
	this._notificationController = new view.notification.NotificationsController(screenLayouter.notificationLayout);
	this.splashScreen = new view.SplashScreen(screenLayouter.backgroundLayout);
	this.splashScreen.show();
};
controller.GameController.__name__ = ["controller","GameController"];
controller.GameController.prototype = {
	setInteraction: function() {
		this.controlButtons = new view.ControlButtons(this.screenLayouter.controlsLayout,this.screenLayouter.boardLayout);
		this.interaction = new controller.UserInteractionController(this.controlButtons,this.screenLayouter.boardLayout);
		var boardBottom = Std.parseInt(this.boardView.getView().style.height) + Std.parseInt(this.boardView.getView().style.top);
		this.interaction.leftCallback = $bind(this,this.moveLeft);
		this.interaction.rightCallback = $bind(this,this.moveRight);
		this.interaction.downCallback = $bind(this,this.moveDown);
		this.interaction.upCallback = $bind(this,this.rotate);
		this.interaction.pauseCallback = $bind(this,this.doPause);
		this.interaction.spaceCallback = $bind(this,this.doSpace);
	}
	,controlButtons: null
	,doNewGame: function() {
		this.startGame();
	}
	,doSpace: function() {
		this.getLines(3);
	}
	,doPause: function() {
		this.pauseGame();
	}
	,rotate: function() {
		this.shapeController.rotateRight();
		this.updateShape();
	}
	,moveDown: function() {
		this.shapeController.moveDown();
		this.updateShape();
	}
	,moveRight: function() {
		this.shapeController.moveRight();
		this.updateShape();
	}
	,moveLeft: function() {
		this.shapeController.moveLeft();
		this.updateShape();
	}
	,stopTimer: function() {
		if(this.timer != null) this.timer.stop();
		this.interaction.setInteractionEnabled(false);
	}
	,endGame: function() {
		this.gameState.state = controller.State.playerLost;
		this.showLooseMenu();
	}
	,gotWinnerPoints: function(opponentPoints) {
		this.gameState.setOpponentPoints(opponentPoints);
		this.menuController.updateOtherPoints(opponentPoints);
	}
	,otherPlayerLost: function(opponentPoints) {
		this.gameState.state = controller.State.playerWon;
		this.gameState.addPoints(300);
		this.gameState.setOpponentPoints(opponentPoints);
		this._connectionController.announceWinningStats();
		this.pauseGame();
	}
	,handleHighScoreReceived: function(key,value) {
		this.gameState.setHighScore(Std.parseInt(value));
		this.menuController.gameStateUpdate(this.gameState);
	}
	,updateHighScore: function() {
		if(this.gameState.getPoints() > this.gameState.getHighScore()) {
			this.gameState.setHighScore(this.gameState.getPoints());
			this._connectionController.setUserData("highScore",Std.string(this.gameState.getPoints()));
		}
	}
	,pauseGame: function(fromOtherUser) {
		if(fromOtherUser == null) fromOtherUser = false;
		switch( (this.gameState.state)[1] ) {
		case 0:
			return;
		case 1:
			if(this.menuController.menuIsOpen()) return;
			js.Lib.document.getElementById("mainContainer").style.opacity = 0;
			this.stopTimer();
			this.gameState.state = controller.State.paused;
			this.showPauseMenu();
			if(!fromOtherUser) this._connectionController.sendPause();
			break;
		case 2:
			this._notificationController.removeNotification(false);
			js.Lib.document.getElementById("mainContainer").style.opacity = 1;
			this.menuController.closeAll();
			this.startTimer();
			this.gameState.state = controller.State.inGame;
			if(!fromOtherUser) this._connectionController.sendResume();
			break;
		case 3:
			this._notificationController.removeNotification(false);
			js.Lib.document.getElementById("mainContainer").style.opacity = 0;
			this.stopTimer();
			this.updateHighScore();
			this.showLooseMenu();
			this._connectionController.announceLose();
			break;
		case 4:
			this._notificationController.removeNotification(false);
			js.Lib.document.getElementById("mainContainer").style.opacity = 0;
			this.stopTimer();
			this.updateHighScore();
			this.showWinMenu();
			break;
		}
	}
	,updateShape: function() {
		this.boardView.updateShape(this.shapeController.getCurrentShape());
	}
	,setNextShapeIndex: function() {
		this.nextShapeIndex = Math.floor(Math.random() * [new model.ShapeData([[-1,-1,-1,-1],[0,0,0,0],[-1,-1,-1,-1]],"#cf64f1"),new model.ShapeData([[-1,-1,-1],[1,1,1],[-1,1,-1]],"#189af0",-0.5),new model.ShapeData([[-1,2],[2,2],[2,-1]],"#f45f76"),new model.ShapeData([[3,-1],[3,3],[-1,3]],"#8DD909"),new model.ShapeData([[-1,-1,-1],[4,4,4],[-1,-1,4]],"#2cc887",-0.5),new model.ShapeData([[-1,-1,-1],[5,5,5],[5,-1,-1]],"#f4bd3a",-0.5),new model.ShapeData([[6,6],[6,6]],"#6D87F3")].length);
	}
	,getRandomShape: function() {
		var result = new model.Shape([new model.ShapeData([[-1,-1,-1,-1],[0,0,0,0],[-1,-1,-1,-1]],"#cf64f1"),new model.ShapeData([[-1,-1,-1],[1,1,1],[-1,1,-1]],"#189af0",-0.5),new model.ShapeData([[-1,2],[2,2],[2,-1]],"#f45f76"),new model.ShapeData([[3,-1],[3,3],[-1,3]],"#8DD909"),new model.ShapeData([[-1,-1,-1],[4,4,4],[-1,-1,4]],"#2cc887",-0.5),new model.ShapeData([[-1,-1,-1],[5,5,5],[5,-1,-1]],"#f4bd3a",-0.5),new model.ShapeData([[6,6],[6,6]],"#6D87F3")][this.nextShapeIndex],this.nextShapeIndex);
		this.setNextShapeIndex();
		this.nextShapePreview.updateShape(new model.Shape([new model.ShapeData([[-1,-1,-1,-1],[0,0,0,0],[-1,-1,-1,-1]],"#cf64f1"),new model.ShapeData([[-1,-1,-1],[1,1,1],[-1,1,-1]],"#189af0",-0.5),new model.ShapeData([[-1,2],[2,2],[2,-1]],"#f45f76"),new model.ShapeData([[3,-1],[3,3],[-1,3]],"#8DD909"),new model.ShapeData([[-1,-1,-1],[4,4,4],[-1,-1,4]],"#2cc887",-0.5),new model.ShapeData([[-1,-1,-1],[5,5,5],[5,-1,-1]],"#f4bd3a",-0.5),new model.ShapeData([[6,6],[6,6]],"#6D87F3")][this.nextShapeIndex],this.nextShapeIndex));
		return result;
	}
	,setOpponentPoints: function(points) {
		this.gameState.setOpponentPoints(points);
		this.panelView.setOpponentPoints(points);
	}
	,updateStats: function(removedLines) {
		if(removedLines > 0) {
			this.gameState.addLines(removedLines);
			this.startTimer();
		}
		this.panelView.setState(this.gameState);
		this._connectionController.sendPoints(this.gameState.getPoints());
	}
	,removeFullLines: function() {
		var shape = this.shapeController._currentShape;
		var currentLines = util.ArrayUtil.range(shape.y,shape.y + shape.getHeight());
		var removedLines = this.tetrisBoard.removeFullLines(currentLines);
		this.updateStats(removedLines.length);
		this.boardView.removeLines(removedLines);
		return removedLines.length;
	}
	,showLinesFromFriendNotification: function(numLines) {
		var opponentName = this.getOpponentName();
		var msg = "Oh no! Your friend just sent you " + numLines + " line";
		if(numLines > 1) msg += "s";
		this._notificationController.showNotification(msg);
	}
	,getLines: function(numLines) {
		this.tetrisBoard.addRandomLines(numLines,7,this.shapeController.getCurrentShape());
		this.boardView.addBottomLines(numLines);
		this._connectionController.sendHeightChanged(this.getHeightRatio());
		this.showLinesFromFriendNotification(numLines);
	}
	,getTopLine: function() {
		return 20 - this.tetrisBoard.getTopLine(this.shapeController.getCurrentShape());
	}
	,getGameState: function() {
		return this.gameState;
	}
	,getHeightRatio: function() {
		return this.getTopLine() / 20;
	}
	,setPlayerMeter: function(playerIndex,ratio) {
		if(ratio >= 0.7 && this.gameState.getOpponentRatio() < 0.7) {
			this.opponentStateMeter.setPlayerInDangerZone(0);
			if(this.getHeightRatio() < 0.7) this._notificationController.showNotification("Almost there! Your friend is about to lose");
		} else if(ratio < 0.7 && this.gameState.getOpponentRatio() >= 0.7) this.opponentStateMeter.setPlayerOutOfDangerZone(0);
		this.opponentStateMeter.setPlayerHeight(0,ratio);
		this.gameState.setOpponentRatio(ratio);
	}
	,sendLinesToOpponent: function(numLines) {
		this.sendLinesToOpponentCallback(numLines);
	}
	,tick: function() {
		if(!this.shapeController.moveDown()) {
			var numRemovedLines = this.removeFullLines();
			var linesToSend = numRemovedLines - 1;
			if(linesToSend > 0) {
				var msg = "Great job! You just sent " + linesToSend + " row" + (linesToSend > 1?"s":"") + " to your friend!";
				this._notificationController.showNotification(msg);
				this.sendLinesToOpponent(linesToSend);
			}
			if(!this.shapeController.addNewShape(this.currentShape = this.getRandomShape())) {
				this.gameState.state = controller.State.playerLost;
				this.pauseGame();
			}
			this._connectionController.sendHeightChanged(this.getHeightRatio());
		}
		this.updateShape();
	}
	,startTimer: function() {
		if(this.timer != null) this.timer.stop();
		this.timer = new haxe.Timer(this.gameState.getIntervalMs());
		this.timer.run = $bind(this,this.tick);
		this.interaction.setInteractionEnabled(true);
		this.gameState.state = controller.State.inGame;
	}
	,resetGame: function() {
		js.Lib.document.getElementById("mainContainer").style.opacity = 1;
		this.interaction.setInteractionEnabled(true);
		this.stopTimer();
		this.tetrisBoard.clear();
		this.boardView.clear();
		this.opponentStateMeter.resetPositions();
		this.setNextShapeIndex();
	}
	,startGame: function(initialLevel,initFromOpponent) {
		if(initFromOpponent == null) initFromOpponent = false;
		if(initialLevel == null) initialLevel = 1;
		if(!initFromOpponent) this._connectionController.sendStartGame();
		if(!Tetris.doNotWaitForOpponent && !this._opponentWaiting && !this._waitingForOpponent) {
			this._waitingForOpponent = true;
			this.menuController.showWaitingForOpponent();
			return;
		}
		this._connectionController.sendStartingGame();
		this.menuController.closeAll();
		this.resetGame();
		this.setGameVisible(true);
		this.gameState.setInitialLevel(initialLevel);
		this.gameState.initLines();
		this.panelView.resetWithLevel(initialLevel);
		this.startTimer();
		this.shapeController.addNewShape(this.getRandomShape());
		this.updateShape();
		this._opponentWaiting = false;
		this._waitingForOpponent = false;
	}
	,timer: null
	,opponentStartedGame: function() {
		if(this._waitingForOpponent) {
			this.menuController.closeAll();
			this.startGame(1,true);
		} else this._opponentWaiting = true;
	}
	,_waitingForOpponent: null
	,opponentForceStartedGame: function() {
		if(this.gameState.getInGame()) return;
		this._waitingForOpponent = true;
		this._opponentWaiting = true;
		this.opponentStartedGame();
	}
	,getOpponentName: function() {
		var participents = this._connectionController.getParticipents();
		return participents.length > 0?participents[0].displayName:"Other";
	}
	,createView: function() {
		this.backgroundController = new controller.BackgroundController(this.screenLayouter.boardLayout);
		this.blockWidth = Math.round(this.screenLayouter.boardLayout.width / 10);
		this.blockHeight = this.blockWidth;
		this.boardView = new view.DomBoardView(this.tetrisBoard,this.screenLayouter.boardLayout.x,this.screenLayouter.boardLayout.y,10,20,this.blockWidth,this.blockHeight);
		var previewSize = this.screenLayouter.panelLayout.width;
		this.nextShapePreview = new view.NextShapePreview(previewSize,previewSize);
		this.panelView = new view.PanelView(this.screenLayouter.panelLayout,this.screenLayouter.leftPanelLayout,this.nextShapePreview);
		this.panelView.pauseCallback = $bind(this,this.pauseGame);
		this.opponentStateMeter = new controller.OpponentStateMeter(this.screenLayouter.opponentMeterLayout,this.blockHeight);
	}
	,leaveGame: function() {
		this._connectionController.announceLose();
		this.resetGame();
		this.showMainMenu();
	}
	,cancelShare: function() {
		this.showMainMenu();
	}
	,share: function(text) {
		this.showMainMenu();
	}
	,showShareMenu: function() {
		this.menuController.showShareMenu(true,true,$bind(this,this.share),$bind(this,this.cancelShare));
	}
	,showWinMenu: function() {
		this.menuController.showEndMenu(true,true,$bind(this,this.showMainMenu),$bind(this,this.showShareMenu),true);
	}
	,showLooseMenu: function() {
		this.menuController.showEndMenu(true,true,$bind(this,this.showMainMenu),$bind(this,this.showShareMenu),false);
	}
	,showPauseMenu: function() {
		this.menuController.showPauseMenu(true,true,$bind(this,this.pauseGame),$bind(this,this.leaveGame));
	}
	,showInstructions: function() {
		this.menuController.showInstructionsMenu($bind(this,this.showMainMenu));
	}
	,showMainMenu: function() {
		if(this.splashScreen != null) {
			this.splashScreen.close();
			this.splashScreen = null;
		}
		this.menuController.showStartMenu(true,true,$bind(this,this.startGame),$bind(this,this.showInstructions),this.gameState.getHighScore());
	}
	,setGameVisible: function(value) {
		js.Lib.document.getElementById("mainContainer").style.visibility = value?"visible":"hidden";
		js.Lib.document.getElementById("controlsContainer").style.visibility = value?"visible":"hidden";
	}
	,createGameView: function() {
		this.createView();
		this.setInteraction();
	}
	,showClouds: function() {
		if(this.cloudController == null) {
			this.cloudController = new view.CloudController(this.screenLayouter.screenLayout,js.Lib.document.getElementById("cloudContainer"));
			this.cloudController.createClouds();
		}
	}
	,setConnectionController: function(connectionController) {
		this._connectionController = connectionController;
		this.menuController.setConnectionController(connectionController);
		this.opponentStateMeter.addPlayer(this.getOpponentName(),15443262);
	}
	,getConnectionController: function() {
		return this._connectionController;
	}
	,splashScreen: null
	,sendLinesToOpponentCallback: null
	,_opponentWaiting: null
	,_notificationController: null
	,_connectionController: null
	,gameState: null
	,nextShapeIndex: null
	,blockHeight: null
	,blockWidth: null
	,currentShape: null
	,opponentStateMeter: null
	,menuController: null
	,nextShapePreview: null
	,panelView: null
	,boardView: null
	,cloudController: null
	,backgroundController: null
	,interaction: null
	,shapeController: null
	,tetrisBoard: null
	,screenLayouter: null
	,__class__: controller.GameController
}
controller.GameState = $hxClasses["controller.GameState"] = function(linesPerLevel) {
	this._opponentRatio = 0;
	this._opponentPoints = 0;
	this._opponentName = "";
	this._playerName = "";
	this._highScore = 0;
	this._initialLevel = 0;
	this._points = 0;
	this._level = 1;
	this._lines = 0;
	this._intervalMS = 0;
	this._linesPerLevel = 0;
	this._linesPerLevel = linesPerLevel;
	this._intervalMS = 700;
	this.state = controller.State.beforeGame;
};
controller.GameState.__name__ = ["controller","GameState"];
controller.GameState.prototype = {
	setOpponentRatio: function(value) {
		this._opponentRatio = value;
	}
	,getOpponentRatio: function() {
		return this._opponentRatio;
	}
	,getInGame: function() {
		return this.state == controller.State.inGame;
	}
	,getOpponentPoints: function() {
		return this._opponentPoints;
	}
	,setOpponentPoints: function(value) {
		this._opponentPoints = value;
	}
	,getOpponentName: function() {
		return this._opponentName;
	}
	,setOpponentName: function(value) {
		this._opponentName = value;
	}
	,getPlayerName: function() {
		return this._playerName;
	}
	,setPlayerName: function(value) {
		this._playerName = value;
	}
	,getIntervalMs: function() {
		return this._intervalMS;
	}
	,getPoints: function() {
		return this._points;
	}
	,getLines: function() {
		return this._lines;
	}
	,getLevel: function() {
		return this._level;
	}
	,updateInterval: function() {
		this._intervalMS = 700 - Math.round(this._level * 20);
	}
	,addLines: function(lines) {
		this._lines += lines;
		this._points += (function($this) {
			var $r;
			switch(lines) {
			case 1:
				$r = 10;
				break;
			case 2:
				$r = 25;
				break;
			case 3:
				$r = 50;
				break;
			case 4:
				$r = 80;
				break;
			default:
				$r = 0;
			}
			return $r;
		}(this));
		this._level = Math.floor(this._lines / this._linesPerLevel) + this._initialLevel;
		this.updateInterval();
	}
	,addPoints: function(points) {
		this._points += points;
	}
	,initLines: function() {
		this._lines = 0;
		this._points = 0;
	}
	,getHighScore: function() {
		return this._highScore;
	}
	,setHighScore: function(value) {
		if(value > this._highScore) this._highScore = value;
	}
	,setInitialLevel: function(value) {
		this._initialLevel = value;
		this._level = value;
		this.updateInterval();
	}
	,state: null
	,_opponentRatio: null
	,_opponentPoints: null
	,_opponentName: null
	,_playerName: null
	,_highScore: null
	,_initialLevel: null
	,_points: null
	,_level: null
	,_lines: null
	,_intervalMS: null
	,_linesPerLevel: null
	,__class__: controller.GameState
}
controller.State = $hxClasses["controller.State"] = { __ename__ : ["controller","State"], __constructs__ : ["beforeGame","inGame","paused","playerLost","playerWon"] }
controller.State.beforeGame = ["beforeGame",0];
controller.State.beforeGame.toString = $estr;
controller.State.beforeGame.__enum__ = controller.State;
controller.State.inGame = ["inGame",1];
controller.State.inGame.toString = $estr;
controller.State.inGame.__enum__ = controller.State;
controller.State.paused = ["paused",2];
controller.State.paused.toString = $estr;
controller.State.paused.__enum__ = controller.State;
controller.State.playerLost = ["playerLost",3];
controller.State.playerLost.toString = $estr;
controller.State.playerLost.__enum__ = controller.State;
controller.State.playerWon = ["playerWon",4];
controller.State.playerWon.toString = $estr;
controller.State.playerWon.__enum__ = controller.State;
controller.MenuController = $hxClasses["controller.MenuController"] = function(backgroundLayout,gameController) {
	this.fadingOut = false;
	this.backgroundVisible = false;
	this.screenLayout = backgroundLayout.clone();
	this.menuContainer = js.Lib.document.getElementById("menuContainer");
	var paddingX = backgroundLayout.width * 0.1 | 0;
	var paddingY = backgroundLayout.width * 0.2 | 0;
	this._backgroundLayout = backgroundLayout.expand(-paddingX,-paddingY);
	this._gameController = gameController;
	this.background = view.DocElements.getNewElement("div","menuBackground","menuBackground");
	this.background.style.opacity = 0;
	this._backgroundLayout.applyToElement(this.background);
	this.fullBackground = view.DocElements.getNewElement("div","menuFullBackground","menuFullBackground");
	this.screenLayout.applyToElement(this.fullBackground);
	this.menus = [];
};
controller.MenuController.__name__ = ["controller","MenuController"];
controller.MenuController.prototype = {
	updateOtherPoints: function(otherPoints) {
		if(js.Boot.__instanceof(this.currentMenu,view.menu.EndMenu)) (js.Boot.__cast(this.currentMenu , view.menu.EndMenu)).updateOtherPoints(otherPoints);
	}
	,gameStateUpdate: function(gameState) {
		if(js.Boot.__instanceof(this.currentMenu,view.menu.StartMenu)) (js.Boot.__cast(this.currentMenu , view.menu.StartMenu)).updateHighScore(gameState.getHighScore());
	}
	,menuIsOpen: function() {
		return this.menus.length > 0;
	}
	,hideBackground: function(fadeOut) {
		if(fadeOut == null) fadeOut = true;
		var _g = this;
		if(this.background.parentNode != null && !this.fadingOut) {
			if(fadeOut) {
				this.fadingOut = true;
				util.AnimationUtil.fadeOut(this.background,100,null,function() {
					_g.menuContainer.style.visibility = "hidden";
					_g.fadingOut = false;
				},0.4);
			} else this.menuContainer.style.visibility = "hidden";
		}
	}
	,showBackground: function(fadeIn) {
		if(fadeIn == null) fadeIn = true;
		this.removeFullScreenBackground();
		this.menuContainer.style.visibility = "inherit";
		if(this.background.parentNode == null) this.menuContainer.appendChild(this.background);
		this.background.style.opacity = 0;
		if(fadeIn) util.AnimationUtil.fadeIn(this.background,100,null,null,0.4); else this.background.style.opacity = 0.4;
		this._gameController.setGameVisible(false);
	}
	,removeFullScreenBackground: function() {
		if(this.fullBackground.parentNode != null) this.menuContainer.removeChild(this.fullBackground);
	}
	,showFullScreenBackground: function() {
		this.menuContainer.style.visibility = "inherit";
		if(this.fullBackground.parentNode == null) this.menuContainer.appendChild(this.fullBackground);
	}
	,closeAll: function(removeBackground) {
		if(removeBackground == null) removeBackground = true;
		while(this.menus.length > 0) this.close(this.menus[this.menus.length - 1],true);
		if(removeBackground) {
			this.hideBackground();
			this._gameController.setGameVisible(true);
			this.removeFullScreenBackground();
		}
		this.pendingMenu = null;
		this.currentMenu = null;
	}
	,update: function(value,menu) {
		menu.getView().style.top = Std.string(value | 0) + "px";
	}
	,moveOutFinished: function(menu) {
		this.menuContainer.removeChild(menu.getView());
	}
	,close: function(menu,animate) {
		if(animate == null) animate = true;
		var _g = this;
		if(menu == this.currentMenu && this.pendingMenu != null) {
			this.currentMenu = this.pendingMenu;
			this.pendingMenu = null;
		}
		HxOverrides.remove(this.menus,menu);
		menu.close();
		if(animate) util.AnimationUtil.fadeOut(menu.getView(),100,null,function() {
			if(_g.menuContainer.parentNode != null) {
				_g.menuContainer.removeChild(menu.getView());
				if(_g.menus.length == 0) _g.menuContainer.style.visibility = "hidden";
			}
		},null); else {
			menu.getView().style.visibility = "hidden";
			this.menuContainer.removeChild(menu.getView());
			if(this.menus.length == 0) this.menuContainer.style.visibility = "hidden";
		}
	}
	,centerMenu: function(element) {
		var width = util.JSUtil.getWidth(element);
		var height = util.JSUtil.getHeight(element);
		var newX = (this._backgroundLayout.width - width) / 2 | 0;
		var newY = 20;
		element.style.left = Std.string(this._backgroundLayout.x + newX) + "px";
		element.style.top = Std.string(this._backgroundLayout.y + newY) + "px";
	}
	,show: function(menu,animate) {
		if(animate == null) animate = true;
		this.closeAll(false);
		this.menus.push(menu);
		this.menuContainer.appendChild(menu.getView());
		menu.addedToDom();
	}
	,showInstructionsMenu: function(closeCallback) {
		var menu = new view.menu.InstructionsMenu(this._backgroundLayout);
		menu.closeCallback = closeCallback;
		this.showBackground(false);
		this.show(menu,false);
	}
	,showShareMenu: function(animate,fadeInBG,shareCallback,cancelCallback) {
		if(fadeInBG == null) fadeInBG = true;
		if(animate == null) animate = true;
		var menu = new view.menu.ShareMenu(this._backgroundLayout);
		menu.shareCallback = shareCallback;
		menu.cancelCallback = cancelCallback;
		this.showBackground(fadeInBG);
		this.show(menu,animate);
	}
	,getOpponentName: function() {
		var participents = this._connectionController.getParticipents();
		var opponentName = "Friend";
		if(participents.length > 0) {
			if(participents[0].name != null) opponentName = participents[0].name; else if(participents[0].displayName != null) opponentName = participents[0].displayName;
		}
		return opponentName;
	}
	,showEndMenu: function(animate,fadeInBG,gotoMainMenuCallback,gotoShareMenuCallback,isWinner) {
		if(fadeInBG == null) fadeInBG = true;
		if(animate == null) animate = true;
		var menu = new view.menu.EndMenu(this._backgroundLayout,isWinner?"WINNER!":"GAME OVER!",this._gameController.getGameState().getPoints(),this.getOpponentName());
		menu.gotoMainMenu = gotoMainMenuCallback;
		menu.gotoShareMenu = gotoShareMenuCallback;
		this.showBackground(fadeInBG);
		this.show(menu,animate);
		menu.updateOtherPoints(this._gameController.getGameState().getOpponentPoints());
		if(this.currentMenu == null) this.currentMenu = menu; else this.pendingMenu = menu;
	}
	,showPauseMenu: function(animate,fadeInBG,pauseGame,leaveGame) {
		if(fadeInBG == null) fadeInBG = true;
		if(animate == null) animate = true;
		var menu = new view.menu.PauseMenu(this._backgroundLayout);
		menu.continueGame = pauseGame;
		menu.leaveGame = leaveGame;
		this.showFullScreenBackground();
		this.show(menu,animate);
	}
	,showWaitingForOpponent: function() {
		var menu = new view.menu.WaitingForOpponentMenu(this._backgroundLayout);
		this.showFullScreenBackground();
		this.show(menu,true);
	}
	,showStartMenu: function(animate,fadeInBG,startGameCallback,showInstructionsGameCallback,highScore) {
		if(fadeInBG == null) fadeInBG = true;
		if(animate == null) animate = true;
		var menu = new view.menu.StartMenu(this._backgroundLayout,highScore);
		menu.startGame = startGameCallback;
		menu.showInstructions = showInstructionsGameCallback;
		this.showBackground(fadeInBG);
		this.show(menu,animate);
		if(this.currentMenu == null) this.currentMenu = menu; else this.pendingMenu = menu;
	}
	,setConnectionController: function(value) {
		this._connectionController = value;
	}
	,_connectionController: null
	,pendingMenu: null
	,currentMenu: null
	,_gameController: null
	,menus: null
	,fadingOut: null
	,backgroundVisible: null
	,fullBackground: null
	,background: null
	,menuContainer: null
	,screenLayout: null
	,_backgroundLayout: null
	,__class__: controller.MenuController
}
controller.OpponentStateMeter = $hxClasses["controller.OpponentStateMeter"] = function(layout,blockHeight) {
	this.indicatorX = 0;
	this.container = view.DocElements.getNewElement("div","opponentMeter","opponentMeter");
	this.layout = layout;
	layout.applyToElement(this.container);
	this.drawSegmentsOnBackground(blockHeight);
	this.indicatorSize = layout.width;
	this.height = layout.height;
	this.blockHeight = blockHeight;
	js.Lib.document.getElementById("mainContainer").appendChild(this.container);
	this.players = [];
};
controller.OpponentStateMeter.__name__ = ["controller","OpponentStateMeter"];
controller.OpponentStateMeter.prototype = {
	updatePlayer: function(player) {
		var y = this.height * (1 - this.players[player].height) | 0;
		var playerView = this.players[player].indicator.getView();
		var topLeft = new util.Point(this.indicatorX,y | 0);
		var newHeight = this.height - topLeft.y | 0;
		util.AnimationUtil.changeSize(playerView,500,this.indicatorSize,newHeight,null,null);
		util.AnimationUtil.move(playerView,500,topLeft,null,null);
	}
	,resetPositions: function() {
		var _g1 = 0, _g = this.players.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.setPlayerHeight(i,0);
		}
	}
	,setPlayerHeight: function(player,height) {
		if(this.players.length > player) {
			this.players[player].height = height;
			this.updatePlayer(player);
		}
	}
	,getPlayerByName: function(name) {
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var player = _g1[_g];
			++_g;
			if(player.name == name) return player;
		}
		return null;
	}
	,setPlayerOutOfDangerZone: function(index) {
		var player = this.players[index];
		player.indicator.getView().style.backgroundColor = "#" + StringTools.hex(player.color,6);
	}
	,setPlayerInDangerZone: function(index) {
		this.players[index].indicator.getView().style.backgroundColor = "#" + StringTools.hex(16711680,6);
	}
	,addPlayer: function(name,color) {
		var player = new controller.PlayerInfo(name,color,0,new controller.PlayerIndicator(color,this.indicatorSize,this.indicatorSize));
		this.players.push(player);
		this.container.insertBefore(player.indicator.getView(),this.stripesContainer);
		this.updatePlayer(this.players.length - 1);
	}
	,drawSegmentsOnBackground: function(segmentHeight) {
		this.stripesContainer = view.DocElements.getNewElement("div","stripeContainer","stripeContainer");
		util.JSUtil.applyLayout(this.stripesContainer,0,0,this.layout.width,this.layout.height);
		var numStripes = this.layout.height / segmentHeight | 0;
		var stripe;
		var _g = 0;
		while(_g < numStripes) {
			var i = _g++;
			stripe = view.DocElements.getNewElement("div","stripe","stripe");
			stripe.style.left = Std.string(0) + "px";
			stripe.style.top = Std.string(i * segmentHeight) + "px";
			{
				stripe.style.width = Std.string(this.layout.width) + "px";
				stripe.style.height = Std.string(1) + "px";
			}
			this.stripesContainer.appendChild(stripe);
		}
		this.container.appendChild(this.stripesContainer);
	}
	,layout: null
	,blockHeight: null
	,height: null
	,indicatorSize: null
	,indicatorX: null
	,players: null
	,stripesContainer: null
	,container: null
	,__class__: controller.OpponentStateMeter
}
controller.PlayerInfo = $hxClasses["controller.PlayerInfo"] = function(name,color,height,indicator) {
	this.name = name;
	this.color = color;
	this.height = height;
	this.indicator = indicator;
};
controller.PlayerInfo.__name__ = ["controller","PlayerInfo"];
controller.PlayerInfo.prototype = {
	indicator: null
	,height: null
	,color: null
	,name: null
	,__class__: controller.PlayerInfo
}
controller.PlayerIndicator = $hxClasses["controller.PlayerIndicator"] = function(color,width,height) {
	this.container = view.DocElements.getNewElement("div","playerIndicator" + color,"playerIndicator");
	util.JSUtil.applyDimentions(this.container,width,height);
	this.container.style.backgroundColor = "#" + StringTools.hex(color,6);
};
controller.PlayerIndicator.__name__ = ["controller","PlayerIndicator"];
controller.PlayerIndicator.prototype = {
	getView: function() {
		return this.container;
	}
	,container: null
	,__class__: controller.PlayerIndicator
}
controller.ShapeController = $hxClasses["controller.ShapeController"] = function(board) {
	this._board = board;
};
controller.ShapeController.__name__ = ["controller","ShapeController"];
controller.ShapeController.rotate = function(bits) {
	var result = new Array();
	var w = bits.length;
	var h = bits[0].length;
	var tempLine = [];
	result = util.ArrayUtil.get2dArray(h,w,-1);
	var _g = 0;
	while(_g < h) {
		var y = _g++;
		var _g1 = 0;
		while(_g1 < w) {
			var x = _g1++;
			result[h - 1 - y][x] = bits[x][y];
		}
	}
	return result;
}
controller.ShapeController.prototype = {
	rotateRight: function() {
		var shapeWidth = this._currentShape.getWidth();
		var shapeHeight = this._currentShape.getHeight();
		this.removeCurrentShape();
		this._currentShape.shapeData.model = controller.ShapeController.rotate(this._currentShape.shapeData.model);
		if(!this._board.shapeHitTest(this._currentShape)) {
			this._board.addShape(this._currentShape);
			this._currentShape.setRotation((this._currentShape.getRotation() + 90) % 360);
			return true;
		}
		this._currentShape.shapeData.model = controller.ShapeController.rotate(controller.ShapeController.rotate(controller.ShapeController.rotate(this._currentShape.shapeData.model)));
		this._board.addShape(this._currentShape);
		return false;
	}
	,move: function(x,y) {
		this._board.removeShape(this._currentShape);
		this._currentShape.x = this._currentShape.x + x;
		this._currentShape.y = this._currentShape.y + y;
		if(!this._board.shapeHitTest(this._currentShape)) {
			this._board.addShape(this._currentShape);
			return true;
		}
		this._currentShape.x = this._currentShape.x - x;
		this._currentShape.y = this._currentShape.y - y;
		this._board.addShape(this._currentShape);
		return false;
	}
	,moveRight: function() {
		return this.move(1,0);
	}
	,moveLeft: function() {
		return this.move(-1,0);
	}
	,moveDown: function() {
		return this.move(0,1);
	}
	,removeCurrentShape: function() {
		this._board.removeShape(this._currentShape);
	}
	,addNewShape: function(shape) {
		this._currentShape = shape;
		this._currentShape.x = Math.round(this._board.getWidth() / 2 - this._currentShape.getWidth() / 2);
		this._currentShape.y = -1;
		if(!this._board.shapeHitTest(this._currentShape)) {
			this._board.addShape(this._currentShape);
			return true;
		}
		return false;
	}
	,getCurrentShape: function() {
		return this._currentShape;
	}
	,_currentShape: null
	,_board: null
	,__class__: controller.ShapeController
}
controller.UserInteractionController = $hxClasses["controller.UserInteractionController"] = function(controlButtons,boardLayout) {
	this._interactionEnabled = false;
	this._controlButtons = controlButtons;
	this._boardLayout = boardLayout;
	var doc = js.Lib.document;
	doc.onkeydown = $bind(this,this.handleKeyDown);
	doc.onkeyup = $bind(this,this.handleKeyUp);
	doc.onkeypress = $bind(this,this.handleKeyPress);
	this.setupButtons();
};
controller.UserInteractionController.__name__ = ["controller","UserInteractionController"];
controller.UserInteractionController.prototype = {
	handleKeyPress: function(event) {
	}
	,handleKeyUp: function(event) {
	}
	,handleKeyDown: function(event) {
		event.stopPropagation();
		switch(event.keyCode) {
		case 37:
			if(this._interactionEnabled) this.leftCallback();
			break;
		case 38:
			if(this._interactionEnabled) this.upCallback();
			break;
		case 39:
			if(this._interactionEnabled) this.rightCallback();
			break;
		case 40:
			if(this._interactionEnabled) this.downCallback();
			break;
		case 32:
			if(this._interactionEnabled) this.spaceCallback();
			break;
		case 80:
			this.pauseCallback();
			break;
		case 78:
			this.menuCallback();
			break;
		}
	}
	,doMenuCallback: function() {
		this.menuCallback();
	}
	,doDownCallback: function() {
		if(this._interactionEnabled) this.downCallback();
	}
	,doRotateCallback: function() {
		if(this._interactionEnabled) this.upCallback();
	}
	,doRightCallback: function() {
		if(this._interactionEnabled) this.rightCallback();
	}
	,doLeftCallback: function() {
		if(this._interactionEnabled) this.leftCallback();
	}
	,setupButtons: function() {
		this._controlButtons.leftCallback = $bind(this,this.doLeftCallback);
		this._controlButtons.rightCallback = $bind(this,this.doRightCallback);
		this._controlButtons.rotateCallback = $bind(this,this.doRotateCallback);
		this._controlButtons.downCallback = $bind(this,this.doDownCallback);
		this._controlButtons.menuCallback = $bind(this,this.doMenuCallback);
		this._controlButtons.setEnabled(true);
	}
	,setInteractionEnabled: function(value) {
		this._interactionEnabled = value;
	}
	,_boardLayout: null
	,_interactionEnabled: null
	,_controlButtons: null
	,menuCallback: null
	,pauseCallback: null
	,spaceCallback: null
	,downCallback: null
	,rightCallback: null
	,upCallback: null
	,leftCallback: null
	,__class__: controller.UserInteractionController
}
controller.Keys = $hxClasses["controller.Keys"] = function() { }
controller.Keys.__name__ = ["controller","Keys"];
var event = event || {}
event.TouchEvent = $hxClasses["event.TouchEvent"] = function() { }
event.TouchEvent.__name__ = ["event","TouchEvent"];
var feffects = feffects || {}
feffects.TweenObject = $hxClasses["feffects.TweenObject"] = function(target,properties,duration,easing,autoStart,onFinish,onFinishParams) {
	if(autoStart == null) autoStart = false;
	this.target = target;
	this.properties = properties;
	this.duration = duration;
	this.easing = easing;
	this.onFinish(onFinish,onFinishParams);
	if(autoStart) this.start();
};
feffects.TweenObject.__name__ = ["feffects","TweenObject"];
feffects.TweenObject.tween = function(target,properties,duration,easing,autoStart,onFinish,onFinishParams) {
	if(autoStart == null) autoStart = false;
	return new feffects.TweenObject(target,properties,duration,easing,autoStart,onFinish,onFinishParams);
}
feffects.TweenObject.prototype = {
	_onFinish: function(tp) {
		this.tweens.remove(tp);
		if(this.tweens.isEmpty()) {
			if(this.__onFinish != null) this.__onFinish.apply(null,this.__onFinishParams);
		}
	}
	,onFinish: function(f,params) {
		this.__onFinish = f;
		this.__onFinishParams = params == null?[]:params;
		return this;
	}
	,stop: function(finish) {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.stop(finish);
		}
	}
	,reverse: function() {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.reverse();
		}
	}
	,seek: function(n) {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.seek(n);
		}
		return this;
	}
	,resume: function() {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.resume();
		}
	}
	,pause: function() {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.pause();
		}
	}
	,start: function() {
		this.tweens = new List();
		var _g = 0, _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var tp = new feffects.TweenProperty(this.target,key,Reflect.field(this.properties,key),this.duration,this.easing,false);
			tp.onFinish($bind(this,this._onFinish),[tp]).start();
			this.tweens.add(tp);
		}
		return this.tweens;
	}
	,setEasing: function(easing) {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.setEasing(easing);
		}
		return this;
	}
	,__onFinishParams: null
	,__onFinish: null
	,get_isPlaying: function() {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tween = $it0.next();
			if(tween.isPlaying) return true;
		}
		return false;
	}
	,isPlaing: null
	,easing: null
	,duration: null
	,properties: null
	,target: null
	,tweens: null
	,__class__: feffects.TweenObject
	,__properties__: {get_isPlaing:"get_isPlaying"}
}
var haxe = haxe || {}
haxe.FastList = $hxClasses["haxe.FastList"] = function() {
};
haxe.FastList.__name__ = ["haxe","FastList"];
haxe.FastList.prototype = {
	toString: function() {
		var a = new Array();
		var l = this.head;
		while(l != null) {
			a.push(l.elt);
			l = l.next;
		}
		return "{" + a.join(",") + "}";
	}
	,iterator: function() {
		var l = this.head;
		return { hasNext : function() {
			return l != null;
		}, next : function() {
			var k = l;
			l = k.next;
			return k.elt;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.head;
		while(l != null) {
			if(l.elt == v) {
				if(prev == null) this.head = l.next; else prev.next = l.next;
				break;
			}
			prev = l;
			l = l.next;
		}
		return l != null;
	}
	,isEmpty: function() {
		return this.head == null;
	}
	,pop: function() {
		var k = this.head;
		if(k == null) return null; else {
			this.head = k.next;
			return k.elt;
		}
	}
	,first: function() {
		return this.head == null?null:this.head.elt;
	}
	,add: function(item) {
		this.head = new haxe.FastCell(item,this.head);
	}
	,head: null
	,__class__: haxe.FastList
}
feffects.Tween = $hxClasses["feffects.Tween"] = function(init,end,dur,easing,autoStart,onUpdate,onUpdateParams,onFinish,onFinishParams) {
	if(autoStart == null) autoStart = false;
	this._initVal = init;
	this._endVal = end;
	this.duration = dur;
	this.onUpdate(onUpdate,onUpdateParams);
	this.onFinish(onFinish,onFinishParams);
	this._offsetTime = 0;
	this.position = 0;
	this.isPlaying = false;
	this.isPaused = false;
	this.isReversed = false;
	if(easing != null) this._easingF = easing; else this._easingF = feffects.Tween.easingEquation;
	if(autoStart) this.start();
};
feffects.Tween.__name__ = ["feffects","Tween"];
feffects.Tween._timer = null;
feffects.Tween._isTweening = null;
feffects.Tween.AddTween = function(tween) {
	if(!feffects.Tween._isTweening) {
		feffects.Tween._timer = new haxe.Timer(feffects.Tween.INTERVAL);
		feffects.Tween._timer.run = feffects.Tween.cb_tick;
		feffects.Tween._isTweening = true;
		feffects.Tween.cb_tick();
	}
	feffects.Tween._aTweens.add(tween);
}
feffects.Tween.RemoveActiveTween = function(tween) {
	feffects.Tween._aTweens.remove(tween);
	feffects.Tween.checkActiveTweens();
}
feffects.Tween.RemovePausedTween = function(tween) {
	feffects.Tween._aPaused.remove(tween);
	feffects.Tween.checkActiveTweens();
}
feffects.Tween.checkActiveTweens = function() {
	if(feffects.Tween._aTweens.head == null) {
		if(feffects.Tween._timer != null) {
			feffects.Tween._timer.stop();
			feffects.Tween._timer = null;
		}
		feffects.Tween._isTweening = false;
	}
}
feffects.Tween.getActiveTweens = function() {
	return feffects.Tween._aTweens;
}
feffects.Tween.getPausedTweens = function() {
	return feffects.Tween._aPaused;
}
feffects.Tween.setTweenPaused = function(tween) {
	if(!tween.isPlaying) return;
	feffects.Tween._aPaused.add(tween);
	feffects.Tween._aTweens.remove(tween);
	feffects.Tween.checkActiveTweens();
}
feffects.Tween.setTweenActive = function(tween) {
	if(tween.isPlaying) return;
	feffects.Tween._aTweens.add(tween);
	feffects.Tween._aPaused.remove(tween);
	if(!feffects.Tween._isTweening) {
		feffects.Tween._timer = new haxe.Timer(feffects.Tween.INTERVAL);
		feffects.Tween._timer.run = feffects.Tween.cb_tick;
		feffects.Tween._isTweening = true;
		feffects.Tween.cb_tick();
	}
}
feffects.Tween.cb_tick = function() {
	var $it0 = feffects.Tween._aTweens.iterator();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		i.doInterval();
	}
}
feffects.Tween.easingEquation = function(t,b,c,d) {
	return c / 2 * (Math.sin(Math.PI * (t / d - 0.5)) + 1) + b;
}
feffects.Tween.prototype = {
	getStamp: function() {
		return new Date().getTime();
	}
	,getCurVal: function(curTime) {
		return this._easingF(curTime,this._initVal,this._endVal - this._initVal,this.duration);
	}
	,doInterval: function() {
		var stamp = new Date().getTime();
		var curTime = 0;
		if(this.isReversed) curTime = this._reverseTime * 2 - stamp - this._startTime + this._offsetTime; else curTime = stamp - this._startTime + this._offsetTime;
		var curVal = this._easingF(curTime,this._initVal,this._endVal - this._initVal,this.duration);
		if(curTime >= this.duration || curTime < 0) this.finish(); else if(this._onUpdate != null) {
			this._onUpdateParams[0] = curVal;
			this._onUpdate.apply(null,this._onUpdateParams);
		}
		this.position = curTime;
	}
	,setEasing: function(f) {
		this._easingF = f;
		return this;
	}
	,onFinish: function(f,params) {
		this._onFinish = f;
		this._onFinishParams = params == null?[]:params;
		return this;
	}
	,onUpdate: function(f,params) {
		this._onUpdate = f;
		this._onUpdateParams = [0];
		if(params != null) this._onUpdateParams = this._onUpdateParams.concat(params);
		return this;
	}
	,finish: function() {
		feffects.Tween.RemoveActiveTween(this);
		this.isPlaying = false;
		this._onUpdateParams[0] = this.isReversed?this._initVal:this._endVal;
		if(this._onUpdate != null) this._onUpdate.apply(null,this._onUpdateParams);
		if(this._onFinish != null) this._onFinish.apply(null,this._onFinishParams);
	}
	,stop: function(doFinish) {
		if(this.isPaused) feffects.Tween.RemovePausedTween(this); else if(this.isPlaying) feffects.Tween.RemoveActiveTween(this);
		if(doFinish) this.finish();
		this.isPaused = false;
		this.isPlaying = false;
	}
	,reverse: function() {
		if(!this.isPlaying) return;
		this.isReversed = !this.isReversed;
		if(!this.isReversed) this._startTime += (new Date().getTime() - this._reverseTime) * 2;
		this._reverseTime = new Date().getTime();
	}
	,seek: function(ms) {
		this._offsetTime = ms < this.duration?ms:this.duration;
		return this;
	}
	,resume: function() {
		if(!this.isPaused || this.isPlaying) return;
		this._startTime += new Date().getTime() - this._pauseTime;
		this._reverseTime += new Date().getTime() - this._pauseTime;
		feffects.Tween.setTweenActive(this);
		this.isPlaying = true;
		this.isPaused = true;
	}
	,pause: function() {
		if(!this.isPlaying) return;
		this._pauseTime = new Date().getTime();
		feffects.Tween.setTweenPaused(this);
		this.isPlaying = false;
		this.isPaused = true;
	}
	,start: function(position) {
		if(position == null) position = 0;
		this._startTime = new Date().getTime();
		this._reverseTime = new Date().getTime();
		this.seek(position);
		if(this.isPaused) feffects.Tween.RemovePausedTween(this);
		feffects.Tween.AddTween(this);
		this.isPlaying = true;
		if(this.duration == 0 || position >= this.duration) this.finish();
	}
	,_onFinishParams: null
	,_onUpdateParams: null
	,_onFinish: null
	,_onUpdate: null
	,_easingF: null
	,_reverseTime: null
	,_offsetTime: null
	,_pauseTime: null
	,_startTime: null
	,_endVal: null
	,_initVal: null
	,isPaused: null
	,isPlaying: null
	,isReversed: null
	,position: null
	,duration: null
	,__class__: feffects.Tween
}
feffects.TweenProperty = $hxClasses["feffects.TweenProperty"] = function(target,prop,value,duration,easing,autostart,onUpdate,onUpdateParams,onFinish,onFinishParams) {
	if(autostart == null) autostart = false;
	this.target = target;
	this.property = prop;
	this.___onUpdateParams = [0];
	if(onUpdateParams != null) this.___onUpdateParams = this.___onUpdateParams.concat(onUpdateParams);
	feffects.Tween.call(this,Reflect.getProperty(target,this.property),value,duration,easing,autostart,$bind(this,this.__onUpdate),onFinish,onFinishParams);
};
feffects.TweenProperty.__name__ = ["feffects","TweenProperty"];
feffects.TweenProperty.__super__ = feffects.Tween;
feffects.TweenProperty.prototype = $extend(feffects.Tween.prototype,{
	__onUpdate: function(n) {
		Reflect.setProperty(this.target,this.property,n);
		if(this.___onUpdate != null) {
			this.___onUpdateParams[0] = n;
			this.___onUpdate.apply(null,this.___onUpdateParams);
		}
	}
	,___onUpdateParams: null
	,___onUpdate: null
	,property: null
	,target: null
	,__class__: feffects.TweenProperty
});
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
if(!feffects.easing) feffects.easing = {}
feffects.easing.Cubic = $hxClasses["feffects.easing.Cubic"] = function() { }
feffects.easing.Cubic.__name__ = ["feffects","easing","Cubic"];
feffects.easing.Cubic.__interfaces__ = [haxe.Public];
feffects.easing.Cubic.easeIn = function(t,b,c,d) {
	return c * (t /= d) * t * t + b;
}
feffects.easing.Cubic.easeOut = function(t,b,c,d) {
	return c * ((t = t / d - 1) * t * t + 1) + b;
}
feffects.easing.Cubic.easeInOut = function(t,b,c,d) {
	if((t /= d * 0.5) < 1) return c * 0.5 * t * t * t + b; else return c * 0.5 * ((t -= 2) * t * t + 2) + b;
}
feffects.easing.Expo = $hxClasses["feffects.easing.Expo"] = function() { }
feffects.easing.Expo.__name__ = ["feffects","easing","Expo"];
feffects.easing.Expo.__interfaces__ = [haxe.Public];
feffects.easing.Expo.easeIn = function(t,b,c,d) {
	return t == 0?b:c * Math.pow(2,10 * (t / d - 1)) + b;
}
feffects.easing.Expo.easeOut = function(t,b,c,d) {
	return t == d?b + c:c * (-Math.pow(2,-10 * t / d) + 1) + b;
}
feffects.easing.Expo.easeInOut = function(t,b,c,d) {
	if(t == 0) return b; else if(t == d) return b + c; else if((t /= d / 2) < 1) return c * 0.5 * Math.pow(2,10 * (t - 1)) + b; else return c * 0.5 * (-Math.pow(2,-10 * --t) + 2) + b;
}
feffects.easing.Quint = $hxClasses["feffects.easing.Quint"] = function() { }
feffects.easing.Quint.__name__ = ["feffects","easing","Quint"];
feffects.easing.Quint.__interfaces__ = [haxe.Public];
feffects.easing.Quint.easeIn = function(t,b,c,d) {
	return c * (t /= d) * t * t * t * t + b;
}
feffects.easing.Quint.easeOut = function(t,b,c,d) {
	return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}
feffects.easing.Quint.easeInOut = function(t,b,c,d) {
	if((t /= d * 0.5) < 1) return c * 0.5 * t * t * t * t * t + b; else return c * 0.5 * ((t -= 2) * t * t * t * t + 2) + b;
}
haxe.FastCell = $hxClasses["haxe.FastCell"] = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
haxe.FastCell.__name__ = ["haxe","FastCell"];
haxe.FastCell.prototype = {
	next: null
	,elt: null
	,__class__: haxe.FastCell
}
haxe.Json = $hxClasses["haxe.Json"] = function() {
};
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
}
haxe.Json.prototype = {
	parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += String.fromCharCode(13);
					break;
				case 110:
					buf.b += String.fromCharCode(10);
					break;
				case 116:
					buf.b += String.fromCharCode(9);
					break;
				case 98:
					buf.b += String.fromCharCode(8);
					break;
				case 102:
					buf.b += String.fromCharCode(12);
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				this.pos--;
				if(!this.reg_float.match(HxOverrides.substr(this.str,this.pos,null))) throw "Invalid float at position " + this.pos;
				var v = this.reg_float.matched(0);
				this.pos += v.length;
				var f = Std.parseFloat(v);
				var i = f | 0;
				return i == f?i:f;
			default:
				this.invalidChar();
			}
		}
	}
	,nextChar: function() {
		return this.str.charCodeAt(this.pos++);
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,quote: function(s) {
		this.buf.b += Std.string("\"");
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += Std.string("\\\"");
				break;
			case 92:
				this.buf.b += Std.string("\\\\");
				break;
			case 10:
				this.buf.b += Std.string("\\n");
				break;
			case 13:
				this.buf.b += Std.string("\\r");
				break;
			case 9:
				this.buf.b += Std.string("\\t");
				break;
			case 8:
				this.buf.b += Std.string("\\b");
				break;
			case 12:
				this.buf.b += Std.string("\\f");
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += Std.string("\"");
	}
	,toStringRec: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 8:
			this.buf.b += Std.string("\"???\"");
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
		case 2:
			this.buf.b += Std.string(v);
			break;
		case 5:
			this.buf.b += Std.string("\"<fun>\"");
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += Std.string("[");
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += Std.string(",");
						this.toStringRec(v1[i++]);
					}
				}
				this.buf.b += Std.string("]");
			} else if(c == Hash) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k = $it0.next();
					o[k] = v1.get(k);
				}
				this.objString(o);
			} else this.objString(v);
			break;
		case 7:
			var e = $e[2];
			this.buf.b += Std.string(v[1]);
			break;
		case 3:
			this.buf.b += Std.string(v?"true":"false");
			break;
		case 0:
			this.buf.b += Std.string("null");
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += Std.string("{");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += Std.string(",");
			this.quote(f);
			this.buf.b += Std.string(":");
			this.toStringRec(value);
		}
		this.buf.b += Std.string("}");
	}
	,toString: function(v) {
		this.buf = new StringBuf();
		this.toStringRec(v);
		return this.buf.b;
	}
	,reg_float: null
	,pos: null
	,str: null
	,buf: null
	,__class__: haxe.Json
}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var model = model || {}
model.Shape = $hxClasses["model.Shape"] = function(shapeData,color) {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.color = color;
	this.shapeData = shapeData;
};
model.Shape.__name__ = ["model","Shape"];
model.Shape.prototype = {
	getRotation: function() {
		return this.rotation;
	}
	,setRotation: function(value) {
		this.rotation = value;
	}
	,getHeight: function() {
		return this.shapeData.model[0].length;
	}
	,getWidth: function() {
		return this.shapeData.model.length;
	}
	,getBits: function() {
		return this.shapeData.model;
	}
	,shapeData: null
	,rotation: null
	,color: null
	,y: null
	,x: null
	,__class__: model.Shape
}
model.ShapeData = $hxClasses["model.ShapeData"] = function(model,color,offset) {
	if(offset == null) offset = 0;
	this.model = model;
	this.color = color;
	this.offset = offset;
};
model.ShapeData.__name__ = ["model","ShapeData"];
model.ShapeData.prototype = {
	offset: null
	,color: null
	,model: null
	,__class__: model.ShapeData
}
model.ShapeStore = $hxClasses["model.ShapeStore"] = function() { }
model.ShapeStore.__name__ = ["model","ShapeStore"];
model.ShapeStore.getLength = function() {
	return [new model.ShapeData([[-1,-1,-1,-1],[0,0,0,0],[-1,-1,-1,-1]],"#cf64f1"),new model.ShapeData([[-1,-1,-1],[1,1,1],[-1,1,-1]],"#189af0",-0.5),new model.ShapeData([[-1,2],[2,2],[2,-1]],"#f45f76"),new model.ShapeData([[3,-1],[3,3],[-1,3]],"#8DD909"),new model.ShapeData([[-1,-1,-1],[4,4,4],[-1,-1,4]],"#2cc887",-0.5),new model.ShapeData([[-1,-1,-1],[5,5,5],[5,-1,-1]],"#f4bd3a",-0.5),new model.ShapeData([[6,6],[6,6]],"#6D87F3")].length;
}
model.ShapeStore.getShapeColor = function(shapeIndex) {
	return shapeIndex < [new model.ShapeData([[-1,-1,-1,-1],[0,0,0,0],[-1,-1,-1,-1]],"#cf64f1"),new model.ShapeData([[-1,-1,-1],[1,1,1],[-1,1,-1]],"#189af0",-0.5),new model.ShapeData([[-1,2],[2,2],[2,-1]],"#f45f76"),new model.ShapeData([[3,-1],[3,3],[-1,3]],"#8DD909"),new model.ShapeData([[-1,-1,-1],[4,4,4],[-1,-1,4]],"#2cc887",-0.5),new model.ShapeData([[-1,-1,-1],[5,5,5],[5,-1,-1]],"#f4bd3a",-0.5),new model.ShapeData([[6,6],[6,6]],"#6D87F3")].length?[new model.ShapeData([[-1,-1,-1,-1],[0,0,0,0],[-1,-1,-1,-1]],"#cf64f1"),new model.ShapeData([[-1,-1,-1],[1,1,1],[-1,1,-1]],"#189af0",-0.5),new model.ShapeData([[-1,2],[2,2],[2,-1]],"#f45f76"),new model.ShapeData([[3,-1],[3,3],[-1,3]],"#8DD909"),new model.ShapeData([[-1,-1,-1],[4,4,4],[-1,-1,4]],"#2cc887",-0.5),new model.ShapeData([[-1,-1,-1],[5,5,5],[5,-1,-1]],"#f4bd3a",-0.5),new model.ShapeData([[6,6],[6,6]],"#6D87F3")][shapeIndex].color:"#DB8433";
}
model.TetrisBoard = $hxClasses["model.TetrisBoard"] = function(boardWidth,boardHeight) {
	if(boardHeight == null) boardHeight = 21;
	if(boardWidth == null) boardWidth = 10;
	this._boardWidth = boardWidth;
	this._boardHeight = boardHeight;
	this.boardWidthWithPadding = this._boardWidth + 6;
	this.boardHeightWithPadding = this._boardHeight + 6;
	this.createBoard(this._boardWidth,this._boardHeight);
};
model.TetrisBoard.__name__ = ["model","TetrisBoard"];
model.TetrisBoard.prototype = {
	getHeight: function() {
		return this._boardHeight;
	}
	,getWidth: function() {
		return this._boardWidth;
	}
	,indexToBoard: function(value) {
		return value + 3;
	}
	,inHeightRange: function(value) {
		return value >= -3 && value < this.boardHeightWithPadding;
	}
	,inWidthRange: function(value) {
		return value >= -3 && value < this.boardWidthWithPadding;
	}
	,assertInHeightRange: function(value,message) {
		if(!this.inHeightRange(value)) throw "trying to access cell out of vertical range (#{value})";
	}
	,assertInWidthRange: function(value,message) {
		if(!this.inWidthRange(value)) throw "trying to access cell out of horizontal range (#{value})";
	}
	,createBoard: function(boardWidth,boardHeight) {
		if(boardHeight == null) boardHeight = 21;
		if(boardWidth == null) boardWidth = 10;
		this.board = [];
		var _g1 = 0, _g = this.boardHeightWithPadding;
		while(_g1 < _g) {
			var i = _g1++;
			this.board.push([]);
		}
		var _g1 = 0, _g = boardHeight + 3;
		while(_g1 < _g) {
			var row = _g1++;
			this.board[row] = this.getEmptyLine();
		}
		var _g1 = boardHeight + 3, _g = this.boardHeightWithPadding;
		while(_g1 < _g) {
			var y = _g1++;
			var _g3 = 0, _g2 = this.boardWidthWithPadding;
			while(_g3 < _g2) {
				var x = _g3++;
				this.board[y][x] = 9;
			}
		}
	}
	,toString: function(padding) {
		if(padding == null) padding = false;
		var result = "";
		var startY = padding?0:3;
		var endY = this.boardHeightWithPadding - (padding?0:3);
		var startX = startY;
		var endX = this.boardWidthWithPadding - (padding?0:3);
		var _g = startY;
		while(_g < endY) {
			var row = _g++;
			var rowBits = this.board[row];
			result += this.board[row].slice(startX,endX).join("") + "\n";
		}
		return result;
	}
	,print: function() {
		haxe.Log.trace("the board: \n" + this.toString(),{ fileName : "TetrisBoard.hx", lineNumber : 243, className : "model.TetrisBoard", methodName : "print"});
	}
	,getRandomLineModel: function(color) {
		var result = [];
		var hasEmpty = false;
		var _g1 = 0, _g = this._boardWidth;
		while(_g1 < _g) {
			var i = _g1++;
			var fill = Math.floor(Math.random() * 3) > 0;
			result.push(fill?color:-1);
			hasEmpty = hasEmpty || !fill;
		}
		if(!hasEmpty) result[0] = color;
		return result;
	}
	,getFullLine: function(color,random) {
		if(random == null) random = false;
		var line = new Array();
		var randomLine = null;
		var _g = 0;
		while(_g < 3) {
			var column = _g++;
			line.push(9);
		}
		if(random) randomLine = this.getRandomLineModel(color);
		var _g1 = 0, _g = this._boardWidth;
		while(_g1 < _g) {
			var column = _g1++;
			if(random) color = randomLine[column];
			line.push(color);
		}
		var _g = 0;
		while(_g < 3) {
			var row = _g++;
			line.push(9);
		}
		return line;
	}
	,getEmptyLine: function() {
		return this.getFullLine(-1);
	}
	,getLine: function(lineIndex) {
		var lineWithoutPadding = this.board[lineIndex + 3].concat([]);
		lineWithoutPadding.splice(0,3);
		lineWithoutPadding.splice(lineWithoutPadding.length - 3,3);
		return lineWithoutPadding;
	}
	,checkLineFull: function(lineIndex) {
		var lineBits = this.getLine(lineIndex);
		var _g1 = 0, _g = lineBits.length;
		while(_g1 < _g) {
			var i = [_g1++];
			if(Lambda.exists([-1,9],(function(i) {
				return function(bit) {
					return bit == lineBits[i[0]];
				};
			})(i))) return false;
		}
		return true;
	}
	,removeLine: function(lineIndex) {
		this.assertInHeightRange(lineIndex);
		this.board.splice(lineIndex + 3,1);
		this.board.splice(3,0,this.getEmptyLine());
	}
	,checkAndRemoveLine: function(line) {
		if(this.checkLineFull(line)) {
			this.removeLine(line);
			return true;
		}
		return false;
	}
	,removeFullLines: function(lines) {
		var result = [];
		var _g = 0;
		while(_g < lines.length) {
			var line = lines[_g];
			++_g;
			if(this.checkAndRemoveLine(line)) result.push(line);
		}
		return result;
	}
	,getCell: function(x,y) {
		if(this.inWidthRange(x) && this.inHeightRange(y)) {
			x = this.indexToBoard(x);
			y = this.indexToBoard(y);
			return this.board[y][x];
		} else throw "trying to get a cell out of range (#{x}, #{y})";
		return -1;
	}
	,checkLineEmpty: function(lineIndex) {
		var lineBits = this.getLine(lineIndex);
		var _g1 = 0, _g = lineBits.length;
		while(_g1 < _g) {
			var i = [_g1++];
			if(!Lambda.exists([-1,9],(function(i) {
				return function(bit) {
					return bit == lineBits[i[0]];
				};
			})(i))) return false;
		}
		return true;
	}
	,getTopLine: function(currentShape) {
		this.removeShape(currentShape);
		var _g1 = 0, _g = this.board.length;
		while(_g1 < _g) {
			var line = _g1++;
			if(!this.checkLineEmpty(line)) {
				this.addShape(currentShape);
				return line;
			}
		}
		this.addShape(currentShape);
		return 0;
	}
	,setCell: function(x,y,color) {
		this.assertInWidthRange(x);
		this.assertInHeightRange(y);
		x = this.indexToBoard(x);
		y = this.indexToBoard(y);
		this.board[y][x] = color;
	}
	,addRandomLines: function(numLines,color,currentShape) {
		this.removeShape(currentShape);
		this.board.splice(3,numLines);
		var _g = 0;
		while(_g < numLines) {
			var i = _g++;
			this.board.splice(this.board.length - 3,0,this.getFullLine(color,true));
		}
		this.addShape(currentShape);
	}
	,removeShape: function(shape) {
		var shapeBits = shape.getBits();
		var _g1 = 0, _g = shape.getHeight();
		while(_g1 < _g) {
			var j = _g1++;
			var _g3 = 0, _g2 = shape.getWidth();
			while(_g3 < _g2) {
				var i = _g3++;
				if(shapeBits[i][j] != -1) this.setCell(shape.x + i,shape.y + j,-1);
			}
		}
	}
	,addShape: function(shape) {
		var shapeBits = shape.getBits();
		var _g1 = 0, _g = shape.getHeight();
		while(_g1 < _g) {
			var j = _g1++;
			var _g3 = 0, _g2 = shape.getWidth();
			while(_g3 < _g2) {
				var i = _g3++;
				var bit = shapeBits[i][j];
				if(bit != -1) this.setCell(shape.x + i,shape.y + j,shapeBits[i][j]);
			}
		}
	}
	,shapeHitTest: function(shape) {
		var shapeBits = shape.getBits();
		var _g1 = 0, _g = shape.getHeight();
		while(_g1 < _g) {
			var j = _g1++;
			var _g3 = 0, _g2 = shape.getWidth();
			while(_g3 < _g2) {
				var i = _g3++;
				if(shapeBits[i][j] != -1 && this.getCell(shape.x + i,shape.y + j) != -1) return true;
			}
		}
		return false;
	}
	,clear: function() {
		this.createBoard(this._boardWidth,this._boardHeight);
	}
	,board: null
	,boardHeightWithPadding: null
	,boardWidthWithPadding: null
	,_boardHeight: null
	,_boardWidth: null
	,__class__: model.TetrisBoard
}
var util = util || {}
util.AnimationUtil = $hxClasses["util.AnimationUtil"] = function() {
};
util.AnimationUtil.__name__ = ["util","AnimationUtil"];
util.AnimationUtil.fadeIn = function(element,time,updateCallback,finishedCallback,endOpacity) {
	if(endOpacity == null) endOpacity = 1;
	var fadeTween = new feffects.Tween(0,endOpacity,time);
	fadeTween.onUpdate(function(value) {
		element.style.opacity = value;
		if(updateCallback != null) updateCallback(value);
	});
	if(finishedCallback != null) fadeTween.onFinish(finishedCallback);
	fadeTween.start();
}
util.AnimationUtil.fadeOut = function(element,time,updateCallback,finishedCallback,start) {
	if(start == null) start = 1;
	var fadeTween = new feffects.Tween(start,0,time);
	fadeTween.onUpdate(function(value) {
		element.style.opacity = value;
		if(updateCallback != null) updateCallback(value);
	});
	if(finishedCallback != null) fadeTween.onFinish(finishedCallback);
	fadeTween.start();
}
util.AnimationUtil.move = function(element,time,position,easing,finishedCallback) {
	var originalPosition = new util.Point(Std.parseInt(element.style.left),Std.parseInt(element.style.top));
	var delta = position.subtract(originalPosition);
	var moveTween = new feffects.Tween(0,1,time,easing);
	moveTween.onUpdate(function(value) {
		var p = originalPosition.add(delta.scalarMult(value));
		element.style.left = Std.string(p.x | 0) + "px";
		element.style.top = Std.string(p.y | 0) + "px";
	});
	if(finishedCallback != null) moveTween.onFinish(finishedCallback);
	moveTween.start();
	return moveTween;
}
util.AnimationUtil.changeSize = function(element,time,width,height,easing,finishedCallback) {
	if(easing == null) easing = "easeOut";
	var originalWidth = util.JSUtil.getWidth(element);
	var originalHeight = util.JSUtil.getHeight(element);
	var deltaWidth = width - originalWidth;
	var deltaHeight = height - originalHeight;
	var sizeTween = new feffects.Tween(0,1,time,null,null,easing);
	sizeTween.onUpdate(function(value) {
		{
			element.style.width = Std.string(originalWidth + deltaWidth * value | 0) + "px";
			element.style.height = Std.string(originalHeight + deltaHeight * value | 0) + "px";
		}
	});
	if(finishedCallback != null) sizeTween.onFinish(finishedCallback);
	sizeTween.start();
}
util.AnimationUtil.prototype = {
	__class__: util.AnimationUtil
}
util.ArrayUtil = $hxClasses["util.ArrayUtil"] = function() { }
util.ArrayUtil.__name__ = ["util","ArrayUtil"];
util.ArrayUtil.range = function(start,end) {
	var result = [];
	var i = start;
	while(i <= end) result.push(i++);
	return result;
}
util.ArrayUtil.deepArrayToString = function(array) {
	var result = "";
	var _g = 0;
	while(_g < array.length) {
		var line = array[_g];
		++_g;
		result += Std.string(line.toString()) + "\n";
	}
	return result;
}
util.ArrayUtil.get2dArray = function(width,height,initValue) {
	var result = [];
	var tempLine;
	var _g = 0;
	while(_g < width) {
		var y = _g++;
		tempLine = [];
		var _g1 = 0;
		while(_g1 < height) {
			var x = _g1++;
			tempLine.push(initValue);
		}
		result.push(tempLine);
	}
	return result;
}
util.DebugConsole = $hxClasses["util.DebugConsole"] = function() {
	this.logCount = 0;
};
util.DebugConsole.__name__ = ["util","DebugConsole"];
util.DebugConsole.instance = null;
util.DebugConsole.getInstance = function() {
	if(util.DebugConsole.instance == null) util.DebugConsole.instance = new util.DebugConsole();
	return util.DebugConsole.instance;
}
util.DebugConsole.prototype = {
	createConsole: function() {
		if(this.console == null) {
			this.console = js.Lib.document.createElement("div");
			if(util.DebugConsole.enabled) this.console.className = "debugConsole"; else {
				this.console.className = "debugConsole";
				util.JSUtil.applyDimentions(this.console,50,50);
				this.console.style.opacity = 0.1;
				this.console.style.overflow = "hidden";
				this.console.style.visibility = "hidden";
			}
		}
		if(this.console.parentNode == null) js.Lib.document.body.appendChild(this.console);
	}
	,clear: function() {
		this.console.innerHTML = "";
	}
	,removeLog: function() {
		this.timer.stop();
		this.timer = null;
		js.Lib.document.body.removeChild(this.console);
	}
	,log: function(str,clearConsole) {
		if(clearConsole == null) clearConsole = true;
		this.createConsole();
		if(clearConsole || this.logCount > 4) {
			this.clear();
			this.logCount = 0;
		}
		this.logCount++;
		this.console.innerHTML += str + "<br>";
		if(this.timer != null) this.timer.stop();
		this.timer = new haxe.Timer(10000);
		this.timer.run = $bind(this,this.removeLog);
	}
	,timer: null
	,logCount: null
	,console: null
	,__class__: util.DebugConsole
}
util.JSUtil = $hxClasses["util.JSUtil"] = function() { }
util.JSUtil.__name__ = ["util","JSUtil"];
util.JSUtil.isUndefined = function(value) {
	return "undefined" === typeof value;
}
util.JSUtil.cssPixels = function(value) {
	return Std.string(value) + "px";
}
util.JSUtil.cssPixelsFloat = function(value) {
	return Std.string(value | 0) + "px";
}
util.JSUtil.fromCssPixel = function(value) {
	return Std.parseInt(value);
}
util.JSUtil.cssHexColor = function(color) {
	return "#" + StringTools.hex(color,6);
}
util.JSUtil.rgbaString = function(color,alpha) {
	return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + alpha + ")";
}
util.JSUtil.getElementsByClassName = function(root,className,tagName) {
	if(tagName == null) tagName = "*";
	var elements = root.getElementsByTagName(tagName);
	var result = [];
	var _g1 = 0, _g = elements.length;
	while(_g1 < _g) {
		var i = _g1++;
		if((" " + elements[i].className + " ").indexOf(" " + className + " ") > -1) result.push(elements[i]);
	}
	return result;
}
util.JSUtil.createCanvas = function(element,x,y,w,h) {
	var doc = js.Lib.document;
	var canvas = doc.createElement("canvas");
	canvas.setAttribute("width",Std.string(w) + "px");
	canvas.setAttribute("height",Std.string(h) + "px");
	var style = "position: fixed; left: " + x + "; top: " + y + ";";
	canvas.setAttribute("style",style);
	canvas.style.position = "absolute";
	element.appendChild(canvas);
	return canvas;
}
util.JSUtil.getWidth = function(e) {
	if(e.parentNode == null) {
		var width = Std.parseInt(e.style.width);
		return width;
	} else return e.offsetWidth;
}
util.JSUtil.setWidth = function(e,width) {
	e.style.width = Std.string(width) + "px";
}
util.JSUtil.setHeight = function(e,height) {
	e.style.height = Std.string(height) + "px";
}
util.JSUtil.setVisibility = function(e,value) {
	e.style.visibility = value?"visible":"hidden";
}
util.JSUtil.getHeight = function(e) {
	if(e.parentNode == null) {
		var savedVisibility = e.style.visibility;
		e.style.visibility = "hidden";
		js.Lib.document.body.appendChild(e);
		var height = Std.parseInt(e.style.height);
		js.Lib.document.body.removeChild(e);
		e.style.visibility = savedVisibility;
		return height;
	} else return e.offsetHeight;
}
util.JSUtil.getPosition = function(e) {
	return new util.Point(Std.parseInt(e.style.left),Std.parseInt(e.style.top));
}
util.JSUtil.bind = function(eventType,handler) {
	new js.JQuery("#" + "mainContainer").bind(eventType,handler);
}
util.JSUtil.unbind = function(eventType,handler) {
	new js.JQuery("#" + "mainContainer").unbind(eventType,handler);
}
util.JSUtil.addEventListener = function(element,eventType,handler) {
	if(js.Lib.isIE) element.attachEvent(eventType,handler,false); else element.addEventListener(eventType,handler,false);
}
util.JSUtil.removeEventListener = function(element,eventType,handler) {
	if(js.Lib.isIE) element.detachEvent(eventType,handler,false); else element.removeEventListener(eventType,handler,false);
}
util.JSUtil.applyLayout = function(element,x,y,width,height) {
	element.style.left = Std.string(x) + "px";
	element.style.top = Std.string(y) + "px";
	{
		element.style.width = Std.string(width) + "px";
		element.style.height = Std.string(height) + "px";
	}
}
util.JSUtil.getOffsetLayout = function(element) {
	return new view.Layout(element.offsetLeft,element.offsetTop,util.JSUtil.getWidth(element),util.JSUtil.getHeight(element));
}
util.JSUtil.getMaxWidth = function(container,ignoreList) {
	var children = container.childNodes;
	var width = 0;
	var _g1 = 0, _g = children.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(ignoreList != null && Lambda.indexOf(ignoreList,children[i]) > -1) continue;
		width = Math.max(width,util.JSUtil.getWidth(children[i])) | 0;
	}
	return width;
}
util.JSUtil.sumChildrenHeight = function(container) {
	var children = container.childNodes;
	var width = 0;
	var _g1 = 0, _g = children.length;
	while(_g1 < _g) {
		var i = _g1++;
		width = Math.max(width,util.JSUtil.getWidth(children[i])) | 0;
	}
	return width;
}
util.JSUtil.setPosition = function(element,x,y) {
	element.style.left = Std.string(x) + "px";
	element.style.top = Std.string(y) + "px";
}
util.JSUtil.setX = function(element,x) {
	element.style.left = Std.string(x) + "px";
}
util.JSUtil.setY = function(element,y) {
	element.style.top = Std.string(y) + "px";
}
util.JSUtil.applyDimentions = function(element,width,height) {
	element.style.width = Std.string(width) + "px";
	element.style.height = Std.string(height) + "px";
}
util.JSUtil.isTouchDevice = function() {
	return "ontouchstart" in window;
}
util.JSUtil.createTextView = function(id,text,fontSize,x,y,labelStyle) {
	if(labelStyle == null) labelStyle = "h1";
	var textView = js.Lib.document.createElement(labelStyle);
	var textNode = js.Lib.document.createTextNode(text);
	textView.appendChild(textNode);
	textView.id = id;
	textView.style.fontSize = fontSize;
	textView.style.left = Std.string(x) + "px";
	textView.style.top = Std.string(y) + "px";
	textView.className = "label";
	textView.style.position = "absolute";
	return textView;
}
util.JSUtil.createRoundButton = function(id,layout,imageAsset) {
	var button = js.Lib.document.createElement("div");
	button.id = id;
	button.className = "roundButton";
	button.style.position = "absolute";
	layout.applyToElement(button);
	if(imageAsset != null) {
		var icon = util.JSUtil.setupImage(imageAsset.createElement());
		var iconX = layout.width / 2 - util.JSUtil.getWidth(icon) / 2 | 0;
		var iconY = layout.height / 2 - util.JSUtil.getHeight(icon) / 2 | 0;
		button.appendChild(icon);
		icon.style.left = Std.string(iconX) + "px";
		icon.style.top = Std.string(iconY) + "px";
	}
	util.JSUtil.setHitArea(button,layout,0,0);
	return button;
}
util.JSUtil.createButton = function(caption,id,layout,styleClass,paddingV,paddingH,fontSize,imageAsset) {
	if(fontSize == null) fontSize = 30;
	if(paddingH == null) paddingH = 0;
	if(paddingV == null) paddingV = 0;
	if(styleClass == null) styleClass = "button";
	var button = js.Lib.document.createElement("div");
	button.id = id;
	button.className = styleClass;
	button.style.position = "absolute";
	layout.applyToElement(button);
	if(paddingV > -1) button.style.padding = "" + paddingV + "px " + paddingH + "px";
	button.style.fontSize = Std.string(fontSize) + "px";
	if(caption != null && caption.length > 0) button.appendChild(js.Lib.document.createTextNode(caption));
	if(imageAsset != null) button.appendChild(util.JSUtil.setupImage(imageAsset.createElement()));
	util.JSUtil.setHitArea(button,layout,paddingH,paddingV);
	return button;
}
util.JSUtil.setHitArea = function(button,layout,paddingH,paddingV) {
	var hitArea = js.Lib.document.createElement("div");
	hitArea.id = button.id + "Hit";
	hitArea.className = "buttonHit";
	hitArea.style.position = "absolute";
	hitArea.style.left = Std.string(0) + "px";
	hitArea.style.top = Std.string(0) + "px";
	{
		hitArea.style.width = Std.string(layout.width + paddingH * 2) + "px";
		hitArea.style.height = Std.string(layout.height + paddingV * 2) + "px";
	}
	button.appendChild(hitArea);
}
util.JSUtil.setupImage = function(img) {
	img.style.marginTop = "auto";
	img.style.marginBottom = "auto";
	img.style.position = "absolute";
	return img;
}
util.JSUtil.getFirstTouchPoint = function(event) {
	var touchEvent = event.originalEvent.touches[0];
	return new util.Point(touchEvent.pageX,touchEvent.pageY);
}
util.JSUtil.getFirstReleasedPoint = function(event) {
	var touchEvent = event.originalEvent.changedTouches[0];
	return new util.Point(touchEvent.pageX,touchEvent.pageY);
}
util.JSUtil.setOpacity = function(element,opacity) {
	element.style.opacity = opacity;
}
util.JSUtil.getOpacity = function(element) {
	var opacity = Std.parseFloat(element.style.opacity);
	return opacity;
}
util.JSUtil.setBGColor = function(element,color) {
	element.style.backgroundColor = "#" + StringTools.hex(color,6);
}
util.JSUtil.setGradient = function(element,startColor,endColor,startAlpha,endAlpha) {
	if(endAlpha == null) endAlpha = 1;
	if(startAlpha == null) startAlpha = 1;
	var start = "rgba(" + (startColor >> 16 & 255) + "," + (startColor >> 8 & 255) + "," + (startColor & 255) + "," + startAlpha + ")";
	var end = "rgba(" + (endColor >> 16 & 255) + "," + (endColor >> 8 & 255) + "," + (endColor & 255) + "," + endAlpha + ")";
	element.style.backgroundImage = "-moz-linear-gradient(top, " + start + ", " + end + ")";
	element.style.backgroundImage = "-webkit-linear-gradient(top, " + start + ", " + end + ")";
	element.style.backgroundImage = "-webkit-gradient(linear, left top, left bottom, color-stop(0, " + start + "), color-stop(1, " + end + "))";
	element.style.backgroundImage = "-ms-linear-gradient(top, " + start + ", " + end + ")";
	element.style.backgroundImage = "-o-linear-gradient(top, " + start + ", " + end + ")";
}
util.JSUtil.stretchHorizontalBackgroundImage = function(element) {
	element.style.backgroundsize = "100%";
}
util.Point = $hxClasses["util.Point"] = function(x,y) {
	this.x = x;
	this.y = y;
};
util.Point.__name__ = ["util","Point"];
util.Point.prototype = {
	toString: function() {
		return "[ " + this.x + ", " + this.y + " ]";
	}
	,clone: function() {
		return new util.Point(this.x,this.y);
	}
	,scalarMult: function(scalar) {
		return new util.Point(this.x * scalar,this.y * scalar);
	}
	,add: function(p) {
		return new util.Point(this.x + p.x,this.y + p.y);
	}
	,subtract: function(p) {
		return new util.Point(this.x - p.x,this.y - p.y);
	}
	,y: null
	,x: null
	,__class__: util.Point
}
var view = view || {}
view.ImageInfo = $hxClasses["view.ImageInfo"] = function(url,x,y,width,height) {
	this.url = url;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	var regex = new EReg("/|\\\\","g");
	this.id = regex.replace(url,"");
	this.id = "" + this.id + "_" + x + "_" + y + "_" + width + "_" + height;
};
view.ImageInfo.__name__ = ["view","ImageInfo"];
view.ImageInfo.prototype = {
	createElement: function() {
		var imageElement = js.Lib.document.createElement("img");
		imageElement.setAttribute("src",this.url);
		imageElement.style.width = Std.string(this.width) + "px";
		imageElement.style.height = Std.string(this.height) + "px";
		imageElement.id = this.id;
		imageElement.style.position = "absolute";
		return imageElement;
	}
	,height: null
	,width: null
	,y: null
	,x: null
	,id: null
	,url: null
	,__class__: view.ImageInfo
}
view.Assets = $hxClasses["view.Assets"] = function() { }
view.Assets.__name__ = ["view","Assets"];
view.Assets.preloadedImages = null;
view.Assets.preload = function(images) {
	if(view.Assets.preloadedImages == null) view.Assets.preloadedImages = [];
	var _g = 0;
	while(_g < images.length) {
		var image = images[_g];
		++_g;
		var imageElement = js.Lib.document.createElement("img");
		imageElement.setAttribute("src",image.url);
		view.Assets.preloadedImages.push(imageElement);
	}
}
view.BlockView = $hxClasses["view.BlockView"] = function(x,y,color,width,height) {
	this._x = x;
	this._y = y;
	this._color = color;
	this._width = width;
	this._height = height;
	this.createBlock();
};
view.BlockView.__name__ = ["view","BlockView"];
view.BlockView.prototype = {
	getView: function() {
		return this.element;
	}
	,createBlock: function() {
		this.element = js.Lib.document.createElement("div");
		this.element.className = "block";
		this.element.style.backgroundColor = model.ShapeStore.getShapeColor(this._color);
		this.element.style.position = "absolute";
		this.element.style.left = Std.string(this._x * this._width) + "px";
		this.element.style.top = Std.string(this._y * this._height) + "px";
		this.element.style.width = Std.string(this._width - 2) + "px";
		this.element.style.height = Std.string(this._height - 2) + "px";
	}
	,element: null
	,_height: null
	,_width: null
	,_color: null
	,_y: null
	,_x: null
	,__class__: view.BlockView
}
view.BoardView = $hxClasses["view.BoardView"] = function() { }
view.BoardView.__name__ = ["view","BoardView"];
view.BoardView.prototype = {
	getWidth: null
	,clear: null
	,updateAllBoard: null
	,removeLines: null
	,addBottomLines: null
	,updateShape: null
	,getView: null
	,__class__: view.BoardView
}
view.Box = $hxClasses["view.Box"] = function(id,className,position) {
	if(position == null) position = "absolute";
	this.padding = 0;
	this.spacingY = 0;
	this.spacingX = 0;
	this.container = view.DocElements.getNewElement("div",id,className,position);
	this.fixedChildren = [];
	this.boxes = [];
};
view.Box.__name__ = ["view","Box"];
view.Box.prototype = {
	runAfter: function(func) {
		var _g = this;
		var timer = new haxe.Timer(0);
		this.container.style.opacity = 0;
		timer.run = function() {
			timer.stop();
			func();
			_g.container.style.opacity = 1;
		};
	}
	,setHAlign: function(value) {
		this._halign = value;
		this.update();
	}
	,setVAlign: function(value) {
		this._valign = value;
		this.update();
	}
	,setAlign: function(value) {
		this._align = value;
		this.update();
	}
	,getView: function() {
		return this.container;
	}
	,setPadding: function(value) {
		this.padding = value;
	}
	,setSpacing: function(value) {
		this.spacingX = value;
		this.spacingY = value;
	}
	,setSpacingY: function(value) {
		this.spacingY = value;
	}
	,setSpacingX: function(value) {
		this.spacingX = value;
	}
	,doUpdate: function() {
	}
	,update: function() {
		var _g1 = 0, _g = this.boxes.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.boxes[i].update();
		}
		this.runAfter($bind(this,this.doUpdate));
	}
	,addBox: function(box) {
		this.boxes.push(box);
		this.add(box.getView());
	}
	,addBoxFixed: function(box,x,y) {
		this.boxes.push(box);
		this.addFixed(box.getView(),x,y);
	}
	,addFixed: function(child,x,y) {
		this.fixedChildren.push(child);
		child.style.left = Std.string(x) + "px";
		child.style.top = Std.string(y) + "px";
		this.container.appendChild(child);
	}
	,add: function(child) {
		this.container.appendChild(child);
		this.update();
	}
	,getHeight: function() {
		return util.JSUtil.getHeight(this.container);
	}
	,getWidth: function() {
		return util.JSUtil.getWidth(this.container);
	}
	,_halign: null
	,_valign: null
	,_align: null
	,padding: null
	,spacingY: null
	,spacingX: null
	,fixedChildren: null
	,container: null
	,boxes: null
	,__class__: view.Box
}
view.Alignment = $hxClasses["view.Alignment"] = { __ename__ : ["view","Alignment"], __constructs__ : ["left","right","center","top","bottom"] }
view.Alignment.left = ["left",0];
view.Alignment.left.toString = $estr;
view.Alignment.left.__enum__ = view.Alignment;
view.Alignment.right = ["right",1];
view.Alignment.right.toString = $estr;
view.Alignment.right.__enum__ = view.Alignment;
view.Alignment.center = ["center",2];
view.Alignment.center.toString = $estr;
view.Alignment.center.__enum__ = view.Alignment;
view.Alignment.top = ["top",3];
view.Alignment.top.toString = $estr;
view.Alignment.top.__enum__ = view.Alignment;
view.Alignment.bottom = ["bottom",4];
view.Alignment.bottom.toString = $estr;
view.Alignment.bottom.__enum__ = view.Alignment;
view.CloudController = $hxClasses["view.CloudController"] = function(layout,parent) {
	this._layout = layout;
	this._parent = parent;
};
view.CloudController.__name__ = ["view","CloudController"];
view.CloudController.prototype = {
	createClouds: function() {
		var x;
		var y;
		this.topClouds = util.JSUtil.setupImage(new view.ImageInfo("resources/images_mdpi/clouds_top.png",0,0,159,20).createElement());
		x = this._layout.width / 2 - util.JSUtil.getWidth(this.topClouds) / 2 | 0;
		util.JSUtil.setPosition(this.topClouds,x,0);
		this._parent.appendChild(this.topClouds);
		this.rightClouds = util.JSUtil.setupImage(new view.ImageInfo("resources/images_mdpi/clouds_right.png",0,0,40,79).createElement());
		x = this._layout.width - util.JSUtil.getWidth(this.rightClouds);
		y = this._layout.height / 2 - util.JSUtil.getHeight(this.rightClouds) / 2 | 0;
		util.JSUtil.setPosition(this.rightClouds,x,y);
		this.rightClouds.style.opacity = 0.4;
		this._parent.appendChild(this.rightClouds);
		this.bottomClouds = util.JSUtil.setupImage(new view.ImageInfo("resources/images_mdpi/clouds_bottom.png",0,0,320,55).createElement());
		var bottomHeight = util.JSUtil.getHeight(this.bottomClouds);
		y = this._layout.height - bottomHeight;
		util.JSUtil.applyLayout(this.bottomClouds,0,y,this._layout.width,bottomHeight);
		this._parent.appendChild(this.bottomClouds);
		this.leftClouds = util.JSUtil.setupImage(new view.ImageInfo("resources/images_mdpi/clouds_left.png",0,0,27,101).createElement());
		y = this._layout.height / 2 - util.JSUtil.getHeight(this.leftClouds) / 2 | 0;
		util.JSUtil.setPosition(this.leftClouds,0,y);
		this._parent.appendChild(this.leftClouds);
	}
	,_parent: null
	,_layout: null
	,bottomClouds: null
	,leftClouds: null
	,rightClouds: null
	,topClouds: null
	,__class__: view.CloudController
}
view.ControlButtons = $hxClasses["view.ControlButtons"] = function(layout,interactionLayout,refreshRate) {
	if(refreshRate == null) refreshRate = 60;
	this.enabled = false;
	this.doc = js.Lib.document;
	this._layout = layout;
	this._interactionLayout = interactionLayout;
	this._refreshRate = refreshRate;
	this.buttonsState = new view.ButtonsState();
	this.timer = new haxe.Timer(refreshRate);
	this.timer.run = $bind(this,this.onTimerTick);
	this.createContainer();
	this.createButtons();
	this.mainJQueryElement = new js.JQuery("#" + "mainContainer");
	this.controlJQueryElement = new js.JQuery("#controlsContainer");
	this.body = new js.JQuery(js.Lib.document.body);
	this.addEventListeners();
};
view.ControlButtons.__name__ = ["view","ControlButtons"];
view.ControlButtons.prototype = {
	getView: function() {
		return this.container;
	}
	,setAutoMargin: function(element) {
		element.style.verticalAlign = "bottom";
		return element;
	}
	,createButtonLayouts: function() {
		var buttonSize = new view.ImageInfo("resources/images_mdpi/clouds_btns.png",0,0,320,60).height + 10;
		var downX = this._layout.x + this._layout.width / 2 - buttonSize / 2 | 0;
		var leftX = downX - buttonSize;
		var rightX = downX + buttonSize;
		this.leftLayout = new view.Layout(leftX - buttonSize,0,buttonSize * 2,buttonSize);
		this.downLayout = new view.Layout(downX,0,buttonSize,buttonSize);
		this.rightLayout = new view.Layout(rightX,0,buttonSize * 2,buttonSize);
	}
	,createButtons: function() {
		this.createButtonLayouts();
		this.leftButton = util.JSUtil.createButton("","leftButton",this.leftLayout,"clearButton",null,null,null,null);
		this.container.appendChild(this.leftButton);
		this.downButton = util.JSUtil.createButton("","downButton",this.downLayout,"clearButton",null,null,null,null);
		this.container.appendChild(this.downButton);
		this.rightButton = util.JSUtil.createButton("","rightButton",this.rightLayout,"clearButton",null,null,null,null);
		this.container.appendChild(this.rightButton);
	}
	,createContainer: function() {
		this.container = js.Lib.document.getElementById("controlsContainer");
		var buttonsImage = new view.ImageInfo("resources/images_mdpi/clouds_btns.png",0,0,320,60).createElement();
		this.container.appendChild(buttonsImage);
		buttonsImage.style.left = Std.string((this._layout.width - new view.ImageInfo("resources/images_mdpi/clouds_btns.png",0,0,320,60).width) / 2 | 0) + "px";
		this._layout.applyToElement(this.container);
	}
	,handleTouchEnd: function(event) {
		event.preventDefault();
		this.buttonsState.reset();
		var id = event.target.id;
		if(id == "menuButton") this.menuCallback();
	}
	,handleTouchStart: function(event) {
		event.preventDefault();
		this.buttonsState.reset();
		var id = event.target.id;
		var firstTouch = util.JSUtil.getFirstTouchPoint(event);
		firstTouch.y -= util.JSUtil.getPosition(this.container).y;
		var currentCount;
		if(this.leftLayout.inRect(firstTouch)) {
			currentCount = ++this.buttonsState.left;
			this.leftCallback();
		} else if(this.downLayout.inRect(firstTouch)) {
			currentCount = ++this.buttonsState.down;
			this.downCallback();
		} else if(this.rightLayout.inRect(firstTouch)) {
			currentCount = ++this.buttonsState.right;
			this.rightCallback();
		}
		if(this._interactionLayout.inRect(util.JSUtil.getFirstTouchPoint(event))) this.rotateCallback();
	}
	,handleTouchMove: function(event) {
		event.preventDefault();
		var firstTouch = util.JSUtil.getFirstTouchPoint(event);
		firstTouch.y -= util.JSUtil.getPosition(this.container).y;
		if(this.leftLayout.inRect(firstTouch) && this.buttonsState.left == 0) {
			this.buttonsState.reset();
			this.buttonsState.left++;
			this.leftCallback();
		} else if(this.downLayout.inRect(firstTouch) && this.buttonsState.down == 0) {
			this.buttonsState.reset();
			this.buttonsState.down++;
			this.downCallback();
		} else if(this.rightLayout.inRect(firstTouch) && this.buttonsState.right == 0) {
			this.buttonsState.reset();
			this.buttonsState.right++;
			this.rightCallback();
		} else if(this._interactionLayout.inRect(util.JSUtil.getFirstTouchPoint(event))) this.buttonsState.reset();
	}
	,setEnabled: function(value) {
		if(this.enabled != value) {
			this.enabled = value;
			if(this.enabled) {
				this.timer = new haxe.Timer(this._refreshRate);
				this.timer.run = $bind(this,this.onTimerTick);
			} else {
				this.timer.stop();
				this.timer = null;
			}
		}
	}
	,doActions: function() {
		if(this.buttonsState.left == 1 || this.buttonsState.left > 8) this.leftCallback();
		if(this.buttonsState.right == 1 || this.buttonsState.right > 8) this.rightCallback();
		if(this.buttonsState.down == 1 || this.buttonsState.down > 8) this.downCallback();
	}
	,onTimerTick: function() {
		this.buttonsState.incAll();
		this.doActions();
	}
	,removeEventListeners: function() {
		if("ontouchstart" in window) {
			this.body.unbind("touchstart",this.handleTouchStartRef);
			this.body.unbind("touchmove",this.handleTouchMoveRef);
			this.body.unbind("touchend",this.handleTouchEndRef);
		} else {
			util.JSUtil.removeEventListener(this.doc,"mouseDown",this.handleTouchStartRef);
			util.JSUtil.removeEventListener(this.doc,"mouseUp",this.handleTouchEndRef);
		}
	}
	,addEventListeners: function() {
		$("body").bind("touchstart", function() {  });;
		this.handleTouchStartRef = $bind(this,this.handleTouchStart);
		this.handleTouchEndRef = $bind(this,this.handleTouchEnd);
		this.handleTouchMoveRef = $bind(this,this.handleTouchMove);
		if("ontouchstart" in window) {
			this.body.bind("touchstart",this.handleTouchStartRef);
			this.body.bind("touchmove",this.handleTouchMoveRef);
			this.body.bind("touchend",this.handleTouchEndRef);
		} else {
			util.JSUtil.addEventListener(this.doc,"mouseDown",this.handleTouchStartRef);
			util.JSUtil.addEventListener(this.doc,"mouseUp",this.handleTouchEndRef);
		}
	}
	,menuCallback: null
	,downCallback: null
	,rotateCallback: null
	,rightCallback: null
	,leftCallback: null
	,handleTouchMoveRef: null
	,handleTouchEndRef: null
	,handleTouchStartRef: null
	,controlJQueryElement: null
	,mainJQueryElement: null
	,counter: null
	,timer: null
	,enabled: null
	,_refreshRate: null
	,rightLayout: null
	,downLayout: null
	,leftLayout: null
	,_rotateLayout: null
	,_interactionLayout: null
	,rightButton: null
	,downButton: null
	,leftButton: null
	,buttonsState: null
	,body: null
	,container: null
	,_layout: null
	,doc: null
	,__class__: view.ControlButtons
}
view.ButtonsState = $hxClasses["view.ButtonsState"] = function() {
	this.rotate = 0;
	this.down = 0;
	this.right = 0;
	this.left = 0;
};
view.ButtonsState.__name__ = ["view","ButtonsState"];
view.ButtonsState.prototype = {
	toString: function() {
		return this.left + " " + this.right + " " + this.down + " " + this.rotate;
	}
	,incAll: function() {
		if(this.left > 0) this.left++;
		if(this.right > 0) this.right++;
		if(this.down > 0) this.down++;
		if(this.rotate > 0) this.rotate++;
	}
	,reset: function() {
		this.left = this.right = this.down = this.rotate = 0;
	}
	,rotate: null
	,down: null
	,right: null
	,left: null
	,__class__: view.ButtonsState
}
view.DocElements = $hxClasses["view.DocElements"] = function() { }
view.DocElements.__name__ = ["view","DocElements"];
view.DocElements.getNewElement = function(type,id,className,position) {
	if(position == null) position = "absolute";
	if(className == null) className = "";
	if(id == null) id = "";
	var element = js.Lib.document.createElement(type);
	element.id = id;
	element.className = className;
	element.style.position = position;
	return element;
}
view.DomBoardView = $hxClasses["view.DomBoardView"] = function(boardModel,left,top,modelWidth,modelHeight,blockWidth,blockHeight) {
	this.rowCounter = 0;
	this._boardModel = boardModel;
	this._modelWidth = modelWidth;
	this._modelHeight = modelHeight;
	this._blockWidth = blockWidth;
	this._blockHeight = blockHeight;
	this.boardLeft = left;
	this.lastRotation = 0.0;
	this.board = view.DocElements.getNewElement("div","graphicsBoard","tetrisBoard");
	js.Lib.document.getElementById("mainContainer").appendChild(this.board);
	util.JSUtil.applyLayout(this.board,left,top,this._modelWidth * this._blockWidth,this._modelHeight * this._blockHeight);
	this.createBlocksArray();
};
view.DomBoardView.__name__ = ["view","DomBoardView"];
view.DomBoardView.__interfaces__ = [view.BoardView];
view.DomBoardView.prototype = {
	getWidth: function() {
		return Std.parseInt(this.board.style.width);
	}
	,clear: function() {
		this.removeShape();
		this.updateAllBoard();
	}
	,updateAllBoard: function() {
		if(this.shapeView != null) this.removeShape();
		var _g = 0, _g1 = this.rows;
		while(_g < _g1.length) {
			var row = _g1[_g];
			++_g;
			var blockList = util.JSUtil.getElementsByClassName(row,"block","div");
			var _g3 = 0, _g2 = blockList.length;
			while(_g3 < _g2) {
				var i = _g3++;
				row.removeChild(blockList[i]);
			}
		}
	}
	,appendBlockToRow: function(block,rowIndex) {
		block.getView().style.left = Std.string(Std.parseInt(block.getView().style.left)) + "px";
		this.rows[rowIndex].appendChild(block.getView());
	}
	,breakShapeToBlocks: function() {
		var rowIndex = this.previousShape.y;
		var _g = 0, _g1 = this.shapeView.getBlocksPerRow();
		while(_g < _g1.length) {
			var row = _g1[_g];
			++_g;
			var _g2 = 0;
			while(_g2 < row.length) {
				var block = row[_g2];
				++_g2;
				if(block != null && rowIndex >= 0) this.appendBlockToRow(block,rowIndex);
			}
			rowIndex++;
		}
		rowIndex++;
	}
	,shiftDownRows: function(rowNum,stopAtRow) {
		var _g = 0;
		while(_g < stopAtRow) {
			var rowIndex = _g++;
			var row = this.rows[rowIndex];
			var rowTop = Std.parseInt(row.style.top);
			row.style.top = Std.string(rowTop + rowNum * this._blockHeight) + "px";
		}
	}
	,shiftRows: function(removedLines) {
		var _g = 0;
		while(_g < removedLines.length) {
			var lineIndex = removedLines[_g];
			++_g;
			this.shiftDownRows(1,lineIndex);
		}
	}
	,removeLinesInner: function() {
		this.removeLinesTimer.stop();
		this.removeLinesTimer = null;
		this.shiftRows(this.currentLinesBeingRemoved);
		this.currentLinesBeingRemoved.reverse();
		var _g = 0, _g1 = this.currentLinesBeingRemoved;
		while(_g < _g1.length) {
			var indexToRemove = _g1[_g];
			++_g;
			this.board.removeChild(this.rows[indexToRemove]);
			this.rows.splice(indexToRemove,1);
		}
		this.addTopDivsToRows(this.currentLinesBeingRemoved.length);
		this.currentLinesBeingRemoved = null;
	}
	,removeLines: function(removedLines) {
		this.breakShapeToBlocks();
		this.removeShape();
		var numRemovedLines = removedLines != null?removedLines.length:0;
		if(numRemovedLines > 0) {
			this.flashLines(removedLines);
			if(this.currentLinesBeingRemoved != null) this.removeLinesInner();
			this.currentLinesBeingRemoved = removedLines;
			this.removeLinesTimer = new haxe.Timer(450);
			var removeLinesWrapper = $bind(this,this.removeLinesInner);
			this.removeLinesTimer.run = removeLinesWrapper;
		}
	}
	,currentLinesBeingRemoved: null
	,removeLinesTimer: null
	,flash: function(element) {
		util.AnimationUtil.fadeOut(element,150,null,function() {
			util.AnimationUtil.fadeIn(element,150,null,function() {
				util.AnimationUtil.fadeOut(element,150,null,null,null);
			},null);
		},null);
	}
	,flashLines: function(lines) {
		var _g = 0;
		while(_g < lines.length) {
			var lineIndex = lines[_g];
			++_g;
			this.flash(this.rows[lineIndex]);
		}
	}
	,removeTopRows: function(numRows) {
		var _g = 0;
		while(_g < numRows) {
			var i = _g++;
			this.board.removeChild(this.rows[0]);
			this.rows.splice(0,1);
		}
	}
	,addBottomRows: function(numLines) {
		var _g1 = this._modelHeight - numLines, _g = this._modelHeight;
		while(_g1 < _g) {
			var row = _g1++;
			var rowElement = this.getRowElement((row + numLines) * this._blockHeight);
			this.rows.push(rowElement);
			this.board.appendChild(rowElement);
			var _g3 = 0, _g2 = this._modelWidth;
			while(_g3 < _g2) {
				var column = _g3++;
				var color = this._boardModel.getCell(column,row);
				if(color != -1) {
					var block = new view.BlockView(column,row,color,this._blockWidth,this._blockHeight);
					block.getView().style.top = "0px";
					rowElement.appendChild(block.getView());
				}
			}
		}
	}
	,shiftUpRows: function(numLines) {
		var i = 0;
		var _g = 0, _g1 = this.rows;
		while(_g < _g1.length) {
			var row = [_g1[_g]];
			++_g;
			var rowPosition = [new util.Point(0,i * this._blockHeight)];
			util.AnimationUtil.move(row[0],500,rowPosition[0],feffects.easing.Expo.easeInOut,(function(rowPosition,row) {
				return function() {
					row[0].style.top = Std.string(rowPosition[0].y | 0) + "px";
				};
			})(rowPosition,row));
			i++;
		}
	}
	,addBottomLines: function(numLines) {
		if(this.currentLinesBeingRemoved != null) this.removeLinesInner();
		this.removeTopRows(numLines);
		this.addBottomRows(numLines);
		this.shiftUpRows(numLines);
	}
	,addShape: function(shape) {
		this.shapeView = new view.ShapeView(shape,this._blockWidth,this._blockHeight);
		this.board.appendChild(this.shapeView.getView());
		this.lastRotation = 0;
	}
	,removeShape: function() {
		if(this.shapeView != null) {
			this.board.removeChild(this.shapeView.getView());
			this.shapeView = null;
		}
	}
	,moveShape: function(shape) {
		this.shapeView.getView().style.left = Std.string(shape.x * this._blockWidth) + "px";
		this.shapeView.getView().style.top = Std.string(shape.y * this._blockHeight) + "px";
		if(this.lastRotation != shape.getRotation()) {
			this.removeShape();
			this.addShape(shape);
		}
		this.lastRotation = shape.getRotation();
	}
	,updateShape: function(shape) {
		if(this.previousShape != shape) {
			if(this.shapeView == null) {
				this.addShape(shape);
				this.previousShape = shape;
			} else if(this.shapeView != null && this.previousShape.y >= 0) {
				this.removeShape();
				this.addShape(shape);
				this.previousShape = shape;
			}
		} else this.moveShape(shape);
	}
	,getRowElement: function(rowTop) {
		var id = "row" + this.rowCounter++;
		var rowElement = view.DocElements.getNewElement("div",id);
		rowElement.style.left = Std.string(0) + "px";
		rowElement.style.top = Std.string(rowTop) + "px";
		return rowElement;
	}
	,rowCounter: null
	,addTopDivsToRows: function(divNum,pushDownRows) {
		if(pushDownRows == null) pushDownRows = true;
		var $it0 = new IntIter(0,divNum);
		while( $it0.hasNext() ) {
			var i = $it0.next();
			var rowIndex = pushDownRows?divNum - i - 1:i;
			var rowElement = this.getRowElement(rowIndex * this._blockHeight);
			if(pushDownRows) {
				this.rows.unshift(rowElement);
				this.board.insertBefore(rowElement,this.board.firstChild);
			} else {
				this.rows.push(rowElement);
				this.board.appendChild(rowElement);
			}
		}
	}
	,createBlocksArray: function() {
		this.rows = [];
		this.addTopDivsToRows(this._modelHeight,false);
	}
	,getView: function() {
		return this.board;
	}
	,boardLeft: null
	,_boardModel: null
	,shapeView: null
	,previousShape: null
	,rows: null
	,topCover: null
	,board: null
	,lastRotation: null
	,_blockHeight: null
	,_blockWidth: null
	,_modelHeight: null
	,_modelWidth: null
	,__class__: view.DomBoardView
}
view.HBox = $hxClasses["view.HBox"] = function(id,className,position) {
	if(position == null) position = "absolute";
	this._fixedHeight = 0;
	view.Box.call(this,id,className,position);
	this._align = view.Alignment.bottom;
};
view.HBox.__name__ = ["view","HBox"];
view.HBox.__super__ = view.Box;
view.HBox.prototype = $extend(view.Box.prototype,{
	setFixedHeight: function(value) {
		this._fixedHeight = value;
	}
	,calculateHeight: function() {
		var children = this.container.childNodes;
		var height = 0;
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var i = _g1++;
			height = Math.max(height,util.JSUtil.getHeight(children[i])) | 0;
		}
		return height;
	}
	,alignElement: function(element,x,boxHeight) {
		var y = (function($this) {
			var $r;
			switch( ($this._align)[1] ) {
			case 2:
				$r = $this.spacingY + ((boxHeight - util.JSUtil.getHeight(element)) / 2 | 0);
				break;
			case 4:
				$r = boxHeight - $this.spacingY - util.JSUtil.getHeight(element);
				break;
			case 3:
				$r = $this.spacingY;
				break;
			case 0:
				$r = null;
				break;
			case 1:
				$r = null;
				break;
			}
			return $r;
		}(this));
		element.style.left = Std.string(x) + "px";
		element.style.top = Std.string(y) + "px";
	}
	,doUpdate: function() {
		var lastY = this.spacingY;
		var lastX = this.spacingX;
		var children = this.container.childNodes;
		var width = 0;
		var height = this._fixedHeight > 0?this._fixedHeight:this.calculateHeight();
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = children[i];
			var inFixedChildren = Lambda.indexOf(this.fixedChildren,child) > -1;
			if(inFixedChildren) continue;
			this.alignElement(child,lastX,height + this.spacingY * 2);
			var childWidth = util.JSUtil.getWidth(child);
			lastX += this.padding + childWidth;
			width += childWidth + this.padding;
		}
		if(height > 0) height += this.padding;
		util.JSUtil.applyDimentions(this.container,width + this.spacingX * 2,height + this.spacingY * 2);
	}
	,_fixedHeight: null
	,__class__: view.HBox
});
view.InstructionsView = $hxClasses["view.InstructionsView"] = function(align,width,height) {
	this._alignment = align;
	this.createView(width,height);
};
view.InstructionsView.__name__ = ["view","InstructionsView"];
view.InstructionsView.prototype = {
	getView: function() {
		return this.container;
	}
	,gotoNextPage: function() {
		if(this.hasNextPage()) {
			this.switchBox.setIndex(this.switchBox.getIndex() + 1);
			this.pageIndicator.setIndex(this.switchBox.getIndex());
			if(this.switchBox.getIndex() == this.switchBox.getNumChildren() - 1) this.nextCloseSwitchBox.setIndex(1);
		}
	}
	,hasNextPage: function() {
		return this.switchBox.getIndex() < this.switchBox.getNumChildren() - 1;
	}
	,fitImage: function(image,width,height) {
		var imageWidth = util.JSUtil.getWidth(image);
		var imageHeight = util.JSUtil.getHeight(image);
		var imageRatio = imageWidth / imageHeight;
		var containerRatio = width / height;
		if(imageRatio < containerRatio) {
			var newWidth = height * imageRatio | 0;
			{
				image.style.width = Std.string(newWidth) + "px";
				image.style.height = Std.string(height) + "px";
			}
		} else {
			var newHeight = width / imageRatio | 0;
			{
				image.style.width = Std.string(width) + "px";
				image.style.height = Std.string(newHeight) + "px";
			}
		}
	}
	,getIconButton: function(iconInfo,name) {
		var iconContainer = new view.VBox(name + "IconContainer");
		iconContainer.setSpacing(10);
		iconContainer.getView().style.backgroundColor = "#" + StringTools.hex(6269427,6);
		var icon = iconInfo.createElement();
		iconContainer.add(icon);
		var iconHitArea = view.DocElements.getNewElement("div",name + "IconHitArea");
		{
			iconHitArea.style.width = Std.string(iconInfo.width + 20) + "px";
			iconHitArea.style.height = Std.string(20 + iconInfo.height) + "px";
		}
		iconContainer.addFixed(iconHitArea,0,0);
		return iconContainer.getView();
	}
	,createView: function(width,height) {
		this.container = new view.HBox("instructionsContainer","");
		this.switchBox = new view.SwitchBox("instructions","instructions");
		this.switchBox.setDimensions(width,height);
		this.switchBox.setHAlign(view.Alignment.center);
		util.JSUtil.setPosition(this.switchBox.getView(),0,0);
		var ratio = 1.0;
		var inst1 = new view.VBox("inst1");
		inst1.setAlign(view.Alignment.right);
		var image1 = new view.ImageInfo("resources/images_mdpi/tip_1_content.png",0,0,161,200).createElement();
		this.fitImage(image1,width * 0.8 | 0,height * 0.7 | 0);
		inst1.add(image1);
		var label1 = util.JSUtil.createTextView("","Tap anywhere to rotate shapes","20px",0,0,"h2");
		label1.style.width = Std.string(width * 0.9 | 0) + "px";
		inst1.add(label1);
		var inst2 = new view.VBox("inst2");
		inst2.setAlign(view.Alignment.center);
		var image2 = new view.ImageInfo("resources/images_mdpi/tip_2_content.png",0,0,136,200).createElement();
		this.fitImage(image2,width,height * 0.50 | 0);
		inst2.add(image2);
		var label2 = util.JSUtil.createTextView("","Meter on the right shows opponent's height","20px",0,0,"h2");
		label2.style.width = Std.string(width * 0.9 | 0) + "px";
		inst2.add(label2);
		var inst3 = new view.VBox("inst1");
		inst3.setAlign(view.Alignment.center);
		var image3 = new view.ImageInfo("resources/images_mdpi/tip_3_content.png",0,0,201,200).createElement();
		this.fitImage(image3,width,height * 0.50 | 0);
		inst3.add(image3);
		var label3 = util.JSUtil.createTextView("","Remove 2 or more lines to send lines to your opponent","20px",0,0,"h2");
		label3.style.width = Std.string(width * 0.9 | 0) + "px";
		inst3.add(label3);
		this.switchBox.addBox(inst1);
		this.switchBox.addBox(inst2);
		this.switchBox.addBox(inst3);
		this.switchBox.setIndex(0);
		this.container.addBox(this.switchBox);
		this.container.addFixed(this.getIconButton(new view.ImageInfo("resources/images_mdpi/close_btn.png",0,0,18,18),"close"),0,0);
		this.nextCloseSwitchBox = new view.SwitchBox("nextCloseSwitchBox","");
		this.nextCloseSwitchBox.setDimensions(38,38);
		this.nextCloseSwitchBox.add(this.getIconButton(new view.ImageInfo("resources/images_mdpi/next_btn.png",0,0,18,18),"next"));
		this.nextCloseSwitchBox.add(this.getIconButton(new view.ImageInfo("resources/images_mdpi/done_btn.png",0,0,18,18),"close"));
		this.container.addFixed(this.nextCloseSwitchBox.getView(),width - 18 - 20,0);
		this.pageIndicator = new view.PageIndicator("instructionPageIndicator",3);
		this.container.addBoxFixed(this.pageIndicator.getView(),(width - this.pageIndicator.getWidth()) / 2 | 0,height - 25);
	}
	,pageIndicator: null
	,_alignment: null
	,container: null
	,nextCloseSwitchBox: null
	,switchBox: null
	,__class__: view.InstructionsView
}
view.NextShapePreview = $hxClasses["view.NextShapePreview"] = function(width,height) {
	var doc = js.Lib.document;
	this._blockWidth = (width - 2) / 4 | 0;
	this._blockHeight = (height - 2) / 4 | 0;
	this.preview = doc.createElement("div");
	this.preview.id = "preview";
	this.preview.className = "preview circle";
	this.preview.style.position = "absolute";
	util.JSUtil.applyDimentions(this.preview,width,height);
};
view.NextShapePreview.__name__ = ["view","NextShapePreview"];
view.NextShapePreview.prototype = {
	getView: function() {
		return this.preview;
	}
	,centerShape: function() {
		var shape = this.shapeView.getView();
		var x = (util.JSUtil.getWidth(this.preview) - util.JSUtil.getWidth(shape)) / 2 | 0;
		var y = 2 + ((util.JSUtil.getHeight(this.preview) - util.JSUtil.getHeight(shape)) / 2 | 0);
		x += this._blockWidth * this.shapeView.getShapeOffset() | 0;
		shape.style.left = Std.string(x) + "px";
		shape.style.top = Std.string(y) + "px";
	}
	,updateShape: function(shape) {
		if(this.shapeView != null) this.preview.removeChild(this.shapeView.getView());
		this.shapeView = new view.ShapeView(shape,this._blockWidth - 2,this._blockHeight - 2);
		this.preview.appendChild(this.shapeView.getView());
		this.centerShape();
	}
	,shapeView: null
	,preview: null
	,_blockHeight: null
	,_blockWidth: null
	,__class__: view.NextShapePreview
}
view.PageIndicator = $hxClasses["view.PageIndicator"] = function(id,numPages) {
	this.currentIndex = 0;
	this.container = new view.HBox(id,"");
	this.container.setAlign(view.Alignment.top);
	this.container.setPadding(5);
	this.indicators = [];
	var _g = 0;
	while(_g < numPages) {
		var i = _g++;
		var indicator = new view.PageDot();
		this.indicators.push(indicator);
		this.container.addBox(indicator.getBox());
	}
	this.indicators[0].setState(1);
};
view.PageIndicator.__name__ = ["view","PageIndicator"];
view.PageIndicator.prototype = {
	getView: function() {
		return this.container;
	}
	,getWidth: function() {
		return new view.ImageInfo("resources/images_mdpi/empty_circle.png",0,0,10,10).width * this.indicators.length + 5 * this.indicators.length - 1;
	}
	,setIndex: function(index) {
		if(index == this.currentIndex || index >= this.indicators.length || index < 0) return;
		this.indicators[this.currentIndex].setState(0);
		this.indicators[index].setState(1);
		this.currentIndex = index;
	}
	,currentIndex: null
	,indicators: null
	,container: null
	,__class__: view.PageIndicator
}
view.PageDot = $hxClasses["view.PageDot"] = function() {
	this.container = new view.SwitchBox("pageDot","");
	this.container.add(new view.ImageInfo("resources/images_mdpi/empty_circle.png",0,0,10,10).createElement());
	this.container.add(new view.ImageInfo("resources/images_mdpi/full_circle.png",0,0,10,10).createElement());
	this.container.setDimensions(new view.ImageInfo("resources/images_mdpi/empty_circle.png",0,0,10,10).width,new view.ImageInfo("resources/images_mdpi/empty_circle.png",0,0,10,10).height);
};
view.PageDot.__name__ = ["view","PageDot"];
view.PageDot.prototype = {
	getBox: function() {
		return this.container;
	}
	,setState: function(state) {
		this.container.setIndex(state);
	}
	,container: null
	,__class__: view.PageDot
}
view.PanelView = $hxClasses["view.PanelView"] = function(layout,leftLayout,preview) {
	this._layout = layout;
	this._leftLayout = leftLayout;
	this._preview = preview;
	this.doc = js.Lib.document;
	this.jquery = new js.JQuery("#" + "mainContainer");
	this.rightContainer = new view.VBox("rightPanel","panel");
	this.rightContainer.setPadding(3);
	this.rightContainer.setSpacingY(3);
	this.rightContainer.setAlign(view.Alignment.center);
	js.Lib.document.getElementById("mainContainer").appendChild(this.rightContainer.getView());
	layout.applyToElement(this.rightContainer.getView());
	this.rightContainer.setFixedWidth(this._layout.width);
	this.leftContainer = new view.VBox("leftPanel","panel");
	this.leftContainer.setPadding(3);
	this.leftContainer.setSpacingY(12);
	this.leftContainer.setAlign(view.Alignment.center);
	js.Lib.document.getElementById("mainContainer").appendChild(this.leftContainer.getView());
	leftLayout.applyToElement(this.leftContainer.getView());
	this.leftContainer.setFixedWidth(this._leftLayout.width);
	this.createElements();
	this.addListeners();
};
view.PanelView.__name__ = ["view","PanelView"];
view.PanelView.prototype = {
	touchCallback: function(event) {
		switch(event.target.id) {
		case "pause" + "Hit":
			this.pauseCallback();
			break;
		}
	}
	,removeListeners: function() {
		if("ontouchstart" in window) util.JSUtil.removeEventListener(js.Lib.document.getElementById("mainContainer"),"touchend",this.touchCallbackRef); else util.JSUtil.removeEventListener(js.Lib.document.body,"click",this.touchCallbackRef);
	}
	,addListeners: function() {
		this.touchCallbackRef = $bind(this,this.touchCallback);
		if("ontouchstart" in window) util.JSUtil.addEventListener(js.Lib.document.body,"touchend",this.touchCallbackRef); else util.JSUtil.addEventListener(js.Lib.document.body,"click",this.touchCallbackRef);
	}
	,resetWithLevel: function(initLevel) {
		this.setLines(0);
		this.setPoints(0);
		this.setLevel(initLevel);
	}
	,getView: function() {
		return this.rightContainer.getView();
	}
	,setOpponentPoints: function(value) {
		this.opponentPoints.innerHTML = Std.string(value);
	}
	,setPoints: function(value) {
		this.points.innerHTML = Std.string(value);
	}
	,setLevel: function(level) {
		this.level.innerHTML = Std.string(level);
	}
	,setLines: function(lines) {
		this.lines.innerHTML = Std.string(lines);
	}
	,setState: function(gameState) {
		this.setLines(gameState.getLines());
		this.setLevel(gameState.getLevel());
		this.setPoints(gameState.getPoints());
	}
	,getOpponentPointsIndicator: function(width) {
		var vbox = new view.VBox("","");
		vbox.setAlign(view.Alignment.center);
		vbox.setPadding(-15);
		this.opponentPoints = util.JSUtil.createTextView("opponentPoints","0","26px",0,0,"h3");
		var opponentPointsLabel = util.JSUtil.createTextView("opponentPointsLabel","friends\npoints","15px",0,0,"h3");
		util.JSUtil.applyDimentions(this.opponentPoints,width,width);
		opponentPointsLabel.style.width = Std.string(this._layout.width) + "px";
		vbox.add(this.opponentPoints);
		vbox.add(opponentPointsLabel);
		return vbox;
	}
	,getLevelIndicator: function(width) {
		var vbox = new view.VBox("","");
		vbox.setAlign(view.Alignment.center);
		vbox.setPadding(-15);
		this.level = util.JSUtil.createTextView("level","0","30px",0,0,"h3");
		var levelLabel = util.JSUtil.createTextView("levelLabel","level","15px",0,0,"h3");
		util.JSUtil.applyDimentions(this.level,width,width);
		levelLabel.style.width = Std.string(this._layout.width) + "px";
		vbox.add(this.level);
		vbox.add(levelLabel);
		return vbox;
	}
	,getPointsIndicator: function(width) {
		var vbox = new view.VBox("","");
		vbox.setAlign(view.Alignment.center);
		vbox.setPadding(-15);
		this.points = util.JSUtil.createTextView("points","0","26px",0,0,"h3");
		var pointsLabel = util.JSUtil.createTextView("pointsLabel","your\npoints","15px",0,0,"h3");
		util.JSUtil.applyDimentions(this.points,width,width);
		pointsLabel.style.width = Std.string(this._layout.width) + "px";
		vbox.add(this.points);
		vbox.add(pointsLabel);
		return vbox;
	}
	,getLinesIndicator: function(width) {
		var vbox = new view.VBox("","");
		vbox.setAlign(view.Alignment.center);
		vbox.setPadding(-15);
		this.lines = util.JSUtil.createTextView("lines","0","30px",0,0,"h3");
		var linesLabel = util.JSUtil.createTextView("linesLabel","lines","15px",0,0,"h3");
		util.JSUtil.applyDimentions(this.lines,width,width);
		linesLabel.style.width = Std.string(this._layout.width) + "px";
		vbox.add(this.lines);
		vbox.add(linesLabel);
		return vbox;
	}
	,createElements: function() {
		var lastX = 0;
		var buttonSize = this._layout.width;
		this.pointsFontSize = Std.string(buttonSize - 5) + "px";
		this.leftContainer.add(this._preview.getView());
		lastX += buttonSize;
		this.pauseButton = util.JSUtil.createRoundButton("pause",new view.Layout(lastX,0,buttonSize,buttonSize),new view.ImageInfo("resources/images_mdpi/pause_btn.png",0,0,13,18));
		this.leftContainer.add(this.pauseButton);
		this.rightContainer.addBox(this.getPointsIndicator(buttonSize));
		this.rightContainer.addBox(this.getLinesIndicator(buttonSize));
		this.rightContainer.addBox(this.getLevelIndicator(buttonSize));
		this.rightContainer.addBox(this.getOpponentPointsIndicator(buttonSize));
	}
	,pointsFontSize: null
	,jquery: null
	,_leftLayout: null
	,_layout: null
	,_preview: null
	,pauseButton: null
	,doc: null
	,opponentPoints: null
	,points: null
	,level: null
	,lines: null
	,leftContainer: null
	,rightContainer: null
	,touchCallbackRef: null
	,pauseCallback: null
	,__class__: view.PanelView
}
view.ScreenLayouter = $hxClasses["view.ScreenLayouter"] = function(boardAspectRatio,modelWidth,modelHeight) {
	this.winH = 0;
	this.winW = 0;
	this.doc = js.Lib.document;
	this.window = js.Lib.window;
	this.boardAspectRatio = boardAspectRatio;
	this._modelWidth = modelWidth;
	this._modelHeight = modelHeight;
	this.winW = Math.max(this.winW,this.window.innerWidth | 0);
	this.winH = Math.max(this.winH,this.window.innerHeight | 0);
	this.screenLayout = new view.Layout(0,0,this.winW | 0,this.winH | 0);
	this.createBoardLayout();
	this.createNotificationLayout();
	this.createOpponentMeterLayout();
	this.createPanelLayout();
	this.createLeftPanelLayout();
	this.createControlsLayout();
	this.createBackgroundLayout();
	this.createMenuLayout();
};
view.ScreenLayouter.__name__ = ["view","ScreenLayouter"];
view.ScreenLayouter.prototype = {
	createBackgroundLayout: function() {
		this.backgroundLayout = new view.Layout(0,0,this.winW | 0,this.winH | 0);
	}
	,createControlsLayout: function() {
		var height = new view.ImageInfo("resources/images_mdpi/clouds_btns.png",0,0,320,60).height;
		this.controlsLayout = new view.Layout(0,this.screenLayout.height - height,this.screenLayout.width,height);
	}
	,createNotificationLayout: function() {
		this.notificationLayout = this.boardLayout.clone();
		this.notificationLayout.height = 30;
	}
	,createPanelLayout: function() {
		this.panelLayout = new view.Layout(this.boardLayout.getRight() + 6 + 3,this.boardLayout.y,50,this.boardLayout.height);
	}
	,createLeftPanelLayout: function() {
		this.leftPanelLayout = new view.Layout(this.boardLayout.x - 50 - 3,0,50,this.boardLayout.getBottom());
	}
	,roundToFitHeightBlocks: function(value) {
		return Math.round(value / this._modelHeight) * this._modelHeight;
	}
	,roundToFitWidthBlocks: function(value) {
		return Math.round(value / this._modelWidth) * this._modelWidth;
	}
	,createBoardLayout: function() {
		var height = 0;
		var width = 0;
		height = this.winH - new view.ImageInfo("resources/images_mdpi/clouds_btns.png",0,0,320,60).height + 6 | 0;
		width = height * this.boardAspectRatio | 0;
		if(width + 112 > this.winW) {
			width = this.winW - 112 | 0;
			height = width / this.boardAspectRatio | 0;
		}
		var x = this.winW / 2 - width / 2 | 0;
		this.boardLayout = new view.Layout(x,0,this.roundToFitWidthBlocks(width),this.roundToFitHeightBlocks(height));
	}
	,createMenuLayout: function() {
		this.menuLayout = new view.Layout(0,0,this.winW | 0,this.winH | 0);
	}
	,createOpponentMeterLayout: function() {
		this.opponentMeterLayout = new view.Layout(this.boardLayout.getRight() + 3,this.boardLayout.y,6,this.boardLayout.height);
	}
	,canvas: null
	,notificationLayout: null
	,screenLayout: null
	,backgroundLayout: null
	,leftPanelLayout: null
	,panelLayout: null
	,opponentMeterLayout: null
	,controlsLayout: null
	,boardLayout: null
	,menuLayout: null
	,_modelHeight: null
	,_modelWidth: null
	,winH: null
	,winW: null
	,window: null
	,doc: null
	,boardAspectRatio: null
	,__class__: view.ScreenLayouter
}
view.Layout = $hxClasses["view.Layout"] = function(x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
view.Layout.__name__ = ["view","Layout"];
view.Layout.prototype = {
	clone: function() {
		return new view.Layout(this.x,this.y,this.width,this.height);
	}
	,applyToElement: function(element) {
		element.style.left = Std.string(this.x) + "px";
		element.style.top = Std.string(this.y) + "px";
		{
			element.style.width = Std.string(this.width) + "px";
			element.style.height = Std.string(this.height) + "px";
		}
	}
	,expand: function(horizontal,vertical) {
		var newLayout = this.clone();
		newLayout.x -= horizontal / 2 | 0;
		newLayout.width += horizontal;
		newLayout.y -= vertical / 2 | 0;
		newLayout.height += vertical;
		return newLayout;
	}
	,intersection: function(other) {
		var newLayout = new view.Layout();
		newLayout.x = Math.max(this.x,other.x) | 0;
		newLayout.y = Math.max(this.y,other.y) | 0;
		newLayout.width = Math.min(this.getRight(),other.getRight()) - newLayout.x | 0;
		newLayout.height = Math.min(this.getBottom(),other.getBottom()) - newLayout.y | 0;
		return newLayout;
	}
	,inRect: function(point) {
		return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height;
	}
	,getBottom: function() {
		return this.y + this.height;
	}
	,getRight: function() {
		return this.x + this.width;
	}
	,draw: function(canvas) {
		var ctx = canvas.getContext("2d");
		ctx.strokeStyle = "#f00";
		ctx.strokeRect(this.x,this.y,this.width,this.height);
	}
	,toString: function() {
		return "[ xy: " + this.x + ", " + this.y + ", wh: " + this.width + ", " + this.height + "]";
	}
	,height: null
	,width: null
	,y: null
	,x: null
	,__class__: view.Layout
}
view.ShapeView = $hxClasses["view.ShapeView"] = function(shape,blockWidth,blockHeight) {
	this.doc = js.Lib.document;
	this.shapeData = shape.shapeData;
	this.blocks = [];
	this._blockWidth = blockWidth;
	this._blockHeight = blockHeight;
	var _g1 = 0, _g = shape.getHeight();
	while(_g1 < _g) {
		var row = _g1++;
		this.blocks.push([]);
	}
	this.createShape(shape);
};
view.ShapeView.__name__ = ["view","ShapeView"];
view.ShapeView.prototype = {
	getShapeOffset: function() {
		return this.shapeData.offset;
	}
	,getModel: function() {
		return this._model;
	}
	,getHeight: function() {
		return Std.parseInt(this.container.style.height);
	}
	,getWidth: function() {
		return Std.parseInt(this.container.style.width);
	}
	,getModelWidth: function() {
		return this.blocks[0].length;
	}
	,setBlockOffset: function(blockView) {
		if(blockView != null) {
			var block = blockView.getView();
			var blockLeft = Std.parseInt(block.style.left);
			var containerLeft = Std.parseInt(this.container.style.left);
			block.style.left = Std.string(containerLeft + blockLeft) + "px";
			block.style.top = "0px";
		}
	}
	,getBlocksPerRow: function() {
		var _g = 0, _g1 = this.blocks;
		while(_g < _g1.length) {
			var row = _g1[_g];
			++_g;
			var _g2 = 0;
			while(_g2 < row.length) {
				var block = row[_g2];
				++_g2;
				this.setBlockOffset(block);
			}
		}
		return this.blocks;
	}
	,getView: function() {
		return this.container;
	}
	,addBlock: function(x,y,color) {
		var block = null;
		if(color != -1) {
			block = new view.BlockView(x,y,color,this._blockWidth,this._blockHeight);
			this.container.appendChild(block.getView());
		}
		return block;
	}
	,createShape: function(shape) {
		var bits = shape.getBits();
		var w = bits.length;
		var h = bits[0].length;
		this.container = this.doc.createElement("div");
		this.container.id = "shape";
		this.container.style.position = "absolute";
		this.container.style.left = Std.string(shape.x * this._blockWidth) + "px";
		this.container.style.top = Std.string(shape.y * this._blockHeight) + "px";
		this.container.style.width = Std.string(shape.getWidth() * this._blockWidth) + "px";
		this.container.style.height = Std.string(shape.getHeight() * this._blockHeight) + "px";
		var _g = 0;
		while(_g < h) {
			var y = _g++;
			var _g1 = 0;
			while(_g1 < w) {
				var x = _g1++;
				this.blocks[y].push(this.addBlock(x,y,bits[x][y]));
			}
		}
	}
	,shapeData: null
	,_model: null
	,_blockHeight: null
	,_blockWidth: null
	,container: null
	,doc: null
	,blocks: null
	,__class__: view.ShapeView
}
view.Spacer = $hxClasses["view.Spacer"] = function(width,height) {
	this.container = view.DocElements.getNewElement("div","spacer");
	util.JSUtil.applyDimentions(this.container,width,height);
};
view.Spacer.__name__ = ["view","Spacer"];
view.Spacer.prototype = {
	getView: function() {
		return this.container;
	}
	,container: null
	,__class__: view.Spacer
}
view.SplashScreen = $hxClasses["view.SplashScreen"] = function(layout) {
	view.Assets.preload([new view.ImageInfo("resources/images_mdpi/tip_1_content.png",0,0,161,200),new view.ImageInfo("resources/images_mdpi/tip_2_content.png",0,0,136,200),new view.ImageInfo("resources/images_mdpi/tip_3_content.png",0,0,201,200)]);
	this.container = new view.VBox("splash","splashScreen");
	this.container.setFixedWidth(layout.width);
	var innerContainer = new view.HBox("innerSplash","splashScreen");
	innerContainer.setFixedHeight(layout.height);
	this.container.setAlign(view.Alignment.center);
	innerContainer.setAlign(view.Alignment.center);
	layout.applyToElement(innerContainer.getView());
	layout.applyToElement(this.container.getView());
	var logo = new view.ImageInfo("resources/images_mdpi/sky_tumble_logo.png",0,0,162,92).createElement();
	innerContainer.add(logo);
	this.container.addBox(innerContainer);
};
view.SplashScreen.__name__ = ["view","SplashScreen"];
view.SplashScreen.prototype = {
	close: function() {
		var _g = this;
		new js.JQuery("#" + "splashContainer").animate({ opacity : 0.0},1,function() {
			js.Lib.document.body.removeChild(js.Lib.document.getElementById("splashContainer"));
			_g.container = null;
		});
	}
	,show: function() {
		js.Lib.document.getElementById("splashContainer").appendChild(this.container.getView());
	}
	,container: null
	,__class__: view.SplashScreen
}
view.StringBoardView = $hxClasses["view.StringBoardView"] = function(boardModel,modelWidth,modelHeight,blockWidth,blockHeight) {
	this.doc = js.Lib.document;
	this._boardModel = boardModel;
	this._modelWidth = modelWidth;
	this._modelHeight = modelHeight;
	this.board = this.doc.createElement("textarea");
	this.board.setAttribute("id","textBoard");
	this.boardContainer = this.doc.getElementById("mainContainer");
	this.boardContainer.appendChild(this.board);
	this.board.cols = modelWidth;
	this.board.rows = modelHeight;
	this.board.style.fontFamily = "courier";
	this.boardContainer.style.width = this.board.style.width;
	this.boardContainer.style.height = this.board.style.width;
};
view.StringBoardView.__name__ = ["view","StringBoardView"];
view.StringBoardView.__interfaces__ = [view.BoardView];
view.StringBoardView.prototype = {
	getWidth: function() {
		return Std.parseInt(this.board.style.width);
	}
	,clear: function() {
		this.updateAllBoard();
	}
	,updateAllBoard: function() {
		this.update(null);
	}
	,removeLines: function(removedLines) {
		this.update(null);
	}
	,addBottomLines: function(numLines) {
	}
	,updateShape: function(shape) {
		this.update(null);
	}
	,getView: function() {
		return this.boardContainer;
	}
	,update: function(shape) {
		this.board.value = this._boardModel.toString(false);
	}
	,doc: null
	,boardContainer: null
	,board: null
	,_modelHeight: null
	,_modelWidth: null
	,_boardModel: null
	,__class__: view.StringBoardView
}
view.SwitchBox = $hxClasses["view.SwitchBox"] = function(id,className,position) {
	if(position == null) position = "absolute";
	this.currentIndex = -1;
	view.Box.call(this,id,className,position);
	this.children = [];
	this._align = view.Alignment.center;
	this._valign = view.Alignment.center;
};
view.SwitchBox.__name__ = ["view","SwitchBox"];
view.SwitchBox.__super__ = view.Box;
view.SwitchBox.prototype = $extend(view.Box.prototype,{
	getNumChildren: function() {
		return this.children.length;
	}
	,remove: function(child) {
		HxOverrides.remove(this.children,child);
		this.container.removeChild(child);
	}
	,getIndex: function() {
		return this.currentIndex;
	}
	,setIndex: function(index) {
		if(index != this.currentIndex) {
			this.children[this.currentIndex].style.visibility = "hidden";
			this.children[index].style.visibility = "visible";
			this.currentIndex = index;
			util.JSUtil.applyDimentions(this.container,this._width,util.JSUtil.getHeight(this.children[index]));
			this.alignElement(this.children[index],this._width,0);
		}
	}
	,alignElement: function(element,boxWidth,y) {
		var x = (function($this) {
			var $r;
			switch( ($this._valign)[1] ) {
			case 0:
				$r = $this.spacingX;
				break;
			case 2:
				$r = $this.spacingX + ((boxWidth - util.JSUtil.getWidth(element)) / 2 | 0);
				break;
			case 4:
				$r = null;
				break;
			case 1:
				$r = null;
				break;
			case 3:
				$r = null;
				break;
			}
			return $r;
		}(this));
		element.style.left = Std.string(x) + "px";
		element.style.top = Std.string(y) + "px";
	}
	,doUpdate: function() {
		this.alignElement(this.children[this.currentIndex],this._width,0);
	}
	,add: function(child) {
		var firstChild = this.children.length == 0;
		var h = 1;
		if(firstChild) {
			this.currentIndex = 0;
			h = util.JSUtil.getHeight(child);
		}
		child.style.visibility = "hidden";
		this.children.push(child);
		this.container.appendChild(child);
		util.JSUtil.applyDimentions(this.container,this._width,h);
		child.style.visibility = firstChild?"visible":"hidden";
	}
	,setDimensions: function(width,height) {
		this._width = width;
		this._height = height;
		util.JSUtil.applyDimentions(this.container,width,height);
	}
	,_height: null
	,_width: null
	,currentIndex: null
	,children: null
	,__class__: view.SwitchBox
});
view.VBox = $hxClasses["view.VBox"] = function(id,className,align,position) {
	if(position == null) position = "absolute";
	if(className == null) className = "";
	this._fixedHeight = 0;
	this._fixedWidth = 0;
	view.Box.call(this,id,className,position);
	this._align = align == null?view.Alignment.left:align;
};
view.VBox.__name__ = ["view","VBox"];
view.VBox.__super__ = view.Box;
view.VBox.prototype = $extend(view.Box.prototype,{
	setFixedHeight: function(value) {
		this._fixedHeight = value;
	}
	,setFixedWidth: function(value) {
		this._fixedWidth = value;
	}
	,alignElement: function(element,boxWidth,y) {
		var x = (function($this) {
			var $r;
			switch( ($this._align)[1] ) {
			case 0:
				$r = $this.spacingX;
				break;
			case 1:
				$r = boxWidth - util.JSUtil.getWidth(element) - $this.spacingX;
				break;
			case 2:
				$r = $this.spacingX + ((boxWidth - util.JSUtil.getWidth(element)) / 2 | 0);
				break;
			case 4:
				$r = null;
				break;
			case 3:
				$r = null;
				break;
			}
			return $r;
		}(this));
		element.style.left = Std.string(x) + "px";
		element.style.top = Std.string(y) + "px";
	}
	,doUpdate: function() {
		var children = this.container.childNodes;
		var lastY = this.spacingY;
		if(this._fixedHeight > 0 && this._valign == view.Alignment.center) lastY = (this._fixedHeight - (util.JSUtil.sumChildrenHeight(this.container) + (children.length - 1) * this.padding)) / 2 | 0;
		var lastX = this.spacingX;
		var width = this._fixedWidth > 0?this._fixedWidth:util.JSUtil.getMaxWidth(this.container,this.fixedChildren) + this.spacingX;
		var height = 0;
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = children[i];
			var inFixedChildren = Lambda.indexOf(this.fixedChildren,child) > -1;
			if(inFixedChildren) continue;
			this.alignElement(child,width,lastY);
			var childHeight = util.JSUtil.getHeight(child);
			lastY += this.padding + childHeight;
			height += childHeight + this.padding;
		}
		if(height > 0) height -= this.padding;
		util.JSUtil.applyDimentions(this.container,this._fixedWidth > 0?this._fixedWidth:width + this.spacingX,this._fixedHeight > 0?this._fixedHeight:height + this.spacingY * 2);
	}
	,_fixedHeight: null
	,_fixedWidth: null
	,__class__: view.VBox
});
if(!view.menu) view.menu = {}
view.menu.Menu = $hxClasses["view.menu.Menu"] = function(popupLayout) {
	this.removed = false;
	this.menuHeight = 300;
	this.menuWidth = 200;
	this._visible = false;
	this._popupLayout = popupLayout;
	var buttonWidth = popupLayout.width * 0.70 | 0;
	var buttonLeft = (popupLayout.width - buttonWidth) * 0.5 | 0;
	this._buttonLayout = new view.Layout(buttonLeft,0,buttonWidth,41);
	this.createMenu();
	this.addListeners();
};
view.menu.Menu.__name__ = ["view","menu","Menu"];
view.menu.Menu.prototype = {
	addedToDom: function() {
		this.outerContainer.update();
	}
	,getView: function() {
		return this.outerContainer.getView();
	}
	,touchCallback: function(event) {
		event.preventDefault();
	}
	,removeListeners: function() {
		if("ontouchstart" in window) util.JSUtil.removeEventListener(js.Lib.document.body,"touchend",this.touchCallbackRef); else util.JSUtil.removeEventListener(js.Lib.document.body,"click",this.touchCallbackRef);
	}
	,addListeners: function() {
		this.touchCallbackRef = $bind(this,this.touchCallback);
		$("#menuContainer").bind("touchstart", function() { });;
		if("ontouchstart" in window) util.JSUtil.addEventListener(js.Lib.document.body,"touchend",this.touchCallbackRef); else util.JSUtil.addEventListener(js.Lib.document.body,"click",this.touchCallbackRef);
	}
	,finished: function() {
		this.menuTween = null;
		js.Lib.document.getElementById("mainContainer").removeChild(this.outerContainer.getView());
	}
	,close: function() {
		this.removeListeners();
		this.removed = true;
	}
	,addSeparator: function() {
		this.container.add(new view.ImageInfo("resources/images_mdpi/bottom_border.png",0,0,239,1).createElement());
	}
	,addSeparatorWithDots: function() {
		this.container.add(new view.ImageInfo("resources/images_mdpi/top_border.png",0,0,239,5).createElement());
	}
	,addLabel: function(caption,fontSize,labelStyle,fontColor) {
		if(fontColor == null) fontColor = -1;
		if(labelStyle == null) labelStyle = "h1";
		if(fontSize == null) fontSize = -1;
		if(fontSize == -1) fontSize = 30;
		var id = StringTools.replace(caption," ","_");
		var label = util.JSUtil.createTextView(id,caption,Std.string(fontSize) + "px",0,0,labelStyle);
		label.style.width = Std.string(this._buttonLayout.width) + "px";
		if(fontColor > -1) label.style.color = "#" + StringTools.hex(fontColor,6);
		return label;
	}
	,createMenu: function() {
		this.container = new view.VBox("menuContainer" + view.menu.Menu.menuCounter++,"menu");
		util.JSUtil.setPosition(this.container.getView(),this._popupLayout.x,this._popupLayout.y);
		this.container.setFixedWidth(this._popupLayout.width);
		this.container.setAlign(view.Alignment.center);
		this.container.setPadding(10);
		this.container.setSpacingY(30);
		this.outerContainer = new view.HBox("outerMenuContainer" + view.menu.Menu.menuCounter++,"");
		util.JSUtil.setPosition(this.outerContainer.getView(),this._popupLayout.x,this._popupLayout.y);
		this.outerContainer.setFixedHeight(this._popupLayout.height);
		this.outerContainer.setAlign(view.Alignment.top);
		this.outerContainer.addBox(this.container);
	}
	,_popupLayout: null
	,touchCallbackRef: null
	,removed: null
	,_buttonLayout: null
	,menuTween: null
	,menuTargetY: null
	,menuTargetX: null
	,menuHeight: null
	,menuWidth: null
	,_visible: null
	,outerContainer: null
	,container: null
	,__class__: view.menu.Menu
}
view.menu.EndMenu = $hxClasses["view.menu.EndMenu"] = function(backgroundLayout,message,yourPoints,otherName) {
	this._message = message;
	this._otherName = otherName;
	this._yourPoints = yourPoints;
	view.menu.Menu.call(this,backgroundLayout);
	this.createMenuItems();
};
view.menu.EndMenu.__name__ = ["view","menu","EndMenu"];
view.menu.EndMenu.__super__ = view.menu.Menu;
view.menu.EndMenu.prototype = $extend(view.menu.Menu.prototype,{
	touchCallback: function(event) {
		if(this.removed) return;
		switch(event.target.id) {
		case "gotoMainMenuButton" + "Hit":
			this.close();
			this.gotoMainMenu();
			break;
		case "shareButton" + "Hit":
			this.close();
			this.gotoShareMenu();
			break;
		}
	}
	,updateOtherPoints: function(otherPoints) {
		this.opponentInfoLabel.innerHTML = this.getOpponentInfo(otherPoints);
	}
	,getOpponentInfo: function(points) {
		return this._otherName + "'s score - " + Std.string(points) + " points";
	}
	,createMenuItems: function() {
		var messageLabel = this.addLabel(this._message,30,"h1");
		messageLabel.style.width = Std.string(this._buttonLayout.width) + "px";
		this.container.add(messageLabel);
		this.addSeparatorWithDots();
		this.container.add(this.addLabel("Scores",25,"h2"));
		var vbox = new view.VBox("","");
		var label = this.addLabel("Your score - " + this._yourPoints + " points",15,"h2");
		label.style.width = Std.string(this._popupLayout.width) + "px";
		vbox.add(label);
		this.container.addBox(vbox);
		vbox = new view.VBox("","");
		this.opponentInfoLabel = this.addLabel(this.getOpponentInfo(0),15,"h2");
		this.opponentInfoLabel.style.width = Std.string(this._popupLayout.width) + "px";
		vbox.add(this.opponentInfoLabel);
		this.container.addBox(vbox);
		this.addSeparator();
		this.gotoMainMenuButton = util.JSUtil.createButton("Play Again","gotoMainMenuButton",this._buttonLayout,"button greenButton",0,0,27,null);
		this.container.add(this.gotoMainMenuButton);
	}
	,_yourPoints: null
	,_otherName: null
	,_message: null
	,opponentInfoLabel: null
	,shareButton: null
	,gotoMainMenuButton: null
	,gotoShareMenu: null
	,gotoMainMenu: null
	,__class__: view.menu.EndMenu
});
view.menu.InstructionsMenu = $hxClasses["view.menu.InstructionsMenu"] = function(layout) {
	view.menu.Menu.call(this,layout);
	this.createView();
};
view.menu.InstructionsMenu.__name__ = ["view","menu","InstructionsMenu"];
view.menu.InstructionsMenu.__super__ = view.menu.Menu;
view.menu.InstructionsMenu.prototype = $extend(view.menu.Menu.prototype,{
	touchCallback: function(event) {
		var closePressed = event.target.id == "closeIconHitArea";
		if(this.instructionsView.hasNextPage() && !closePressed) this.instructionsView.gotoNextPage(); else this.closeCallback();
	}
	,createView: function() {
		this.instructionsView = new view.InstructionsView(view.Alignment.center,this._popupLayout.width,this._popupLayout.height);
		this.container.setVAlign(view.Alignment.top);
		this.container.setSpacingY(0);
		this.container.addBox(this.instructionsView.getView());
	}
	,instructionsView: null
	,closeCallback: null
	,__class__: view.menu.InstructionsMenu
});
view.menu.PauseMenu = $hxClasses["view.menu.PauseMenu"] = function(backgroundLayout) {
	view.menu.Menu.call(this,backgroundLayout);
	this.createMenuItems();
};
view.menu.PauseMenu.__name__ = ["view","menu","PauseMenu"];
view.menu.PauseMenu.__super__ = view.menu.Menu;
view.menu.PauseMenu.prototype = $extend(view.menu.Menu.prototype,{
	touchCallback: function(event) {
		if(this.removed) return;
		switch(event.target.id) {
		case "continueGameButton" + "Hit":
			this.close();
			this.continueGame();
			break;
		case "leaveGameButton" + "Hit":
			this.leaveGame();
			break;
		}
	}
	,createMenuItems: function() {
		this.container.add(this.addLabel("Game Paused",-1,"h1",1333097));
		var spacer = new view.Spacer(this._buttonLayout.width,this._buttonLayout.height);
		this.container.add(spacer.getView());
		this.continueGameButton = util.JSUtil.createButton("Resume","continueGameButton",this._buttonLayout,"button greenButton",0,0,27,null);
		this.container.add(this.continueGameButton);
		this.leaveGameButton = util.JSUtil.createButton("Quit Game","leaveGameButton",this._buttonLayout,"button redButton",0,0,27,null);
		this.container.add(this.leaveGameButton);
		this.outerContainer.setAlign(view.Alignment.center);
	}
	,leaveGameButton: null
	,continueGameButton: null
	,leaveGame: null
	,continueGame: null
	,__class__: view.menu.PauseMenu
});
view.menu.ShareMenu = $hxClasses["view.menu.ShareMenu"] = function(backgroundLayout) {
	view.menu.Menu.call(this,backgroundLayout);
	this.createMenuItems();
};
view.menu.ShareMenu.__name__ = ["view","menu","ShareMenu"];
view.menu.ShareMenu.__super__ = view.menu.Menu;
view.menu.ShareMenu.prototype = $extend(view.menu.Menu.prototype,{
	touchCallback: function(event) {
		if(this.removed) return;
		switch(event.target.id) {
		case "shareButton" + "Hit":
			this.close();
			this.shareCallback(this.shareTextArea.innerHTML);
			break;
		case "cancelButton" + "Hit":
			this.close();
			this.cancelCallback();
			break;
		}
	}
	,createMenuItems: function() {
		this.container.add(this.addLabel("Share the Fun"));
		this.shareTextArea = view.DocElements.getNewElement("textarea","shareTextArea","textArea");
		this.shareTextArea.innerHTML = "Share on facebook";
		util.JSUtil.applyDimentions(this.shareTextArea,this._buttonLayout.width,this._buttonLayout.height * 3);
		this.container.add(this.shareTextArea);
		this.shareButton = util.JSUtil.createButton("Share","shareButton",this._buttonLayout,"button greenButton",0,0,27,null);
		this.cancelButton = util.JSUtil.createButton("Cancel","cancelButton",this._buttonLayout,"button redButton",0,0,27,null);
		this.container.add(this.shareButton);
		this.container.add(this.cancelButton);
	}
	,shareTextArea: null
	,cancelButton: null
	,shareButton: null
	,cancelCallback: null
	,shareCallback: null
	,__class__: view.menu.ShareMenu
});
view.menu.StartMenu = $hxClasses["view.menu.StartMenu"] = function(layout,highScore) {
	this._highScore = 0;
	this.level = 1;
	view.menu.Menu.call(this,layout);
	this.createMenuItems(highScore);
};
view.menu.StartMenu.__name__ = ["view","menu","StartMenu"];
view.menu.StartMenu.__super__ = view.menu.Menu;
view.menu.StartMenu.prototype = $extend(view.menu.Menu.prototype,{
	touchCallback: function(event) {
		view.menu.Menu.prototype.touchCallback.call(this,event);
		switch(event.target.id) {
		case "startGameButton" + "Hit":
			this.startGame(this.level);
			break;
		case "instructionsButton" + "Hit":
			this.showInstructions();
			break;
		}
	}
	,updateHighScore: function(value) {
		this.highScoreLable.innerHTML = Std.string(Int);
	}
	,addHighScore: function(highScore) {
		var vbox = new view.VBox("highscorecontainer","");
		vbox.setAlign(view.Alignment.center);
		vbox.setSpacing(0);
		var yourHighScoreLable = util.JSUtil.createTextView("","Beat Your Best Score:","25px",0,0,"h2");
		yourHighScoreLable.style.opacity = 0.6;
		yourHighScoreLable.style.width = Std.string(this._popupLayout.width) + "px";
		vbox.add(yourHighScoreLable);
		var highScoreBox = new view.HBox("scorehbox","");
		highScoreBox.setPadding(5);
		highScoreBox.setAlign(view.Alignment.bottom);
		this.highScoreLable = util.JSUtil.createTextView("highScore",Std.string(highScore),"30px",0,0,"h2");
		highScoreBox.add(this.highScoreLable);
		var pointsText = highScore == 1?"point":"points";
		var pointsLabel = util.JSUtil.createTextView("points",pointsText,"30px",0,-7,"h2");
		highScoreBox.add(pointsLabel);
		vbox.addBox(highScoreBox);
		this.container.addBox(vbox);
	}
	,createMenuItems: function(highScore) {
		this.addHighScore(highScore);
		this.addSeparatorWithDots();
		this.startGameButton = util.JSUtil.createButton("Lets Tumble","startGameButton",this._buttonLayout,"button greenButton",0,0,27,null);
		this.instructionsButton = util.JSUtil.createButton("Instructions","instructionsButton",this._buttonLayout,"button",0,0,27,null);
		this.instructionsButton.style.backgroundColor = "#" + StringTools.hex(16098056,6);
		this.container.add(this.startGameButton);
		this.container.add(this.instructionsButton);
		this.outerContainer.setAlign(view.Alignment.center);
	}
	,_highScore: null
	,level: null
	,highScoreLable: null
	,instructionsButton: null
	,startGameButton: null
	,showInstructions: null
	,startGame: null
	,__class__: view.menu.StartMenu
});
view.menu.WaitingForOpponentMenu = $hxClasses["view.menu.WaitingForOpponentMenu"] = function(layout) {
	this.animationIndex = 0;
	view.menu.Menu.call(this,layout);
	this.timer = new haxe.Timer(1000);
	this.addItems();
	this.timer.run = $bind(this,this.onTick);
};
view.menu.WaitingForOpponentMenu.__name__ = ["view","menu","WaitingForOpponentMenu"];
view.menu.WaitingForOpponentMenu.__super__ = view.menu.Menu;
view.menu.WaitingForOpponentMenu.prototype = $extend(view.menu.Menu.prototype,{
	getShapeData: function() {
		return new model.ShapeData([[-1,2],[5,4],[6,-1]],"#f45f76");
	}
	,addItems: function() {
		var halfBlock = 15;
		var label = this.addLabel("Waiting for opponent...");
		this.container.add(label);
		this.animation = new view.SwitchBox("animation","");
		var shapeData = this.getShapeData();
		this.animation.add(new view.ShapeView(new model.Shape(shapeData,3),30,30).getView());
		shapeData.model = controller.ShapeController.rotate(shapeData.model);
		this.animation.add(new view.ShapeView(new model.Shape(shapeData,3),30,30).getView());
		this.container.add(this.animation.getView());
		this.animation.getView().style.opacity = 0;
	}
	,onTick: function() {
		if(this.animationIndex > 0) this.animation.getView().style.opacity = 1;
		this.animation.setIndex(this.animationIndex % 2);
		this.animationIndex++;
	}
	,animationIndex: null
	,timer: null
	,animation: null
	,__class__: view.menu.WaitingForOpponentMenu
});
if(!view.notification) view.notification = {}
view.notification.Notification = $hxClasses["view.notification.Notification"] = function(layout,text,duration) {
	if(duration == null) duration = 3000;
	if(text == null) text = "";
	this.layout = layout;
	this.text = text;
	this.duration = duration;
	this.createView();
};
view.notification.Notification.__name__ = ["view","notification","Notification"];
view.notification.Notification.prototype = {
	getView: function() {
		return this.view;
	}
	,setText: function(text) {
		this.label.innerHTML = text;
	}
	,createView: function() {
		this.view = view.DocElements.getNewElement("div","notification","notification");
		this.layout.applyToElement(this.view);
		this.label = util.JSUtil.createTextView("notificationText",this.text,"12px",0,0,"h2");
		util.JSUtil.applyDimentions(this.label,this.layout.width,this.layout.height);
		this.view.appendChild(this.label);
	}
	,label: null
	,view: null
	,layout: null
	,duration: null
	,text: null
	,__class__: view.notification.Notification
}
view.notification.NotificationsController = $hxClasses["view.notification.NotificationsController"] = function(layout) {
	this.layout = layout;
	this.notification = new view.notification.Notification(layout);
};
view.notification.NotificationsController.__name__ = ["view","notification","NotificationsController"];
view.notification.NotificationsController.prototype = {
	removeNotificationFromParent: function() {
		if(this.notification.getView().parentNode != null) js.Lib.document.body.removeChild(this.notification.getView());
	}
	,removeNotification: function(animation) {
		if(animation == null) animation = true;
		if(this.notificationTimer != null) {
			this.notificationTimer.stop();
			this.notificationTimer = null;
		}
		if(this.notification == null) return;
		if(animation) {
			var endPosition = util.JSUtil.getPosition(this.notification.getView());
			var notificationHeight = util.JSUtil.getHeight(this.notification.getView());
			endPosition.y -= notificationHeight;
			util.AnimationUtil.move(this.notification.getView(),300,endPosition,null,$bind(this,this.removeNotificationFromParent));
		} else this.removeNotificationFromParent();
	}
	,showNotification: function(text) {
		var _g = this;
		if(this.notificationTimer != null) this.removeNotification(false);
		this.notification.setText(text);
		this.layout.applyToElement(this.notification.getView());
		var notificationHeight = util.JSUtil.getHeight(this.notification.getView());
		var endPosition = util.JSUtil.getPosition(this.notification.getView());
		this.notification.getView().style.top = Std.string((endPosition.y | 0) - notificationHeight) + "px";
		js.Lib.document.body.appendChild(this.notification.getView());
		util.AnimationUtil.move(this.notification.getView(),300,endPosition,null,null);
		this.notificationTimer = new haxe.Timer(4000);
		this.notificationTimer.run = function() {
			_g.removeNotification();
		};
	}
	,notificationTimer: null
	,layout: null
	,notification: null
	,__class__: view.notification.NotificationsController
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof(JSON) != "undefined") haxe.Json = JSON;
if(typeof($) == 'undefined') {
	/*! jQuery v1.6.4 http://jquery.com/ | http://jquery.org/license */
(function(a,b){function cu(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cr(a){if(!cg[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ch||(ch=c.createElement("iframe"),ch.frameBorder=ch.width=ch.height=0),b.appendChild(ch);if(!ci||!ch.createElement)ci=(ch.contentWindow||ch.contentDocument).document,ci.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),ci.close();d=ci.createElement(a),ci.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ch)}cg[a]=e}return cg[a]}function cq(a,b){var c={};f.each(cm.concat.apply([],cm.slice(0,b)),function(){c[this]=a});return c}function cp(){cn=b}function co(){setTimeout(cp,0);return cn=f.now()}function cf(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ce(){try{return new a.XMLHttpRequest}catch(b){}}function b$(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function bZ(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function bY(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bA.test(a)?d(a,e):bY(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)bY(a+"["+e+"]",b[e],c,d);else d(a,b)}function bX(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bW(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bP,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bW(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bW(a,c,d,e,"*",g));return l}function bV(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bL),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function by(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bt:bu;if(d>0){c!=="border"&&f.each(e,function(){c||(d-=parseFloat(f.css(a,"padding"+this))||0),c==="margin"?d+=parseFloat(f.css(a,c+this))||0:d-=parseFloat(f.css(a,"border"+this+"Width"))||0});return d+"px"}d=bv(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0,c&&f.each(e,function(){d+=parseFloat(f.css(a,"padding"+this))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+this+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+this))||0)});return d+"px"}function bl(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bd,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bk(a){f.nodeName(a,"input")?bj(a):"getElementsByTagName"in a&&f.grep(a.getElementsByTagName("input"),bj)}function bj(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bi(a){return"getElementsByTagName"in a?a.getElementsByTagName("*"):"querySelectorAll"in a?a.querySelectorAll("*"):[]}function bh(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bg(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c=f.expando,d=f.data(a),e=f.data(b,d);if(d=d[c]){var g=d.events;e=e[c]=f.extend({},d);if(g){delete e.handle,e.events={};for(var h in g)for(var i=0,j=g[h].length;i<j;i++)f.event.add(b,h+(g[h][i].namespace?".":"")+g[h][i].namespace,g[h][i],g[h][i].data)}}}}function bf(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function V(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(Q.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function U(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function M(a,b){return(a&&a!=="*"?a+".":"")+b.replace(y,"`").replace(z,"&")}function L(a){var b,c,d,e,g,h,i,j,k,l,m,n,o,p=[],q=[],r=f._data(this,"events");if(!(a.liveFired===this||!r||!r.live||a.target.disabled||a.button&&a.type==="click")){a.namespace&&(n=new RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)")),a.liveFired=this;var s=r.live.slice(0);for(i=0;i<s.length;i++)g=s[i],g.origType.replace(w,"")===a.type?q.push(g.selector):s.splice(i--,1);e=f(a.target).closest(q,a.currentTarget);for(j=0,k=e.length;j<k;j++){m=e[j];for(i=0;i<s.length;i++){g=s[i];if(m.selector===g.selector&&(!n||n.test(g.namespace))&&!m.elem.disabled){h=m.elem,d=null;if(g.preType==="mouseenter"||g.preType==="mouseleave")a.type=g.preType,d=f(a.relatedTarget).closest(g.selector)[0],d&&f.contains(h,d)&&(d=h);(!d||d!==h)&&p.push({elem:h,handleObj:g,level:m.level})}}}for(j=0,k=p.length;j<k;j++){e=p[j];if(c&&e.level>c)break;a.currentTarget=e.elem,a.data=e.handleObj.data,a.handleObj=e.handleObj,o=e.handleObj.origHandler.apply(e.elem,arguments);if(o===!1||a.isPropagationStopped()){c=e.level,o===!1&&(b=!1);if(a.isImmediatePropagationStopped())break}}return b}}function J(a,c,d){var e=f.extend({},d[0]);e.type=a,e.originalEvent={},e.liveFired=b,f.event.handle.call(c,e),e.isDefaultPrevented()&&d[0].preventDefault()}function D(){return!0}function C(){return!1}function m(a,c,d){var e=c+"defer",g=c+"queue",h=c+"mark",i=f.data(a,e,b,!0);i&&(d==="queue"||!f.data(a,g,b,!0))&&(d==="mark"||!f.data(a,h,b,!0))&&setTimeout(function(){!f.data(a,g,b,!0)&&!f.data(a,h,b,!0)&&(f.removeData(a,e,!0),i.resolve())},0)}function l(a){for(var b in a)if(b!=="toJSON")return!1;return!0}function k(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(j,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNaN(d)?i.test(d)?f.parseJSON(d):d:parseFloat(d)}catch(g){}f.data(a,c,d)}else d=b}return d}var c=a.document,d=a.navigator,e=a.location,f=function(){function K(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(K,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/\d/,n=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,o=/^[\],:{}\s]*$/,p=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,q=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,r=/(?:^|:|,)(?:\s*\[)+/g,s=/(webkit)[ \/]([\w.]+)/,t=/(opera)(?:.*version)?[ \/]([\w.]+)/,u=/(msie) ([\w.]+)/,v=/(mozilla)(?:.*? rv:([\w.]+))?/,w=/-([a-z]|[0-9])/ig,x=/^-ms-/,y=function(a,b){return(b+"").toUpperCase()},z=d.userAgent,A,B,C,D=Object.prototype.toString,E=Object.prototype.hasOwnProperty,F=Array.prototype.push,G=Array.prototype.slice,H=String.prototype.trim,I=Array.prototype.indexOf,J={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=n.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.6.4",length:0,size:function(){return this.length},toArray:function(){return G.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?F.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),B.done(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(G.apply(this,arguments),"slice",G.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:F,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;B.resolveWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").unbind("ready")}},bindReady:function(){if(!B){B=e._Deferred();if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",C,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",C),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&K()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNaN:function(a){return a==null||!m.test(a)||isNaN(a)},type:function(a){return a==null?String(a):J[D.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!E.call(a,"constructor")&&!E.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||E.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(o.test(b.replace(p,"@").replace(q,"]").replace(r,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(x,"ms-").replace(w,y)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:H?function(a){return a==null?"":H.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?F.call(c,a):e.merge(c,a)}return c},inArray:function(a,b){if(!b)return-1;if(I)return I.call(b,a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=G.call(arguments,2),g=function(){return a.apply(c,f.concat(G.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=s.exec(a)||t.exec(a)||u.exec(a)||a.indexOf("compatible")<0&&v.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){J["[object "+b+"]"]=b.toLowerCase()}),A=e.uaMatch(z),A.browser&&(e.browser[A.browser]=!0,e.browser.version=A.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?C=function(){c.removeEventListener("DOMContentLoaded",C,!1),e.ready()}:c.attachEvent&&(C=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",C),e.ready())});return e}(),g="done fail isResolved isRejected promise then always pipe".split(" "),h=[].slice;f.extend({_Deferred:function(){var a=[],b,c,d,e={done:function(){if(!d){var c=arguments,g,h,i,j,k;b&&(k=b,b=0);for(g=0,h=c.length;g<h;g++)i=c[g],j=f.type(i),j==="array"?e.done.apply(e,i):j==="function"&&a.push(i);k&&e.resolveWith(k[0],k[1])}return this},resolveWith:function(e,f){if(!d&&!b&&!c){f=f||[],c=1;try{while(a[0])a.shift().apply(e,f)}finally{b=[e,f],c=0}}return this},resolve:function(){e.resolveWith(this,arguments);return this},isResolved:function(){return!!c||!!b},cancel:function(){d=1,a=[];return this}};return e},Deferred:function(a){var b=f._Deferred(),c=f._Deferred(),d;f.extend(b,{then:function(a,c){b.done(a).fail(c);return this},always:function(){return b.done.apply(b,arguments).fail.apply(this,arguments)},fail:c.done,rejectWith:c.resolveWith,reject:c.resolve,isRejected:c.isResolved,pipe:function(a,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[c,"reject"]},function(a,c){var e=c[0],g=c[1],h;f.isFunction(e)?b[a](function(){h=e.apply(this,arguments),h&&f.isFunction(h.promise)?h.promise().then(d.resolve,d.reject):d[g+"With"](this===b?d:this,[h])}):b[a](d[g])})}).promise()},promise:function(a){if(a==null){if(d)return d;d=a={}}var c=g.length;while(c--)a[g[c]]=b[g[c]];return a}}),b.done(c.cancel).fail(b.cancel),delete b.cancel,a&&a.call(b,b);return b},when:function(a){function i(a){return function(c){b[a]=arguments.length>1?h.call(arguments,0):c,--e||g.resolveWith(g,h.call(b,0))}}var b=arguments,c=0,d=b.length,e=d,g=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred();if(d>1){for(;c<d;c++)b[c]&&f.isFunction(b[c].promise)?b[c].promise().then(i(c),g.reject):--e;e||g.resolveWith(g,b)}else g!==a&&g.resolveWith(g,d?[a]:[]);return g.promise()}}),f.support=function(){var a=c.createElement("div"),b=c.documentElement,d,e,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u;a.setAttribute("className","t"),a.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=a.getElementsByTagName("*"),e=a.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=a.getElementsByTagName("input")[0],k={leadingWhitespace:a.firstChild.nodeType===3,tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55$/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:a.className!=="t",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,k.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,k.optDisabled=!h.disabled;try{delete a.test}catch(v){k.deleteExpando=!1}!a.addEventListener&&a.attachEvent&&a.fireEvent&&(a.attachEvent("onclick",function(){k.noCloneEvent=!1}),a.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),k.radioValue=i.value==="t",i.setAttribute("checked","checked"),a.appendChild(i),l=c.createDocumentFragment(),l.appendChild(a.firstChild),k.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,a.innerHTML="",a.style.width=a.style.paddingLeft="1px",m=c.getElementsByTagName("body")[0],o=c.createElement(m?"div":"body"),p={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},m&&f.extend(p,{position:"absolute",left:"-1000px",top:"-1000px"});for(t in p)o.style[t]=p[t];o.appendChild(a),n=m||b,n.insertBefore(o,n.firstChild),k.appendChecked=i.checked,k.boxModel=a.offsetWidth===2,"zoom"in a.style&&(a.style.display="inline",a.style.zoom=1,k.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",k.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",q=a.getElementsByTagName("td"),u=q[0].offsetHeight===0,q[0].style.display="",q[1].style.display="none",k.reliableHiddenOffsets=u&&q[0].offsetHeight===0,a.innerHTML="",c.defaultView&&c.defaultView.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",a.appendChild(j),k.reliableMarginRight=(parseInt((c.defaultView.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0),o.innerHTML="",n.removeChild(o);if(a.attachEvent)for(t in{submit:1,change:1,focusin:1})s="on"+t,u=s in a,u||(a.setAttribute(s,"return;"),u=typeof a[s]=="function"),k[t+"Bubbles"]=u;o=l=g=h=m=j=a=i=null;return k}(),f.boxModel=f.support.boxModel;var i=/^(?:\{.*\}|\[.*\])$/,j=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!l(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i=f.expando,j=typeof c=="string",k=a.nodeType,l=k?f.cache:a,m=k?a[f.expando]:a[f.expando]&&f.expando;if((!m||e&&m&&l[m]&&!l[m][i])&&j&&d===b)return;m||(k?a[f.expando]=m=++f.uuid:m=f.expando),l[m]||(l[m]={},k||(l[m].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?l[m][i]=f.extend(l[m][i],c):l[m]=f.extend(l[m],c);g=l[m],e&&(g[i]||(g[i]={}),g=g[i]),d!==b&&(g[f.camelCase(c)]=d);if(c==="events"&&!g[c])return g[i]&&g[i].events;j?(h=g[c],h==null&&(h=g[f.camelCase(c)])):h=g;return h}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e=f.expando,g=a.nodeType,h=g?f.cache:a,i=g?a[f.expando]:f.expando;if(!h[i])return;if(b){d=c?h[i][e]:h[i];if(d){d[b]||(b=f.camelCase(b)),delete d[b];if(!l(d))return}}if(c){delete h[i][e];if(!l(h[i]))return}var j=h[i][e];f.support.deleteExpando||!h.setInterval?delete h[i]:h[i]=null,j?(h[i]={},g||(h[i].toJSON=f.noop),h[i][e]=j):g&&(f.support.deleteExpando?delete a[f.expando]:a.removeAttribute?a.removeAttribute(f.expando):a[f.expando]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d=null;if(typeof a=="undefined"){if(this.length){d=f.data(this[0]);if(this[0].nodeType===1){var e=this[0].attributes,g;for(var h=0,i=e.length;h<i;h++)g=e[h].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),k(this[0],g,d[g]))}}return d}if(typeof a=="object")return this.each(function(){f.data(this,a)});var j=a.split(".");j[1]=j[1]?"."+j[1]:"";if(c===b){d=this.triggerHandler("getData"+j[1]+"!",[j[0]]),d===b&&this.length&&(d=f.data(this[0],a),d=k(this[0],a,d));return d===b&&j[1]?this.data(j[0]):d}return this.each(function(){var b=f(this),d=[j[0],c];b.triggerHandler("setData"+j[1]+"!",d),f.data(this,a,c),b.triggerHandler("changeData"+j[1]+"!",d)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,c){a&&(c=(c||"fx")+"mark",f.data(a,c,(f.data(a,c,b,!0)||0)+1,!0))},_unmark:function(a,c,d){a!==!0&&(d=c,c=a,a=!1);if(c){d=d||"fx";var e=d+"mark",g=a?0:(f.data(c,e,b,!0)||1)-1;g?f.data(c,e,g,!0):(f.removeData(c,e,!0),m(c,d,"mark"))}},queue:function(a,c,d){if(a){c=(c||"fx")+"queue";var e=f.data(a,c,b,!0);d&&(!e||f.isArray(d)?e=f.data(a,c,f.makeArray(d),!0):e.push(d));return e||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e;d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),d.call(a,function(){f.dequeue(a,b)})),c.length||(f.removeData(a,b+"queue",!0),m(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(){var c=this;setTimeout(function(){f.dequeue(c,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f._Deferred(),!0))h++,l.done(m);m();return d.promise()}});var n=/[\n\t\r]/g,o=/\s+/,p=/\r/g,q=/^(?:button|input)$/i,r=/^(?:button|input|object|select|textarea)$/i,s=/^a(?:rea)?$/i,t=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,u,v;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(o);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(o);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(n," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(o);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ";for(var c=0,d=this.length;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(n," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e=this[0];if(!arguments.length){if(e){c=f.valHooks[e.nodeName.toLowerCase()]||f.valHooks[e.type];if(c&&"get"in c&&(d=c.get(e,"value"))!==b)return d;d=e.value;return typeof d=="string"?d.replace(p,""):d==null?"":d}return b}var g=f.isFunction(a);return this.each(function(d){var e=f(this),h;if(this.nodeType===1){g?h=a.call(this,d,e.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c=a.selectedIndex,d=[],e=a.options,g=a.type==="select-one";if(c<0)return null;for(var h=g?c:0,i=g?c+1:e.length;h<i;h++){var j=e[h];if(j.selected&&(f.support.optDisabled?!j.disabled:j.getAttribute("disabled")===null)&&(!j.parentNode.disabled||!f.nodeName(j.parentNode,"optgroup"))){b=f(j).val();if(g)return b;d.push(b)}}if(g&&!d.length&&e.length)return f(e[c]).val();return d},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attrFix:{tabindex:"tabIndex"},attr:function(a,c,d,e){var g=a.nodeType;if(!a||g===3||g===8||g===2)return b;if(e&&c in f.attrFn)return f(a)[c](d);if(!("getAttribute"in a))return f.prop(a,c,d);var h,i,j=g!==1||!f.isXMLDoc(a);j&&(c=f.attrFix[c]||c,i=f.attrHooks[c],i||(t.test(c)?i=v:u&&(i=u)));if(d!==b){if(d===null){f.removeAttr(a,c);return b}if(i&&"set"in i&&j&&(h=i.set(a,d,c))!==b)return h;a.setAttribute(c,""+d);return d}if(i&&"get"in i&&j&&(h=i.get(a,c))!==null)return h;h=a.getAttribute(c);return h===null?b:h},removeAttr:function(a,b){var c;a.nodeType===1&&(b=f.attrFix[b]||b,f.attr(a,b,""),a.removeAttribute(b),t.test(b)&&(c=f.propFix[b]||b)in a&&(a[c]=!1))},attrHooks:{type:{set:function(a,b){if(q.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(u&&f.nodeName(a,"button"))return u.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(u&&f.nodeName(a,"button"))return u.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e=a.nodeType;if(!a||e===3||e===8||e===2)return b;var g,h,i=e!==1||!f.isXMLDoc(a);i&&(c=f.propFix[c]||c,h=f.propHooks[c]);return d!==b?h&&"set"in h&&(g=h.set(a,d,c))!==b?g:a[c]=d:h&&"get"in h&&(g=h.get(a,c))!==null?g:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):r.test(a.nodeName)||s.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabIndex=f.propHooks.tabIndex,v={get:function(a,c){var d;return f.prop(a,c)===!0||(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},f.support.getSetAttribute||(u=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&d.nodeValue!==""?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})})),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var w=/\.(.*)$/,x=/^(?:textarea|input|select)$/i,y=/\./g,z=/ /g,A=/[^\w\s.|`]/g,B=function(a){return a.replace(A,"\\$&")};f.event={add:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){if(d===!1)d=C;else if(!d)return;var g,h;d.handler&&(g=d,d=g.handler),d.guid||(d.guid=f.guid++);var i=f._data(a);if(!i)return;var j=i.events,k=i.handle;j||(i.events=j={}),k||(i.handle=k=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.handle.apply(k.elem,arguments):b}),k.elem=a,c=c.split(" ");var l,m=0,n;while(l=c[m++]){h=g?f.extend({},g):{handler:d,data:e},l.indexOf(".")>-1?(n=l.split("."),l=n.shift(),h.namespace=n.slice(0).sort().join(".")):(n=[],h.namespace=""),h.type=l,h.guid||(h.guid=d.guid);var o=j[l],p=f.event.special[l]||{};if(!o){o=j[l]=[];if(!p.setup||p.setup.call(a,e,n,k)===!1)a.addEventListener?a.addEventListener(l,k,!1):a.attachEvent&&a.attachEvent("on"+l,k)}p.add&&(p.add.call(a,h),h.handler.guid||(h.handler.guid=d.guid)),o.push(h),f.event.global[l]=!0}a=null}},global:{},remove:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){d===!1&&(d=C);var g,h,i,j,k=0,l,m,n,o,p,q,r,s=f.hasData(a)&&f._data(a),t=s&&s.events;if(!s||!t)return;c&&c.type&&(d=c.handler,c=c.type);if(!c||typeof c=="string"&&c.charAt(0)==="."){c=c||"";for(h in t)f.event.remove(a,h+c);return}c=c.split(" ");while(h=c[k++]){r=h,q=null,l=h.indexOf(".")<0,m=[],l||(m=h.split("."),h=m.shift(),n=new RegExp("(^|\\.)"+f.map(m.slice(0).sort(),B).join("\\.(?:.*\\.)?")+"(\\.|$)")),p=t[h];if(!p)continue;if(!d){for(j=0;j<p.length;j++){q=p[j];if(l||n.test(q.namespace))f.event.remove(a,r,q.handler,j),p.splice(j--,1)}continue}o=f.event.special[h]||{};for(j=e||0;j<p.length;j++){q=p[j];if(d.guid===q.guid){if(l||n.test(q.namespace))e==null&&p.splice(j--,1),o.remove&&o.remove.call(a,q);if(e!=null)break}}if(p.length===0||e!=null&&p.length===1)(!o.teardown||o.teardown.call(a,m)===!1)&&f.removeEvent(a,h,s.handle),g=null,delete 
t[h]}if(f.isEmptyObject(t)){var u=s.handle;u&&(u.elem=null),delete s.events,delete s.handle,f.isEmptyObject(s)&&f.removeData(a,b,!0)}}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){var h=c.type||c,i=[],j;h.indexOf("!")>=0&&(h=h.slice(0,-1),j=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if(!!e&&!f.event.customEvent[h]||!!f.event.global[h]){c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.exclusive=j,c.namespace=i.join("."),c.namespace_re=new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)");if(g||!e)c.preventDefault(),c.stopPropagation();if(!e){f.each(f.cache,function(){var a=f.expando,b=this[a];b&&b.events&&b.events[h]&&f.event.trigger(c,d,b.handle.elem)});return}if(e.nodeType===3||e.nodeType===8)return;c.result=b,c.target=e,d=d!=null?f.makeArray(d):[],d.unshift(c);var k=e,l=h.indexOf(":")<0?"on"+h:"";do{var m=f._data(k,"handle");c.currentTarget=k,m&&m.apply(k,d),l&&f.acceptData(k)&&k[l]&&k[l].apply(k,d)===!1&&(c.result=!1,c.preventDefault()),k=k.parentNode||k.ownerDocument||k===c.target.ownerDocument&&a}while(k&&!c.isPropagationStopped());if(!c.isDefaultPrevented()){var n,o=f.event.special[h]||{};if((!o._default||o._default.call(e.ownerDocument,c)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)){try{l&&e[h]&&(n=e[l],n&&(e[l]=null),f.event.triggered=h,e[h]())}catch(p){}n&&(e[l]=n),f.event.triggered=b}}return c.result}},handle:function(c){c=f.event.fix(c||a.event);var d=((f._data(this,"events")||{})[c.type]||[]).slice(0),e=!c.exclusive&&!c.namespace,g=Array.prototype.slice.call(arguments,0);g[0]=c,c.currentTarget=this;for(var h=0,i=d.length;h<i;h++){var j=d[h];if(e||c.namespace_re.test(j.namespace)){c.handler=j.handler,c.data=j.data,c.handleObj=j;var k=j.handler.apply(this,g);k!==b&&(c.result=k,k===!1&&(c.preventDefault(),c.stopPropagation()));if(c.isImmediatePropagationStopped())break}}return c.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[f.expando])return a;var d=a;a=f.Event(d);for(var e=this.props.length,g;e;)g=this.props[--e],a[g]=d[g];a.target||(a.target=a.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX==null&&a.clientX!=null){var h=a.target.ownerDocument||c,i=h.documentElement,j=h.body;a.pageX=a.clientX+(i&&i.scrollLeft||j&&j.scrollLeft||0)-(i&&i.clientLeft||j&&j.clientLeft||0),a.pageY=a.clientY+(i&&i.scrollTop||j&&j.scrollTop||0)-(i&&i.clientTop||j&&j.clientTop||0)}a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==b&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);return a},guid:1e8,proxy:f.proxy,special:{ready:{setup:f.bindReady,teardown:f.noop},live:{add:function(a){f.event.add(this,M(a.origType,a.selector),f.extend({},a,{handler:L,guid:a.handler.guid}))},remove:function(a){f.event.remove(this,M(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}}},f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!this.preventDefault)return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?D:C):this.type=a,b&&f.extend(this,b),this.timeStamp=f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=D;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=D;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=D,this.stopPropagation()},isDefaultPrevented:C,isPropagationStopped:C,isImmediatePropagationStopped:C};var E=function(a){var b=a.relatedTarget,c=!1,d=a.type;a.type=a.data,b!==this&&(b&&(c=f.contains(this,b)),c||(f.event.handle.apply(this,arguments),a.type=d))},F=function(a){a.type=a.data,f.event.handle.apply(this,arguments)};f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={setup:function(c){f.event.add(this,b,c&&c.selector?F:E,a)},teardown:function(a){f.event.remove(this,b,a&&a.selector?F:E)}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(a,b){if(!f.nodeName(this,"form"))f.event.add(this,"click.specialSubmit",function(a){var b=a.target,c=f.nodeName(b,"input")||f.nodeName(b,"button")?b.type:"";(c==="submit"||c==="image")&&f(b).closest("form").length&&J("submit",this,arguments)}),f.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,c=f.nodeName(b,"input")||f.nodeName(b,"button")?b.type:"";(c==="text"||c==="password")&&f(b).closest("form").length&&a.keyCode===13&&J("submit",this,arguments)});else return!1},teardown:function(a){f.event.remove(this,".specialSubmit")}});if(!f.support.changeBubbles){var G,H=function(a){var b=f.nodeName(a,"input")?a.type:"",c=a.value;b==="radio"||b==="checkbox"?c=a.checked:b==="select-multiple"?c=a.selectedIndex>-1?f.map(a.options,function(a){return a.selected}).join("-"):"":f.nodeName(a,"select")&&(c=a.selectedIndex);return c},I=function(c){var d=c.target,e,g;if(!!x.test(d.nodeName)&&!d.readOnly){e=f._data(d,"_change_data"),g=H(d),(c.type!=="focusout"||d.type!=="radio")&&f._data(d,"_change_data",g);if(e===b||g===e)return;if(e!=null||g)c.type="change",c.liveFired=b,f.event.trigger(c,arguments[1],d)}};f.event.special.change={filters:{focusout:I,beforedeactivate:I,click:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";(c==="radio"||c==="checkbox"||f.nodeName(b,"select"))&&I.call(this,a)},keydown:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";(a.keyCode===13&&!f.nodeName(b,"textarea")||a.keyCode===32&&(c==="checkbox"||c==="radio")||c==="select-multiple")&&I.call(this,a)},beforeactivate:function(a){var b=a.target;f._data(b,"_change_data",H(b))}},setup:function(a,b){if(this.type==="file")return!1;for(var c in G)f.event.add(this,c+".specialChange",G[c]);return x.test(this.nodeName)},teardown:function(a){f.event.remove(this,".specialChange");return x.test(this.nodeName)}},G=f.event.special.change.filters,G.focus=G.beforeactivate}f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){function e(a){var c=f.event.fix(a);c.type=b,c.originalEvent={},f.event.trigger(c,null,c.target),c.isDefaultPrevented()&&a.preventDefault()}var d=0;f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.each(["bind","one"],function(a,c){f.fn[c]=function(a,d,e){var g;if(typeof a=="object"){for(var h in a)this[c](h,d,a[h],e);return this}if(arguments.length===2||d===!1)e=d,d=b;c==="one"?(g=function(a){f(this).unbind(a,g);return e.apply(this,arguments)},g.guid=e.guid||f.guid++):g=e;if(a==="unload"&&c!=="one")this.one(a,d,e);else for(var i=0,j=this.length;i<j;i++)f.event.add(this[i],a,g,d);return this}}),f.fn.extend({unbind:function(a,b){if(typeof a=="object"&&!a.preventDefault)for(var c in a)this.unbind(c,a[c]);else for(var d=0,e=this.length;d<e;d++)f.event.remove(this[d],a,b);return this},delegate:function(a,b,c,d){return this.live(b,c,d,a)},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f.data(this,"lastToggle"+a.guid)||0)%d;f.data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var K={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};f.each(["live","die"],function(a,c){f.fn[c]=function(a,d,e,g){var h,i=0,j,k,l,m=g||this.selector,n=g?this:f(this.context);if(typeof a=="object"&&!a.preventDefault){for(var o in a)n[c](o,d,a[o],m);return this}if(c==="die"&&!a&&g&&g.charAt(0)==="."){n.unbind(g);return this}if(d===!1||f.isFunction(d))e=d||C,d=b;a=(a||"").split(" ");while((h=a[i++])!=null){j=w.exec(h),k="",j&&(k=j[0],h=h.replace(w,""));if(h==="hover"){a.push("mouseenter"+k,"mouseleave"+k);continue}l=h,K[h]?(a.push(K[h]+k),h=h+k):h=(K[h]||h)+k;if(c==="live")for(var p=0,q=n.length;p<q;p++)f.event.add(n[p],"live."+M(h,m),{data:d,selector:m,handler:e,origType:h,origHandler:e,preType:l});else n.unbind("live."+M(h,m),e)}return this}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0)}),function(){function u(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}if(i.nodeType===1){f||(i.sizcache=c,i.sizset=g);if(typeof b!="string"){if(i===b){j=!0;break}}else if(k.filter(b,[i]).length>0){j=i;break}}i=i[a]}d[g]=j}}}function t(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}i.nodeType===1&&!f&&(i.sizcache=c,i.sizset=g);if(i.nodeName.toLowerCase()===b){j=i;break}i=i[a]}d[g]=j}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d=0,e=Object.prototype.toString,g=!1,h=!0,i=/\\/g,j=/\W/;[0,0].sort(function(){h=!1;return 0});var k=function(b,d,f,g){f=f||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return f;var i,j,n,o,q,r,s,t,u=!0,w=k.isXML(d),x=[],y=b;do{a.exec(""),i=a.exec(y);if(i){y=i[3],x.push(i[1]);if(i[2]){o=i[3];break}}}while(i);if(x.length>1&&m.exec(b))if(x.length===2&&l.relative[x[0]])j=v(x[0]+x[1],d);else{j=l.relative[x[0]]?[d]:k(x.shift(),d);while(x.length)b=x.shift(),l.relative[b]&&(b+=x.shift()),j=v(b,j)}else{!g&&x.length>1&&d.nodeType===9&&!w&&l.match.ID.test(x[0])&&!l.match.ID.test(x[x.length-1])&&(q=k.find(x.shift(),d,w),d=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]);if(d){q=g?{expr:x.pop(),set:p(g)}:k.find(x.pop(),x.length===1&&(x[0]==="~"||x[0]==="+")&&d.parentNode?d.parentNode:d,w),j=q.expr?k.filter(q.expr,q.set):q.set,x.length>0?n=p(j):u=!1;while(x.length)r=x.pop(),s=r,l.relative[r]?s=x.pop():r="",s==null&&(s=d),l.relative[r](n,s,w)}else n=x=[]}n||(n=j),n||k.error(r||b);if(e.call(n)==="[object Array]")if(!u)f.push.apply(f,n);else if(d&&d.nodeType===1)for(t=0;n[t]!=null;t++)n[t]&&(n[t]===!0||n[t].nodeType===1&&k.contains(d,n[t]))&&f.push(j[t]);else for(t=0;n[t]!=null;t++)n[t]&&n[t].nodeType===1&&f.push(j[t]);else p(n,f);o&&(k(o,h,f,g),k.uniqueSort(f));return f};k.uniqueSort=function(a){if(r){g=h,a.sort(r);if(g)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},k.matches=function(a,b){return k(a,null,null,b)},k.matchesSelector=function(a,b){return k(b,null,null,[a]).length>0},k.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=l.order.length;e<f;e++){var g,h=l.order[e];if(g=l.leftMatch[h].exec(a)){var j=g[1];g.splice(1,1);if(j.substr(j.length-1)!=="\\"){g[1]=(g[1]||"").replace(i,""),d=l.find[h](g,b,c);if(d!=null){a=a.replace(l.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},k.filter=function(a,c,d,e){var f,g,h=a,i=[],j=c,m=c&&c[0]&&k.isXML(c[0]);while(a&&c.length){for(var n in l.filter)if((f=l.leftMatch[n].exec(a))!=null&&f[2]){var o,p,q=l.filter[n],r=f[1];g=!1,f.splice(1,1);if(r.substr(r.length-1)==="\\")continue;j===i&&(i=[]);if(l.preFilter[n]){f=l.preFilter[n](f,j,d,i,e,m);if(!f)g=o=!0;else if(f===!0)continue}if(f)for(var s=0;(p=j[s])!=null;s++)if(p){o=q(p,f,s,j);var t=e^!!o;d&&o!=null?t?g=!0:j[s]=!1:t&&(i.push(p),g=!0)}if(o!==b){d||(j=i),a=a.replace(l.match[n],"");if(!g)return[];break}}if(a===h)if(g==null)k.error(a);else break;h=a}return j},k.error=function(a){throw"Syntax error, unrecognized expression: "+a};var l=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!j.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&k.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!j.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&k.filter(b,a,!0)}},"":function(a,b,c){var e,f=d++,g=u;typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("parentNode",b,f,a,e,c)},"~":function(a,b,c){var e,f=d++,g=u;typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("previousSibling",b,f,a,e,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(i,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(i,"")},TAG:function(a,b){return a[1].replace(i,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||k.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&k.error(a[0]);a[0]=d++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(i,"");!f&&l.attrMap[g]&&(a[1]=l.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(i,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=k(b[3],null,null,c);else{var g=k.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(l.match.POS.test(b[0])||l.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!k(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=l.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||k.getText([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}k.error(e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case"only":case"first":while(d=d.previousSibling)if(d.nodeType===1)return!1;if(c==="first")return!0;d=a;case"last":while(d=d.nextSibling)if(d.nodeType===1)return!1;return!0;case"nth":var e=b[2],f=b[3];if(e===1&&f===0)return!0;var g=b[0],h=a.parentNode;if(h&&(h.sizcache!==g||!a.nodeIndex)){var i=0;for(d=h.firstChild;d;d=d.nextSibling)d.nodeType===1&&(d.nodeIndex=++i);h.sizcache=g}var j=a.nodeIndex-f;return e===0?j===0:j%e===0&&j/e>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=l.attrHandle[c]?l.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=l.setFilters[e];if(f)return f(a,c,b,d)}}},m=l.match.POS,n=function(a,b){return"\\"+(b-0+1)};for(var o in l.match)l.match[o]=new RegExp(l.match[o].source+/(?![^\[]*\])(?![^\(]*\))/.source),l.leftMatch[o]=new RegExp(/(^(?:.|\r|\n)*?)/.source+l.match[o].source.replace(/\\(\d+)/g,n));var p=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(q){p=function(a,b){var c=0,d=b||[];if(e.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var f=a.length;c<f;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var r,s;c.documentElement.compareDocumentPosition?r=function(a,b){if(a===b){g=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(r=function(a,b){if(a===b){g=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],h=a.parentNode,i=b.parentNode,j=h;if(h===i)return s(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return s(e[k],f[k]);return k===c?s(a,f[k],-1):s(e[k],b,1)},s=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),k.getText=function(a){var b="",c;for(var d=0;a[d];d++)c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=k.getText(c.childNodes));return b},function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(l.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},l.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(l.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(l.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=k,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){k=function(b,e,f,g){e=e||c;if(!g&&!k.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return p(e.getElementsByTagName(b),f);if(h[2]&&l.find.CLASS&&e.getElementsByClassName)return p(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return p([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return p([],f);if(i.id===h[3])return p([i],f)}try{return p(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var m=e,n=e.getAttribute("id"),o=n||d,q=e.parentNode,r=/^\s*[+~]/.test(b);n?o=o.replace(/'/g,"\\$&"):e.setAttribute("id",o),r&&q&&(e=e.parentNode);try{if(!r||q)return p(e.querySelectorAll("[id='"+o+"'] "+b),f)}catch(s){}finally{n||m.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)k[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}k.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(a))try{if(e||!l.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return k(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;l.order.splice(1,0,"CLASS"),l.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?k.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?k.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:k.contains=function(){return!1},k.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var v=function(a,b){var c,d=[],e="",f=b.nodeType?[b]:b;while(c=l.match.PSEUDO.exec(a))e+=c[0],a=a.replace(l.match.PSEUDO,"");a=l.relative[a]?a+"*":a;for(var g=0,h=f.length;g<h;g++)k(a,f[g],d);return k.filter(e,d)};f.find=k,f.expr=k.selectors,f.expr[":"]=f.expr.filters,f.unique=k.uniqueSort,f.text=k.getText,f.isXMLDoc=k.isXML,f.contains=k.contains}();var N=/Until$/,O=/^(?:parents|prevUntil|prevAll)/,P=/,/,Q=/^.[^:#\[\.,]*$/,R=Array.prototype.slice,S=f.expr.match.POS,T={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(V(this,a,!1),"not",a)},filter:function(a){return this.pushStack(V(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h,i,j={},k=1;if(g&&a.length){for(d=0,e=a.length;d<e;d++)i=a[d],j[i]||(j[i]=S.test(i)?f(i,b||this.context):i);while(g&&g.ownerDocument&&g!==b){for(i in j)h=j[i],(h.jquery?h.index(g)>-1:f(g).is(h))&&c.push({selector:i,elem:g,level:k});g=g.parentNode,k++}}return c}var l=S.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(l?l.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(U(c[0])||U(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c),g=R.call(arguments);N.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!T[a]?f.unique(e):e,(this.length>1||P.test(d))&&O.test(a)&&(e=e.reverse());return this.pushStack(e,a,g.join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|object|embed|option|style)/i,bb=/checked\s*(?:[^=]|=\s*.checked.)/i,bc=/\/(java|ecma)script/i,bd=/^\s*<!(?:\[CDATA\[|\-\-)/,be={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};be.optgroup=be.option,be.tbody=be.tfoot=be.colgroup=be.caption=be.thead,be.th=be.td,f.support.htmlSerialize||(be._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){f(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f(arguments[0]).toArray());return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!be[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bb.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bf(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bl)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i;b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof a[0]=="string"&&a[0].length<512&&i===c&&a[0].charAt(0)==="<"&&!ba.test(a[0])&&(f.support.checkClone||!bb.test(a[0]))&&(g=!0,h=f.fragments[a[0]],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean
(a,i,e,d)),g&&(f.fragments[a[0]]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d=a.cloneNode(!0),e,g,h;if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bh(a,d),e=bi(a),g=bi(d);for(h=0;e[h];++h)g[h]&&bh(e[h],g[h])}if(b){bg(a,d);if(c){e=bi(a),g=bi(d);for(h=0;e[h];++h)bg(e[h],g[h])}}e=g=null;return d},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=be[l]||be._default,n=m[0],o=b.createElement("div");o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bk(k[i]);else bk(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||bc.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.expando,g=f.event.special,h=f.support.deleteExpando;for(var i=0,j;(j=a[i])!=null;i++){if(j.nodeName&&f.noData[j.nodeName.toLowerCase()])continue;c=j[f.expando];if(c){b=d[c]&&d[c][e];if(b&&b.events){for(var k in b.events)g[k]?f.event.remove(j,k):f.removeEvent(j,k,b.handle);b.handle&&(b.handle.elem=null)}h?delete j[f.expando]:j.removeAttribute&&j.removeAttribute(f.expando),delete d[c]}}}});var bm=/alpha\([^)]*\)/i,bn=/opacity=([^)]*)/,bo=/([A-Z]|^ms)/g,bp=/^-?\d+(?:px)?$/i,bq=/^-?\d/,br=/^([\-+])=([\-+.\de]+)/,bs={position:"absolute",visibility:"hidden",display:"block"},bt=["Left","Right"],bu=["Top","Bottom"],bv,bw,bx;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bv(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=br.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bv)return bv(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return by(a,b,d);f.swap(a,bs,function(){e=by(a,b,d)});return e}},set:function(a,b){if(!bp.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bn.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNaN(b)?"":"alpha(opacity="+b*100+")",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bm,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bm.test(g)?g.replace(bm,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bv(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bw=function(a,c){var d,e,g;c=c.replace(bo,"-$1").toLowerCase();if(!(e=a.ownerDocument.defaultView))return b;if(g=e.getComputedStyle(a,null))d=g.getPropertyValue(c),d===""&&!f.contains(a.ownerDocument.documentElement,a)&&(d=f.style(a,c));return d}),c.documentElement.currentStyle&&(bx=function(a,b){var c,d=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;!bp.test(d)&&bq.test(d)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":d||0,d=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));return d===""?"auto":d}),bv=bw||bx,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bz=/%20/g,bA=/\[\]$/,bB=/\r?\n/g,bC=/#.*$/,bD=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bE=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bF=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bG=/^(?:GET|HEAD)$/,bH=/^\/\//,bI=/\?/,bJ=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bK=/^(?:select|textarea)/i,bL=/\s+/,bM=/([?&])_=[^&]*/,bN=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bO=f.fn.load,bP={},bQ={},bR,bS,bT=["*/"]+["*"];try{bR=e.href}catch(bU){bR=c.createElement("a"),bR.href="",bR=bR.href}bS=bN.exec(bR.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bO)return bO.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bJ,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bK.test(this.nodeName)||bE.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bB,"\r\n")}}):{name:b.name,value:c.replace(bB,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.bind(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?bX(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),bX(a,b);return a},ajaxSettings:{url:bR,isLocal:bF.test(bS[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bT},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bV(bP),ajaxTransport:bV(bQ),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?bZ(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=b$(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.resolveWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f._Deferred(),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bD.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.done,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bC,"").replace(bH,bS[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bL),d.crossDomain==null&&(r=bN.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bS[1]&&r[2]==bS[2]&&(r[3]||(r[1]==="http:"?80:443))==(bS[3]||(bS[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bW(bP,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bG.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bI.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bM,"$1_="+x);d.url=y+(y===d.url?(bI.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bT+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bW(bQ,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){s<2?w(-1,z):f.error(z)}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)bY(g,a[g],c,e);return d.join("&").replace(bz,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var b_=f.now(),ca=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+b_++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ca.test(b.url)||e&&ca.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ca,l),b.url===j&&(e&&(k=k.replace(ca,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cb=a.ActiveXObject?function(){for(var a in cd)cd[a](0,1)}:!1,cc=0,cd;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ce()||cf()}:ce,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cb&&delete cd[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cc,cb&&(cd||(cd={},f(a).unload(cb)),cd[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cg={},ch,ci,cj=/^(?:toggle|show|hide)$/,ck=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cl,cm=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cn;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cq("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cr(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cq("hide",3),a,b,c);for(var d=0,e=this.length;d<e;d++)if(this[d].style){var g=f.css(this[d],"display");g!=="none"&&!f._data(this[d],"olddisplay")&&f._data(this[d],"olddisplay",g)}for(d=0;d<e;d++)this[d].style&&(this[d].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cq("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return this[e.queue===!1?"each":"queue"](function(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(f.support.inlineBlockNeedsLayout?(j=cr(this.nodeName),j==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)):this.style.display="inline-block"))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)k=new f.fx(this,b,i),h=a[i],cj.test(h)?k[h==="toggle"?d?"show":"hide":h]():(l=ck.exec(h),m=k.cur(),l?(n=parseFloat(l[2]),o=l[3]||(f.cssNumber[i]?"":"px"),o!=="px"&&(f.style(this,i,(n||1)+o),m=(n||1)/k.cur()*m,f.style(this,i,m+o)),l[1]&&(n=(l[1]==="-="?-1:1)*n+m),k.custom(m,n,o)):k.custom(m,h,""));return!0})},stop:function(a,b){a&&this.queue([]),this.each(function(){var a=f.timers,c=a.length;b||f._unmark(!0,this);while(c--)a[c].elem===this&&(b&&a[c](!0),a.splice(c,1))}),b||this.dequeue();return this}}),f.each({slideDown:cq("show",1),slideUp:cq("hide",1),slideToggle:cq("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default,d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue!==!1?f.dequeue(this):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,b,c){function g(a){return d.step(a)}var d=this,e=f.fx;this.startTime=cn||co(),this.start=a,this.end=b,this.unit=c||this.unit||(f.cssNumber[this.prop]?"":"px"),this.now=this.start,this.pos=this.state=0,g.elem=this.elem,g()&&f.timers.push(g)&&!cl&&(cl=setInterval(e.tick,e.interval))},show:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.show=!0,this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b=cn||co(),c=!0,d=this.elem,e=this.options,g,h;if(a||b>=e.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),e.animatedProperties[this.prop]=!0;for(g in e.animatedProperties)e.animatedProperties[g]!==!0&&(c=!1);if(c){e.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){d.style["overflow"+b]=e.overflow[a]}),e.hide&&f(d).hide();if(e.hide||e.show)for(var i in e.animatedProperties)f.style(d,i,e.orig[i]);e.complete.call(d)}return!1}e.duration==Infinity?this.now=b:(h=b-this.startTime,this.state=h/e.duration,this.pos=f.easing[e.animatedProperties[this.prop]](this.state,h,0,1,e.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){for(var a=f.timers,b=0;b<a.length;++b)a[b]()||a.splice(b--,1);a.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cl),cl=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now}}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cs=/^t(?:able|d|h)$/i,ct=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cu(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);f.offset.initialize();var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.offset.supportsFixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.offset.doesNotAddBorder&&(!f.offset.doesAddBorderForTableAndCells||!cs.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.offset.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.offset.supportsFixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={initialize:function(){var a=c.body,b=c.createElement("div"),d,e,g,h,i=parseFloat(f.css(a,"marginTop"))||0,j="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";f.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"}),b.innerHTML=j,a.insertBefore(b,a.firstChild),d=b.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,this.doesNotAddBorder=e.offsetTop!==5,this.doesAddBorderForTableAndCells=h.offsetTop===5,e.style.position="fixed",e.style.top="20px",this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==i,a.removeChild(b),f.offset.initialize=f.noop},bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.offset.initialize(),f.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=ct.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!ct.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cu(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cu(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a&&a.style?parseFloat(f.css(a,d,"padding")):null},f.fn["outer"+c]=function(a){var b=this[0];return b&&b.style?parseFloat(f.css(b,d,a?"margin":"border")):null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNaN(j)?i:j}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f})(window);;
}
var q = window.jQuery;
js.JQuery = q;
q.fn.iterator = function() {
	return { pos : 0, j : this, hasNext : function() {
		return this.pos < this.j.length;
	}, next : function() {
		return $(this.j[this.pos++]);
	}};
};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
Tetris.SPLASH_DURATION = 1000;
Tetris.doNotWaitForOpponent = false;
Tetris.startAppCounter = 0;
connection.ConnectionController.LINES_RECEIVED = "linesReceived";
connection.ConnectionController.HEIGHT_RATIO = "heightRatio";
connection.ConnectionController.PLAYER_LOST = "playerLost";
connection.ConnectionController.PLAYER_WON = "playerWon";
connection.ConnectionController.START_GAME = "startGame";
connection.ConnectionController.FORCE_START_GAME = "forceStartGame";
connection.ConnectionController.NEXT_TUTORIAL_PAGE = "nextTutorialPage";
connection.ConnectionController.PAUSE_GAME = "pauseGame";
connection.ConnectionController.RESUME_GAME = "resumeGame";
connection.ConnectionController.POINTS = "points";
connection.ConnectionController.USER_TOP_SCORE_KEY = "userTopScoreKey";
connection.ConnectionController.USER_TOP_LINES_KEY = "userTopLinesKey";
connection.ConnectionController.HIGH_SCORE = "highScore";
connection.MockWasabi.APP_ID = "0";
connection.RoundsConsts.USER_AGE = "USER_AGE";
connection.RoundsConsts.USER_GENDER = "USER_COUNTRY";
connection.RoundsConsts.USER_COUNTRY = "USER_COUNTRY";
connection.RoundsConsts.USER_GEO = "USER_GEO";
connection.RoundsConsts.DISPLAY_NAME = "DISPLAY_NAME";
connection.RoundsConsts.THUMBNAILURL = "THUMBNAILURL";
connection.RoundsConsts.USER_ALL = "USER_ALL";
connection.RoundsConsts.ALLUSERS = "ALLUSERS";
connection.RoundsConsts.ALLSESSIONUSERS = "ALLSESSIONUSERS";
connection.RoundsConsts.ROUNDS = "ROUNDS";
connection.RoundsConsts.MAX_MESSAGE_BYTES = "MAX_MESSAGE_BYTES";
connection.RoundsConsts.CONNECTED = "CONNECTED";
connection.RoundsConsts.CONNECTION_CLOSED = "CONNECTION_CLOSED";
connection.RoundsConsts.CONNECTION_ERROR = "CONNECTION_ERROR";
connection.RoundsConsts.PARTICIPANT_CONNECTED = "PARTICIPANT_CONNECTED";
connection.RoundsConsts.PARTICIPANT_DISCONNECTED = "PARTICIPANT_DISCONNECTED";
connection.RoundsConsts.MESSAGE_RECEIVED = "MESSAGE_RECEIVED";
connection.RoundsConsts.OBJECT_NONE = "OBJECT_NONE";
connection.RoundsConsts.OBJECT_USER = "OBJECT_USER";
connection.RoundsConsts.OBJECT_MESSAGE = "OBJECT_MESSAGE";
connection.wasabi.WasabiWrapper.APP_ID = "4";
controller.BackgroundController.MAX_DARK_LAYER_ALPHA = 0.5;
controller.GameController.MODEL_WIDTH = 10;
controller.GameController.MODEL_HEIGHT = 20;
controller.GameController.LINES_PER_LEVEL = 5;
controller.GameController.OPPONENT_LINE_COLOR = 7;
controller.GameController.WINNER_EXTRA_POINTS = 300;
controller.GameController.DANGER_ZONE_RATIO = 0.7;
controller.GameController.OPPONENT_ABOUT_TO_LOOSE_MSG = "Almost there! Your friend is about to lose";
controller.GameState.INIT_INTERVAL = 700;
controller.GameState.MS_PER_LEVEL = 20;
controller.MenuController.MENU_X = 20;
controller.MenuController.BACKGROUND_OPACITY = 0.4;
controller.MenuController.BG_FADEIN_MS = 100;
controller.MenuController.BACKGROUND_PADDING_RATIO_X = 0.1;
controller.MenuController.BACKGROUND_PADDING_RATIO_Y = 0.2;
controller.OpponentStateMeter.ELEMENT_NAME = "opponentMeter";
controller.OpponentStateMeter.INDICATOR_MOVE_TIME = 500;
controller.OpponentStateMeter.STRIPE_THICKNESS = 1;
controller.OpponentStateMeter.DANGER_COLOR = 16711680;
controller.Keys.SPACE = 32;
controller.Keys.LEFT = 37;
controller.Keys.UP = 38;
controller.Keys.RIGHT = 39;
controller.Keys.DOWN = 40;
controller.Keys.P = 80;
controller.Keys.N = 78;
event.TouchEvent.TOUCH_START = "touchstart";
event.TouchEvent.TOUCH_MOVE = "touchmove";
event.TouchEvent.TOUCH_END = "touchend";
feffects.Tween._aTweens = new haxe.FastList();
feffects.Tween._aPaused = new haxe.FastList();
feffects.Tween.INTERVAL = 10;
feffects.Tween.DEFAULT_EASING = feffects.Tween.easingEquation;
js.Lib.onerror = null;
model.ShapeStore.e = -1;
model.ShapeStore.randomBlockColor = "#DB8433";
model.ShapeStore.shapes = [new model.ShapeData([[-1,-1,-1,-1],[0,0,0,0],[-1,-1,-1,-1]],"#cf64f1"),new model.ShapeData([[-1,-1,-1],[1,1,1],[-1,1,-1]],"#189af0",-0.5),new model.ShapeData([[-1,2],[2,2],[2,-1]],"#f45f76"),new model.ShapeData([[3,-1],[3,3],[-1,3]],"#8DD909"),new model.ShapeData([[-1,-1,-1],[4,4,4],[-1,-1,4]],"#2cc887",-0.5),new model.ShapeData([[-1,-1,-1],[5,5,5],[5,-1,-1]],"#f4bd3a",-0.5),new model.ShapeData([[6,6],[6,6]],"#6D87F3")];
model.TetrisBoard.PADDING = 3;
model.TetrisBoard.PAD_COLOR = 9;
model.TetrisBoard.EMPTY = -1;
model.TetrisBoard.RANDOM_COLOR = -2;
util.DebugConsole.DISPLAY_TIME = 10000;
util.DebugConsole.enabled = false;
view.Assets.cloudsBottom = new view.ImageInfo("resources/images_mdpi/clouds_bottom.png",0,0,320,55);
view.Assets.cloudsButtonsBackground = new view.ImageInfo("resources/images_mdpi/clouds_btns_background.png",0,0,320,39);
view.Assets.cloudsButtons = new view.ImageInfo("resources/images_mdpi/clouds_btns.png",0,0,320,60);
view.Assets.cloudsLeft = new view.ImageInfo("resources/images_mdpi/clouds_left.png",0,0,27,101);
view.Assets.cloudsRight = new view.ImageInfo("resources/images_mdpi/clouds_right.png",0,0,40,79);
view.Assets.cloudsTop = new view.ImageInfo("resources/images_mdpi/clouds_top.png",0,0,159,20);
view.Assets.facebookLogo = new view.ImageInfo("resources/images_mdpi/facebook.png",0,0,44,44);
view.Assets.instructions1 = new view.ImageInfo("resources/images_mdpi/tip_1_content.png",0,0,161,200);
view.Assets.instructions2 = new view.ImageInfo("resources/images_mdpi/tip_2_content.png",0,0,136,200);
view.Assets.instructions3 = new view.ImageInfo("resources/images_mdpi/tip_3_content.png",0,0,201,200);
view.Assets.closeButton = new view.ImageInfo("resources/images_mdpi/close_btn.png",0,0,18,18);
view.Assets.doneButton = new view.ImageInfo("resources/images_mdpi/done_btn.png",0,0,18,18);
view.Assets.nextButton = new view.ImageInfo("resources/images_mdpi/next_btn.png",0,0,18,18);
view.Assets.pauseButton = new view.ImageInfo("resources/images_mdpi/pause_btn.png",0,0,13,18);
view.Assets.separator = new view.ImageInfo("resources/images_mdpi/bottom_border.png",0,0,239,1);
view.Assets.separatorWithDots = new view.ImageInfo("resources/images_mdpi/top_border.png",0,0,239,5);
view.Assets.skyBgTile = new view.ImageInfo("resources/images_mdpi/sky_bg_tile.png",0,0,100,100);
view.Assets.skyTumblerLogo = new view.ImageInfo("resources/images_mdpi/sky_tumble_logo.png",0,0,162,92);
view.Assets.tip1Content = new view.ImageInfo("resources/images_mdpi/tip_1_content.png",0,0,225,280);
view.Assets.tip1 = new view.ImageInfo("resources/images_mdpi/tip_1.png",0,0,277,355);
view.Assets.tweeterLogo = new view.ImageInfo("resources/images_mdpi/tweeter.png",0,0,44,44);
view.Assets.emptyCircle = new view.ImageInfo("resources/images_mdpi/empty_circle.png",0,0,10,10);
view.Assets.fullCircle = new view.ImageInfo("resources/images_mdpi/full_circle.png",0,0,10,10);
view.ControlButtons.PADDING = 15;
view.ControlButtons.CYCLE_BEFORE_REPEAT = 8;
view.DocElements.mainName = "mainContainer";
view.DocElements.mainNameHash = "#" + "mainContainer";
view.DocElements.mainElement = js.Lib.document.getElementById("mainContainer");
view.DocElements.cloudContainer = js.Lib.document.getElementById("cloudContainer");
view.DocElements.menuContainer = js.Lib.document.getElementById("menuContainer");
view.DocElements.controlsContainer = js.Lib.document.getElementById("controlsContainer");
view.DocElements.controlsNameHash = "#controlsContainer";
view.DocElements.splashName = "splashContainer";
view.DocElements.splashNameHash = "#" + "splashContainer";
view.DocElements.splashElement = js.Lib.document.getElementById("splashContainer");
view.DocElements.body = js.Lib.document.body;
view.DomBoardView.ROW_FLASH_TIME = 150;
view.DomBoardView.TOP_COVER_HEIGHT = 12;
view.DomBoardView.TOP_COVER_COLOR = 16777215;
view.InstructionsView.PAGE = "page";
view.NextShapePreview.PADDING = 2;
view.PageIndicator.PADDING = 5;
view.PanelView.VALUE_SIZE = "30px";
view.PanelView.POINTS_SIZE = "26px";
view.PanelView.LABEL_SIZE = "15px";
view.PanelView.PADDING_Y = 3;
view.PanelView.PADDING_X = 0;
view.PanelView.PAUSE_BUTTON_ID = "pause";
view.ScreenLayouter.BOARD_WIDTH_TO_WINDOW_WIDTH = 0.77;
view.ScreenLayouter.BOARD_HEIGHT_TO_WINDOW_HEIGHT = 0.77;
view.ScreenLayouter.SUGGESTED_CONTROLS_HEIGHT = 80;
view.ScreenLayouter.NOTIFICATION_HEIGHT = 30;
view.ScreenLayouter.METER_WIDTH = 6;
view.ScreenLayouter.PANEL_WIDTH = 50;
view.ScreenLayouter.PANEL_PADDING = 3;
view.ScreenLayouter.BOARD_AND_BUTTONS_OVERLAP = 6;
view.menu.Menu.PADDING = 10;
view.menu.Menu.V_SPACING = 30;
view.menu.Menu.COLOR1 = 3860335;
view.menu.Menu.COLOR2 = 16098056;
view.menu.Menu.COLOR3 = 16061247;
view.menu.Menu.BUTTON_MARGINS = 7;
view.menu.Menu.BUTTON_TEXT_SIZE = 27;
view.menu.Menu.TITLE_FONT_SIZE = 30;
view.menu.Menu.menuCounter = 0;
view.menu.EndMenu.PLAY_AGAIN_BUTTON = "gotoMainMenuButton";
view.menu.EndMenu.SHARE_BUTTON = "shareButton";
view.menu.PauseMenu.CONTINUE_GAME = "continueGameButton";
view.menu.PauseMenu.LEAVE_GAME = "leaveGameButton";
view.menu.ShareMenu.SHARE_BUTTON = "shareButton";
view.menu.ShareMenu.CANCEL_BUTTON = "cancelButton";
view.menu.StartMenu.START_GAME = "startGameButton";
view.menu.StartMenu.INSTRUCTIONS = "instructionsButton";
view.menu.WaitingForOpponentMenu.BLOCK_SIZE = 30;
view.notification.NotificationsController.NOTIFICATION_DURATION = 4000;
Tetris.main();
