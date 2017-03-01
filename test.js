const Faker = require('Faker');


    const arr = [];
    for (var index = 0; index < 50; index = index + 1) {
      console.log(index)
      arr.push(index);
    }
    console.log(arr)
    const documents = arr.map(() => ({
      title: Faker.Lorem.sentence(),
      content: Faker.Lorem.paragraphs(),
      public: Math.round(Math.random()),
      editable: Math.round(Math.random()),
      ownerId: Math.floor(Math.random() * 3) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
console.log(documents)