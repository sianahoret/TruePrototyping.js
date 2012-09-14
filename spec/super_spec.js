describeProperty("tpSuper", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should call on ancestor the specified method", function(){
    var Person;
    var john;
    beforeEach(function(){
      Person = {
        fullName: function(){
          return this.name + " " + this.surname;
        }
      };
      john = Person.tpDerive({
        name: "John",
        surname: "Lennon",
        greeting: function(){
          return "Hello, I am " + this.tpSuper("fullName");
        }
      });
    });

    it("with the same name", function(){
      expect(john.greeting()).toEqual("Hello, I am John Lennon");
    })

    it("with a different name name", function(){
      john.fullName = function(){
        return "My full name is " + this.tpSuper("fullName");
      };
      expect(john.fullName()).toEqual("My full name is John Lennon");
    })

  });
});

