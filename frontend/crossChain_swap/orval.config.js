module.exports = {
  STOA: {
    output: {
      mode: "tags-split",
      target: "src/utils/api/generated/api.ts",
      schemas: "src/utils/api/generated/schemas",
      client: "react-query",
    },
    input: {
      //url api
      target: "",
    },
  },
};
