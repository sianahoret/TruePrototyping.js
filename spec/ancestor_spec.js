describeProperty("tpAncestor", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should point to the actual object's prototype", function(){

    describe("when the object has been created with 'tpDerive' method -", function(){
      it("to the object which 'tpDerive' was called on", function(){
        var Person = {};
        var Serg = Person.tpDerive();
        expect(Serg.tpAncestor).toBe(Person);
      });
    });

    describe("when the object has been created traditionally", function(){
      it("with 'new' operator - to the [Function-constructor].prototype", function(){
        expect(objectCreatedByFunction.tpAncestor).toBe(Number.prototype);
      });

      it("with object literal - to the Object.prototype", function(){
        expect(objectCreatedByLiteral.tpAncestor).toBe(Object.prototype);
      });
    });
    
    describe("should be null", function(){
      it("on the Object.prototype (the root of any hierarchy)", function(){
        expect(Object.prototype.tpAncestor).toBeNull();
      });
    });

  });

});

describeProperty("tpAncestors", function() {

  shouldBeDefinedOnAnyObject();

  describe("Should return an array of all ancestors, ordered by nearness (first element is the nearest ancestor)", function(){

    it("when the object has been created with 'tpDerive' method", function(){
      expect(Serg.tpAncestors).toEqual([Employee, Person, Object.prototype]);
    });

    describe("when the object has been created traditionally", function(){
      it("with 'new' operator", function(){
        expect(objectCreatedByFunction.tpAncestors).toEqual([Number.prototype, Object.prototype]);
      });
    
      it("with object literal", function(){
        expect(objectCreatedByLiteral.tpAncestors).toEqual([Object.prototype]);
      });
    });

  });
  
  describe("should be empty", function(){
    it("on the Object.prototype (the root of any hierarchy)", function(){
      expect(Object.prototype.tpAncestors).toEqual(jasmine.any(Array));
      expect(Object.prototype.tpAncestors.length).toEqual(0);
    });
  });

});

describeProperty("tpIsAncestorOf", function() {

  shouldBeDefinedOnAnyObject();

  describe("Should return true, if for the passed object", function(){

    describe("has been created with 'tpDerive' method", function(){
      it("the respondent object is the immediate ancestor", function(){
        expect(Employee.tpIsAncestorOf(Serg)).toBeTruthy();
      });

      it("the respondent object is a far ancestor", function(){
        expect(Person.tpIsAncestorOf(Serg)).toBeTruthy();
      });
    });

    describe("has been created traditionally", function(){
      describe("with 'new' operator", function(){
        it("the respondent object is the immediate ancestor (that is [Function-constructor].prototype)", function(){
          expect(Number.prototype.tpIsAncestorOf(objectCreatedByFunction)).toBeTruthy();
        });

        it("the respondent object is a far ancestor (that is Object.prototype)", function(){
          expect(Object.prototype.tpIsAncestorOf(objectCreatedByFunction)).toBeTruthy();
        });
      });

      describe("with object literal", function(){
        it("the respondent object is the sole ancestor (that is Object.prototype)", function(){
          expect(Object.prototype.tpIsAncestorOf(objectCreatedByLiteral)).toBeTruthy();
        });
      });
    });

  });

});

describeProperty("tpIsDescendantOf", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should return true, if the respondent object", function(){

    describe("has been created with 'tpDerive' method", function(){
      it("and the passed object is its immediate ancestor", function(){
        expect(Serg.tpIsDescendantOf(Employee)).toBeTruthy();
      });

      it("and the passed object is its far ancestor", function(){
        expect(Serg.tpIsDescendantOf(Person)).toBeTruthy();
      });
    });

    describe("has been created traditionally", function(){
      describe("with 'new' operator", function(){
        it("and the passed object is its immediate ancestor (that is [Function-constructor].prototype)", function(){
          expect(objectCreatedByFunction.tpIsDescendantOf(Number.prototype)).toBeTruthy();
        });

        it("and the passed object is its far ancestor (that is Object.prototype)", function(){
          expect(objectCreatedByFunction.tpIsDescendantOf(Object.prototype)).toBeTruthy();
        });
      });

      describe("with object literal", function(){
        it("and the respondent object is its sole ancestor (that is Object.prototype)", function(){
          expect(objectCreatedByLiteral.tpIsDescendantOf(Object.prototype)).toBeTruthy();
        });
      });
    });

  });
});

