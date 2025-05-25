function isEqual<T>(value: T, other: T): boolean {
  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0)
    return value === other;

  // Compare arrays
  if (type === '[object Array]') {
    const valueArray = value as unknown as Array<any>;
    const otherArray = other as unknown as Array<any>;
    if (valueArray.length !== otherArray.length) return false;
    for (let i = 0; i < valueArray.length; i++) {
      if (!isEqual(valueArray[i], otherArray[i])) return false;
    }
    return true;
  }

  // Compare objects
  if (type === '[object Object]') {
    const valueObj = value as Record<string, any>;
    const otherObj = other as Record<string, any>;
    const valueKeys = Object.keys(valueObj);
    const otherKeys = Object.keys(otherObj);
    if (valueKeys.length !== otherKeys.length) return false;
    for (let key of valueKeys) {
      if (!otherObj.hasOwnProperty(key)) return false;
      if (!isEqual(valueObj[key], otherObj[key])) return false;
    }
    return true;
  }

  // If none of the above conditions match, just return strict equality
  return value === other;
}

export {isEqual};
