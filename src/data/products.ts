import { PHOTOS } from "./site";

export type Tag = "veg" | "vegan" | "spicy" | "mild" | "chef" | "new" | "gf";
export type CategoryId =
  | "deals" | "indian-mains" | "biryani" | "indian-starters"
  | "pizza" | "vegan-pizza" | "kebab" | "voner" | "falafel" | "salads" | "drinks";

export type Product = {
  id: string;
  cat: CategoryId;
  name: string;
  nameFi?: string;
  desc: string;
  descFi?: string;
  price: number;          // list price €
  offer?: number;         // promo price € (10% house discount / campaign)
  tags?: Tag[];
  img?: string;
  hero?: boolean;         // featured on home page
};

export const CATEGORIES: {
  id: CategoryId;
  label: { en: string; fi: string };
  blurb: { en: string; fi: string };
  img: string;
}[] = [
  { id: "deals", label: { en: "Deals", fi: "Tarjoukset" }, blurb: { en: "Limited campaign prices", fi: "Rajoitetut kampanjahinnat" }, img: PHOTOS.food1 },
  { id: "indian-mains", label: { en: "Indian Mains", fi: "Intialaiset pääruoat" }, blurb: { en: "Served with rice & naan", fi: "Riisin ja naanin kera" }, img: PHOTOS.food2 },
  { id: "biryani", label: { en: "Biryani", fi: "Biryani" }, blurb: { en: "Dum-cooked, saffron & raita", fi: "Dum-kypsennetty, sahrami ja raita" }, img: PHOTOS.food3 },
  { id: "indian-starters", label: { en: "Starters", fi: "Alkupalat" }, blurb: { en: "Crisp, hot, made to order", fi: "Rapeaa ja kuumaa" }, img: PHOTOS.food4 },
  { id: "pizza", label: { en: "Pizza", fi: "Pizzat" }, blurb: { en: "Stone-baked classics", fi: "Kiviuunipizzat" }, img: PHOTOS.food5 },
  { id: "vegan-pizza", label: { en: "Vegan Pizza", fi: "Vegaanipizzat" }, blurb: { en: "100% plant based", fi: "100% kasvipohjainen" }, img: PHOTOS.food6 },
  { id: "kebab", label: { en: "Kebab", fi: "Kebabit" }, blurb: { en: "From the vertical grill", fi: "Pystygrillistä" }, img: PHOTOS.food7 },
  { id: "voner", label: { en: "Vöner", fi: "Vöner" }, blurb: { en: "Vegan döner", fi: "Vegaaninen döner" }, img: PHOTOS.food8 },
  { id: "falafel", label: { en: "Falafel", fi: "Falafelit" }, blurb: { en: "House-made chickpea", fi: "Talon oma kikherne" }, img: PHOTOS.food9 },
  { id: "salads", label: { en: "Salads", fi: "Salaatit" }, blurb: { en: "Fresh & generous", fi: "Tuoreita ja runsaita" }, img: PHOTOS.buffet1 },
  { id: "drinks", label: { en: "Drinks", fi: "Juomat" }, blurb: { en: "Cold from the fridge", fi: "Kylmää kaapista" }, img: PHOTOS.interior2 },
];

const P = (p: Product) => p;

