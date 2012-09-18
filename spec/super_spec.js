describeProperty("tpSuper", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should call on 'this' object the nearest (among ancestors) different implementation of the method", function(){
    var Person;
    var john;
    beforeEach(function(){
      Person = {
        fullName: function(){
          return "Person " + this.name + " " + this.surname;
        }
      };
      
      Englishman = Person.tpDerive({
        fullName: function(){
          return "Englishman " + this.tpSuper("fullName");
        }
      });

      Musician = Englishman.tpDerive({
        fullName: function(){
          return "Musician " + this.tpSuper("fullName");
        }
      });
      
      john = Musician.tpDerive({
        name: "John",
        surname: "Lennon"
      });
    });

    it("with the same name", function(){
      expect(john.fullName()).toEqual("Musician Englishman Person John Lennon");
    });

    it("with a different name", function(){
      john.greeting = function(){
        return "Hello, I am " + this.tpSuper("fullName");
      };
      expect(john.greeting()).toEqual("Hello, I am Englishman Person John Lennon");
    });

  });
  
  describe("Should return undefined,", function(){
    it("if object does not have ancestor", function(){
      expect(Object.prototype.tpSuper()).toBeUndefined()
    });
  });
});

describeProperty("tpSuperImmediate", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should call on 'this' object the immediate ancestor's implementation of the specified method", function(){
    var Person;
    var john;
    beforeEach(function(){
      Person = {
        fullName: function(){
          return "Person " + this.name + " " + this.surname;
        }
      };
      
      Englishman = Person.tpDerive({
        fullName: function(){
          return "Englishman " + this.tpSuperImmediate("fullName");
        }
      });

      Musician = Englishman.tpDerive();
      
      john = Musician.tpDerive({
        name: "John",
        surname: "Lennon"
      });
    });

    it("with the same name", function(){
      expect(john.fullName()).toEqual("Englishman Englishman Englishman Person John Lennon");
    });

    it("with a different name", function(){
      john.greeting = function(){
        return "Hello, I am " + this.tpSuperImmediate("fullName");
      };
      expect(john.greeting()).toEqual("Hello, I am Englishman Englishman Person John Lennon");
    });

  });
});



