describeProperty("tpSuper", function() {
  shouldBeDefinedOnAnyObject();

  beforeEach(function(){
    Person = {
      fullName: function(){
        return "Person " + this.name + " " + this.surname;
      },
      health: 'middle'
    };
    
    Englishman = Person.tpDerive({
      fullName: function(){
        return "Englishman " + this.tpSuper("fullName");
      }
    });

    Musician = Englishman.tpDerive({
      fullName: function(){
        return "Musician " + this.tpSuper(new String("fullName"));
      }
    });
    
    john = Musician.tpDerive({
      name: "John",
      surname: "Lennon",
      health: 'great'
    });
  });

  describe("Should call on 'this' object the nearest (among ancestors) different implementation of a method", function(){
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
    it("if object does not have an ancestor", function(){
      expect(Object.prototype.tpSuper('toString')).toBeUndefined();
    });
    
    it("if the method is not defined above in hierarchy", function(){
      john.age = function(){ return 25; }
      expect(john.tpSuper("age")).toBeUndefined();
    });
    
    it("if the method is not defined differently above in hierarchy", function(){
      expect(Person.tpSuper('toString')).toBeUndefined();
    });
    
    it("if the method is not defined differently above in hierarchy, even there is a property with appropriate name", function(){
      expect(john.tpSuper('health')).toBeUndefined();
    });
  });
  
  describe("Should throw an exception,", function(){
    it("if the method name is not specified", function(){
      expect(function(){ Person.tpSuper() }).toThrow("Method name should be specified and it should be a string!");
    });
    
    it("if the method name is not string", function(){
      expect(function(){ Person.tpSuper(123) }).toThrow("Method name should be specified and it should be a string!");
    });
  });
});

describeProperty("tpSuperImmediate", function() {
  shouldBeDefinedOnAnyObject();

  beforeEach(function(){
    Person = {
      fullName: function(){
        return "Person " + this.name + " " + this.surname;
      },
      health: 'middle'
    };
    
    Englishman = Person.tpDerive({
      fullName: function(){
        return "Englishman " + this.tpSuperImmediate("fullName");
      }
    });

    Musician = Englishman.tpDerive();
    
    john = Musician.tpDerive({
      name: "John",
      surname: "Lennon",
      health: 'great'
    });
  });

  describe("Should call on 'this' object the immediate ancestor's implementation of the specified method", function(){
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
  
  describe("Should return undefined,", function(){
    it("if object does not have an ancestor", function(){
      expect(Object.prototype.tpSuperImmediate('toString')).toBeUndefined();
    });
    
    it("if the method is not defined above in hierarchy", function(){
      john.age = function(){ return 25; }
      expect(john.tpSuperImmediate("age")).toBeUndefined();
    });
  });
  
  describe("Should not return undefined,", function(){
    it("if the method is not defined differently above in hierarchy", function(){
      expect(Person.tpSuperImmediate('toString')).toBeDefined();
    });
    
    it("if the method is not defined differently above in hierarchy, even there is a property with appropriate name", function(){
      expect(john.tpSuperImmediate('health')).toBeUndefined();
    });
  });

  describe("Should throw an exception,", function(){
    it("if the method name is not specified", function(){
      expect(function(){ Person.tpSuperImmediate() }).toThrow("Method name should be specified and it should be a string!");
    });
    
    it("if the method name is not string", function(){
      expect(function(){ Person.tpSuperImmediate(123) }).toThrow("Method name should be specified and it should be a string!");
    });
  });

});

describeProperty("tpDependingOnSuperLevel", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should return one of two received arguments:", function(){
    
    beforeEach(function(){
      Person = {
        whoIs: function(){
          return "Person" + this.commaOrDot();
        },
        commaOrDot: function(){
          return this.tpDependingOnSuperLevel('.', ', ');
        }
      };
      
      Englishman = Person.tpDerive({
        whoIs: function(){
          return this.tpSuperImmediate('whoIs') + "Englishman" + this.commaOrDot();
        }
      });

      john = Englishman.tpDerive({ 
        whoIs: function(){ 
          return this.tpSuper('whoIs') + "John" + this.commaOrDot();
        } 
      });
    });

    describe("the first argument", function(){
      it("outside of super recursion", function(){
        expect(john.tpDependingOnSuperLevel('foo', 222)).toEqual('foo');
      });

      it("on the first level of super recursion ", function(){
        expect(john.tpDependingOnSuperLevel('foo', 222)).toEqual('foo');
      });
    });
    
    describe("the second argument", function(){
      it("inside super recursion (on any level more than first)", function(){
        expect(john.whoIs()).toEqual('Person, Englishman, John.');
      });
    });


  });
});

