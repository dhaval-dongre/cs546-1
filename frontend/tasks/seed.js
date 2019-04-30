const dbConnection = require("../mongoConnection");
const data = require("../data/");
const books = data.book;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const harry1 = await books.create("Harry Potter And The Sorcerer's Stone", "J.K. Rowling","Scholastic Press","Harry Potter and the Philosopher's Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry. Harry makes close friends and a few enemies during his first year at the school, and with the help of his friends, Harry faces an attempted comeback by the dark wizard Lord Voldemort, who killed Harry's parents, but failed to kill Harry when he was just 15 months old.",["Fiction", "Fanasy","Drama","Thriller"],"3.79","0-7475-3009-9","uploads/2019-04-23T07:07:51.145Zharry1.png","Used Book","English","1998-08-31","HARRY POTTER");
  const harry2 = await books.create("Harry Potter And The Sorcerer's Stone", "J.K. Rowling","Scholastic Press","Harry Potter and the Philosopher's Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry. Harry makes close friends and a few enemies during his first year at the school, and with the help of his friends, Harry faces an attempted comeback by the dark wizard Lord Voldemort, who killed Harry's parents, but failed to kill Harry when he was just 15 months old.",["Fiction", "Fanasy","Drama","Thriller"],"3.79","0-7475-3010-9","uploads/2019-04-23T07:12:07.755Zharry2.png","Used Book","English","1998-08-31","HARRY POTTER");

//   const nightside1 = await books.create("Phil", "Barresi");
//   const nightside2 = await books.create("Phil", "Barresi");
//   const nightside3 = await books.create("Phil", "Barresi");
//   const nightside4 = await books.create("Phil", "Barresi");
//   const nightside5 = await books.create("Phil", "Barresi");

  console.log("Done seeding database");
  await db.close();
}

main();