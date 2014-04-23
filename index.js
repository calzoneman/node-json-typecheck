function type(v) {
    switch (typeof v) {
        case 'object':
            if (v === null) {
                return 'null';
            } else if (Array.isArray(v)) {
                return 'array';
            }
            return 'object';
        default:
            return typeof v;
    }
}

function _typematch(obj, templ) {
    var templkeys = Object.keys(templ).filter(Object.hasOwnProperty.bind(templ));
    var objkeys = Object.keys(obj).filter(Object.hasOwnProperty.bind(obj));

    for (var i = 0; i < templkeys.length; i++) {
        var key = templkeys[i];
        var expect = (typeof templ[key] === 'object') ? 'object' : templ[key];
        if (typeof expect !== 'string') {
            throw new TypeError('Invalid template value ' + typeof expect + ' for key ' +
                                key);
        }

        if (!obj.hasOwnProperty(key)) {
            if (expect.indexOf('optional') === -1) {
                throw new TypeError('Missing key: ' + expect + ':' + key);
            } else {
                continue;
            }
        }

        if (expect === 'object') {
            _typematch(obj[key], templ[key]);
        } else {
            var actual = type(obj[key]);
            if (expect.indexOf(type(obj[key])) === -1 &&
                expect.indexOf('*') === -1) {
                throw new TypeError('Expected key ' + key + ' to be of type ' +
                                    expect + ', instead got ' + actual);
            }
        }
    }

    for (var i = 0; i < objkeys.length; i++) {
        if (!templ.hasOwnProperty(objkeys[i])) {
            throw new TypeError('Extra key: ' + objkeys[i]);
        }
    }
}

module.exports = function typecheck(obj, templ, cb) {
    try {
        if (type(obj) !== type(templ)) {
            throw new TypeError('Expected type ' + type(templ) + ', got ' +
                                type(obj));
        }
        if (type(templ) === 'object') {
            _typematch(obj, templ);
        }
        if (cb) {
            cb(null, obj);
        }
    } catch (e) {
        if (cb) {
            cb(e, null);
        } else {
            throw e;
        }
    }
};
