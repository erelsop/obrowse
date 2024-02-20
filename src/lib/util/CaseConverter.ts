type AnyObj = { [key: string]: any };

class CaseConverter {
  static toCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/gi, ($1) => {
      return $1.toUpperCase().replace('-', '').replace('_', '');
    });
  }

  static convertKeys(obj: any, caseConverter: (str: string) => string): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => CaseConverter.convertKeys(item, caseConverter));
    } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
      return Object.entries(obj).reduce((acc: AnyObj, [key, value]) => {
        acc[caseConverter(key)] = CaseConverter.convertKeys(value, caseConverter);
        return acc;
      }, {});
    }
    return obj;
  }
}

export default CaseConverter;
