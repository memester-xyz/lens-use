/* eslint-disable */
function has(obj: any, prop: any): boolean {
  return Function.prototype.bind.call(Function.call, Object.prototype.hasOwnProperty)(obj, prop);
}

function isUnsafeKey(key: any) {
  return key === "__proto__" || key === "constructor" || key === "prototype";
}

function validateKey(key: any) {
  if (isUnsafeKey(key)) {
    throw new Error(`Cannot set unsafe key: "${key}"`);
  }
}

function unset(obj: any, prop: any) {
  if (!isObject(obj)) {
    throw new TypeError("expected an object.");
  }

  var isArray = Array.isArray(prop);

  if (!isArray && obj.hasOwnProperty(prop)) {
    delete obj[prop];
    return true;
  }

  if (has(obj, prop)) {
    var segs = isArray ? prop.slice() : prop.split(".");
    var last = segs.pop();
    while (segs.length && segs[segs.length - 1].slice(-1) === "\\") {
      last = segs.pop().slice(0, -1) + "." + last;
    }
    while (segs.length) {
      prop = segs.shift();
      validateKey(prop);
      obj = obj[prop];
    }
    return delete obj[last];
  }
  return true;
}

function isObject(o: any) {
  return Object.prototype.toString.call(o) === "[object Object]";
}

function isPlainObject(o: any) {
  var ctor, prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

export function omitDeep(value: any, keys: any) {
  if (typeof value === "undefined") {
    return {};
  }

  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      value[i] = omitDeep(value[i], keys);
    }
    return value;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if (typeof keys === "string") {
    keys = [keys];
  }

  if (!Array.isArray(keys)) {
    return value;
  }

  for (var j = 0; j < keys.length; j++) {
    unset(value, keys[j]);
  }

  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      value[key] = omitDeep(value[key], keys);
    }
  }

  return value;
}
