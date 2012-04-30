/**
 * Copyright (C) 2011 Yehonatan Daniv <maggotfish@gmail.com>
 *
 *          DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 */
(function (_window, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define(function () {
			return (_window.Eventbox = factory(_window));
		});
	} else {
		(_window.Eventbox = factory(_window));
	}
}(window, function (global) {
	var _self, Box = {}, _scope,
		objToString = global.Object.prototype.toString,
		slice = global.Array.prototype.slice, _token = 0;
	function isObj(obj) {
		return objToString.call(obj) == '[object Object]';
	}
	function add(t, fn) {
		if (!(t in Box)) Box[t] = {};
		return (Box[t][_token] = _scope ? fn.bind(_scope) : fn), _token++;
	}
	function remove(type, token) {
		if (Box[type] && Box[type][token])
			delete Box[type][token];
		else
			delete Box[type];
	}
	function emit(fn, data, args) {
		setTimeout(function () {
			return fn.apply(this, [data].concat(args));
		}, 0);
	}
	return _self = {
		notify	: function (note) {
			var h, t, args = slice.call(arguments, 1);
			if (isObj(note)) {
				for (t in note)
					if (t in Box)
						for (h in Box[t]) emit(Box[t][h], note[t], args);
			} else if (typeof note == 'string' && note in Box)
				for (h in Box[note]) emit(Box[note][h], args[0], args.slice(1));
			return _self;
		},
		listen	: function (note, handler) {
			var fn_map = {}, k;
			if (isObj(note))
				for (k in note) (function (t, obj) {
					if (typeof obj == 'function')
						fn_map[t] = add(t, obj);
					else if (isObj(obj))
						fn_map[t] = add(t, function () {
							_self.notify.apply(_self, [obj].concat(slice.call(arguments)));
						});
				})(k, note[k]);
			else if (typeof note == 'string')
				fn_map = add(note, handler);
			if (_scope) _scope = null;
			return fn_map;
		},
		unlisten: function (types, idx) {
			if (typeof types == 'string')
				remove(types, idx);
			else if (isObj(types))
				for (var _t in types)
					remove(_t, types[_t]);
			return _self;
		},
		bind	: function (scope) {
			return _scope = scope, _self;
		}
	};
}));