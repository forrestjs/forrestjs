const STRING_TRUTHY_VALUES = ["TRUE", "T", "YES", "Y"];
const STRING_FALSY_VALUES = ["FALSE", "F", "NO", "N"];

module.exports = (val) => {
  if (typeof val === "boolean") return val;

  if (typeof val === "string") {
    if (val.replace(/ /g, "").length === 0) return false;
    if (STRING_TRUTHY_VALUES.includes(val.toUpperCase())) return true;
    if (STRING_FALSY_VALUES.includes(val.toUpperCase())) return false;
  }

  return Boolean(val);
};
