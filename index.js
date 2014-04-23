function type(v) {
    switch (typeof v) {
        case 'object':
            if (Array.isArray(v)) {
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

        if (!obj.hasOwnProperty(templkeys[i])) {
            throw new TypeError('Missing key: ' + templ[key] + ':' + key);
        }

        var expect = templ[key];
        if (Array.isArray(expect)) {
            expect = expect.join(',');
        } else if (typeof expect === 'object') {
            _typematch(obj[key], templ[key]);
            continue;
        }

        if (typeof expect === 'string' ) {
            var actual = type(obj[key]);
            if (expect.indexOf(type(obj[key])) === -1) {
                throw new TypeError('Expected key ' + key + ' to be of type ' +
                                    expect + ', instead got ' + actual);
            }
        } else {
            throw new TypeError('Invalid template value ' + typeof expect + ' for key ' +
                                key);
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
        _typematch(obj, templ);
        if (cb) {
            cb(null, obj);
        }
    } catch (e) {
        if (cb) {
            cb(e, null);
        } else {
            cb(null, obj);
        }
    }
};
