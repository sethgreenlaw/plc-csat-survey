/**
 * Mock PgDrizzle Implementation
 *
 * Provides a mock Drizzle interface that uses MockDataStore.
 * Supports common query patterns used in repositories.
 *
 * SUPPORTED OPERATIONS:
 * ---------------------
 * Query Builders:
 *   - select().from().where().orderBy().groupBy().limit().offset()
 *   - insert().values().returning().onConflictDoUpdate().onConflictDoNothing()
 *   - update().set().where().returning()
 *   - delete().where().returning()
 *   - query.table.findMany() / query.table.findFirst()
 *
 * Filter Operators (in where clauses):
 *   - eq, ne (equality/inequality)
 *   - gt, gte, lt, lte (comparison)
 *   - in, notIn (array membership)
 *   - isNull, isNotNull (null checks)
 *   - between (range)
 *   - like, ilike (pattern matching)
 *   - and, or, not (logical combinators)
 *
 * Aggregations (with groupBy):
 *   - count(*), sum(), avg(), max(), min()
 *
 * Sorting:
 *   - orderBy with asc/desc support
 *
 * IMPORTANT: Effect Integration
 * -----------------------------
 * This implementation bridges Drizzle's Promise-based API with Effect.
 * Query builders implement `then()` to be Promise-compatible, using
 * `Effect.runPromise()` internally to execute MockDataStore operations.
 *
 * Key constraint: Because Effect.runPromise() runs Effects without
 * providing additional context, MockDataStore must be fully self-contained.
 * The mockStore instance is captured in the closure when MockPgDrizzleLive
 * is created, so its internal Ref operations work correctly.
 *
 * Repositories should use standard Drizzle operations (select, insert, etc.)
 * that work identically with both real PgDrizzle and this mock implementation.
 * Do NOT mix MockDataStore direct access with PgDrizzle in repositories.
 */

import { PgDrizzle } from '@effect/sql-drizzle/Pg';
import { Effect, Layer } from 'effect';
import { MockDataStore, type MockRecord } from './MockDataStore.js';

/**
 * Extract table name from a Drizzle table object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTableName = (table: any): string => {
  // First try: check for Table._ structure (internal config)
  if (table && table._ && typeof table._.name === 'string') {
    return table._.name;
  }

  // Second try: Drizzle tables have a Symbol with the table name
  const symbols = Object.getOwnPropertySymbols(table);
  for (const sym of symbols) {
    const desc = sym.description;
    // Look for the drizzle:Name symbol
    if (desc === 'drizzle:Name' || desc?.includes('Name')) {
      const value = table[sym];
      if (typeof value === 'string') return value;
    }
    // Also check for object values with name property
    const value = table[sym];
    if (typeof value === 'object' && value !== null && 'name' in value && typeof value.name === 'string') {
      return value.name;
    }
  }

  // Third try: table config at Symbol.for('drizzle:PgTable')
  const pgTableSym = Symbol.for('drizzle:PgTable');
  if (table[pgTableSym] && typeof table[pgTableSym] === 'object') {
    const config = table[pgTableSym];
    if (config.name) return config.name as string;
  }

  throw new Error(`Could not determine table name from: ${JSON.stringify(Object.keys(table))}`);
};

/**
 * Extract column name from a Drizzle column reference
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getColumnName = (col: any): string | undefined => {
  if (!col) return undefined;
  return col.name || col.column?.name || (col._ && col._.name);
};

/**
 * Extract value from a Drizzle value wrapper
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractValue = (val: any): unknown => {
  if (val === null || val === undefined) return val;
  if (typeof val === 'object' && 'value' in val) return val.value;
  return val;
};

/**
 * Compare two values with proper type handling
 */
const compareValues = (a: unknown, b: unknown, op: 'gt' | 'lt' | 'gte' | 'lte'): boolean => {
  // Handle null/undefined
  if (a === null || a === undefined || b === null || b === undefined) return false;

  // Handle dates
  const aVal = a instanceof Date ? a.getTime() : typeof a === 'string' && !isNaN(Date.parse(a)) ? Date.parse(a) : a;
  const bVal = b instanceof Date ? b.getTime() : typeof b === 'string' && !isNaN(Date.parse(b)) ? Date.parse(b) : b;

  // Compare numbers or strings
  switch (op) {
    case 'gt':
      return aVal > bVal;
    case 'lt':
      return aVal < bVal;
    case 'gte':
      return aVal >= bVal;
    case 'lte':
      return aVal <= bVal;
  }
};