describeProperty("tpHasProperty", function() {
  shouldBeDefinedOnAnyObject();
  
  beforeEach(function(){
    Person = {
      health: 'middle'
    };
  
    Englishman = Person.tpDerive();
    
    Musician = Englishman.tpDerive();
  
    john = Musician.tpDerive({
      health: 'great'
    });
  });
  
  shouldCheckFirstArgument("Property name", String, "Property name should be specified and it should be a string!");
  
  describe("Should return true, if", function(){  
    describe("the respondent object has own specified prooerty", function(){
      it("and the property value is not null and is not 'undefined'", function(){
        expect(john.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        john.health = null;
        expect(john.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        john.health = void(0);
        expect(john.tpHasProperty('health')).toBe(true);
      });
    });
    
    describe("the respondent object has inherited specified property", function(){
      it("and the property value is not null and is not 'undefined'", function(){
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        Person.health = null;
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        Person.health = void(0);
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
    });
  });
  
  describe("Should return false, if the respondent object does not have the specified property", function(){  
    it('neither own nor inherited', function(){
      delete Person.health;
      expect(Musician.tpHasProperty('health')).toBe(false);
    });
  });
});

describeProperty("tpAncestorByCondition", function() {
  shouldBeDefinedOnAnyObject();
  
  beforeEach(function(){
    Person = {
      health: 'middle'
    };

    Englishman = Person.tpDerive();
  
    Musician = Englishman.tpDerive();

    john = Musician.tpDerive({
      health: 'great'
    });
  });
  
  shouldCheckFirstArgument("Predicate", Function, "Predicate should be specified and it should be a function!");
  
  it("Should return the nearest ancestor, in which predicate evaluates to true", function(){
    expect(john.tpAncestorByCondition(function(theAncestor){
      return theAncestor.hasOwnProperty('health');
    })).toBe(Person);
  });
  
  it("Should return the tpAncestor, if predicate is always true", function(){
    expect(john.tpAncestorByCondition(function(){
      return true;
    })).toBe(john.tpAncestor);
  });
  
  it("Should return null, if there is no ancestor, in which predicate evaluates to true", function(){
    expect(john.tpAncestorByCondition(function(theAncestor){
      return theAncestor.hasOwnProperty('qwerty');
    })).toBeNull;
  });
});

describeProperty("tpAncestorHaving", function() {
  shouldBeDefinedOnAnyObject();

  beforeEach(function(){
    Person = {
      health: 'middle'
    };

    Englishman = Person.tpDerive();
    
    Musician = Englishman.tpDerive();

    john = Musician.tpDerive({
      health: 'great'
    });
  });
  
  shouldCheckFirstArgument("Property name", String, "Property name should be specified and it should be a string!");
  
  describe("Should return the nearest ancestor, which", function(){
    it("has either own specified property", function(){
      expect(john.tpAncestorHaving('health')).toBe(Musician);
    });
    
    it("or inherited specified property", function(){
      expect(Musician.tpAncestorHaving('health')).toBe(Englishman);
    });
  });
  
  describe("Should return null,", function(){
    it("if the specified property is not defined above in hierarchy", function(){
      delete Person.health;
      expect(Musician.tpAncestorHaving('health')).toBeNull();
    });    
  });
});

describeProperty("tpAncestorHavingOwn", function() {
  shouldBeDefinedOnAnyObject();

  beforeEach(function(){
    Person = {
      health: 'middle'
    };

    Englishman = Person.tpDerive();
    
    Musician = Englishman.tpDerive();

    john = Musician.tpDerive({
      health: 'great'
    });
  });
  
  shouldCheckFirstArgument("Property name", String, "Property name should be specified and it should be a string!");
  
  describe("Should return the nearest ancestor, which", function(){
    it("has own specified property", function(){
      expect(Musician.tpAncestorHavingOwn('health')).toBe(Person);
    });    
  });
  
  describe("Should return null,", function(){
    it("if the specified property is not defined above in hierarchy", function(){
      delete Person.health;
      expect(Musician.tpAncestorHavingOwn('health')).toBeNull();
    });    
  });
});