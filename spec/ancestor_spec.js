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
  });
  
  describe("Should be null", function(){
    it("on the Object.prototype (the root of any hierarchy)", function(){
      expect(Object.prototype.tpAncestor).toBeNull();
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
  
  describe("Should be empty", function(){
    it("on the Object.prototype (the root of any hierarchy)", function(){
      var res = Object.prototype.tpAncestors;
      expect(res).toEqual(jasmine.any(Array));
      expect(res.length).toEqual(0);
    });
  });

});

describeProperty("tpAncestorByCondition", function() {
  shouldBeDefinedOnAnyObject();
  shouldCheckFirstArgument("predicate", Function, "Predicate should be specified and it should be a function!");
  
  beforeEach(function(){
    Person = { health: 'middle' };
    Englishman = Person.tpDerive();
    Musician = Englishman.tpDerive();
    john = Musician.tpDerive({ health: 'great' });
  });
  
  describe("Should return", function(){
    it("the nearest ancestor, on which predicate evaluates to true", function(){
      expect(john.tpAncestorByCondition(function(theAncestor){
        return theAncestor.hasOwnProperty('health');
      })).toBe(Person);
    });
  
    it("the tpAncestor, if predicate is always true", function(){
      var predicate = function(){ return true; };
      expect(john.tpAncestorByCondition(predicate)).toBe(john.tpAncestor);
    });
    
    describe("null,", function(){
      it("if predicate is always false", function(){
        var predicate = function(){ return false; };
        expect(john.tpAncestorByCondition(predicate)).toBeNull();
      });

      it("if there is no ancestor, in which predicate evaluates to true", function(){
        expect(john.tpAncestorByCondition(function(theAncestor){
          return theAncestor.hasOwnProperty('qwerty');
        })).toBeNull();
      });
    });
  });
});

describeProperty("tpAncestorsByCondition", function() {
  shouldBeDefinedOnAnyObject();
  shouldCheckFirstArgument("predicate", Function, "Predicate should be specified and it should be a function!");
  
  beforeEach(function(){
    Person = { health: 'middle' };
    Englishman = Person.tpDerive();
    Musician = Englishman.tpDerive({health: 'good'});
    john = Musician.tpDerive({ health: 'great' });
  });
  
  describe("Should return", function(){
    it("all ancestors, on which predicate evaluates to true", function(){
      expect(john.tpAncestorsByCondition(function(theAncestor){
        return theAncestor.hasOwnProperty('health');
      })).toEqual([Musician, Person]);
    });
  
    it("the tpAncestors, if predicate is always true", function(){
      var predicate = function(){ return true; };
      expect(john.tpAncestorsByCondition(predicate)).toEqual(john.tpAncestors);
    });
    
    describe("empty array,", function(){
      it("if predicate is always false", function(){
        var res = john.tpAncestorsByCondition(function(){ return false; });
        expect(res).toEqual(jasmine.any(Array));
        expect(res.length).toEqual(0);
      });

      it("if there is no ancestor, in which predicate evaluates to true", function(){
        var res = john.tpAncestorsByCondition(function(ancestor){ 
          return ancestor.hasOwnProperty('qwerty');
        });
        expect(res).toEqual(jasmine.any(Array));
        expect(res.length).toEqual(0);
      });
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
