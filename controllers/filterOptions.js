const handleGetFilterOptions = async function (req, res, dataBase) {
  try {
    const filterOptions = {
      sections: [],
      categories: [],
      brands: [],
      sizes: [],
      conditions: [],
      colours: [],
      price: 0,
    };

    // EXTRACTING FILTER OPTIONS FROM DATABASE
    // Retrieve distinct sections
    const sections = await dataBase("items").distinct("section");
    filterOptions.sections = sections.map((row) => row.section);

    // Retrieve distinct categories
    const categories = await dataBase("items").distinct("category");
    filterOptions.categories = categories.map((row) => row.category);

    // Retrieve distinct brands
    const brands = await dataBase("items").distinct("brand");
    filterOptions.brands = brands.map((row) => row.brand);

    // Retrieve distinct sizes
    const sizes = await dataBase("items").distinct("size");
    filterOptions.sizes = sizes.map((row) => row.size);

    // Retrieve distinct conditions
    const conditions = await dataBase("items").distinct("condition");
    filterOptions.conditions = conditions.map((row) => row.condition);

    // Retrieve distinct colours. Colours column's value is an array of colours and we need to flatten it and remove duplicates
    const colours = await dataBase("items").distinct("colours");
    filterOptions.colours = [...new Set(colours.flatMap((row) => row.colours))];

    // Retrieve maximum price
    const maxPrice = await dataBase("items").max("price").first();
    filterOptions.price = maxPrice.max || 0;

    res.json(filterOptions);
  } catch (err) {
    console.error(err);
    res.json("🔥🔥🔥 Database not responding");
  }
};
export default handleGetFilterOptions;
