/** The buffet rotates daily. Source: the restaurant's published weekly rotation. */
export type BuffetDish = { name: string; nameFi?: string; desc: string; descFi?: string; veg?: boolean };
export type BuffetDay = { day: { en: string; fi: string }; dishes: BuffetDish[] };

export const EVERY_DAY: BuffetDish[] = [
  { name: "Steamed basmati rice", nameFi: "Höyrytetty basmatiriisi", desc: "Long-grain, cooked fresh through service.", descFi: "Pitkäjyväistä riisiä, keitetään tuoreena.", veg: true },
  { name: "Tandoori roasted vegetables", nameFi: "Uunivihannekset", desc: "Mixed seasonal vegetables roasted until tender and caramelised.", descFi: "Kauden vihanneksia paahdettuna kypsiksi ja karamellisoituneiksi.", veg: true },
  { name: "Crisp spiced legumes", nameFi: "Rapeat maustetut pavut", desc: "Legumes cooked to a crisp with a spicy kick.", descFi: "Papuja rapeiksi kypsennettynä, mausteisella potkulla.", veg: true },
  { name: "Onion pakoda", nameFi: "Sipulipakora", desc: "Thinly sliced onions in seasoned gram flour batter, deep fried.", descFi: "Ohuita sipuliviipaleita maustetussa kikhernetaikinassa.", veg: true },
  { name: "Aloo pakoda", nameFi: "Perunapakora", desc: "Potato slices coated in chickpea flour batter, deep fried.", descFi: "Perunaviipaleita kikhernetaikinassa uppopaistettuna.", veg: true },
  { name: "Turkish döner kebab", nameFi: "Turkkilainen döner kebab", desc: "Seasoned meat carved from the vertical rotisserie.", descFi: "Maustettua lihaa pystygrillistä." },
];

export const WEEK: BuffetDay[] = [
  {
    day: { en: "Monday", fi: "Maanantai" },
    dishes: [
      { name: "Butter Chicken Makhani", desc: "Marinated chicken tikka simmered in butter and makhani sauce.", descFi: "Marinoitua kanatikkaa voissa ja makhani-kastikkeessa." },
      { name: "Madras Fish Curry", desc: "South Indian fish in a spicy, tangy Chennai-style curry.", descFi: "Etelä-intialaista kalaa tulisessa ja kirpeässä curryssa." },
      { name: "Daal Panchmel", desc: "Five different lentils cooked together with spices.", descFi: "Viisi linssilajia keitettynä yhteen mausteiden kanssa.", veg: true },
    ],
  },
  {
    day: { en: "Tuesday", fi: "Tiistai" },
    dishes: [
      { name: "Lime Dhaniya Chicken", desc: "Chicken cooked with lime, coriander and warm spices.", descFi: "Kanaa limen, korianterin ja mausteiden kera." },
      { name: "Kuta Mirch Ka Beef", desc: "Beef cooked with crushed chilli flakes.", descFi: "Naudanlihaa murskatuilla chilihiutaleilla." },
      { name: "Daal Lahsooni", desc: "Lentils with a garlic-infused tempering.", descFi: "Linssejä valkosipulitemperoinnilla.", veg: true },
    ],
  },
  {
    day: { en: "Wednesday", fi: "Keskiviikko" },
    dishes: [
      { name: "Chicken Biryani", desc: "Marinated chicken with fragrant spices and basmati rice.", descFi: "Marinoitua kanaa mausteiden ja basmatiriisin kera." },
      { name: "Mango Chicken", desc: "Tender chicken with mango in a sweet-savoury sauce.", descFi: "Mureaa kanaa mangon kera makean ja suolaisen kastikkeessa." },
      { name: "Fish Vindaloo", desc: "Fish marinated in vinegar, spices and chilli.", descFi: "Kalaa etikassa, mausteissa ja chilissä marinoituna." },
      { name: "Daal Palak", desc: "Lentils cooked with spinach and spices.", descFi: "Linssejä pinaatin ja mausteiden kera.", veg: true },
    ],
  },
  {
    day: { en: "Thursday", fi: "Torstai" },
    dishes: [
      { name: "Chicken Tikka Masala", desc: "Grilled chicken tikka in a creamy tomato sauce.", descFi: "Grillattua kanatikkaa kermaisessa tomaattikastikkeessa." },
      { name: "Subzi Beef Curry", desc: "Tender beef with a variety of vegetables and spices.", descFi: "Mureaa naudanlihaa vihannesten ja mausteiden kera." },
      { name: "Daal Tadka", desc: "Lentils finished with ghee, garlic and cumin.", descFi: "Linssejä ghee-, valkosipuli- ja jeeratemperoinnilla.", veg: true },
    ],
  },
  {
    day: { en: "Friday", fi: "Perjantai" },
    dishes: [
      { name: "Chicken Biryani", desc: "Marinated chicken with fragrant spices and basmati rice.", descFi: "Marinoitua kanaa mausteiden ja basmatiriisin kera." },
      { name: "Chicken Vindaloo", desc: "Marinated chicken in vinegar, spices and chilli.", descFi: "Marinoitua kanaa etikassa, mausteissa ja chilissä." },
      { name: "Beef Masala", desc: "Tender beef simmered with spices, onion and tomato.", descFi: "Mureaa naudanlihaa mausteiden, sipulin ja tomaatin kera." },
      { name: "Palak Paneer (Finnish cheese)", nameFi: "Palak Paneer (suomalaista juustoa)", desc: "Finnish cheese cooked with spinach, cream, butter and Indian spices.", descFi: "Suomalaista juustoa pinaatin, kerman, voin ja intialaisten mausteiden kera.", veg: true },
    ],
  },
  {
    day: { en: "Saturday", fi: "Lauantai" },
    dishes: [
      { name: "Kabuli Pulao", desc: "Afghan rice with fragrant spices, carrot, raisins and nuts.", descFi: "Afganistanilaista riisiä mausteiden, porkkanan, rusinoiden ja pähkinöiden kera." },
      { name: "Tandoori Chicken Masala", desc: "Tandoor-cooked chicken dipped in tomato butter gravy.", descFi: "Tandoorikanaa tomaatti-voikastikkeessa." },
      { name: "Beef Vindaloo", desc: "Beef marinated in vinegar, garlic, ginger and aromatic spices.", descFi: "Naudanlihaa etikassa, valkosipulissa, inkiväärissä ja mausteissa." },
      { name: "Afghani Lamb", desc: "Tender lamb in a flavourful sauce with traditional spices.", descFi: "Mureaa lammasta maukkaassa kastikkeessa perinteisillä mausteilla." },
    ],
  },
  {
    day: { en: "Sunday", fi: "Sunnuntai" },
    dishes: [
      { name: "Kabuli Pulao", desc: "Afghan rice with fragrant spices, carrot, raisins and nuts.", descFi: "Afganistanilaista riisiä mausteiden, porkkanan, rusinoiden ja pähkinöiden kera." },
      { name: "Kadhai Chicken", desc: "Chicken cooked with aromatic spices in a traditional kadhai.", descFi: "Kanaa aromaattisilla mausteilla perinteisessä kadhaissa." },
      { name: "Nihari Beef", desc: "Slow-cooked beef stew with spices and bone marrow.", descFi: "Hitaasti haudutettua naudanlihaa mausteilla ja luuytimellä." },
      { name: "Adraki Dal Tadka", desc: "Spiced lentils tempered with fresh ginger.", descFi: "Maustettuja linssejä tuoreella inkiväärillä.", veg: true },
    ],
  },
];
