import { sanitize, trim } from './clean'

describe('sanitize', () => {
  test('replace & with &amp;', () => {
    expect(sanitize("&")).toBe('&amp;');
    expect(sanitize("string beginning & string ending")).toBe('string beginning &amp; string ending');
    expect(sanitize("string beginning&string ending")).toBe('string beginning&amp;string ending');
  });
  test('replace < with &lt;', () => {
    expect(sanitize("<")).toBe('&lt;');
    expect(sanitize("string beginning < string ending")).toBe('string beginning &lt; string ending');
    expect(sanitize("string beginning<string ending")).toBe('string beginning&lt;string ending');
  });
  test('replace > with &gt;', () => {
    expect(sanitize(">")).toBe('&gt;');
    expect(sanitize("string beginning > string ending")).toBe('string beginning &gt; string ending');
    expect(sanitize("string beginning>string ending")).toBe('string beginning&gt;string ending');
  });
  test('replace " with &quot;', () => {
    expect(sanitize("\"")).toBe('&quot;');
    expect(sanitize("string beginning \" string ending")).toBe('string beginning &quot; string ending');
    expect(sanitize("string beginning\"string ending")).toBe('string beginning&quot;string ending');
  });
  test('replace \' with &#x27;', () => {
    expect(sanitize("'")).toBe('&#x27;');
    expect(sanitize("string beginning ' string ending")).toBe('string beginning &#x27; string ending');
    expect(sanitize("string beginning'string ending")).toBe('string beginning&#x27;string ending');
  });
  test('replace / with &#x2F;', () => {
    expect(sanitize("/")).toBe('&#x2F;');
    expect(sanitize("string beginning / string ending")).toBe('string beginning &#x2F; string ending');
    expect(sanitize("string beginning/string ending")).toBe('string beginning&#x2F;string ending');
  });
})

describe('trimming', () => {
  test('trim whitespace from beginning of string', () => {
    expect(trim("  /")).toBe('/');
  });
  test('trim whitespace from end of string', () => {
    expect(trim("/   ")).toBe('/');
  });

  test('trim whitespace from boths ends of string', () => {
    expect(trim("    /   ")).toBe('/');
    expect(trim("       ")).toBe('');
  });
})