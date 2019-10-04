class SequelizeUtils {
    prepareWhere(params) {
        if (!params) {
            return {};
        }

        let where = {};
        for (let key in params) {
            let value = params[key];
            let operator;
            if (key.endsWith('.gte')) {
                key = key.slice(0, -4);
                operator = '$gte';
            } else if (key.endsWith('.lte')) {
                key = key.slice(0, -4);
                operator = '$lte';
            } else if (key.endsWith('.ne')) {
                key = key.slice(0, -3);
                operator = '$ne';
            } else if (/^true$/.test(value)) {
                operator = '$like';
                value = true;
            } else if (/^false$/.test(value)) {
                operator = '$like';
                value = false;
            } else if (value === '') {
                operator = '$is';
                value = null;
            } else if (Array.isArray(value)) {
                operator = '$or';
                value = value.map(v => {
                    return v === '' ? null : v;
                });
            } else {
                operator = /%/.test(value) === true ? '$like' : '$eq';
            }

            if (where[key]) {
                where[key][operator] = value;
            } else {
                where[key] = { [operator]: value };
            }
        }

        return where;
    }
}

module.exports = SequelizeUtils;
