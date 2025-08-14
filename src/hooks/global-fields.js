export const globalFieldsHook = context => {
  const { query } = context.params;
console.log(query);
  if (query && query.fields) {
    query.$select = query.fields.split(',').map(f => f.trim());
    delete query.fields;
  }

  return context;
};