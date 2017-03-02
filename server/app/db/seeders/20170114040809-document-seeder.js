module.exports = {
  up(queryInterface) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Documents',
      [{
        ownerId: 1,
        title: 'Alice in wonder Document',
        content: `Since any number of consecutive spaces are treated 
          like a single one,  the formatting of the input file makes no 
          difference to LaTEX, but it makes a  difference to you. When you 
          use LaTEX, making your input file as easy to read as possible will 
          be a great help as you write your document and when you change it. 
          This sample file shows how you can add comments
         to your own input file.`,
        public: 0,
        editable: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        title: 'Alice in wonder Document',
        content: 'Goku trumps saitama',
        public: 0,
        editable: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 1,
        title: 'The hunger games',
        content: `here is an environment for verse Whose features s
          ome poets will 
          curse.For instead of making Them do all line breaking, It allows them 
          to put too many words on a line when they’d rather be forced to be 
          terse..`,
        public: 0,
        editable: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down(queryInterface) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Documents', null, {});
  }
};
