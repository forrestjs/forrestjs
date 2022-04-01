const str2bool = require("./str2bool");

describe("str2bool", () => {
  it("Should work with booleans", () => {
    expect(str2bool(true)).toBe(true);
    expect(str2bool(false)).toBe(false);
  });

  it('Should work with "TRUE" and "FALSE', () => {
    expect(str2bool("true")).toBe(true);
    expect(str2bool("TRUE")).toBe(true);
    expect(str2bool("TrUe")).toBe(true);
    expect(str2bool("false")).toBe(false);
    expect(str2bool("FALSE")).toBe(false);
    expect(str2bool("FaLsE")).toBe(false);
  });

  it('Should work with "T" and "F', () => {
    expect(str2bool("t")).toBe(true);
    expect(str2bool("T")).toBe(true);
    expect(str2bool("f")).toBe(false);
    expect(str2bool("F")).toBe(false);
  });

  it('Should work with "yes" and "no', () => {
    expect(str2bool("yes")).toBe(true);
    expect(str2bool("YES")).toBe(true);
    expect(str2bool("YeS")).toBe(true);
    expect(str2bool("no")).toBe(false);
    expect(str2bool("NO")).toBe(false);
    expect(str2bool("No")).toBe(false);
  });

  it('Should work with "Y" and "N', () => {
    expect(str2bool("y")).toBe(true);
    expect(str2bool("Y")).toBe(true);
    expect(str2bool("n")).toBe(false);
    expect(str2bool("N")).toBe(false);
  });

  it("Should work with empty strings", () => {
    expect(str2bool("")).toBe(false);
    expect(str2bool(" ")).toBe(false);
    expect(str2bool("  ")).toBe(false);
    expect(str2bool("   ")).toBe(false);
  });

  it("Should return true with any string", () => {
    expect(str2bool("foobar")).toBe(true);
    expect(str2bool("1")).toBe(true);
  });

  it("Should work with numbers", () => {
    expect(str2bool(1)).toBe(true);
    expect(str2bool(-1)).toBe(true);
    expect(str2bool(0)).toBe(false);
  });
});
