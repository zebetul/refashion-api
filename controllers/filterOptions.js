const handleGetFilterOptions = async function (req, res, dataBase) {
  try {
    // creating filterOptions object
    const filterOptions = {
      categories: [],
      brands: [],
      sizes: [],
      price: 0,
    };

    // Extracting the filterOptions from the database
    // Retrieve distinct categories
    const categories = await dataBase("items").distinct("category");
    filterOptions.categories = categories.map((row) => row.category);

    // Retrieve distinct brands
    const brands = await dataBase("items").distinct("brand");
    filterOptions.brands = brands.map((row) => row.brand);

    // Retrieve distinct sizes
    const sizes = await dataBase("items").distinct("size");
    filterOptions.sizes = sizes.map((row) => row.size);

    // Retrieve maximum price
    const maxPrice = await dataBase("items").max("price").first();
    filterOptions.price = maxPrice.max;

    res.json(filterOptions);
  } catch (err) {
    console.error(err);
    res.json("🔥🔥🔥 Database not responding");
  }
};
export default handleGetFilterOptions;