/**
 * Create a predicate function from a Drizzle condition
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createPredicate(condition: any): (record: MockRecord) => boolean {
  if (!condition) return () => true;

  // Check for SQL template literal (raw SQL) - Drizzle's and(), or(), eq(), and raw sql``
  if (condition.queryChunks) {
    const chunks = condition.queryChunks;

    // Categorize chunks:
    // - Column chunks have .name property
    // - Value chunks have .value property but no .name
    // - Nested SQL chunks have .queryChunks property
    // - Operator strings are value chunks where value is an operator like " = ", " and ", etc.

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnChunks = chunks.filter((c: any) => c && typeof c === 'object' && c.name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nestedSqlChunks = chunks.filter((c: any) => c && typeof c === 'object' && c.queryChunks);

    // Value chunks - separate operators from actual values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allValueChunks = chunks.filter((c: any) => c && typeof c === 'object' && 'value' in c && !c.name && !c.queryChunks);

    // Operators are value chunks containing SQL operators
    const operatorPatterns = [' = ', '=', ' <> ', '<>', ' != ', '!=', ' < ', '<', ' > ', '>', ' <= ', '<=', ' >= ', '>=', ' and ', ' or ', ' ilike ', ' like ', ' is null', ' is not null', ' not in ', ' in '];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const operatorChunks = allValueChunks.filter((c: any) => {
      const val = String(c.value).toLowerCase();
      return operatorPatterns.some(op => val.includes(op.toLowerCase())) || val.trim() === '';
    });

    // Actual values are value chunks that are NOT operators
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actualValueChunks = allValueChunks.filter((c: any) => {
      const val = String(c.value);
      // Not an operator and not empty
      if (val.trim() === '') return false;
      const lowerVal = val.toLowerCase();
      return !operatorPatterns.some(op => lowerVal.includes(op.toLowerCase()));
    });

    // Collect all operator strings to understand the SQL structure
    const operatorString = operatorChunks.map((c: { value: unknown }) => String(c.value)).join('').toLowerCase();


    // Handle simple equality: column = value (Drizzle's eq())
    // Structure: ["", column, " = ", value, ""]
    if (columnChunks.length === 1 && actualValueChunks.length === 1 && operatorString.includes('=') && !operatorString.includes('<') && !operatorString.includes('>')) {
      const columnName = getColumnName(columnChunks[0]);
      const value = extractValue(actualValueChunks[0]);
      if (columnName) {
        return (record: MockRecord) => record[columnName] === value;
      }
    }

    // Handle inequality: column <> value or column != value
    if (columnChunks.length === 1 && actualValueChunks.length === 1 && (operatorString.includes('<>') || operatorString.includes('!='))) {
      const columnName = getColumnName(columnChunks[0]);
      const value = extractValue(actualValueChunks[0]);
      if (columnName) {
        return (record: MockRecord) => record[columnName] !== value;
      }
    }

    // Handle comparisons: <=, >=, <, >
    if (columnChunks.length === 1 && actualValueChunks.length === 1) {
      const columnName = getColumnName(columnChunks[0]);
      const value = extractValue(actualValueChunks[0]);
      if (columnName) {
        if (operatorString.includes('<=')) {
          return (record: MockRecord) => compareValues(record[columnName], value, 'lte');
        }
        if (operatorString.includes('>=')) {
          return (record: MockRecord) => compareValues(record[columnName], value, 'gte');
        }
        if (operatorString.includes('<') && !operatorString.includes('<=') && !operatorString.includes('<>')) {
          return (record: MockRecord) => compareValues(record[columnName], value, 'lt');
        }
        if (operatorString.includes('>') && !operatorString.includes('>=')) {
          return (record: MockRecord) => compareValues(record[columnName], value, 'gt');
        }
      }
    }

    // Handle AND compound - multiple nested SQL conditions joined with ' and '
    if (operatorString.includes(' and ') && nestedSqlChunks.length > 0) {
      const predicates = nestedSqlChunks.map((c: unknown) => createPredicate(c));
      if (predicates.length > 0) {
        return (record: MockRecord) => predicates.every((p: (r: MockRecord) => boolean) => p(record));
      }
    }

    // Handle OR compound
    if (operatorString.includes(' or ') && nestedSqlChunks.length > 0) {
      const predicates = nestedSqlChunks.map((c: unknown) => createPredicate(c));
      if (predicates.length > 0) {
        return (record: MockRecord) => predicates.some((p: (r: MockRecord) => boolean) => p(record));
      }
    }

    // Handle IS NOT NULL
    if (operatorString.includes('is not null') && columnChunks.length === 1) {
      const columnName = getColumnName(columnChunks[0]);
      if (columnName) {
        return (record: MockRecord) => record[columnName] !== null && record[columnName] !== undefined;
      }
    }

    // Handle IS NULL
    if (operatorString.includes('is null') && !operatorString.includes('is not null') && columnChunks.length === 1) {
      const columnName = getColumnName(columnChunks[0]);
      if (columnName) {
        return (record: MockRecord) => record[columnName] === null || record[columnName] === undefined;
      }
    }

    // Handle NOT IN pattern
    if (operatorString.includes('not in') && columnChunks.length === 1) {
      const columnName = getColumnName(columnChunks[0]);
      if (columnName) {
        const extractedValues = actualValueChunks.map((v: unknown) => extractValue(v));
        const values = extractedValues.filter((val: unknown): val is string | number => val !== undefined && (typeof val === 'string' || typeof val === 'number'));
        if (values.length > 0) {
          return (record: MockRecord) => !values.includes(record[columnName] as string | number);
        }
      }
    }

    // Handle ILIKE pattern
    if (operatorString.includes('ilike') && columnChunks.length === 1 && actualValueChunks.length === 1) {
      const columnName = getColumnName(columnChunks[0]);
      const pattern = String(extractValue(actualValueChunks[0])).replace(/%/g, '.*');
      if (columnName) {
        const regex = new RegExp(`^${pattern}$`, 'i');
        return (record: MockRecord) => {
          const val = record[columnName];
          return regex.test(typeof val === 'string' ? val : '');
        };
      }
    }

    // Handle LIKE pattern
    if (operatorString.includes('like') && !operatorString.includes('ilike') && columnChunks.length === 1 && actualValueChunks.length === 1) {
      const columnName = getColumnName(columnChunks[0]);
      const pattern = String(extractValue(actualValueChunks[0])).replace(/%/g, '.*');
      if (columnName) {
        const regex = new RegExp(`^${pattern}$`);
        return (record: MockRecord) => {
          const val = record[columnName];
          return regex.test(typeof val === 'string' ? val : '');
        };
      }
    }

    // If we have a single nested SQL chunk, recursively process it
    if (nestedSqlChunks.length === 1) {
      return createPredicate(nestedSqlChunks[0]);
    }

    // Handle parenthesized single condition: ["(", nested, ")"]
    if (nestedSqlChunks.length === 1 && operatorString.includes('(') && operatorString.includes(')')) {
      return createPredicate(nestedSqlChunks[0]);
    }

    // Default for unparsed SQL
    return () => true;
  }

  const op = condition.operator ?? condition.op;
  const type = condition.type;
  const left = condition.left ?? condition.leftOperand;
  const right = condition.right ?? condition.rightOperand;

  // Handle eq operator
  if (op === '=' || op === 'eq' || type === 'BinaryExpression') {
    if (left && right !== undefined) {
      const columnName = getColumnName(left);
      if (columnName) {
        const value = extractValue(right);
        return (record: MockRecord) => record[columnName] === value;
      }
    }
  }

  // Handle ne (not equal) operator
  if (op === '<>' || op === '!=' || op === 'ne') {
    if (left && right !== undefined) {
      const columnName = getColumnName(left);
      if (columnName) {
        const value = extractValue(right);
        return (record: MockRecord) => record[columnName] !== value;
      }
    }
  }

  // Handle gt (greater than) operator
  if (op === '>' || op === 'gt') {
    if (left && right !== undefined) {
      const columnName = getColumnName(left);
      if (columnName) {
        const value = extractValue(right);
        return (record: MockRecord) => compareValues(record[columnName], value, 'gt');
      }
    }
  }

  // Handle gte (greater than or equal) operator
  if (op === '>=' || op === 'gte') {
    if (left && right !== undefined) {
      const columnName = getColumnName(left);
      if (columnName) {
        const value = extractValue(right);
        return (record: MockRecord) => compareValues(record[columnName], value, 'gte');
      }
    }
  }

  // Handle lt (less than) operator
  if (op === '<' || op === 'lt') {
    if (left && right !== undefined) {
      const columnName = getColumnName(left);
      if (columnName) {
        const value = extractValue(right);
        return (record: MockRecord) => compareValues(record[columnName], value, 'lt');
      }
    }
  }

  // Handle lte (less than or equal) operator
  if (op === '<=' || op === 'lte') {
    if (left && right !== undefined) {
      const columnName = getColumnName(left);
      if (columnName) {
        const value = extractValue(right);
        return (record: MockRecord) => compareValues(record[columnName], value, 'lte');
      }
    }
  }

  // Handle in operator
  if (op === 'in' || op === 'IN' || type === 'InArray') {
    const columnName = getColumnName(left);
    const values = condition.values ?? (Array.isArray(right) ? right.map(extractValue) : []);
    if (columnName && values.length > 0) {
      return (record: MockRecord) => values.includes(record[columnName]);
    }
  }

  // Handle notIn operator
  if (op === 'not in' || op === 'NOT IN' || op === 'notIn' || type === 'NotInArray') {
    const columnName = getColumnName(left);
    const values = condition.values ?? (Array.isArray(right) ? right.map(extractValue) : []);
    if (columnName && values.length > 0) {
      return (record: MockRecord) => !values.includes(record[columnName]);
    }
  }

  // Handle isNull operator
  if (op === 'isNull' || op === 'is null' || type === 'IsNull') {
    const col = left ?? condition.column ?? condition.value;
    const columnName = getColumnName(col);
    if (columnName) {
      return (record: MockRecord) => record[columnName] === null || record[columnName] === undefined;
    }
  }

  // Handle isNotNull operator
  if (op === 'isNotNull' || op === 'is not null' || type === 'IsNotNull') {
    const col = left ?? condition.column ?? condition.value;
    const columnName = getColumnName(col);
    if (columnName) {
      return (record: MockRecord) => record[columnName] !== null && record[columnName] !== undefined;
    }
  }

  // Handle between operator
  if (op === 'between' || op === 'BETWEEN' || type === 'Between') {
    const columnName = getColumnName(left);
    const min = extractValue(condition.min ?? condition.low ?? right?.[0]);
    const max = extractValue(condition.max ?? condition.high ?? right?.[1]);
    if (columnName && min !== undefined && max !== undefined) {
      return (record: MockRecord) =>
        compareValues(record[columnName], min, 'gte') && compareValues(record[columnName], max, 'lte');
    }
  }

  // Handle and operator (object-based)
  if (op === 'and' || type === 'And') {
    const conditions = condition.conditions ?? condition.expressions ?? [];
    const predicates = conditions.map((c: unknown) => createPredicate(c));
    return (record: MockRecord) => predicates.every((p: (r: MockRecord) => boolean) => p(record));
  }

  // Handle or operator (object-based)
  if (op === 'or' || type === 'Or') {
    const conditions = condition.conditions ?? condition.expressions ?? [];
    const predicates = conditions.map((c: unknown) => createPredicate(c));
    return (record: MockRecord) => predicates.some((p: (r: MockRecord) => boolean) => p(record));
  }

  // Handle not operator
  if (op === 'not' || type === 'Not') {
    const inner = condition.condition ?? condition.expression ?? condition.value;
    if (inner) {
      const innerPred = createPredicate(inner);
      return (record: MockRecord) => !innerPred(record);
    }
  }

  // Handle ilike
  if (op === 'ilike' || op === 'ILIKE') {
    if (left && right) {
      const columnName = getColumnName(left);
      if (columnName) {
        const pattern = String(extractValue(right)).replace(/%/g, '.*');
        const regex = new RegExp(`^${pattern}$`, 'i');
        return (record: MockRecord) => {
          const val = record[columnName];
          return regex.test(typeof val === 'string' ? val : '');
        };
      }
    }
  }

  // Handle like (case-sensitive)
  if (op === 'like' || op === 'LIKE') {
    if (left && right) {
      const columnName = getColumnName(left);
      if (columnName) {
        const pattern = String(extractValue(right)).replace(/%/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return (record: MockRecord) => {
          const val = record[columnName];
          return regex.test(typeof val === 'string' ? val : '');
        };
      }
    }
  }

  // Default: match all records
  return () => true;
}

/**
 * Extract sort direction and column info from orderBy argument
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractOrderInfo = (col: any): { columnName: string; direction: 'asc' | 'desc' } | null => {
  if (!col) return null;

  // Handle desc() wrapper
  if (col.value || col.column) {
    const inner = col.value ?? col.column;
    const columnName = getColumnName(inner);
    if (columnName) {
      // Check if it's desc
      const isDesc =
        col.order === 'desc' || col.direction === 'desc' || col.isDesc === true || col.type === 'Desc';
      return { columnName, direction: isDesc ? 'desc' : 'asc' };
    }
  }

  // Direct column reference (defaults to asc)
  const columnName = getColumnName(col);
  if (columnName) {
    return { columnName, direction: 'asc' };
  }

  return null;
};

/**
 * Check if a column selection is an aggregation (like count(*))
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAggregation = (col: any): boolean => {
  if (!col) return false;
  // Check for SQL template with aggregation functions
  // Avoid JSON.stringify as queryChunks can contain cyclic structures
  const chunks = col.queryChunks || col.sql;
  if (chunks) {
    // Check string chunks for aggregation keywords
    const checkForAggregation = (val: unknown): boolean => {
      if (typeof val === 'string') {
        const lower = val.toLowerCase();
        return lower.includes('count(') || lower.includes('sum(') ||
               lower.includes('avg(') || lower.includes('max(') || lower.includes('min(');
      }
      if (Array.isArray(val)) {
        return val.some(checkForAggregation);
      }
      if (val && typeof val === 'object' && 'value' in val) {
        return checkForAggregation((val as { value: unknown }).value);
      }
      return false;
    };
    return checkForAggregation(chunks);
  }
  return false;
};

/**
 * Create mock query builders that work with MockDataStore
 */
