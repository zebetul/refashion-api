const items = [
  {
    id: 1,
    seller: 4,
    title: "2-piece cotton jersey set",
    price: 89.95,
    description:
      "Set with a T-shirt in soft cotton jersey and a pair of shorts in lightweight sweatshirt fabric. T-shirt with a rib-trimmed neckline and dropped shoulders. Shorts with an elasticated, drawstring waist, discreet side pockets and an open back pocket.",
    brand: "H&M",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F18%2F3b%2F183b47f6f611e50d85b92859f6067d0dabfea179.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bkids_boys_setsoutfits%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    rating: { rate: 3.9, count: 120 },
    size: "S",
  },
  {
    id: 2,
    seller: 3,
    title: "Mens Casual Premium Slim Fit T-Shirts ",
    price: 22.3,
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    brand: "Nike",
    category: "men",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: { rate: 4.1, count: 259 },
    size: "S",
  },
  {
    id: 3,
    seller: 2,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description:
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    brand: "Zara",
    category: "men",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: { rate: 4.7, count: 500 },
    size: "S",
  },
  {
    id: 4,
    seller: 1,
    title: "Mens Casual Slim Fit",
    price: 15.99,
    description:
      "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
    brand: "Zara",
    category: "men",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    rating: { rate: 2.1, count: 430 },
    size: "S",
  },
  {
    id: 5,
    seller: 0,
    title: "Suit",
    price: 199.99,
    description:
      "Suit with a classic jacket and matching trousers in woven fabric. Two-button jacket with notch lapels, a fake pocket at the top and flap front pockets. Decorative buttons at the cuffs and a single back vent. Lined. Trousers with an adjustable, elasticated waist, concealed hook-and-eye fastener and zip fly. Side pockets, welt back pockets and tapered legs with creases.",
    brand: "H&M",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F0c%2Fee%2F0ceeafa428ceaab04db6f3cacfb9c3a88ff25a7c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    rating: { rate: 4.6, count: 400 },
    size: "M",
  },
  {
    id: 6,
    seller: 4,
    title: "Cotton T-shirt",
    price: 16.99,
    description:
      "Classic T-shirt in soft, printed cotton jersey with a ribbed trim around the neckline.",
    brand: "H&M",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/3e/78/3e78589d1e4854c8fe2d2ce2b2123a9fb711f0aa.jpg],origin[dam],category[kids_boys_clothing_tshirtsshirts_tshirts],type[DESCRIPTIVESTILLLIFE],res[w],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 3.9, count: 70 },
    size: "M",
  },
  {
    id: 7,
    seller: 3,
    title: "Patterned cotton dress",
    price: 14.99,
    description:
      "Comfortable sleeveless dress in soft, patterned cotton jersey with a gathered seam at the waist and gently flared skirt.",
    brand: "H&M",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/c0/fa/c0fab0d9660bd6b88ea3fed8c96c783316a4cfe1.jpg],origin[dam],category[kids_girls_clothing_dresses],type[DESCRIPTIVESTILLLIFE],res[w],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 3, count: 400 },
    size: "M",
  },
  {
    id: 8,
    seller: 2,
    title: "Patterned cotton dress",
    price: 10.99,
    description:
      "Comfortable sleeveless dress in soft, patterned cotton jersey with a gathered seam at the waist and gently flared skirt.",
    brand: "Zara",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F06%2F03%2F06039a50ac452ddee95287fa65cfb61b90d02d08.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bkids_girls_clothing_dresses%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    rating: { rate: 1.9, count: 100 },
    size: "M",
  },
  {
    id: 9,
    seller: 1,
    title: "Zip-through hoodie",
    price: 24.99,
    description:
      "Zip-through hoodie in sweatshirt fabric made from an organic cotton and recycled polyester blend with a soft brushed inside. Jersey-lined hood, a zip down the front, front pockets and ribbing at the cuffs and hem.",
    brand: "Zara",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F69%2Fb8%2F69b8426c9bfa38b4fc029ac136754b41bed94a9e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bkids_boy8y_jumperscardigans_Hoodiessweatshirt%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    rating: { rate: 3.3, count: 203 },
    size: "XL",
  },
  {
    id: 10,
    seller: 0,
    title: "3-pack printed T-shirts",
    price: 79.99,
    description:
      "Classic T-shirts in soft, printed cotton jersey with a rib-trimmed neckline.",
    brand: "Zara",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/11/94/1194615772ee2784150b44a18a09b0bd8cce865b.jpg],origin[dam],category[kids_boys_clothing_tshirtsshirts_tshirts],type[DESCRIPTIVESTILLLIFE],res[w],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 2.9, count: 470 },
    size: "XL",
  },
  {
    id: 11,
    seller: 4,
    title: "2-piece printed set",
    price: 89,
    description:
      "Matching set with a T-shirt and a pair of shorts in soft fabric with print motifs. T-shirt in cotton jersey with dropped shoulders, wide sleeves and ribbing around the neckline. Shorts in lightweight sweatshirt fabric with covered elastication and a drawstring at the waist.",
    brand: "Zara",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/43/93/439310aa2ad4bb7bc38a4ec3577b65a32fdbbd49.jpg],origin[dam],category[kids_clothing_shorts_sweatshorts],type[DESCRIPTIVESTILLLIFE],res[w],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 4.8, count: 319 },
    size: "XL",
  },
  {
    id: 12,
    seller: 4,
    title: "Jacket",
    price: 67,
    description:
      "Jacket in woven fabric with notch lapels, buttons at the front and jetted front pockets. Satin lining.",
    brand: "Zara",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F26%2F19%2F2619773b6c71de8de5fc8e18d27eda822ed9c93c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bkids_clothing_blazersuits%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    rating: { rate: 4.8, count: 400 },
    size: "L",
  },
  {
    id: 13,
    seller: 4,
    title: "Printed pyjamas",
    price: 49,
    description:
      "Pyjamas in soft jersey with a print motif. Top with short sleeves. Shorts with an elasticated waist.",
    brand: "Zara",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/23/e0/23e0db2b0ed8d3ee8edefead245bd19faa03e152.jpg],origin[dam],category[kids_boys_clothing_nightwear_pyjamas],type[DESCRIPTIVESTILLLIFE],res[w],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 2.9, count: 250 },
    size: "L",
  },
  {
    id: 14,
    seller: 4,
    title: "Wide trousers",
    price: 49.99,
    description:
      "Ankle-length trousers in a soft crêpe weave with a loose fit through the hip and thigh. Paper bag waist with smocked elastication, diagonal side pockets and wide legs.",
    brand: "Zara",
    category: "kids",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/af/64/af647570c98c95ca6d235905998d7ee3bb39d1d5.jpg],origin[dam],category[kids_oldergirls_clothing_trousersjeans_trousers],type[DESCRIPTIVESTILLLIFE],res[w],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 2.2, count: 140 },
    size: "M",
  },
  {
    id: 15,
    seller: 3,
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    price: 56.99,
    description:
      "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
    brand: "Zara",
    category: "women",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    rating: { rate: 2.6, count: 235 },
    size: "M",
  },
  {
    id: 16,
    seller: 3,
    title:
      "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    description:
      "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
    brand: "Nike",
    category: "women",
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
    rating: { rate: 2.9, count: 340 },
    size: "M",
  },
  {
    id: 17,
    seller: 3,
    title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    description:
      "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
    brand: "Nike",
    category: "women",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
    rating: { rate: 3.8, count: 679 },
    size: "XS",
  },
  {
    id: 18,
    seller: 3,
    title: "MBJ Women's Solid Short Sleeve Boat Neck V ",
    price: 9.85,
    description:
      "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
    brand: "H&M",
    category: "women",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
    rating: { rate: 4.7, count: 130 },
    size: "XS",
  },
  {
    id: 19,
    seller: 3,
    title: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    description:
      "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
    brand: "Zara",
    category: "women",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
    rating: { rate: 4.5, count: 146 },
    size: "XS",
  },
  {
    id: 20,
    seller: 2,
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    description:
      "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
    brand: "H&M",
    category: "women",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
    rating: { rate: 3.6, count: 145 },
    size: "XS",
  },

  // ---------->
  {
    id: 21,
    seller: 2,
    title: "Linen joggers",
    price: 129.99,
    description:
      "Ankle-length joggers in airy linen with a regular, elasticated drawstring waist and diagonal side pockets.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/14/9d/149dc730cf652092bd9d4084f4914e5bbfe30532.jpg],origin[dam],category[ladies_trousers_joggers],type[DESCRIPTIVESTILLLIFE],res[y],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "XS",
  },

  {
    id: 22,
    seller: 2,
    title: "Linen-blend blazer",
    price: 149.99,
    description:
      "Single-breasted blazer in a linen and viscose weave with notch lapels and a one-button fastening at the front. Long sleeves with shoulder pads and a slit and button at the cuffs. Jetted front pockets with a flap, and a single back vent. Lined.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/4d/63/4d63dc22bb24fdde45fc2fb1251efe0d7d871e6f.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "XS",
  },
  {
    id: 23,
    seller: 2,
    title: "Cropped pull-on trousers",
    price: 59.99,
    description:
      "Ankle-length trousers in a softly draping viscose weave. High waist with covered elastication, discreet pockets in the side seams and wide, straight legs.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/3c/e6/3ce6e70dc3130285d6cdbe979b2e0efce4206a2f.jpg],origin[dam],category[ladies_trousers_highwaisted],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "XS",
  },
  {
    id: 24,
    seller: 2,
    title: "Tie-belt shirt dress",
    price: 59.99,
    description:
      "Calf-length dress in a viscose weave with a collar, V-neck and short sleeves. Seam with a tie belt at the waist, concealed elastication at the back, and a flared skirt with a rounded hem. Unlined.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/22/c2/22c29554fdb52c3bed10a5caf32346a851b3ac44.jpg],origin[dam],category[ladies_dresses_mididresses],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "XS",
  },
  {
    id: 25,
    seller: 2,
    title: "Oversized linen shirt",
    price: 109.99,
    description:
      "Oversized shirt in airy linen with a collar and buttons down the front. Slightly forward-facing shoulder seams and a double-layered yoke. A patch chest pocket, dropped shoulders and long sleeves with buttoned cuffs. Gently rounded hem.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/80/15/80153f16f7f8287a2df1e127e5774f967cfe8968.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "S",
  },
  {
    id: 26,
    seller: 2,
    title: "Tie-belt jersey jumpsuit",
    price: 67.99,
    description:
      "Full-length, wide jumpsuit in textured jersey with narrow shoulder straps and a deep V-shaped neckline at the front and back. Wide tie belt at the waist and discreet pockets in the side seams.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/29/db/29db85b9cfcf6bae20ab8f82929171c9118b00e4.jpg],origin[dam],category[ladies_jumpsuits],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "S",
  },
  {
    id: 27,
    seller: 0,
    title: "Linen-blend shirt",
    price: 103.99,
    description:
      "Longer shirt in woven fabric made from a cotton and linen blend with a collar and buttons down the front. Loose fit with dropped shoulders, long sleeves with buttoned cuffs, a patch chest pocket and a rounded hem.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/06/a0/06a00633a3429b4411f6e0636776f26c715aee0b.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "S",
  },
  {
    id: 28,
    seller: 0,
    title: "Tie-belt shirt dress",
    price: 89.99,
    description:
      "Calf-length dress in a viscose weave with a collar, V-neck and short sleeves. Seam with a tie belt at the waist, concealed elastication at the back, and a flared skirt with a rounded hem. Unlined.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/60/0e/600eb2d705985add7603a05b0489a26854e0b40c.jpg],origin[dam],category[ladies_dresses_mididresses],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "S",
  },
  {
    id: 29,
    seller: 0,
    title: "Linen-blend pull-on trousers",
    price: 79.99,
    description:
      "Full-length trousers in an airy weave made from a viscose and linen blend. High, elasticated waist with a drawstring and wide legs with in-seam side pockets.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/e1/14/e1141f56eaf51a2269e45cb8cd22df536071c63f.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "L",
  },
  {
    id: 30,
    seller: 0,
    title: "Ankle-length linen trousers",
    price: 129.99,
    description:
      "Ankle-length linen trousers in a relaxed fit. High waist with covered elastication and small frill at the top, diagonal side pockets and wide legs.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/01/fd/01fd4e3dff5c984dd6993f838ab3accd024beb5a.jpg],origin[dam],category[ladies_trousers_highwaisted],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "L",
  },
  {
    id: 31,
    seller: 0,
    title: "Linen-blend pull-on shorts",
    price: 69.99,
    description:
      "Shorts in a linen and viscose weave. High waist with covered elastication and a small frill trim, and discreet pockets in the side seams.",
    brand: "H&M",
    category: "women",
    image:
      "https://lp2.hm.com/hmgoepprod?set=source[/55/3e/553e76fa79b6abd5c8311c0fac2e1909d0e9ca28.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[z],hmver[2]&call=url[file:/product/main]",
    rating: { rate: 1, count: 100 },
    size: "L",
  },
  /*
{
  id: 32,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "L",
},
{
  id: 33,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "XL",
},
{
  id: 34,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "XL",
},
{
  id: 35,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "XL",
},
{
  id: 36,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "XL",
},
{
  id: 37,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "M",
},
{
  id: 38,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "M",
},
{
  id: 39,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "M",
},
{
  id: 40,
  seller: 0,
  title: "",
  price: ,
  description:
    "",
  brand: "H&M",
  category: "women",
  image: "",
  rating: { rate: 1, count: 100 },
  size: "M",
},
*/
];

export default items;
