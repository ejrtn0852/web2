// To parse this data:
//
//   import { Convert, CoinTicker } from "./file";
//
//   const coinTicker = Convert.toCoinTicker(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CoinTicker {
    id:            string;
    name:          string;
    symbol:        string;
    rank:          number;
    total_supply:  number;
    max_supply:    number;
    beta_value:    number;
    first_data_at: Date;
    last_updated:  Date;
    quotes:        Quotes;
}

export interface Quotes {
    USD: Usd;
}

export interface Usd {
    price:                  number;
    volume_24h:             number;
    volume_24h_change_24h:  number;
    market_cap:             number;
    market_cap_change_24h:  number;
    percent_change_15m:     number;
    percent_change_30m:     number;
    percent_change_1h:      number;
    percent_change_6h:      number;
    percent_change_12h:     number;
    percent_change_24h:     number;
    percent_change_7d:      number;
    percent_change_30d:     number;
    percent_change_1y:      number;
    ath_price:              number;
    ath_date:               Date;
    percent_from_price_ath: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCoinTicker(json: string): CoinTicker {
        return cast(JSON.parse(json), r("CoinTicker"));
    }

    public static coinTickerToJson(value: CoinTicker): string {
        return JSON.stringify(uncast(value, r("CoinTicker")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CoinTicker": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "symbol", js: "symbol", typ: "" },
        { json: "rank", js: "rank", typ: 0 },
        { json: "total_supply", js: "total_supply", typ: 0 },
        { json: "max_supply", js: "max_supply", typ: 0 },
        { json: "beta_value", js: "beta_value", typ: 3.14 },
        { json: "first_data_at", js: "first_data_at", typ: Date },
        { json: "last_updated", js: "last_updated", typ: Date },
        { json: "quotes", js: "quotes", typ: r("Quotes") },
    ], false),
    "Quotes": o([
        { json: "USD", js: "USD", typ: r("Usd") },
    ], false),
    "Usd": o([
        { json: "price", js: "price", typ: 3.14 },
        { json: "volume_24h", js: "volume_24h", typ: 3.14 },
        { json: "volume_24h_change_24h", js: "volume_24h_change_24h", typ: 3.14 },
        { json: "market_cap", js: "market_cap", typ: 0 },
        { json: "market_cap_change_24h", js: "market_cap_change_24h", typ: 3.14 },
        { json: "percent_change_15m", js: "percent_change_15m", typ: 3.14 },
        { json: "percent_change_30m", js: "percent_change_30m", typ: 3.14 },
        { json: "percent_change_1h", js: "percent_change_1h", typ: 3.14 },
        { json: "percent_change_6h", js: "percent_change_6h", typ: 3.14 },
        { json: "percent_change_12h", js: "percent_change_12h", typ: 3.14 },
        { json: "percent_change_24h", js: "percent_change_24h", typ: 3.14 },
        { json: "percent_change_7d", js: "percent_change_7d", typ: 3.14 },
        { json: "percent_change_30d", js: "percent_change_30d", typ: 3.14 },
        { json: "percent_change_1y", js: "percent_change_1y", typ: 3.14 },
        { json: "ath_price", js: "ath_price", typ: 3.14 },
        { json: "ath_date", js: "ath_date", typ: Date },
        { json: "percent_from_price_ath", js: "percent_from_price_ath", typ: 3.14 },
    ], false),
};