export const PRODUCTS: Product[] = [
  /* ---------------- DEALS ---------------- */
  P({ id: "deal-mix-lamb", cat: "deals", name: "Lamb Tikka Masala — Mix Deal", nameFi: "Lamb Tikka Masala — Mix-tarjous", desc: "Clay-oven roasted lamb cooked with grainy onion masala.", descFi: "Saviuunissa paahdettua lammasta karkeassa sipulimasalassa.", price: 22, offer: 17.99, tags: ["chef"], img: PHOTOS.food2, hero: true }),
  P({ id: "deal-mix-beef", cat: "deals", name: "Beef Vindaloo — Mix Deal", nameFi: "Beef Vindaloo — Mix-tarjous", desc: "Tender beef in a spicy, tangy vindaloo sauce of mixed Indian spices.", descFi: "Mureaa naudanlihaa tulisessa ja kirpeässä vindaloo-kastikkeessa.", price: 22, offer: 16.99, tags: ["spicy"], img: PHOTOS.food3, hero: true }),
  P({ id: "deal-mix-makhni", cat: "deals", name: "Murgh Makhni — Mix Deal", nameFi: "Murgh Makhni — Mix-tarjous", desc: "Clay-oven roasted chicken in a creamy, tangy tomato gravy.", descFi: "Saviuunikanaa kermaisessa tomaattikastikkeessa.", price: 20, offer: 14.99, tags: ["mild", "chef"], img: PHOTOS.food1, hero: true }),
  P({ id: "deal-pizza-999", cat: "deals", name: "Any Classic Pizza — €9.99", nameFi: "Mikä tahansa klassikkopizza — 9,99 €", desc: "Campaign price on the full classic pizza range. Choose your favourite.", descFi: "Kampanjahinta koko klassikkopizzavalikoimaan. Valitse suosikkisi.", price: 12.99, offer: 9.99, tags: ["new"], img: PHOTOS.food5 }),
  P({ id: "deal-vegan-999", cat: "deals", name: "Any Vegan Pizza — €9.99", nameFi: "Mikä tahansa vegaanipizza — 9,99 €", desc: "Campaign price across the vegan pizza range.", descFi: "Kampanjahinta koko vegaanipizzavalikoimaan.", price: 14.99, offer: 9.99, tags: ["vegan", "new"], img: PHOTOS.food6 }),

  /* ---------------- INDIAN MAINS ---------------- */
  P({ id: "gosht-tar-kalia", cat: "indian-mains", name: "Gosht Tar Kalia", desc: "Rich lamb shank preparation with onion, tomato and Indian spices.", descFi: "Runsas karitsanpotka sipulin, tomaatin ja intialaisten mausteiden kera.", price: 25, offer: 22.5, tags: ["chef"], img: PHOTOS.food2 }),
  P({ id: "lamb-tikka-masala", cat: "indian-mains", name: "Lamb Tikka Masala", desc: "Clay-oven roasted lamb cooked with grainy onion masala.", descFi: "Saviuunissa paahdettua lammasta karkeassa sipulimasalassa.", price: 22, offer: 19.8, tags: ["chef"], img: PHOTOS.food3, hero: true }),
  P({ id: "laal-maas", cat: "indian-mains", name: "Laal Maas (Beef)", desc: "Beef with spices and curd, smoked over cloves.", descFi: "Naudanlihaa mausteissa ja jogurtissa, savustettuna neilikalla.", price: 22, offer: 19.8, tags: ["spicy"], img: PHOTOS.food4 }),
  P({ id: "beef-vindaloo", cat: "indian-mains", name: "Beef Vindaloo", desc: "Tender beef in spicy tangy vindaloo sauce made with mixed Indian spices.", descFi: "Mureaa naudanlihaa tulisessa vindaloo-kastikkeessa.", price: 22, offer: 19.8, tags: ["spicy"], img: PHOTOS.food5 }),
  P({ id: "beef-sali-boti", cat: "indian-mains", name: "Beef Sali Boti", desc: "Minced beef and beef boti cooked with onion, tomato and spices.", descFi: "Jauhettua naudanlihaa ja botia sipulin, tomaatin ja mausteiden kera.", price: 22, offer: 19.8, img: PHOTOS.food6 }),
  P({ id: "murgh-makhni", cat: "indian-mains", name: "Murgh Makhni", desc: "Clay-oven roasted chicken cooked in creamy tangy gravy.", descFi: "Saviuunikanaa kermaisessa, kirpeässä kastikkeessa.", price: 20, offer: 18, tags: ["mild", "chef"], img: PHOTOS.food1, hero: true }),
  P({ id: "kozhi-vartha", cat: "indian-mains", name: "Kozhi Vartha Curry", desc: "South Indian style spicy chicken curry.", descFi: "Etelä-intialainen tulinen kanacurry.", price: 20, offer: 18, tags: ["spicy"], img: PHOTOS.food7 }),
  P({ id: "goan-fish-curry", cat: "indian-mains", name: "Goan Fish Curry", desc: "Goan sea bass curry with chilli paste, kokum and coconut.", descFi: "Goalainen meribassicurry chilitahnalla, kokumilla ja kookoksella.", price: 26, offer: 23.4, tags: ["spicy", "chef"], img: PHOTOS.food8, hero: true }),
  P({ id: "kadhai-jheenga", cat: "indian-mains", name: "Kadhai Jheenga", desc: "Prawns cooked with fresh onions, tomatoes, Indian spices and capsicum.", descFi: "Katkarapuja tuoreen sipulin, tomaatin, mausteiden ja paprikan kera.", price: 24, offer: 21.6, img: PHOTOS.food9 }),
  P({ id: "palak-paneer", cat: "indian-mains", name: "Palak Paneer", desc: "Tempered spinach purée cooked with Indian cottage cheese.", descFi: "Pinaattipyree intialaisen paneer-juuston kera.", price: 20, offer: 18, tags: ["veg", "mild"], img: PHOTOS.food2, hero: true }),
  P({ id: "subz-korma", cat: "indian-mains", name: "Subz Korma", desc: "Seasonal vegetables cooked with onion, cashew and yoghurt.", descFi: "Kauden vihanneksia sipulin, cashewin ja jogurtin kera.", price: 16, offer: 14.4, tags: ["veg", "mild"], img: PHOTOS.food3 }),
  P({ id: "goan-broccoli", cat: "indian-mains", name: "Goan Broccoli", desc: "Vegetables simmered in coconut and poppy-seed gravy with ground spices.", descFi: "Vihanneksia kookos- ja unikonsiemenkastikkeessa.", price: 17, offer: 15.3, tags: ["vegan", "veg"], img: PHOTOS.food4 }),
  P({ id: "dal-tadka", cat: "indian-mains", name: "Dal Tadka", desc: "Yellow lentils tempered with garlic, cumin and dried red chilli.", descFi: "Keltaisia linssejä valkosipulilla, juustokuminalla ja chilillä.", price: 15, offer: 13.5, tags: ["vegan", "veg"], img: PHOTOS.food5 }),

  /* ---------------- BIRYANI ---------------- */
  P({ id: "subz-dum-biryani", cat: "biryani", name: "Subz Dum Biryani", desc: "Seasonal vegetables and basmati cooked in dum with saffron and aromatic spices, served with raita.", descFi: "Kauden vihanneksia ja basmatiriisiä dum-kypsennettynä sahramilla, raitan kera.", price: 15, offer: 13.5, tags: ["veg"], img: PHOTOS.food6 }),
  P({ id: "murgh-biryani", cat: "biryani", name: "Murgh Biryani", desc: "Succulent chicken cooked dum-style with basmati, saffron and aromatic spices, served with raita.", descFi: "Mehevää kanaa dum-tyyliin basmatiriisin ja sahramin kanssa, raitan kera.", price: 18, offer: 16.2, tags: ["chef"], img: PHOTOS.food7, hero: true }),
  P({ id: "awadhi-ghost-biryani", cat: "biryani", name: "Awadhi Ghost Biryani", desc: "Signature Awadh-style dum cooked lamb with basmati, saffron and spices, served with raita.", descFi: "Awadh-tyylinen dum-lammas basmatiriisin ja sahramin kera, raitan kanssa.", price: 22, offer: 19.8, tags: ["chef"], img: PHOTOS.food8 }),
  P({ id: "jhinga-biryani", cat: "biryani", name: "Jhinga Biryani", desc: "Slow-cooked flavoured basmati rice with prawns.", descFi: "Hitaasti kypsennettyä maustettua basmatiriisiä katkarapujen kera.", price: 25, offer: 22.5, img: PHOTOS.food9 }),

  /* ---------------- STARTERS ---------------- */
  P({ id: "onion-pakoda", cat: "indian-starters", name: "Onion Pakoda", desc: "Deep-fried onion rings in spiced gram flour batter.", descFi: "Uppopaistettuja sipulirenkaita maustetussa kikhernetaikinassa.", price: 7, offer: 6.3, tags: ["vegan", "veg"], img: PHOTOS.food1 }),
  P({ id: "paneer-pakoda", cat: "indian-starters", name: "Paneer Pakoda", desc: "Deep-fried paneer in roasted gram flour batter.", descFi: "Uppopaistettua paneeria kikhernetaikinassa.", price: 7, offer: 6.3, tags: ["veg"], img: PHOTOS.food2 }),
  P({ id: "chicken-pakoda", cat: "indian-starters", name: "Chicken Pakoda", desc: "Deep-fried chicken in roasted gram flour batter.", descFi: "Uppopaistettua kanaa kikhernetaikinassa.", price: 7, offer: 6.3, img: PHOTOS.food3 }),

  /* ---------------- PIZZA ---------------- */
  P({ id: "pizza-texas", cat: "pizza", name: "Texas", desc: "Pepperoni, roasted chicken, jalapeño, mozzarella, taco sauce.", descFi: "Pepperonimakkara, paahdettu broileri, jalapeno, mozzarella, tacokastike.", price: 12.99, offer: 11.69, tags: ["spicy"], img: PHOTOS.food5, hero: true }),
  P({ id: "pizza-chilli-pap", cat: "pizza", name: "Chilli Pap", desc: "Jalapeño, roasted chicken, bell pepper, corn, Texas sauce.", descFi: "Jalapeno, paahdettu broileri, paprika, maissi, texas-kastike.", price: 12.99, offer: 11.69, tags: ["spicy"], img: PHOTOS.food5 }),
  P({ id: "pizza-sam", cat: "pizza", name: "Sam Pizza", desc: "Crumbled salami, kebab meat, minced beef, bacon, blue cheese, mayo sauce.", descFi: "Salamirouhe, kebabliha, jauheliha, pekoni, aurajuusto, majoneesikastike.", price: 12.99, offer: 11.69, img: PHOTOS.food5 }),
  P({ id: "pizza-atish", cat: "pizza", name: "Atish Pizza", desc: "Kebab meat, bacon, egg, blue cheese, garlic, Texas sauce, mayo sauce.", descFi: "Kebabliha, pekoni, kananmuna, aurajuusto, valkosipuli, texas-kastike, majoneesikastike.", price: 12.99, offer: 11.69, img: PHOTOS.food5 }),
  P({ id: "pizza-kamu", cat: "pizza", name: "Kamupizza", desc: "Kebab meat, prawns, onion, blue cheese, mayo sauce.", descFi: "Kebabliha, katkarapu, sipuli, aurajuusto, majoneesikastike.", price: 12.99, offer: 11.69, img: PHOTOS.food5 }),
  P({ id: "pizza-pinaatti", cat: "pizza", name: "Pinaatti", desc: "Spinach, onion, garlic, mozzarella.", descFi: "Pinaatti, sipuli, valkosipuli, mozzarella.", price: 11.99, offer: 10.79, tags: ["veg"], img: PHOTOS.food5 }),
  P({ id: "pizza-vege1", cat: "pizza", name: "Vege 1", desc: "Bell pepper, red onion, pineapple, mushroom.", descFi: "Paprika, punasipuli, ananas, herkkusieni.", price: 11.99, offer: 10.79, tags: ["veg"], img: PHOTOS.food5 }),
  P({ id: "pizza-lasten", cat: "pizza", name: "Kids' Pizza", nameFi: "Lasten pizza", desc: "Three toppings of your choice, with fries.", descFi: "Kolme täytettä oman valinnan mukaan, ranskalaiset.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-margarita", cat: "pizza", name: "Margarita", desc: "Tomato, mozzarella, pesto.", descFi: "Tomaatti, mozzarella, pesto.", price: 11.99, offer: 10.79, tags: ["veg"], img: PHOTOS.food5 }),
  P({ id: "pizza-pepperoni", cat: "pizza", name: "Pepperoni", desc: "Pepperoni sausage.", descFi: "Pepperonimakkara.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-opera", cat: "pizza", name: "Opera", desc: "Ham, tuna.", descFi: "Kinkku, tonnikala.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-tropicana", cat: "pizza", name: "Tropicana", desc: "Ham, pineapple.", descFi: "Kinkku, ananas.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-hawaiji", cat: "pizza", name: "Hawaiji", desc: "Ham, pineapple, blue cheese, mozzarella.", descFi: "Kinkku, ananas, aurajuusto, mozzarella.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-opera-special", cat: "pizza", name: "Opera Special", desc: "Ham, tuna, salami.", descFi: "Kinkku, tonnikala, salami.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-bolognese", cat: "pizza", name: "Bolognese", desc: "Minced beef.", descFi: "Jauheliha.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-frutti", cat: "pizza", name: "Frutti Di Mare", desc: "Tuna, prawns, mussels.", descFi: "Tonnikala, katkarapu, simpukka.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-quatro", cat: "pizza", name: "Quatro Stagioni", desc: "Ham, mushroom, tuna, prawns.", descFi: "Kinkku, herkkusieni, tonnikala, katkarapu.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-mexicana", cat: "pizza", name: "Mexicana", desc: "Pepperoni, jalapeño, mozzarella, red onion.", descFi: "Pepperonimakkara, jalapeno, mozzarella, punasipuli.", price: 11.99, offer: 10.79, tags: ["spicy"], img: PHOTOS.food5 }),
  P({ id: "pizza-kebab", cat: "pizza", name: "Kebab Pizza", desc: "Kebab meat, feta, red onion, tomato.", descFi: "Kebab, feta, punasipuli, tomaatti.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-chicken-hawaiji", cat: "pizza", name: "Chicken Hawaiji", desc: "Roasted chicken, pineapple, blue cheese.", descFi: "Paahdettu broileri, ananas, aurajuusto.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-rome", cat: "pizza", name: "Rome", desc: "Ham, minced beef, crumbled salami, blue cheese.", descFi: "Kinkku, jauheliha, salamirouhe, aurajuusto.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-pollo", cat: "pizza", name: "Pollo", desc: "Roasted chicken, bacon, peach, blue cheese.", descFi: "Paahdettu broileri, pekoni, persikka, aurajuusto.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-vagabonda", cat: "pizza", name: "Vagabonda", desc: "Ham, bacon, crumbled salami, egg.", descFi: "Kinkku, pekoni, salamirouhe, kananmuna.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-alcapone", cat: "pizza", name: "Alcapone", desc: "Kebab meat, crumbled salami, bell pepper, red onion.", descFi: "Kebabliha, salamirouhe, paprika, punasipuli.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-aurinko", cat: "pizza", name: "Aurinkopizza", desc: "Sun-dried tomato, chicken, feta, mozzarella.", descFi: "Aurinkokuivattu tomaatti, kana, fetajuusto, mozzarella.", price: 11.99, offer: 10.79, img: PHOTOS.food5 }),
  P({ id: "pizza-pasargad-special", cat: "pizza", name: "Pasargad Special", desc: "Roasted chicken, roast beef, red onion, mozzarella, mayo.", descFi: "Paahdettu broileri, naudan paahtopaisti, punasipuli, mozzarella, majoneesi.", price: 12.99, offer: 11.69, tags: ["chef"], img: PHOTOS.food5, hero: true }),
  P({ id: "pizza-spicy-hot", cat: "pizza", name: "Spicy Hot", desc: "Pepperoni, roasted chicken, jalapeño, red onion, BBQ sauce.", descFi: "Pepperonimakkara, paahdettu broileri, jalapeno, punasipuli, bbq-kastike.", price: 12.99, offer: 11.69, tags: ["spicy"], img: PHOTOS.food5 }),

  /* ---------------- VEGAN PIZZA ---------------- */
  P({ id: "vpizza-voner", cat: "vegan-pizza", name: "Vöner Pizza", desc: "Vöner, red onion, garlic, pesto, tomato, vegan cheese.", descFi: "Vöner, punasipuli, valkosipuli, pesto, tomaatti, vegaanijuusto.", price: 14.99, offer: 13.49, tags: ["vegan", "veg"], img: PHOTOS.food6 }),
  P({ id: "vpizza-greenday", cat: "vegan-pizza", name: "Green Day", desc: "Vöner, sun-dried tomato, red onion, pineapple, jalapeño, vegan cheese.", descFi: "Vöner, aurinkokuivattu tomaatti, punasipuli, ananas, jalapeno, vegaanijuusto.", price: 14.99, offer: 13.49, tags: ["vegan", "veg", "spicy"], img: PHOTOS.food6 }),
  P({ id: "vpizza-vege", cat: "vegan-pizza", name: "Vegepizza", desc: "Pineapple, vöner, vegan feta, red onion, vegan cheese.", descFi: "Ananas, vöner, vegaanifetajuusto, punasipuli, vegaanijuusto.", price: 14.99, offer: 13.49, tags: ["vegan", "veg"], img: PHOTOS.food6 }),
  P({ id: "vpizza-vegaani", cat: "vegan-pizza", name: "Vegaani Pizza", desc: "Olive, vöner, bell pepper, red onion, vegan blue cheese, vegan cheese.", descFi: "Oliivi, vöner, paprika, punasipuli, vegaanisinihomejuusto, vegaanijuusto.", price: 14.99, offer: 13.49, tags: ["vegan", "veg"], img: PHOTOS.food6 }),
  P({ id: "vpizza-choice", cat: "vegan-pizza", name: "Vegan Choice", desc: "Four toppings of your choice.", descFi: "Neljä valinnaista täytettä.", price: 14.99, offer: 13.49, tags: ["vegan", "veg"], img: PHOTOS.food6 }),

  /* ---------------- KEBAB ---------------- */
  P({ id: "kebab-rulla", cat: "kebab", name: "Kebab Wrap", nameFi: "Kebabrulla", desc: "Kebab meat, salad, tomato, sauce of your choice.", descFi: "Kebabliha, salaatti, tomaatti, valitsemasi kastike.", price: 11.99, offer: 10.79, img: PHOTOS.food7 }),
  P({ id: "kebab-pita", cat: "kebab", name: "Kebab Pita", desc: "Kebab meat, salad, tomato, sauce of your choice.", descFi: "Kebabliha, salaatti, tomaatti, valitsemasi kastike.", price: 11.99, offer: 10.79, img: PHOTOS.food7 }),
  P({ id: "kebab-annos", cat: "kebab", name: "Kebab Plate", nameFi: "Kebab annos", desc: "Kebab meat, salad, tomato, side of your choice.", descFi: "Kebabliha, salaatti, tomaatti, valitsemasi lisuke.", price: 11.99, offer: 10.79, img: PHOTOS.food7, hero: true }),
  P({ id: "kebab-iskender", cat: "kebab", name: "Iskender Kebab", desc: "Kebab meat, salad, bread cubes, yoghurt sauce, tomato sauce.", descFi: "Kebabliha, salaatti, leipäkuutio, jogurttikastike, tomaattikastike.", price: 11.99, offer: 10.79, img: PHOTOS.food7 }),
  P({ id: "kebab-kasvisrulla", cat: "kebab", name: "Veggie Wrap", nameFi: "Kasvisrulla", desc: "Aubergine, goat cheese / feta, pesto, onion rings, mozzarella sticks, garlic mayo, salad.", descFi: "Munakoiso, vuohenjuusto / feta, pesto, sipulirenkaat, mozzarellatikkuja, valkosipulimajoneesi, salaattia.", price: 11.99, offer: 10.79, tags: ["veg"], img: PHOTOS.food7 }),
  P({ id: "kebab-doner-kana", cat: "kebab", name: "Real Chicken Döner Kebab", nameFi: "Aito döner kanakebab", desc: "Kebab meat, salad, fries / house wedges or rice.", descFi: "Kebabliha, salaatti, ranskalaiset / talon lohkoperunat tai riisi.", price: 11.99, offer: 10.79, img: PHOTOS.food7 }),
  P({ id: "kebab-super", cat: "kebab", name: "Superkebab", desc: "Kebab, chicken döner, rice and fries.", descFi: "Kebab, döner-kana, riisi, ranskalaiset.", price: 17.99, offer: 16.19, tags: ["chef"], img: PHOTOS.food7 }),

  /* ---------------- VÖNER ---------------- */
  P({ id: "voner-plate", cat: "voner", name: "Vöner with Potato or Rice", nameFi: "Vöner & perunaa tai riisiä", desc: "Vöner, salad, fries / house wedges or rice.", descFi: "Vöner, salaatti, ranskalaiset / talon lohkoperunat tai riisi.", price: 13.99, offer: 12.59, tags: ["vegan", "veg"], img: PHOTOS.food8 }),

  /* ---------------- FALAFEL ---------------- */
  P({ id: "falafel-iskender", cat: "falafel", name: "Falafel Iskender", desc: "House falafel, bread cubes, yoghurt and tomato sauce.", descFi: "Talon falafel, leipäkuutiot, jogurtti- ja tomaattikastike.", price: 11.99, offer: 10.79, tags: ["veg"], img: PHOTOS.food9 }),
  P({ id: "falafel-rulla", cat: "falafel", name: "Falafel Wrap", nameFi: "Falafel rulla", desc: "House falafel, salad and sauce in a wrap.", descFi: "Talon falafel, salaatti ja kastike rullassa.", price: 11.99, offer: 10.79, tags: ["vegan", "veg"], img: PHOTOS.food9 }),
  P({ id: "falafel-annos", cat: "falafel", name: "Falafel Plate", nameFi: "Falafel annos", desc: "House falafel with the side of your choice.", descFi: "Talon falafel valitsemallasi lisukkeella.", price: 11.99, offer: 10.79, tags: ["vegan", "veg"], img: PHOTOS.food9 }),

  /* ---------------- SALADS ---------------- */
  P({ id: "salad-greek", cat: "salads", name: "Greek Salad", nameFi: "Kreikkalainen salaatti", desc: "Iceberg, cucumber, olive, tomato, red onion, pineapple, feta, dressing and fresh bread.", descFi: "Jäävuorisalaatti, kurkku, oliivi, tomaatti, punasipuli, ananas, fetajuusto, kastike ja tuoreleipä.", price: 11.99, offer: 10.79, tags: ["veg"], img: PHOTOS.food1 }),
  P({ id: "salad-falafel", cat: "salads", name: "Falafel Salad", nameFi: "Falafelsalaatti", desc: "House falafel, iceberg, tomato, red onion, cucumber, mayo dressing, fries.", descFi: "Talon falafel, jäävuorisalaatti, tomaatti, punasipuli, kurkku, majoneesikastike, ranskalaiset.", price: 10.99, offer: 9.89, tags: ["veg"], img: PHOTOS.food1 }),
  P({ id: "salad-chicken", cat: "salads", name: "Chicken Salad", nameFi: "Kanasalaatti", desc: "Chicken fillet, semi-dried tomato, melon, tomato, courgette, lemon vinaigrette.", descFi: "Kanafilee, puolikuivattu tomaatti, meloni, tomaatti, kesäkurpitsa, sitruunavinegrette.", price: 13.0, offer: 11.7, img: PHOTOS.food1 }),
  P({ id: "salad-doner", cat: "salads", name: "Döner Salad", nameFi: "Dönersalaatti", desc: "Chicken, döner sauce, iceberg, cucumber, pineapple, tomato, plum tomato, sun-dried tomato.", descFi: "Kana, dönerkastike, jäävuorisalaatti, kurkku, ananas, tomaatti, luumutomaatti, aurinkokuivattu tomaatti.", price: 11.99, offer: 10.79, img: PHOTOS.food1 }),
  P({ id: "salad-kebab", cat: "salads", name: "Kebab Salad", nameFi: "Kebabsalaatti", desc: "Kebab, iceberg, cucumber, tomato, plum tomato, sun-dried tomato, pineapple.", descFi: "Kebab, jäävuorisalaatti, kurkku, tomaatti, luumutomaatti, aurinkokuivattu tomaatti, ananas.", price: 11.99, offer: 10.79, img: PHOTOS.food1 }),

  /* ---------------- DRINKS ---------------- */
  P({ id: "drink-pepsi-max", cat: "drinks", name: "Pepsi Max 0.5 l", desc: "Chilled.", descFi: "Kylmänä.", price: 3.5, img: PHOTOS.food3 }),
  P({ id: "drink-7up", cat: "drinks", name: "7Up 0.5 l", desc: "Chilled.", descFi: "Kylmänä.", price: 3.5, img: PHOTOS.food3 }),
  P({ id: "drink-jaffa", cat: "drinks", name: "Hartwall Jaffa Orange 0.5 l", nameFi: "Hartwall Jaffa Appelsiini 0,5 l", desc: "Chilled.", descFi: "Kylmänä.", price: 3.5, img: PHOTOS.food3 }),
  P({ id: "drink-crodo", cat: "drinks", name: "Fonti di Crodo Limonata 0.33 l", desc: "Italian lemonade.", descFi: "Italialainen limonadi.", price: 3.5, img: PHOTOS.food3 }),
  P({ id: "drink-rockstar", cat: "drinks", name: "Rockstar Original 0.33 l", desc: "Energy drink.", descFi: "Energiajuoma.", price: 3.0, img: PHOTOS.food3 }),
  P({ id: "drink-moretti", cat: "drinks", name: "Birra Moretti Zero 0% 0.33 l", desc: "Alcohol-free beer.", descFi: "Alkoholiton olut.", price: 4.5, img: PHOTOS.food3 }),
];

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id);
export const byCat = (cat: CategoryId) => PRODUCTS.filter((p) => p.cat === cat);
export const heroes = () => PRODUCTS.filter((p) => p.hero);
export const effectivePrice = (p: Product) => p.offer ?? p.price;
