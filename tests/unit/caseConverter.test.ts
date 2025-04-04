import CaseConverter from '../../src/lib/util/CaseConverter';

describe('CaseConverter', () => {
  describe('toCamelCase', () => {
    test('should convert kebab-case strings to camelCase', () => {
      expect(CaseConverter.toCamelCase('user-agent')).toBe('userAgent');
      expect(CaseConverter.toCamelCase('video-size')).toBe('videoSize');
      expect(CaseConverter.toCamelCase('test-frame')).toBe('testFrame');
    });

    test('should convert snake_case strings to camelCase', () => {
      expect(CaseConverter.toCamelCase('user_agent')).toBe('userAgent');
      expect(CaseConverter.toCamelCase('video_size')).toBe('videoSize');
      expect(CaseConverter.toCamelCase('test_frame')).toBe('testFrame');
    });

    test('should handle strings that are already camelCase', () => {
      expect(CaseConverter.toCamelCase('userAgent')).toBe('userAgent');
      expect(CaseConverter.toCamelCase('videoSize')).toBe('videoSize');
    });

    test('should handle strings with multiple hyphens or underscores', () => {
      expect(CaseConverter.toCamelCase('very-long-property-name')).toBe('veryLongPropertyName');
      expect(CaseConverter.toCamelCase('very_long_property_name')).toBe('veryLongPropertyName');
      expect(CaseConverter.toCamelCase('very-long_property-name')).toBe('veryLongPropertyName');
    });

    test('should not modify strings without hyphens or underscores', () => {
      expect(CaseConverter.toCamelCase('property')).toBe('property');
      expect(CaseConverter.toCamelCase('name')).toBe('name');
    });
  });

  describe('convertKeys', () => {
    test('should convert keys in a simple object', () => {
      const input = {
        'user-agent': 'Mozilla/5.0',
        'video-size': '1280x720'
      };
      
      const expected = {
        userAgent: 'Mozilla/5.0',
        videoSize: '1280x720'
      };
      
      expect(CaseConverter.convertKeys(input, CaseConverter.toCamelCase)).toEqual(expected);
    });

    test('should convert keys in a nested object', () => {
      const input = {
        'browser-options': {
          'user-agent': 'Mozilla/5.0',
          'window-size': '1280x720'
        },
        'proxy-settings': {
          'server-url': 'http://localhost:8080'
        }
      };
      
      const expected = {
        browserOptions: {
          userAgent: 'Mozilla/5.0',
          windowSize: '1280x720'
        },
        proxySettings: {
          serverUrl: 'http://localhost:8080'
        }
      };
      
      expect(CaseConverter.convertKeys(input, CaseConverter.toCamelCase)).toEqual(expected);
    });

    test('should convert keys in arrays of objects', () => {
      const input = {
        'browser-list': [
          { 'browser-name': 'chrome', 'is-headless': true },
          { 'browser-name': 'firefox', 'is-headless': false }
        ]
      };
      
      const expected = {
        browserList: [
          { browserName: 'chrome', isHeadless: true },
          { browserName: 'firefox', isHeadless: false }
        ]
      };
      
      expect(CaseConverter.convertKeys(input, CaseConverter.toCamelCase)).toEqual(expected);
    });

    test('should handle null and undefined values', () => {
      const input = {
        'user-agent': null,
        'video-size': undefined
      };
      
      const expected = {
        userAgent: null,
        videoSize: undefined
      };
      
      expect(CaseConverter.convertKeys(input, CaseConverter.toCamelCase)).toEqual(expected);
    });

    test('should not modify Date objects', () => {
      const date = new Date('2023-01-01');
      const input = {
        'created-at': date
      };
      
      const expected = {
        createdAt: date
      };
      
      const result = CaseConverter.convertKeys(input, CaseConverter.toCamelCase);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result).toEqual(expected);
    });
  });
}); 