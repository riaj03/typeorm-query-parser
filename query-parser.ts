import {In, Not} from 'typeorm';

export class QueryParser {
    operations: object;
    keyName: object;
    constructor() {
        this.operations = {
            in: In,
            not: Not
        };

        this.keyName = {
            limit: 'take',
            offset: 'skip'
        };
    }

    replaceKeyName(json: object) {
        const keyValues = Object.keys(json).map(key => {
            const newKey = this.keyName[key] || key;
            return {[newKey]: json[key]};
        });

        return Object.assign({}, ...keyValues);
    }

    replaceKey(
        params: object,
        op: <T>(value: T[]) => void,
        json: object,
        key: string
    ) {
        json[key] = op(params as number[]);
    }

    iterativeReplace = (
        json: object,
        // Need previous JSON (prevJson) to replace next function if available in operations
        prevJson: object = undefined,
        prevKey: string = undefined
    ) => {
        Object.keys(json).forEach(key => {
            if (json[key] !== null && typeof json[key] === 'object') {
                const op = this.operations[key];

                if (op && prevJson && prevKey) {
                    this.iterativeReplace(json[key], json, key);
                    this.replaceKey(json[key], op, prevJson, prevKey);
                } else {
                    this.iterativeReplace(json[key], json, key);
                }
            } else {
                const op = this.operations[key];
                if (op && prevJson && prevKey) {
                    this.replaceKey(json[key], op, prevJson, prevKey);
                }
            }
        });
    }

    parseQueryFields = (query: object) => {
        const json = this.replaceKeyName(JSON.parse(query.toString()));
        this.iterativeReplace(json);
        return json;
    }

    async parse(req: object): Promise<object> {
        const requestQuery = req['query'];
        let parsed = null;
        if ('query' in requestQuery) {
            parsed = this.parseQueryFields(requestQuery.query);
        }
        return parsed;
    }
}