const createMockDrizzle = (mockStore: MockDataStore) => {
  // Select builder
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createSelectBuilder = (columns?: Record<string, any>) => {
    let tableName = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let predicate: ((r: any) => boolean) | undefined;
    let limitVal: number | undefined;
    let offsetVal: number | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderByColumns: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let groupByColumns: any[] = [];

    const builder = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      from: (table: any) => {
        tableName = getTableName(table);
        return builder;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: (condition: any) => {
        if (condition) predicate = createPredicate(condition);
        return builder;
      },
      limit: (n: number) => {
        limitVal = n;
        return builder;
      },
      offset: (n: number) => {
        offsetVal = n;
        return builder;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy: (...cols: any[]) => {
        orderByColumns = cols.flat();
        return builder;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      groupBy: (...cols: any[]) => {
        groupByColumns = cols.flat();
        return builder;
      },

      // Make it thenable for Effect
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then: (resolve: any, reject?: any) => {
        const effect = Effect.gen(function* () {
          let records = yield* mockStore.findAll(tableName);

          if (predicate) {
            records = records.filter(predicate);
          }

          // Handle groupBy with aggregations
          if (groupByColumns.length > 0 && columns) {
            const groupColNames = groupByColumns.map((c) => getColumnName(c)).filter(Boolean) as string[];
            const hasCountAgg = Object.values(columns).some((c) => isAggregation(c));

            if (groupColNames.length > 0 && hasCountAgg) {
              // Group records by the group columns
              const groups = new Map<string, MockRecord[]>();
              for (const record of records) {
                const key = groupColNames
                  .map((col) => {
                    const val = record[col];
                    if (val === null || val === undefined) return '';
                    if (typeof val === 'object') return JSON.stringify(val);
                    if (typeof val === 'string') return val;
                    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
                    return JSON.stringify(val);
                  })
                  .join('|');
                const existing = groups.get(key) ?? [];
                existing.push(record);
                groups.set(key, existing);
              }

              // Build aggregated results
              const aggregatedResults: MockRecord[] = [];
              for (const [_key, groupRecords] of groups) {
                const result: MockRecord = { id: '' };

                // Add group columns
                for (const colName of groupColNames) {
                  result[colName] = groupRecords[0]?.[colName];
                }

                // Add aggregations
                for (const [alias, colDef] of Object.entries(columns)) {
                  if (isAggregation(colDef)) {
                    // For count(*), just use the length
                    result[alias] = groupRecords.length;
                  } else {
                    const colName = getColumnName(colDef);
                    if (colName) {
                      result[alias] = groupRecords[0]?.[colName];
                    }
                  }
                }

                aggregatedResults.push(result);
              }

              // Apply orderBy to aggregated results
              if (orderByColumns.length > 0) {
                aggregatedResults.sort((a, b) => {
                  for (const col of orderByColumns) {
                    const orderInfo = extractOrderInfo(col);
                    if (orderInfo) {
                      const { columnName, direction } = orderInfo;
                      const aVal = a[columnName] as string | number | null | undefined;
                      const bVal = b[columnName] as string | number | null | undefined;
                      if (aVal === null || aVal === undefined) return direction === 'asc' ? 1 : -1;
                      if (bVal === null || bVal === undefined) return direction === 'asc' ? -1 : 1;
                      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
                    }
                  }
                  return 0;
                });
              }

              return aggregatedResults;
            }
          }

          // Apply orderBy
          if (orderByColumns.length > 0) {
            records = [...records].sort((a, b) => {
              for (const col of orderByColumns) {
                const orderInfo = extractOrderInfo(col);
                if (orderInfo) {
                  const { columnName, direction } = orderInfo;
                  const aVal = a[columnName] as string | number | null | undefined;
                  const bVal = b[columnName] as string | number | null | undefined;

                  // Handle null/undefined
                  if (aVal === null || aVal === undefined) return direction === 'asc' ? 1 : -1;
                  if (bVal === null || bVal === undefined) return direction === 'asc' ? -1 : 1;

                  // Compare values
                  if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                  if (aVal > bVal) return direction === 'asc' ? 1 : -1;
                }
              }
              return 0;
            });
          }

          if (offsetVal !== undefined) {
            records = records.slice(offsetVal);
          }
          if (limitVal !== undefined) {
            records = records.slice(0, limitVal);
          }

          // Handle column selection (without groupBy)
          if (columns && groupByColumns.length === 0) {
            // Check if we have count(*) without groupBy - return total count
            const hasCountAgg = Object.values(columns).some((c) => isAggregation(c));
            if (hasCountAgg) {
              const result: MockRecord = { id: '' };
              for (const [alias, colDef] of Object.entries(columns)) {
                if (isAggregation(colDef)) {
                  result[alias] = records.length;
                } else {
                  const colName = getColumnName(colDef);
                  if (colName && records[0]) {
                    result[alias] = records[0][colName];
                  }
                }
              }
              return [result];
            }

            // Regular column selection
            const colEntries = Object.entries(columns);
            records = records.map((r) => {
              const result: MockRecord = { id: r.id };
              for (const [alias, colDef] of colEntries) {
                const colName = getColumnName(colDef) || alias;
                if (colName in r) {
                  result[alias] = r[colName];
                }
              }
              return result;
            });
          }

          return records;
        });

        return Effect.runPromise(effect).then(resolve, reject);
      }
    };

    return builder;
  };

  // Insert builder
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createInsertBuilder = (table: any) => {
    const tableName = getTableName(table);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] = [];
    let returningFlag = false;

    const builder = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      values: (d: any) => {
        data = Array.isArray(d) ? d : [d];
        return builder;
      },
      returning: () => {
        returningFlag = true;
        return builder;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onConflictDoUpdate: (_config: any) => builder,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onConflictDoNothing: (_config?: any) => builder,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then: (resolve: any, reject?: any) => {
        const effect = Effect.gen(function* () {
          const results: MockRecord[] = [];
          for (const item of data) {
            const record = yield* mockStore.insert(tableName, item);
            results.push(record);
          }
          return returningFlag ? results : [];
        });

        return Effect.runPromise(effect).then(resolve, reject);
      }
    };

    return builder;
  };

  // Update builder
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createUpdateBuilder = (table: any) => {
    const tableName = getTableName(table);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData: any = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let predicate: ((r: any) => boolean) | undefined;
    let returningFlag = false;

    const builder = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (d: any) => {
        updateData = d;
        return builder;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: (condition: any) => {
        if (condition) predicate = createPredicate(condition);
        return builder;
      },
      returning: () => {
        returningFlag = true;
        return builder;
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then: (resolve: any, reject?: any) => {
        const effect = Effect.gen(function* () {
          const records = yield* mockStore.findAll(tableName);
          const toUpdate = predicate ? records.filter(predicate) : records;

          const results: MockRecord[] = [];
          for (const record of toUpdate) {
            const updated = yield* mockStore.update(tableName, record.id, updateData);
            if (updated._tag === 'Some') {
              results.push(updated.value);
            }
          }

          return returningFlag ? results : [];
        });

        return Effect.runPromise(effect).then(resolve, reject);
      }
    };

    return builder;
  };

  // Delete builder
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createDeleteBuilder = (table: any) => {
    const tableName = getTableName(table);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let predicate: ((r: any) => boolean) | undefined;
    let returningFlag = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let returningColumns: any;

    const builder = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: (condition: any) => {
        if (condition) predicate = createPredicate(condition);
        return builder;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      returning: (cols?: any) => {
        returningFlag = true;
        returningColumns = cols;
        return builder;
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then: (resolve: any, reject?: any) => {
        const effect = Effect.gen(function* () {
          const records = yield* mockStore.findAll(tableName);
          const toDelete = predicate ? records.filter(predicate) : records;

          const results: MockRecord[] = [];
          for (const record of toDelete) {
            const deleted = yield* mockStore.delete(tableName, record.id);
            if (deleted) {
              if (returningColumns) {
                const partial = Object.fromEntries(
                  Object.entries(returningColumns).map(([key, col]) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const colName = (col as any).name || key;
                    return [key, record[colName]];
                  })
                ) as MockRecord;
                results.push(partial);
              } else {
                results.push(record);
              }
            }
          }

          return returningFlag ? results : [];
        });

        return Effect.runPromise(effect).then(resolve, reject);
      }
    };

    return builder;
  };

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (columns?: any) => createSelectBuilder(columns),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    insert: (table: any) => createInsertBuilder(table),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (table: any) => createUpdateBuilder(table),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete: (table: any) => createDeleteBuilder(table),

    // Query object for relational queries
    query: new Proxy(
      {},
      {
        get: (_target, tableNameProp) => ({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          findMany: async (options: any = {}) => {
            let records = await Effect.runPromise(mockStore.findAll(String(tableNameProp)));

            if (options.where) {
              const pred = createPredicate(options.where);
              records = records.filter(pred);
            }
            if (options.offset) {
              records = records.slice(options.offset);
            }
            if (options.limit) {
              records = records.slice(0, options.limit);
            }

            return records;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          findFirst: async (options: any = {}) => {
            let records = await Effect.runPromise(mockStore.findAll(String(tableNameProp)));

            if (options.where) {
              const pred = createPredicate(options.where);
              records = records.filter(pred);
            }

            return records[0] ?? null;
          }
        })
      }
    )
  };
};

/**
 * MockPgDrizzle Layer
 *
 * Provides a mock PgDrizzle implementation using MockDataStore.
 */
export const MockPgDrizzleLive = Layer.effect(
  PgDrizzle,
  Effect.gen(function* () {
    const mockStore = yield* MockDataStore;
    console.log('[MockPgDrizzle] Initialized mock Drizzle with in-memory store');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createMockDrizzle(mockStore) as any;
  })
);

/**
 * Complete mock SQL layer (MockDataStore + MockPgDrizzle)
 */
export const MockSqlLive = Layer.mergeAll(
  MockDataStore.Default,
  MockPgDrizzleLive.pipe(Layer.provide(MockDataStore.Default))
);
